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
COLOR[TYPE.BULLET] = 'red';
COLOR[TYPE.DROP] = 'lime';
COLOR[TYPE.CELL] = 'royalBlue';
COLOR[TYPE.PEARL] = 'lightSkyblue';

const SIZE = {
  LINE: WORLD.w * WORLD.h / 200000
};
SIZE[TYPE.DOT] = WORLD.w * WORLD.h / 8000
SIZE[TYPE.BULLET] = 2 * SIZE[TYPE.DOT];
SIZE[TYPE.DROP] = 5 * SIZE[TYPE.DOT];
SIZE[TYPE.CELL] = 10 * SIZE[TYPE.DROP];
SIZE[TYPE.PEARL] = 10 * SIZE[TYPE.DROP];

const PROP = {
  FOOD: 'food',
  PAIN: 'pain',
  BOOST: 'boost',
  SPIKE: 'spike',
  SHOT: 'shot',
  EGG: 'egg', // (*) get big enough and have a new generation
  HALO: 'halo', // gun that shoots food at others
  GHOST: 'ghost', // transparent to bullets and others
  CHOMP: 'chomp', // ability to break drop piece from others
  /*
  BLIND: 'blind', // can't seek drop or point shoot
  */
}

const SAY = {
  PEW: 'pew', // shoot spike
  BANG: 'bang', // shoot 3 spikes
  BOOM: 'boom', // dart all spikes
}

const SPEED = 3 * SIZE.LINE / FRAMERATE;

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
    this.r = sqrt(v / PI);
    this.d = this.r * 2;
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
      circle(0, 0, this.d);
    });
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.vel.mult(world.frix);
    if (this.pos.x < this.r || this.pos.x > world.w - this.r)
      this.vel.x *= -1;
    if (this.pos.y < this.r || this.pos.y > world.h - this.r)
      this.vel.y *= -1;
    this.pos.x = constrain(this.pos.x, this.r + 1, world.w - this.r - 1);
    this.pos.y = constrain(this.pos.y, this.r + 1, world.h - this.r - 1);
    if (this.size < 1) {
      this.done = true;
      delete this;
    }
  }

  isTouching(target) {
    return this.pos.dist(target.pos) <= this.r + target.r;
  }

  collide(target) {
    if (this.done) return;
    if (target === this) return;
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
    let lastPos = createVector(this.pos.x, this.pos.y);
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
    let d = 2 * this.d;
    let n = floor(diff.mag() / d);
    diff.setMag(d);
    let points = [lastPos, this.pos];
    while (n) {
      points.push(p5.Vector.add(lastPos, diff));
      diff.setMag(d * n);
      n -= 1;
    }
    anims.forEach(a => {
      if (this.done || !a.hasAgency || a.done) return;
      if (a.has(PROP.GHOST)) return;
      points.forEach(p => {
        if (!this.done) this.done = a.pos.dist(p) < a.r;
      });
      if (this.done) {
        if (this.isHalo) a.addTrait(PROP.FOOD, this.size);
        else {
          a.addTrait(PROP.PAIN, this.size);
          a.vel.add(this.vel.mult(10 * this.size / a.size));
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
    if (this.has(PROP.BOOST)) {
      this.drawFlag();
      if (this.type === TYPE.DROP) this.drawFlag(1, PI);
    }
    if (this.has(PROP.HALO)) this.drawHalo()
    if (this.has(PROP.BOOST)) this.drawFlag();
    if (this.has(PROP.SPIKE)) this.drawSpikes();
    if (this.has(PROP.SHOT)) this.drawGun();
  }

  drawSpikes(d, c) {
    let n = 8;
    let delta = PI / n;
    if (!d) d = SIZE.LINE * 2;
    this.inDraw(() => {
      if (c) stroke(colorSet(c, colorAlpha(this.color)));
      while (n) {
        rotate(delta);
        line(0, this.r, 0, this.r + d);
        line(0, -this.r, 0, -this.r - d);
        n -= 1;
      }
    });
  }

  drawFlag(a = 1, ang = 0, len = 1) {
    a = min(a, 1);
    this.inDraw(() => {
      noFill();
      a *= colorAlpha(this.color);
      stroke(colorSet(this.color, a));
      rotate(PI + vectorAng(this.acc) + ang);
      translate(this.r, 0);
      len = this.r * len;
      let s = len * sin(frameCount) * 0.34;
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
      translate(this.r, 0);
      let z = SIZE.LINE * 5;
      let red = this.hasAgency ? 1 : 0.5;
      strokeWeight(SIZE.LINE);
      if (c) stroke(c);
      line(0, 0, 1.86 * z * red, 0);
      noStroke();
      fill(this.color);
      polygon(z * 0.34 / red, 0, red * z, 3);
    });
    this.gun = createVector(cos(ang), sin(ang)).setMag(this.r * 1.5);
  }

  drawHalo(a = 1) {
    a = min(a, 1);
    this.inDraw(() => {
      noFill();
      a *= colorAlpha(this.color);
      stroke(colorSet(COLOR[TYPE.DROP], a));
      strokeWeight(SIZE.LINE * 0.5);
      circle(0, 0, this.d + SIZE.LINE * 4);
    });
  }

  drawEgg(outline = false) {
    this.inDraw(() => {
      let r = min(sqrt(2 * SIZE[TYPE.DROP] / PI), this.r);
      let len = r * 0.5;
      strokeWeight(SIZE.LINE * 1.5);
      line(-len, 0, len, 0);
      line(0, -len, 0, len);
      strokeWeight(SIZE.LINE * 0.5);
      if (outline) circle(0, 0, 2 * r);
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
    let g = this.getTrait(PROP.FOOD);
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
    let pBoost = this.props.includes(PROP.BOOST) ? this._speed : 0;
    let tBoost = min(this._speed, this.getTrait(PROP.BOOST));
    return this._speed + tBoost + pBoost;
  }

  set speed(v) {
    this._speed = v;
  }

  set acc(vect) {
    this._acc = vectorMap(vect, this.r, this.speed);
  }

  get acc() {
    return this._acc;
  }

  has(prop) {
    return super.has(prop) || !!this.getTrait(prop);
  }

  addTrait(t, n = 0) {
    return this.trait[t] = max(this.getTrait(t) + n, 0);
  }

  getTrait(t) {
    return this.trait[t];
  }

  halfTrait(t) {
    let half = this.trait[t] / 2;
    if (half < 1) half = 0;
    return this.trait[t] = half;
  }

  draw() {
    super.draw();
    this.drawEye()
  }

  drawEye() {
    this.inDraw(() => {
      rotate(vectorAng(this.acc));
      fill(this.color);
      let d = this.r * 0.68;
      let m = map(this.acc.mag(), 0, this.speed, 0, d);
      circle(m, 0, d);
    });
  }

  drawGun() {
    if (!this.getTrait(PROP.SHOT)) return;
    if (!this.pointAng) this.pointAng = 0;
    let a = frameCount / FRAMERATE;
    if (this.bullseye && this.bullseye.pos) {
      let ba = p5.Vector.sub(this.bullseye.pos, this.pos);
      this.pointAng += (vectorAng(ba) - this.pointAng) / 4;
    }
    a = this.pointAng;
    super.drawGun(a, COLOR[this.has(PROP.HALO) ? TYPE.DROP : TYPE.BULLET]);
  }

  drawSpikes() {
    if (!this.getTrait(PROP.SPIKE)) return;
    let d = min(this.getTrait(PROP.SPIKE) / SIZE[TYPE.DOT], SIZE.LINE * 5);
    let h = this.has(PROP.HALO);
    super.drawSpikes(d + SIZE.LINE, h ? COLOR[TYPE.DROP] : COLOR[TYPE.BULLET]);
    super.drawSpikes(d);
  }

  drawFlag() {
    let n = 0;
    if (this.props.includes(PROP.BOOST)) super.drawFlag(1, 0, 0.68);
    if (!this.getTrait(PROP.BOOST)) return;
    super.drawFlag(this.getTrait(PROP.BOOST) / SIZE[TYPE.DOT]);
  }

  drawHalo() {
    if (!this.getTrait(PROP.HALO)) return;
    super.drawHalo(this.getTrait(PROP.HALO) / SIZE[TYPE.DOT]);
  }

  drawEgg() {
    if (!this.getTrait(PROP.EGG)) return;
    super.drawEgg(true);
  }

  fire() {
    if (!this.getTrait(PROP.SHOT)) return;
    let bullet = new Bullet({
      x: this.pos.x + this.gun.x,
      y: this.pos.y + this.gun.y,
      vel: this.gun,
      shooter: this
    });
    this.addTrait(PROP.SHOT, -bullet.size);
    this.addTrait(PROP.HALO, -bullet.size);
  }

  split() {
    let baby = new Cell({
      x: this.pos.x,
      y: this.pos.y
    });
    baby.size = 2 * SIZE[TYPE.DROP];
    this.addTrait(PROP.EGG, -baby.size);
    this.size -= baby.size;
  }

  update() {
    super.update();
    this.acc.limit(this.speed);
    // reduce thse boost
    if (this.getTrait(PROP.FOOD)) this.size += this.halfTrait(PROP.FOOD);
    if (this.getTrait(PROP.PAIN)) this.size -= this.halfTrait(PROP.PAIN);
    let dim = SIZE[TYPE.DOT] / FRAMERATE;
    if (this.getTrait(PROP.BOOST)) this.addTrait(PROP.BOOST, -dim);
    if (this.getTrait(PROP.SPIKE)) this.addTrait(PROP.SPIKE, -dim);
    if (this.getTrait(PROP.GHOST)) this.addTrait(PROP.GHOST, -dim);
    // automaton
    if (this.getTrait(PROP.EGG)) {
      if (this.size > SIZE[TYPE.DROP] + SIZE[TYPE.CELL]) this.split();
      else if (this.size < SIZE[TYPE.DROP]) this.addTrait(PROP.EGG, -this.getTrait(PROP.EGG));
    }
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
      this.addTrait(PROP.FOOD, target.size);
      target.size = 0;
    } else if (target.hasAgency) {
      let hurt = 0;
      if (this.getTrait(PROP.SPIKE)) {
        hurt = min(3 * this.getTrait(PROP.SPIKE), target.size);
        target.addTrait(this.has(PROP.HALO) ? PROP.FOOD : PROP.PAIN, hurt);
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
      props: [PROP.BOOST]
    });
  }
}