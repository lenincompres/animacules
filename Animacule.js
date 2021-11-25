const TYPE = {
  BULLET: 'bullet',
  FOOD: ' food',
  AGENT: 'agent'
}

const TRAIT = {
  BOOST: 'boost',
  SPIKE: 'spike',
  SHOT: 'shot',
  PAIN: 'pain', // when hit with spikes or shot
  SEED: 'seed', // make other split in half
  SPLIT: 'split', // when hit with seed and split
  CHOMP: 'chomp', // ability to eat half of others
}

const SAY = {
  PEW: 'pew', // shoot spike
  BANG: 'bang', // shoot 3 spikes
  BOOM: 'boom', // dart all spikes
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
    if (!c.levels) c = color(c);
    if (this._color === undefined) this._firstColor = c;
    c.setAlpha(0.68);
    this._color = c;
    this._hl = colorAdd(c, {
      l: 15
    });
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

  get rotation() {
    return vectorAng(this.vel);
  }

  inDraw(drawing = () => null) {
    push();
    translate(this.pos.x, this.pos.y);
    fill(this.color, 0.68);
    stroke(this._hl, 0.86);
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
    this.acc.limit(this.speed);
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
    this.color = opt.color ? opt.color : 'green';
    this.trait = {};
    this.traits = opt.traits ? opt.traits : [];
    Object.values(TRAIT).forEach(t => this.trait[t] = 0);
    if (opt.traits) opt.traits.forEach(t => this.addTrait(t));
  }

  draw() {
    super.draw();
    if (this.trait[TRAIT.BOOST] > 0) this.inDraw(() => this.boost());
    if (this.trait[TRAIT.SPIKE] > 0) this.inDraw(() => this.spike());
    if (this.trait[TRAIT.SHOT] > 0) this.point();
  }

  addTrait(t, n = 1) {
    this.trait[t] += n;
  }

  spike() {
    let n = min(16, this.trait[TRAIT.SPIKE]);
    let delta = 2 * PI / n;
    while (n) {
      rotate(delta);
      line(0, this.r, 0, this.r * 1.17);
      n -= 1;
    }
  }

  point() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(colorAdd(this._hl, {
      r: 30
    }));
    rotate(frameCount / 24);
    polygon(0, 0, this.r * 0.68, 3);
    pop();
  }

  boost(n = 1) {
    noFill();
    stroke(this._hl);
    let ang = PI + vectorAng(this.acc);
    this.drawFlag(ang);
    if(this.type === TYPE.FOOD) this.drawFlag(PI);
  }

  drawFlag(ang = 0){
    rotate(ang);
    let z = this.r * (this.type === TYPE.FOOD ? 0.68 : 0.86);
    let s = sin(frameCount) * z * 0.34;
    beginShape();
    curveVertex(this.r, 0);
    curveVertex(this.r, 0);
    curveVertex(this.r + z * 0.5, s * 0.5);
    curveVertex(this.r + z, -s);
    curveVertex(this.r + z, -s);
    endShape();
  }

  update() {
    super.update();
    this.size -= world.heat * this.dew;
    if (this.size < 1) {
      this.done = true;
      delete this;
    }
  }
}

class Animacule extends Drop {
  constructor(opt = {}) {
    super(opt);
    this.color = opt.color ? opt.color : 'dodgerblue';
    this.type = TYPE.AGENT;
    this.speed = opt.speed ? opt.speed : world.w / 1000;
    this.size = world.w * world.h / 100;
    this.metab = opt.metab ? opt.metab : 0.5;
    this.dew += this.metab;
  }

  get speed() {
    if(this.trait && this.trait[TRAIT.BOOST]) return this._speed * 1.5;
    return this._speed;
  }

  set speed(v) {
    this._speed = v;
  }

  set acc(vect) {
    this._acc = vectorMap(vect, this.r, this.speed);
  }

  get acc(){
    return this._acc;
  }

  draw() {
    super.draw();
    this.inDraw(() => {
      rotate(vectorAng(this.acc));
      fill(this._hl);
      noStroke();
      let d = this.r * 0.68;
      let m = map(this.acc.mag(), 0, this.speed, 0, d);
      circle(m, 0, d);
    });
  }

  point() {
    push();
    translate(this.pos.x, this.pos.y);
    fill(colorAdd(this._hl, {
      l: 100
    }));
    rotate(vectorAng(this.vel));
    let r = this.r * 0.3;
    triangle(r, this.r * 0.9, -r, this.r * 0.9, 0, this.r + r * 2);
    pop();
  }

  update() {
    super.update();
    if (this.trait[TRAIT.BOOST] > 0) this.trait[TRAIT.BOOST] -= 2;
    if (this !== pearl && this.type === TYPE.AGENT) {
      let food = anims.filter(a => a.type === TYPE.FOOD)
        .reduce((o, a) => !o || this.pos.dist(a.pos) < this.pos.dist(o.pos) ? a : o, false);
      if (!food) return this.acc.mult(0.68);
      this.acc = p5.Vector.sub(food.pos, this.pos);
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
      target.traits.forEach(t => this.addTrait(t, target.size));
      this.size += target.size;
      target.size = 0;
      return;
    }
    this.collide(target);
  }

  collide(target) {
    let spike = 3 * this.trait[TRAIT.SPIKE];
    spike = min(spike, target.size);
    if (spike > 0) {
      target.size -= spike;
      this.trait[TRAIT.SPIKE] -= spike;
      if (this.trait[TRAIT.SPIKE] < 0) this.trait[TRAIT.SPIKE] = 0;
      this.trait[TRAIT.PAIN] += spike;
    }
    let col = p5.Vector.add(target.pos, this.pos).mult(0.5);
    this.vel.add(p5.Vector.sub(this.pos, col).normalize().mult((target.size + spike) / 1000));
    target.vel.add(p5.Vector.sub(target.pos, col).normalize().mult((this.size + spike) / 1000));
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
    this.traits = [TRAIT.SHOT];
  }

  point() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(vectorAng(pointer));
    noStroke();
    fill(colorAdd(this._hl, {
      r: 30
    }));
    let r = this.r * 0.3;
    triangle(r, this.r * 0.9, -r, this.r * 0.9, 0, this.r + r * 2);
    pop();
  }
}