class Shot extends Drop {
  constructor(opt = {}) {
    if (!opt.type) opt.type = TYPE.SHOT;
    if (!opt.vel) opt.vel = p5.Vector(0, SPEED);
    super(opt);
    this.vel = opt.vel.setMag(SHOTSPEED);
    if (opt.shooter.hasTrait(PROP.HALO)) this.halo = true;
    if (opt.shooter.hasTrait(PROP.SEED)) this.addProp(PROP.OVUM);
  }

  collide(target, extend) {
    if(super.collide(target, extend)) target.vel.add(this.vel);
  }
}