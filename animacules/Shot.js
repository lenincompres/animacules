class Shot extends Drop {
  constructor(opt = {}) {
    if (!opt.type) opt.type = TYPE.SHOT;
    if (!opt.vel) opt.vel = p5.Vector(0, SPEED);
    super(opt);
    this.vel = opt.vel.setMag(SHOTSPEED);
    if (opt.shooter.hasTrait(PROP.SEED)) this.addProp(PROP.OVUM);
    if (opt.shooter.hasTrait(PROP.SICK)) this.addProp(PROP.SICK);
    if (opt.shooter.hasTrait(PROP.HALO)) this.halo = true;
    else this.pain = 1;
  }

  update(){
    super.update();
    if (this.halo) {
      this.gain = 1;
      this.pain = 0;
    } else {
      this.gain = -1;
      this.pain = -1;
    }
  }

  collide(target, extend) {
    if (super.collide(target, extend)) target.vel.add(this.vel);
  }
}