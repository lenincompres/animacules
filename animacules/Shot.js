class Shot extends Dot {
  constructor(opt = {}) {
    if (!opt.type) opt.type = TYPE.SHOT;
    if (!opt.vel) opt.vel = p5.Vector(0, SPEED);
    super(opt);
    this.vel = opt.vel.setMag(150 * SPEED);
    this.isHalo = opt.shooter.has(PROP.HALO);
    this.isSeed = opt.shooter.has(PROP.SEED);
    if (this.isHalo) this.color = COLOR[TYPE.DROP];
  }

  draw() {
    super.draw();
    this.inDraw(() => {
      line(-this.r, 0, this.r, 0);
    });
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
    anims.filter(anim => anim.hasAgency && !anim.done && !anim.has(PROP.SOUL)).forEach(cell => {
      if (this.done) return;
      points.forEach(p => {
        if (!this.done) this.done = cell.pos.dist(p) < cell.radius;
      });
      if (this.done) {
        if (this.isSeed) cell.addTrait(PROP.OVUM, this.size);
        if (this.isHalo) cell.addTrait(PROP.GAIN, this.size);
        else {
          cell.addTrait(PROP.PAIN, 2 * this.size);
          cell.vel.add(this.vel.mult(10 * this.size / cell.size));
        }
      }
    });
  }
}