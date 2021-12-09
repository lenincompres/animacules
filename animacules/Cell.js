class Cell extends Drop {
  constructor(opt = {}) {
    if (!opt.type) opt.type = TYPE.CELL;
    super(opt);
    this.hasAgency = true;
    this.speed = opt.speed ? opt.speed : SPEED;
    this.metab = 1;
    this.dew = this.metab;
    this.gain = 0;
    this.trait = {};
    Object.values(PROP).forEach(t => this.trait[t] = 0);
    if (opt.mutation) this.mutate({
      mutation: opt.mutation,
      mom: opt.mom,
      dad: opt.dad,
    });
  }

  set color(colour) {
    super.color = colour;
  }

  get color() {
    let r = this.getTrait(PROP.PAIN);
    let g = this.getTrait(PROP.GAIN);
    let b = 0; //this.getTrait(PROP.HIDE);
    let colour = colorAdd(this._color, {
      r: r - (g + b) * 0.5,
      g: g - (r + b) * 0.5,
      b: b - (r + g) * 0.5,
    });
    return colour;
  }

  getFill() {
    if(!this.getTrait(PROP.HIDE)) return colorSet(this.color, 0.6);
    let hide = min(this.getTrait(PROP.HIDE) / SIZE[TYPE.DROP], 1);
    return colorSet(this.color, 1 - pow(hide , 0.25));
  }

  getStroke(){
    if (this.getTrait(PROP.HIDE)) return colorSet(this.color, 0.34);
    let hide = min(this.getTrait(PROP.HIDE) / SIZE[TYPE.DROP], 1);
    return super.getStroke();
  }

  get speed() {
    if (!this.props) return this._speed;
    let tail = min(SPEED, this.getTrait(PROP.TAIL));
    return this._speed + tail;
  }

  set speed(v) {
    this._speed = v;
  }

  set acc(vect) {
    this._acc = vectorMap(vect, this.radius, this.speed);
  }

  get acc() {
    return this._acc;
  }

  hasTrait(prop) {
    return !!this.getTrait(prop);
  }

  getTrait(trait) {
    if (!this.trait) return 0;
    return this.trait[trait];
  }

  addTrait(trait, val = 0) {
    return this.trait[trait] = round(max(this.getTrait(trait) + val, 0));
  }

  incTrait(trait, factor = 0) {
    let diff = this.getTrait(trait) * factor;
    this.addTrait(trait, diff);
    return diff;
  }

  removeTrait(t) {
    return this.trait[t] = 0;
  }

  draw() {
    if (this.done) return delete this;
    super.draw();
    this.drawOvum();
    this.drawHalo();
    this.drawTail();
    this.drawHurl();
    this.drawHurt();
    this.drawEye();
    this.drawSeed();
  }

  drawEye() {
    this.inDraw(() => {
      let diam = this.radius * 0.75;
      let x = map(this.acc.mag(), 0, this.speed, 0, this.radius - diam * 0.5);
      this.eye = {
        radius: diam * 0.5,
        x: x,
        angle: vectorAng(this.acc)
      };
      fill(this.getStroke());
      rotate(this.eye.angle);
      translate(this.eye.x, 0);
      circle(0, 0, diam);
    });
  }

  drawHurl() {
    if (!this.getTrait(PROP.HURL)) return;
    if (!this.pointAng) this.pointAng = 0;
    let ang = frameCount / FRAMERATE;
    if (this.bullseye && this.bullseye.pos) {
      let bAng = vectorAng(p5.Vector.sub(this.bullseye.pos, this.pos));
      bAng = [bAng + PI * 2, bAng - PI * 2].reduce((b, a) => abs(this.pointAng - b) < abs(this.pointAng - a) ? b : a, bAng);
      this.pointAng += (bAng - this.pointAng) / 4;
    }
    ang = this.pointAng;
    super.drawHurl(ang, COLOR[this.hasTrait(PROP.HALO) ? TYPE.DROP : TYPE.SHOT]);
  }

  drawHurt() {
    if (!this.getTrait(PROP.HURT)) return;
    this.thorn = min(this.getTrait(PROP.HURT) / SIZE[TYPE.DOT], SIZE.LINE * 5);
    let colour = this.hasTrait(PROP.HALO) ? COLOR[TYPE.DROP] : COLOR[TYPE.SHOT]
    super.drawHurt(this.thorn, colour);
  }

  drawTail() {
    if (this.props.includes(PROP.TAIL)) super.drawTail(0.68, 0);
    if (!this.getTrait(PROP.TAIL)) return;
    super.drawTail(this.getTrait(PROP.TAIL) / SIZE[TYPE.DOT]);
  }

  drawHalo() {
    if (!this.getTrait(PROP.HALO)) return;
    super.drawHalo(this.getTrait(PROP.HALO) / SIZE[TYPE.DOT]);
  }

  drawOvum() {
    let ovum = this.getTrait(PROP.OVUM);
    if (!ovum) return;
    let factor = ovum / SIZE.BABY;
    super.drawOvum(this.radius * factor);
    this.inDraw(() => {
      fill(colorSet(this.color, 0.34));
      strokeWeight(SIZE.LINE * 0.5);
      circle(0, 0, this.diam * factor);
    });
  }

  drawSeed() {
    let seed = this.getTrait(PROP.SEED);
    if (!seed) return;
    this.eye.radius *= min(seed, SIZE[TYPE.DROP]) / SIZE[TYPE.DROP];
    super.drawSeed(this.eye.x, this.eye.radius, this.eye.angle);
  }

  update() {
    if (this.done) return delete this;
    super.update();
    this.acc.limit(this.speed);
    // reduce traits
    let sec = 6 / FRAMERATE;
    let dim = SIZE[TYPE.DOT] / FRAMERATE;
    if (this.getTrait(PROP.GAIN)) this.size -= this.incTrait(PROP.GAIN, -sec);
    if (this.getTrait(PROP.PAIN)) this.size += this.incTrait(PROP.PAIN, -sec);
    if (this.getTrait(PROP.TAIL)) this.addTrait(PROP.TAIL, -dim);
    if (this.getTrait(PROP.HURT)) this.addTrait(PROP.HURT, -dim);
    if (this.getTrait(PROP.HIDE)) this.addTrait(PROP.HIDE, -dim);
    if (this.getTrait(PROP.HALO)) this.addTrait(PROP.HALO, -dim);
    if (this.getTrait(PROP.SEED)) this.addTrait(PROP.SEED, -dim);
    //Reproduction
    if (this.getTrait(PROP.SEED) && this.getTrait(PROP.OVUM)) {
      let minor = min(this.getTrait(PROP.SEED), this.getTrait(PROP.OVUM));
      this.addTrait(PROP.OVUM, -minor);
      this.addTrait(PROP.SEED, -minor);
    }
    let ovum = this.getTrait(PROP.OVUM);
    if (ovum) {
      this.size += dim * 0.5;
      this.addTrait(PROP.OVUM, dim);
      if (this.size <= SIZE.BABY) this.removeTrait(PROP.OVUM);
      else if (ovum >= SIZE.BABY) this.split();
    }
  }

  isTouching(target, extend) {
    if(!target.hasAgency) return super.isTouching(target, extend);
    if(this.hasTrait(PROP.HIDE) || target.hasTrait(PROP.HIDE)) return;
    return super.isTouching(target, extend);
  }

  reach(targets = []) {
    if (!targets.length) return;
    let target = targets.reduce((o, a) => !o || this.pos.dist(a.pos) < this.pos.dist(o.pos) ? a : o, false);
    if (target) this.acc = p5.Vector.sub(target.pos, this.pos);
    else this.acc.mult(0.68);
  }

  target(targets = []) {
    if (!targets.length) return;
    if (!this.hasTrait(PROP.HURL)) return;
    targets = targets.filter(target => !target.hasTrait(PROP.HIDE) && target !== this);
    if (!targets.length) return;
    this.bullseye = targets.reduce((o, a) => !o || this.pos.dist(a.pos) < this.pos.dist(o.pos) ? a : o);
    if (this.type !== TYPE.PEARL && frameCount % (2 * FRAMERATE) < 1) this.fire();
  }

  split() {
    new Cell({
      x: this.pos.x,
      y: this.pos.y,
      size: SIZE.BABY,
      mutation: sin(random(PI)) * 20,
      mom: this
    });
    this.addTrait(PROP.PAIN, SIZE.BABY * 0.5);
    this.removeTrait(PROP.OVUM);
  }

  mutate({
    mutation = 0,
    mom = this,
    dad
  }) {
    this.color = colorAdd(mom._color, {
      h: mutation
    });
  }

  collide(target) {
    if (this.done) return;
    if (target === this) return;
    let colVect = super.collide(target, this.thorn);
    if (!colVect) return;
    let maxBite = SIZE[TYPE.DROP];
    let eat = min(maxBite, target.size);
    if (target.gain) {
      let gain = eat * target.gain;
      this.addTrait(PROP.GAIN, gain);
    }
    if (target.pain) {
      let pain = eat * target.pain;
      this.addTrait(PROP.PAIN, pain);
      this.vel.mult(map(pain / maxBite, 0, 1, 1, -0.5));
    }
    if (!target.hasAgency) {
      this.vel.add(target.vel.mult(maxBite/this.size));
      if (eat >= target.size) target.props.forEach(t => this.addTrait(t, target.size));
      target.size -= eat;
    } else {
      if (this.hasTrait(PROP.HURT)) {
        let hurt = min(this.getTrait(PROP.HURT), SIZE[TYPE.DROP]);
        this.addTrait(PROP.HURT, -hurt);
        hurt *= 2;
        target.addTrait(this.hasTrait(PROP.HALO) ? PROP.GAIN : PROP.PAIN, hurt);
        target.vel.add(p5.Vector.sub(target.pos, colVect).setMag(sqrt(hurt / SIZE[TYPE.DOT])));
      }
      if (this.hasTrait(PROP.SEED)) {
        let seed = min(this.getTrait(PROP.SEED), SIZE[TYPE.DROP]);
        target.addTrait(PROP.OVUM, seed);
        this.addTrait(PROP.SEED, -seed);
      }
    }
    return colVect;
  }

  fire() {
    if (!this.hasTrait(PROP.HURL)) return;
    if (!this.gun) this.gun = this.vel;
    let shot = new Shot({
      x: this.pos.x + this.gun.x,
      y: this.pos.y + this.gun.y,
      vel: this.gun,
      shooter: this
    });
    this.addTrait(PROP.HURL, -shot.size);
    this.addTrait(PROP.SEED, -shot.size);
  }
}