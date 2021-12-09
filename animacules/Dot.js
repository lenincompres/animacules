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
    this.positions = [];
    this.collitions = [];
    this.time = levelTime; // birthTime
    dots.push(this);
  }

  get age(){
    return levelTime - this.time;
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
    return LINEWEIGHT;
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
    if(this.vel.mag() < 0.1) this.vel.setMag(0);
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
    // handle fast things like bullets for multiple hit points
    this.positions = [this.pos];
    if (p5.Vector.sub(this.pos, this.lastPos).mag() > MAXLENGTH) return;
    let diff = vectorClone(this.vel);
    let inc = floor(diff.mag() / MAXLENGTH);
    diff.setMag(MAXLENGTH);
    this.positions = new Array(inc).fill(1).map((v, i) => p5.Vector.add(this.lastPos, diff.setMag(MAXLENGTH * i)));
  }

  isTouching(target, extend = 0) {
    if (this.done) return;
    let hit = false;
    let minDist = this.radius + target.radius + extend
    // these should always contain the pos
    if (!this.positions.length) this.positions = [this.pos];
    if (!target.positions.length) target.positions = [target.pos];
    // check all possible points
    this.positions.forEach(p => {
      if (!hit) hit = target.pos.dist(p) <= minDist;
    });
    if (!hit) target.positions.forEach(p => {
      if (!hit) hit = this.pos.dist(p) <= minDist;
    });
    if (!hit) return;
    //return the toaching point
    return p5.Vector.add(target.pos, this.pos).mult(0.5);
  }

  collide(target, extend) {
    if (this.done) return;
    if (target === this) return;
    if (this.collitions.includes(target)) return;
    let touchPoint = this.isTouching(target, extend);
    if (!touchPoint) return;
    this.handleCollision(touchPoint, target);
    target.handleCollision(touchPoint, this);
    return true;
  }

  handleCollision(point, target) {
    let normal = p5.Vector.sub(target.pos, point).normalize();
    let push = sqrt(target.size / SIZE[TYPE.DOT]);
    this.vel.sub(normal.setMag(push));
    this.collitions.push(target);
  }
}