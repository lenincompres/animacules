class Dot {
  constructor({
    x,
    y,
    type = TYPE.DOT,
    size,
    color
  }) {
    if (x === undefined) x = random(world.w);
    if (y === undefined) y = random(world.h);
    this.pos = createVector(x, y);
    this.acc = createVector(0, 0);
    this.vel = createVector(0, 0);
    this.dew = 0;
    this.type = type;
    this.size = size ? size : SIZE[this.type];
    this.color = color ? color : COLOR[this.type];
    this.hitPoints = [];
    this.collitions = [];
    this.t = t; // birthTime
    dots.push(this);
  }

  set color(colour) {
    if (!colour.mode) colour = color(colour);
    this._color = colour;
  }

  get color() {
    return this._color;
  }

  set size(v) {
    this._size = v;
    this.radius = sqrt(v / PI);
    this.diam = this.radius * 2;
    this.done = v < 1;
  }

  get size() {
    return this._size;
  }

  getFill() {
    return this.color;
  }

  getStroke() {
    return this.color;
  }

  getLine() {
    return SIZE.LINE;
  }

  inDraw(drawing = () => null) {
    push();
    translate(this.pos.x, this.pos.y);
    fill(this.getFill());
    stroke(this.getStroke());
    strokeWeight(this.getLine());
    drawing();
    pop();
  }

  draw() {
    if (this.done) return delete this;
    this.inDraw(() => circle(0, 0, this.diam));
  }

  update() {
    if (this.done) return delete this;
    this.lastPos = vectorClone(this.pos);
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.vel.mult(world.frix);
    this.collitions = [];
    if (this.pos.x < this.radius || this.pos.x > world.w - this.radius) {
      this.vel.x *= -1;
      this.acc.x *= -1;
      this.pos.x = constrain(this.pos.x, this.radius, world.w - this.radius);
    }
    if (this.pos.y < this.radius || this.pos.y > world.h - this.radius) {
      this.vel.y *= -1;
      this.acc.y *= -1;
      this.pos.y = constrain(this.pos.y, this.radius, world.h - this.radius);
    }
    if (this.size < 1) this.done = true;
    this.hitPoints = [this.pos];
    let dist = this.diam;
    if (p5.Vector.sub(this.pos, this.lastPos).mag() > dist) return;
    let diff = vectorClone(this.vel);
    let inc = floor(diff.mag() / dist);
    diff.setMag(dist);
    this.hitPoints = new Array(inc).fill(1).map((v, i) => p5.Vector.add(this.lastPos, diff.setMag(dist * i)));
  }

  isTouching(target, extend = 0) {
    let hit = false;
    if (this.hitPoints.length < 2) {
      hit = this.pos.dist(target.pos) <= this.radius + target.radius + extend;
    } else {
      this.hitPoints.forEach(p => {
        if (!hit) hit = target.pos.dist(p) < target.radius + extend;
      });
    }
    if(!hit) return;
    let median = p5.Vector.add(target.pos, this.pos).mult(0.5);
    return p5.Vector.sub(target.pos, median).normalize();
  }

  collide(target, extend) {
    if (this.done);
    if (target === this) return;
    if (this.collitions.includes(target)) return;
    let normal = this.isTouching(target, extend);
    if (!normal) return;

    let push = sqrt(this.size / SIZE[TYPE.DOT]);
    target.vel.add(normal.setMag(push));

    push = sqrt(target.size / SIZE[TYPE.DOT]);
    this.vel.sub(normal.setMag(push));

    this.collitions.push(target);
    target.collitions.push(this);
    return normal;
  }
}