

class Grain {
  constructor({
    x = random(world.w),
    y = random(world.h),
    size = world.w * world.h / 10000,
    color = 'yellow'
  }) {
    this.pos = createVector(x, y);
    this.acc = createVector(0, 0);
    this.vel = createVector(0, 0);
    colorMode(HSB);
    this.color = color;
    this.size = size;
  }

  set color(c) {
    this._color = color(c);
    this._hl = color(hue(c) - 20, saturation(c), brightness(c) + 100);
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
    fill(this._color);
    stroke(this._hl)
    strokeWeight(2);
    circle(this.pos.x, this.pos.y, this.d);
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
  constructor(opt) {
    super(opt);
    this.size = world.w * world.h / 1000,
      this.color = opt.color ? opt.color : 'green';
    this.dew = opt.dew ? opt.dew : 1;
    this.type = TYPE.FOOD;
  }

  update() {
    super.update();
    this.size -= world.heat * this.dew;
    if(this.size<1) this.done = true;
  }
}

class Animacule extends Drop {
  constructor(opt) {
    super(opt);
    this.color = opt.color ? opt.color : 'maroon';
    this.type = TYPE.AGENT,
      this.speed = opt.speed ? opt.speed : world.w / 2000;
    this.size = world.w * world.h / 100;
    this.metab = opt.metab ? opt.metab : 0.5;
    this.dew += this.metab;
  }

  draw() {
    super.draw();
    fill(this._hl);
    noStroke();
    let nuc = createVector(this.acc.x, this.acc.y);
    let d = this.r * 0.68;
    nuc.setMag(map(nuc.mag(), 0, this.speed, 0, d));
    nuc.limit(d);
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

  eat(target) {
    if (this.done) return;
    if (target === this) return;
    if (this === pearl && target.type === TYPE.AGENT) return;
    if (this.pos.dist(target.pos) > this.r + target.r) return;
    if (target.type === TYPE.FOOD) {
      this.size += target.size;
      target.size = 0;
      return;
    }
    let col = createVector(target.pos.x + this.pos.x, target.pos.y + this.pos.y).mult(0.5);
    this.vel.add(p5.Vector.sub(this.pos, col).normalize().mult(10));
    target.vel.add(p5.Vector.sub(target.pos, col).normalize().mult(10));
    if (target === pearl) {
      target.size *= 0.5;
      target.vel.add(p5.Vector.sub(target.pos, col).normalize().mult(10));
    }
  }
}


/*
class Pearl extends Animacule {
  constructor(opt) {
    super(opt);
    this.color = opt.color ? opt.color : 'royalBlue'
    this.speed = opt.speed ? opt.speed : world.w / 1000;
    this.name = 'Pearl';
  }

  collide(target) {
    super.collide(target);
    target.size *= 0.5;
    target.vel.add(p5.Vector.sub(target.pos, col).normalize().mult(10));
  }
}
*/