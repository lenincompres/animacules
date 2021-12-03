const WORLD = {
  w: 600,
  h: 600,
  w2: 300,
  h2: 300,
  heat: 1.5,
  frix: 0.9,
  foodrate: 50,
  foodcap: 1
}

const TYPE = {
  BULLET: 'bullet',
  FOOD: ' food',
  AGENT: 'agent'
}

const PROP = {
  BOOST: 'boost',
  SPIKE: 'spike',
  GROW: 'grow',
  SHOT: 'shot',
  PAIN: 'pain', // when hit with spikes or shot
  /*
  SEEK: 'seek', // can see food
  SPLIT: 'split', // make other split in half
  CHOMP: 'chomp', // ability to break food piece from others
  EGG: 'egg', // (*) get big enough and have a new generation
  OVUM: 'ovum', // (+) needs (-) to be egg
  SEED: 'seed', // (-) needs (+) to be egg, goes into agents with (+) upon bumping
  */
}

const SAY = {
  PEW: 'pew', // shoot spike
  BANG: 'bang', // shoot 3 spikes
  BOOM: 'boom', // dart all spikes
}

const SIZE = WORLD.w * WORLD.h / 10000;
const FRAMERATE = 30;
const SPEED = 0.2 * SIZE / FRAMERATE;

let anims = [];

class Grain {
  constructor({
    x,
    y,
    size = SIZE,
    color = 'yellow'
  }) {
    if (x === undefined) x = random(world.w);
    if (y === undefined) y = random(world.h);
    this.pos = createVector(x, y);
    this.acc = createVector(0, 0);
    this.vel = createVector(0, 0);
    this.color = color;
    this.size = size;
    anims.push(this);
  }

  set color(c) {
    if (!c.levels) c = color(c);
    if (this._color === undefined) this._firstColor = c;
    this._color = colorSet(c, 0.68);
  }

  set bodyColor(a) {
    fill(this.bodyColor);
  }

  set lineColor(w = 1) {
    stroke(this.lineColor);
    strokeWeight(w);
  }

  get bodyColor() {
    return colorSet(this.color, 0.86);
  }

  get lineColor() {
    return colorAdd(this.color, {
      l: 15,
      a: 1
    });
  }

  get color() {
    return this._color;
  }

  set size(v) {
    this._z = v;
    this.d = 2 * sqrt(v / PI);
    this.r = this.d * 0.5;
    this.done = v < 1;
  }

  get size() {
    return this._z;
  }

  inDraw(drawing = () => null) {
    push();
    translate(this.pos.x, this.pos.y);
    fill(this.bodyColor);
    stroke(this.lineColor);
    strokeWeight(2);
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
}

class Bullet extends Grain {
  constructor(opt = {}) {
    super(opt);
    opt.shooter.addTrait(PROP.SHOT, -2 * SIZE);
    this.size *= 2;
    this.dew = 0;
    this.type = TYPE.BULLET;
    this.color = opt.color ? opt.color : 'red';
    this.vel = opt.vel ? opt.vel.setMag(150 * SPEED) : p5.Vector(0, SPEED);
  }

  update() {
    let lastPos = createVector(this.pos.x, this.pos.y);
    super.update();
    let diff = p5.Vector.sub(this.pos, lastPos);
    if (diff.mag() < 0.5) return this.done = true;
    let d = 2 * this.d;
    let n = floor(diff.mag() / d);
    diff.setMag(d);
    let points = [lastPos, this.pos];
    while (n) {
      points.push(p5.Vector.add(lastPos, diff));
      diff.setMag(d * n);
      n -= 1;
    }
    agents.forEach(a => {
      if (this.done) return;
      points.forEach(p => {
        if (this.done) return;
        this.done = a.pos.dist(p) < a.r;
      });
      if (this.done) {
        a.addTrait(PROP.PAIN, this.size);
        a.vel.add(this.vel.mult(10 * this.size / a.size));
      }
    });
  }
}

class Drop extends Grain {
  constructor(opt = {}) {
    super(opt);
    this.size *= 5;
    this.dew = opt.dew ? opt.dew : 0.5;
    this.type = TYPE.FOOD;
    this.color = opt.color ? opt.color : 'green';
    this.props = opt.props ? opt.props : [];
    if (opt.traits) opt.traits.forEach(t => this.addTrait(t, this.size));
  }

  draw() {
    super.draw();
    if (this.props.includes(PROP.BOOST)) {
      this.drawFlag();
      if (this.type === TYPE.FOOD) this.drawFlag(0, 1, 2 * PI);
    }
    if (this.props.includes(PROP.SPIKE)) this.drawSpikes();
    if (this.props.includes(PROP.SHOT)) this.drawGun();
  }

  drawSpikes(d, n = 8) {
    let max = 4;
    if (!d) d = max / 2;
    else d *= 3;
    d = min(d, max);
    let delta = PI / n;
    this.inDraw(() => {
      while (n) {
        rotate(delta);
        line(0, this.r, 0, this.r + d);
        line(0, -this.r, 0, -this.r - d);
        n -= 1;
      }
    });
  }

  drawFlag(len, a = 1, ang = 0) {
    this.inDraw(() => {
      noFill();
      strokeWeight(2);
      stroke(colorSet(this.lineColor, a));
      if (!ang) ang = PI + vectorAng(this.acc);
      rotate(ang);
      if (!len) len = 0.5;
      len *= this.r;
      let s = sin(frameCount) * len * 0.34;
      beginShape();
      curveVertex(this.r, 0);
      curveVertex(this.r, 0);
      curveVertex(this.r + len * 0.5, s * 0.5);
      curveVertex(this.r + len, -s);
      curveVertex(this.r + len, -s);
      endShape();
    });
  }

  drawGun(a = frameCount / FRAMERATE, d) {
    this.inDraw(() => {
      noStroke();
      fill(this.lineColor);
      rotate(a);
      let z = 8;
      if (!d) d = -z / 2;
      polygon(d + z * 0.34, 0, z, 3);
      this.lineColor = z * 0.25;
      line(d, 0, d + 1.86 * z, 0);
    });
    this.gun = createVector(cos(a), sin(a)).setMag(this.r + d * 0.5);
  }

  update() {
    super.update();
    this.size -= world.heat * this.dew;
  }
}

class Animacule extends Drop {
  constructor(opt = {}) {
    super(opt);
    this.color = opt.color ? opt.color : 'dodgerblue';
    this.type = TYPE.AGENT;
    this.speed = opt.speed ? opt.speed : SPEED;
    this.size *= 10;
    this.metab = opt.metab ? opt.metab : 0.5;
    this.dew += this.metab;
    this.trait = {};
    Object.values(PROP).forEach(t => this.addTrait(t));
  }

  set color(c) {
    super.color = c;
  }

  get color() {
    return colorAdd(this._color, {
      r: this.getTrait(PROP.PAIN),
      g: this.getTrait(PROP.GROW)
    })
  }

  get speed() {
    if (this.trait && this.getTrait(PROP.BOOST)) {
      let boost = min(this._speed, this.getTrait(PROP.BOOST));
      return this._speed + boost;
    }
    return this._speed;
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

  addTrait(t, n = 0) {
    if (this.trait[t] === undefined) this.trait[t] = 0;
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
    this.drawEye();
    this.boost();
    this.spike();
    this.point();
  }

  drawEye() {
    this.inDraw(() => {
      rotate(vectorAng(this.acc));
      fill(this.lineColor);
      let d = this.r * 0.68;
      let m = map(this.acc.mag(), 0, this.speed, 0, d);
      circle(m, 0, d);
    });
  }

  spike() {
    if (!this.getTrait(PROP.SPIKE)) return;
    let d = this.type === TYPE.FOOD ? 1 : this.getTrait(PROP.SPIKE) / 200;
    this.drawSpikes(d);
  }

  boost() {
    if (!this.getTrait(PROP.BOOST)) return;
    let a = this.type === this.getTrait(PROP.BOOST) / 200;
    this.drawFlag(1, a);
    if (this.type === TYPE.FOOD) this.drawFlag(1, a, PI);
  }

  point() {
    if (!this.getTrait(PROP.SHOT)) return;
    if (!this.pointAng) this.pointAng = 0;
    if (this.bullseye && this.bullseye.pos) {
      let ba = p5.Vector.sub(this.bullseye.pos, this.pos);
      this.pointAng += (vectorAng(ba) - this.pointAng) / 4;
    } else this.pointAng = undefined;
    this.drawGun(this.pointAng, this.r);
  }

  fire() {
    if (!this.getTrait(PROP.SHOT)) return;
    new Bullet({
      x: this.pos.x + this.gun.x,
      y: this.pos.y + this.gun.y,
      vel: this.gun,
      shooter: this
    })
  }

  update() {
    super.update();
    this.acc.limit(this.speed);
    // reduce thse boost
    if (this.getTrait(PROP.GROW)) this.size += this.halfTrait(PROP.GROW);
    if (this.getTrait(PROP.PAIN)) this.size -= this.halfTrait(PROP.PAIN);
    if (this.getTrait(PROP.BOOST)) this.addTrait(PROP.BOOST, -1);
    if (this.getTrait(PROP.SPIKE)) this.addTrait(PROP.SPIKE, -1);
    // automaton
    if (!this.name) {
      // go to the closest food
      if (anims.filter(a => a.type === TYPE.FOOD).length) {
        let food = anims.filter(a => a.type === TYPE.FOOD).reduce((o, a) => !o || this.pos.dist(a.pos) < this.pos.dist(o.pos) ? a : o, false);
        if (!food) this.acc.mult(0.68);
        else this.acc = p5.Vector.sub(food.pos, this.pos);
      }
      //firing
      if (frameCount % (2 * FRAMERATE) < 1) this.fire();
    }
    let targets = anims.filter(a => this !== a && a.type === TYPE.AGENT);
    if (targets.length) {
      this.bullseye = anims.filter(a => this !== a && a.type === TYPE.AGENT).reduce((b, a) => !b || this.pos.dist(a.pos) < this.pos.dist(b.pos) ? a : b);
    }
  }

  isTouching(target) {
    return this.pos.dist(target.pos) > this.r + target.r;
  }

  collide(target) {
    if (this.done) return;
    if (target === this) return;
    if (this.isTouching(target)) return;
    if (target.type === TYPE.FOOD) {
      target.props.forEach(t => this.addTrait(t, target.size));
      this.addTrait(PROP.GROW, target.size);
      target.size = 0;
      return;
    }
    if (target.type === TYPE.AGENT) {
      let hurt = 0;
      let col = p5.Vector.add(target.pos, this.pos).mult(0.5);
      if (this.getTrait(PROP.SPIKE)) {
        hurt = min(3 * this.getTrait(PROP.SPIKE), target.size);
        target.addTrait(PROP.PAIN, hurt);
        this.addTrait(PROP.SPIKE, -hurt);
      }
      // collision force
      target.vel.add(p5.Vector.sub(target.pos, col).setMag(sqrt((this.size + hurt) / SIZE)));
    }
  }
}

class Pearl extends Animacule {
  constructor(opt = {}) {
    opt.x = world.w2;
    opt.y = world.h2;
    super(opt);
    this.color = colorAdd(this._color, {
      l: 25
    });
    this.speed *= 2;
    this.name = 'Pearl';
    this.props.push(PROP.BOOST);
  }
}