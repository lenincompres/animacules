class Shot extends Drop {
  constructor(opt = {}) {
    if (!opt.type) opt.type = TYPE.SHOT;
    if (!opt.vel) opt.vel = p5.Vector(0, SPEED);
    super(opt);
    this.vel = opt.vel.setMag(150 * SPEED);
    if (opt.shooter.hasTrait(PROP.HALO)) {
      this.gain = 1;
      this.pain = 0;
    } else {
      this.gain = 0;
      this.pain = 1;
    }
    if (opt.shooter.hasTrait(PROP.SEED)) this.addProp(PROP.OVUM);
  }

  update() {
    if (this.done) return delete this;
    super.update();
    if (this.vel.mag() < SIZE.LINE) {
      this.gain = 1;
      this.pain = 0;
      return;
    }
  }

  collide(target, extend) {
    if (this.done) return;
    if (target === this) return;
    if(super.collide(target, extend)){
      target.vel.add(this.vel);
    };
  }
}