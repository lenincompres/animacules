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
    anims.push(this);
  }

  set color(colour) {
    if (!colour.mode) colour = color(colour);
    if (this._color === undefined) this._firstColor = colour;
    this._color = colour;
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
    fill(colorAdd(this.color, -0.34));
    stroke(this.color);
    strokeWeight(SIZE.LINE);
    push();
    drawing();
    pop();
    pop();
  }

  draw(full = true) {
    if (this.done) return delete this;
    this.inDraw(() => {
      if (full) fill(this.color);
      circle(0, 0, this.diam);
    });
  }

  update() {
    if (this.done) return delete this;
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

  isTouching(target, extend = 0) {
    if (target.type === TYPE.BULLET) return false;
    return this.pos.dist(target.pos) <= this.radius + target.radius + extend;
  }

  collide(target, extend) {
    if (this.done);
    if (target === this) return;
    if (!this.isTouching(target, extend)) return;
    let col = p5.Vector.add(target.pos, this.pos).mult(0.5);
    target.vel.add(p5.Vector.sub(target.pos, col).setMag(sqrt(this.size / SIZE[TYPE.DOT])));
    return col;
  }
}