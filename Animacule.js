const FRAMERATE = 26;

const WORLD = {
  w: 800,
  h: 600,
  frix: 0.9,
  droprate: 50,
  dropcap: 1,
  heat: 1
}
WORLD.w2 = WORLD.w * 0.5;
WORLD.h2 = WORLD.h * 0.5;

const TYPE = {
  DOT: 'dot',
  BULLET: 'bullet',
  DROP: 'drop',
  CELL: 'cell',
  PEARL: 'pearl'
}

const COLOR = {};
COLOR[TYPE.DOT] = 'gray';
COLOR[TYPE.BULLET] = 'crimson';
COLOR[TYPE.DROP] = 'lawngreen';
COLOR[TYPE.CELL] = 'dodgerBlue';
COLOR[TYPE.PEARL] = 'lightSkyblue';

const SIZE = {
  LINE: WORLD.w * WORLD.h / 200000
};
SIZE[TYPE.DOT] = WORLD.w * WORLD.h / 8000
SIZE[TYPE.BULLET] = 2 * SIZE[TYPE.DOT];
SIZE[TYPE.DROP] = 5 * SIZE[TYPE.DOT];
SIZE[TYPE.CELL] = 10 * SIZE[TYPE.DROP];
SIZE[TYPE.PEARL] = 10 * SIZE[TYPE.DROP];
SIZE.BABY = 4 * SIZE[TYPE.DROP];

const PROP = {
  GAIN: 'gain',
  PAIN: 'pain',
  TAIL: 'tail',
  SPIKE: 'spike',
  HURL: 'hurl',
  EGG: 'egg', // (*) get big enough and have a new generation
  HALO: 'halo', // gun that shoots food at others
  GHOST: 'ghost', // transparent to bullets and others
  CHOMP: 'chomp', // ability to break drop piece from others
  BLIND: 'blind', // can't seek drop or point shoot
}

const SAY = {
  PEW: 'pew', // shoot spike
  BANG: 'bang', // shoot 3 spikes
  BOOM: 'boom', // dart all spikes
}

const SPEED = 4 * SIZE.LINE / FRAMERATE;

let anims = [];

class Dot {
  constructor({
    x,
    y,
    size,
    type = TYPE.DOT,
  }) {
    if (x === undefined) x = random(world.w);
    if (y === undefined) y = random(world.h);
    this.pos = createVector(x, y);
    this.acc = createVector(0, 0);
    this.vel = createVector(0, 0);
    this.dew = 0;
    this.type = type;
    this.size = size ? size : SIZE[this.type];
    this.color = COLOR[this.type];
    anims.push(this);
  }

  set color(c) {
    if (!c.levels) c = color(c);
    if (this._color === undefined) this._firstColor = c;
    this._color = c;
  }

  get color() {
    return this._color;
  }

  set size(v) {
    this._z = v;
    this.radius = sqrt(v / PI);
    this.diam = this.radius * 2;
    this.done = v < 1;
  }

  get size() {
    return this._z;
  }

  inDraw(drawing = () => null) {
    push();
    translate(this.pos.x, this.pos.y);
    fill(colorAdd(this.color, -0.5));
    stroke(this.color);
    strokeWeight(SIZE.LINE);
    push();
    drawing();
    pop();
    pop();
  }

  draw() {
    if (this.done) return;
    this.inDraw(() => {
      circle(0, 0, this.diam);
    });
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.vel.mult(world.frix);
    if (this.pos.x < this.radius || this.pos.x > world.w - this.radius)
      this.vel.x *= -1;
    if (this.pos.y < this.radius || this.pos.y > world.h - this.radius)
      this.vel.y *= -1;
    this.pos.x = constrain(this.pos.x, this.radius + 1, world.w - this.radius - 1);
    this.pos.y = constrain(this.pos.y, this.radius + 1, world.h - this.radius - 1);
    if (this.size < 1) {
      this.done = true;
      delete this;
    }
  }

  isTouching(target) {
    if (target.type === TYPE.BULLET) return false;
    return this.pos.dist(target.pos) <= this.radius + target.radius;
  }

  collide(target) {
    if (this.done || target === this) return;
    if (!this.isTouching(target)) return;
    let col = p5.Vector.add(target.pos, this.pos).mult(0.5);
    target.vel.add(p5.Vector.sub(target.pos, col).setMag(sqrt(this.size / SIZE[TYPE.DOT])));
    return col;
  }
}

class Bullet extends Dot {
  constructor(opt = {}) {
    if (!opt.type) opt.type = TYPE.BULLET;
    if (!opt.vel) opt.vel = p5.Vector(0, SPEED);
    super(opt);
    this.vel = opt.vel.setMag(150 * SPEED);
    this.isHalo = opt.shooter.has(PROP.HALO);
    if (this.isHalo) this.color = COLOR[TYPE.DROP];
  }

  update() {
    let lastPos = vectorClone(this.pos);
    super.update();
    let diff = p5.Vector.sub(this.pos, lastPos);
    if (diff.mag() < SIZE.LINE) {
      new Drop({
        x: this.pos.x,
        y: this.pos.y,
        size: this.size
      })
      return this.done = true;
    }
    let d = 2 * this.diam;
    let n = floor(diff.mag() / d);
    diff.setMag(d);
    let points = new Array(n).fill(1).map((v, i) => p5.Vector.add(lastPos, diff.setMag(d * i)));
    points.push(this.pos);
    anims.filter(anim => anim.hasAgency && !anim.done && !anim.has(PROP.GHOST)).forEach(cell => {
      if (this.done) return;
      points.forEach(p => {
        if (!this.done) this.done = cell.pos.dist(p) < cell.radius;
      });
      if (this.done) {
        if (this.isHalo) cell.addTrait(PROP.GAIN, this.size);
        else {
          cell.addTrait(PROP.PAIN, 2 * this.size);
          cell.vel.add(this.vel.mult(10 * this.size / cell.size));
        }
      }
    });
  }
}

class Drop extends Dot {
  constructor(opt = {}) {
    if (!opt.type) opt.type = TYPE.DROP;
    super(opt);
    this.dew = 0;
    this.props = opt.props ? opt.props : [];
  }

  has(prop) {
    return this.props.includes(prop);
  }

  get color() {
    if (this.has(PROP.GHOST)) return colorAdd(this._color, -0.5);
    return this._color;
  }

  set color(c) {
    super.color = c;
  }

  draw() {
    if (this.has(PROP.EGG)) this.drawEgg();
    super.draw();
    if (this.has(PROP.TAIL)) {
      this.drawFlag();
      if (this.type === TYPE.DROP) this.drawFlag(1, PI);
    }
    if (this.has(PROP.TAIL)) this.drawFlag();
    if (this.has(PROP.SPIKE)) this.drawSpikes();
    if (this.has(PROP.HURL)) this.drawGun();
    if (this.has(PROP.HALO)) this.drawHalo();
  }

  drawSpikes(d, c) {
    let n = 8;
    let delta = PI / n;
    if (!d) d = SIZE.LINE * 2;
    this.inDraw(() => {
      if (c) {
        strokeWeight(SIZE.LINE * 0.68);
        stroke(colorSet(c, colorAlpha(this.color)));
      }
      while (n) {
        rotate(delta);
        line(0, this.radius, 0, this.radius + d);
        line(0, -this.radius, 0, -this.radius - d);
        n -= 1;
      }
    });
  }

  drawFlag(a = 1, ang = 0) {
    a = min(a, 1);
    this.inDraw(() => {
      noFill();
      rotate(PI + vectorAng(this.acc) + ang);
      translate(this.radius, 0);
      let len = this.radius * a;
      let s = len * sin(15 * frameCount / FRAMERATE) * 0.34;
      beginShape();
      curveVertex(0, 0);
      curveVertex(0, 0);
      curveVertex(len * 0.5, s * 0.5);
      curveVertex(len, -s);
      curveVertex(len, -s);
      endShape();
    });
  }

  drawGun(ang = frameCount / FRAMERATE, c) {
    this.inDraw(() => {
      rotate(ang);
      translate(this.radius, 0);
      let z = min(SIZE.LINE * 5, this.radius * 0.86);
      if (c) stroke(c);
      line(0, 0, 1.68 * z, 0);
      noStroke();
      fill(this.color);
      polygon(z * 0.34, 0, z, 3);
    });
    this.gun = createVector(cos(ang), sin(ang)).setMag(this.radius * 1.5);
  }

  drawEgg() {
    this.inDraw(() => {
      let len = sqrt(SIZE[TYPE.DROP] / PI) * 0.5;
      stroke(colorSet(this.color, 0.68 + sin(8 * frameCount / FRAMERATE) * 0.68));
      line(-len, 0, len, 0);
      line(0, -len, 0, len);
    });
  }

  drawHalo(alpha = 1) {
    alpha = min(alpha, 1);
    this.inDraw(() => {
      noFill();
      alpha *= colorAlpha(this.color);
      stroke(colorSet(COLOR[TYPE.DROP], alpha));
      strokeWeight(SIZE.LINE * 0.5);
      circle(0, 0, this.diam + SIZE.LINE * 4);
    });
  }

  update() {
    super.update();
    this.size -= SIZE[TYPE.DOT] * world.heat * this.dew / FRAMERATE;
  }
}

class Cell extends Drop {
  constructor(opt = {}) {
    if (!opt.type) opt.type = TYPE.CELL;
    super(opt);
    this.hasAgency = true;
    this.speed = SPEED;
    this.metab = 1;
    this.dew = this.metab;
    this.trait = {};
    Object.values(PROP).forEach(t => this.trait[t] = 0);
  }

  set color(c) {
    super.color = c;
  }

  get color() {
    let r = this.getTrait(PROP.PAIN);
    let g = this.getTrait(PROP.GAIN);
    let b = this.getTrait(PROP.GHOST);
    let c = colorAdd(this._color, {
      r: r - (g + b) * 0.5,
      g: g - (r + b) * 0.5,
      b: b - (r + g) * 0.5
    });
    let a = min(this.getTrait(PROP.GHOST) / 200, 0.5);
    return colorAdd(c, -a);
  }

  get speed() {
    if (!this.props) return this._speed;
    let tail = min(SPEED, this.getTrait(PROP.TAIL));
    return this._speed + tail;
  }

  set speed(v) {
    this._speed = v;
  }

  set acc(vect) {
    this._acc = vectorMap(vect, this.radius, this.speed);
  }

  get acc() {
    return this._acc;
  }

  has(prop) {
    return super.has(prop) || !!this.getTrait(prop);
  }

  getTrait(trait) {
    return this.trait[trait];
  }

  addTrait(trait, val = 0) {
    return this.trait[trait] = round(max(this.getTrait(trait) + val, 0));
  }

  incTrait(trait, factor = 0) {
    let diff = this.getTrait(trait) * factor;
    this.addTrait(trait, diff);
    return diff;
  }

  removeTrait(t) {
    return this.trait[t] = 0;
  }

  draw() {
    super.draw();
    this.inDraw(() => {
      rotate(vectorAng(this.acc));
      fill(this.color);
      noStroke;
      let radius = this.radius * 0.75;
      let x = map(this.acc.mag(), 0, this.speed, 0, this.radius - radius * 0.5);
      circle(x, 0, radius);
    });
  }

  drawGun() {
    if (!this.getTrait(PROP.HURL)) return;
    if (!this.pointAng) this.pointAng = 0;
    let ang = frameCount / FRAMERATE;
    if (this.bullseye && this.bullseye.pos) {
      let bAng = vectorAng(p5.Vector.sub(this.bullseye.pos, this.pos));
      bAng = [bAng + PI * 2, bAng - PI * 2].reduce((b, a) => abs(this.pointAng - b) < abs(this.pointAng - a) ? b : a, bAng);
      this.pointAng += (bAng - this.pointAng) / 4;
    }
    ang = this.pointAng;
    super.drawGun(ang, COLOR[this.has(PROP.HALO) ? TYPE.DROP : TYPE.BULLET]);
  }

  drawSpikes() {
    if (!this.getTrait(PROP.SPIKE)) return;
    let d = min(this.getTrait(PROP.SPIKE) / SIZE[TYPE.DOT], SIZE.LINE * 5);
    let h = this.has(PROP.HALO);
    super.drawSpikes(d + SIZE.LINE, h ? COLOR[TYPE.DROP] : COLOR[TYPE.BULLET]);
    super.drawSpikes(d);
  }

  drawFlag() {
    if (this.props.includes(PROP.TAIL)) super.drawFlag(0.68, 0);
    if (!this.getTrait(PROP.TAIL)) return;
    super.drawFlag(this.getTrait(PROP.TAIL) / SIZE[TYPE.DOT]);
  }

  drawHalo() {
    if (!this.getTrait(PROP.HALO)) return;
    super.drawHalo(this.getTrait(PROP.HALO) / SIZE[TYPE.DOT]);
  }

  drawEgg() {
    let egg = this.getTrait(PROP.EGG);
    if (!egg) return;
    super.drawEgg();
    this.inDraw(() => {
      let r = 2 * sqrt(SIZE.BABY / PI);
      noStroke();
      circle(0, 0, r * egg / SIZE.BABY);
      noFill();
      stroke(this.color);
      strokeWeight(SIZE.LINE * 0.5);
      circle(0, 0, r);
    })
  }

  fire() {
    if (!this.getTrait(PROP.HURL)) return;
    let bullet = new Bullet({
      x: this.pos.x + this.gun.x,
      y: this.pos.y + this.gun.y,
      vel: this.gun,
      shooter: this
    });
    this.addTrait(PROP.HURL, -bullet.size);
    this.addTrait(PROP.HALO, -bullet.size);
  }

  split() {
    new Cell({
      x: this.pos.x,
      y: this.pos.y,
      size: SIZE.BABY
    });
    this.removeTrait(PROP.EGG);
  }

  update() {
    super.update();
    this.acc.limit(this.speed);
    // reduce traits
    let sec = 6 / FRAMERATE;
    if (this.getTrait(PROP.GAIN)) this.size -= this.incTrait(PROP.GAIN, -sec);
    if (this.getTrait(PROP.PAIN)) this.size += this.incTrait(PROP.PAIN, -sec);
    let dim = SIZE[TYPE.DOT] / FRAMERATE;
    if (this.getTrait(PROP.TAIL)) this.addTrait(PROP.TAIL, -dim);
    if (this.getTrait(PROP.SPIKE)) this.addTrait(PROP.SPIKE, -dim);
    if (this.getTrait(PROP.GHOST)) this.addTrait(PROP.GHOST, -dim);
    if (this.getTrait(PROP.HALO)) this.addTrait(PROP.HALO, -dim);
    if (this.getTrait(PROP.EGG)) {
      this.addTrait(PROP.EGG, dim);
      this.size += dim;
      if (this.size <= SIZE.BABY) this.removeTrait(PROP.EGG);
      else if (this.getTrait(PROP.EGG) >= SIZE.BABY) this.split();
    }
    // automaton
    if (this.type !== TYPE.PEARL) {
      // go to the closest drop
      if (anims.filter(a => a.type === TYPE.DROP).length) {
        let drop = anims.filter(a => a.type === TYPE.DROP).reduce((o, a) => !o || this.pos.dist(a.pos) < this.pos.dist(o.pos) ? a : o, false);
        if (!drop) this.acc.mult(0.68);
        else this.acc = p5.Vector.sub(drop.pos, this.pos);
      }
      //firing
      if (frameCount % (2 * FRAMERATE) < 1) this.fire();
    }
    let targets = anims.filter(a => this !== a && a.hasAgency && !a.has(PROP.GHOST));
    if (targets.length) this.bullseye = targets.reduce((b, a) => !b || this.pos.dist(a.pos) < this.pos.dist(b.pos) ? a : b);
  }

  isTouching(target) {
    if (target.hasAgency && (target.has(PROP.GHOST) || this.has(PROP.GHOST))) return false;
    return super.isTouching(target);
  }

  collide(target) {
    if (this.done) return;
    if (target === this) return;
    if (!this.isTouching(target)) return;
    let colVect = super.collide(target);
    if (!colVect) return;
    if (target.type === TYPE.DROP) {
      target.props.forEach(t => this.addTrait(t, target.size));
      this.addTrait(PROP.GAIN, target.size);
      target.size = 0;
    } else if (target.hasAgency) {
      let hurt = 0;
      if (this.getTrait(PROP.SPIKE)) {
        hurt = 2 * min(this.getTrait(PROP.SPIKE), SIZE[TYPE.DROP]);
        target.addTrait(this.has(PROP.HALO) ? PROP.GAIN : PROP.PAIN, hurt);
        this.addTrait(PROP.HALO, -hurt);
        this.addTrait(PROP.SPIKE, -hurt);
      }
      target.vel.add(p5.Vector.sub(target.pos, colVect).setMag(sqrt(hurt / SIZE[TYPE.DOT])));
    }
    return colVect;
  }
}

class Pearl extends Cell {
  constructor() {
    super({
      x: world.w2,
      y: world.h2,
      type: TYPE.PEARL,
      props: [PROP.TAIL]
    });
    this.speed = SPEED * 1.5
  }
}