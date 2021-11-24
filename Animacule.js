const TYPE = {
  BULLET: 'bullet',
  FOOD: ' food',
  AGENT: 'agent'
}

const TRAIT = {
  SPIKE: 'spike',
  BOOST: 'boost',
  SHOT: 'shot',
}

let anims = [];

class Grain {
  constructor({
    x,
    y,
    size = world.w * world.h / 10000,
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
    if(!c.levels) c = color(c);
    this._color = colorSet(c, 0.68);
    this._hl = colorAdd(c, 15, 'l');
    this._hl.setAlpha(0.86);
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

  draw() {
    if (this.done) return;
    fill(this.color);
    stroke(this._hl)
    strokeWeight(2);
    circle(this.pos.x, this.pos.y, this.d);
  }

  update() {
    this.acc.limit(this.speed + this.boost);
    this.boost *= 0.9;
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.vel.mult(world.frix);
    if (this.pos.x < this.r || this.pos.x > world.w - this.r)
      this.vel.x *= -1;
    if (this.pos.y < this.r || this.pos.y > world.h - this.r)
      this.vel.y *= -1;
    this.pos.x = constrain(this.pos.x, this.r, world.w - this.r);
    this.pos.y = constrain(this.pos.y, this.r, world.h - this.r);
  }
}

class Drop extends Grain {
  constructor(opt = {}) {
    super(opt);
    this.size = world.w * world.h / 1000;
    this.dew = opt.dew ? opt.dew : 1;
    this.type = TYPE.FOOD;
    this.traits = opt.traits ? opt.traits : [];
    this.boost = 0;
    this.color = opt.color ? opt.color : 'green';
    if (this.traits.includes(TRAIT.BOOST)) this.color = 'firebrick';
  }

  update() {
    super.update();
    this.size -= world.heat * this.dew;
    if (this.size < 1) this.done = true;
  }
}

class Animacule extends Drop {
  constructor(opt = {}) {
    super(opt);
    this.color = opt.color ? opt.color : 'dodgerblue';
    this.color = colorAdd(this._color, 15, 'b');
    this.type = TYPE.AGENT;
    this.speed = opt.speed ? opt.speed : world.w / 2000;
    this.size = world.w * world.h / 100;
    this.metab = opt.metab ? opt.metab : 0.5;
    this.dew += this.metab;
  }

  draw() {
    super.draw();
    fill(this._hl);
    noStroke();
    let d = this.r * 0.68;
    let nuc = vectorMap(this.acc, this.speed, d);
    circle(nuc.x + this.pos.x, nuc.y + this.pos.y, d);
  }

  update() {
    super.update();
    if (this !== pearl && this.type === TYPE.AGENT) {
      let food = anims.filter(a => a.type === TYPE.FOOD)
        .reduce((o, a) => !o || this.pos.dist(a.pos) < this.pos.dist(o.pos) ? a : o, false);
      if (!food) return this.acc.mult(0.68);
      let v = p5.Vector.sub(food.pos, this.pos);
      this.acc.add(v.normalize());
    }
  }

  isTouching(target) {
    return this.pos.dist(target.pos) > this.r + target.r;
  }

  eat(target) {
    if (this.done) return;
    if (target === this) return;
    if (this.isTouching(target)) return;
    if (target.type === TYPE.FOOD) {
      this.size += target.size;
      target.size = 0;
      return;
    }
    this.collide(target);
  }

  collide(target) {
    let col = p5.Vector.add(target.pos, this.pos).mult(0.5);
    this.vel.add(p5.Vector.sub(this.pos, col).normalize().mult(target.size / 1000));
    target.vel.add(p5.Vector.sub(target.pos, col).normalize().mult(this.size / 1000));
    if (this.traits.includes(TRAIT.SPIKES)) target.size *= 0.5;
  }
}

class Pearl extends Animacule {
  constructor(opt = {}) {
    opt.x = world.w2;
    opt.y = world.h2;
    super(opt);
    this.color = colorAdd(this._color, 25, 'l');
    this.speed *= 1.5;
    this.name = 'Pearl';
  }
}