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
    Object.values(PROP).forEach(time => this.trait[time] = 0);
    if (opt.mutation) this.mutate(opt.mutation);
  }

  set color(colour) {
    super.color = colour;
  }

  get color() {
    let r = this.getTrait(PROP.PAIN);
    let g = this.getTrait(PROP.GAIN);
    let colour = colorAdd(this._color, {
      r: r - g,
      g: g - r,
    });
    return colour;
  }

  getFill() {
    if (!this.getTrait(PROP.HIDE)) return colorSet(this.color, 0.62);
    let hide = min(this.getTrait(PROP.HIDE) / SIZE[TYPE.DROP], 1);
    return colorSet(this.color, pow(map(hide, 0, 1, 0.62, 0), 4));
  }

  getStroke() {
    if (this.getTrait(PROP.HIDE)) return colorSet(this.color, 0.31);
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

  removeTrait(time) {
    return this.trait[time] = 0;
  }

  draw() {
    if (this.done) return delete this;
    super.draw();
    this.drawOvum();
    this.drawHalo();
    this.drawTail();
    this.drawHurl();
    this.drawHurt();
    this.drawSick();
    this.drawEye();
    this.drawSeed();
  }

  drawEye() {
    this.inDraw(() => {
      let radius = 0.45 * this.radius;
      this.eye = {
        x: map(this.acc.mag(), 0, this.speed, 0, this.radius - radius),
        radius: radius,
        angle: vectorAng(this.acc)
      };
      fill(this.getStroke());
      rotate(this.eye.angle);
      translate(this.eye.x, 0);
      circle(0, 0, 2 * radius);
    });
  }

  drawHurl(ang = 0) {
    if (!this.getTrait(PROP.HURL)) return;
    if (this.bullseye && this.bullseye.pos) {
      ang = vectorAng(p5.Vector.sub(this.bullseye.pos, this.pos));
    }
    super.drawHurl(ang, COLOR[this.hasTrait(PROP.HALO) ? TYPE.DROP : TYPE.SHOT]);
  }

  drawHurt() {
    if (!this.getTrait(PROP.HURT)) return;
    this.thorn = min(this.getTrait(PROP.HURT) / SIZE[TYPE.DOT], LINEWEIGHT * 5);
    let colour = this.hasTrait(PROP.HALO) ? COLOR[TYPE.DROP] : COLOR[TYPE.SHOT]
    super.drawHurt(this.thorn, colour);
  }

  drawTail() {
    if (!this.getTrait(PROP.TAIL)) return;
    let factor = min(3 * this.getTrait(PROP.TAIL) / SIZE[TYPE.DROP], 1);
    super.drawTail(factor);
    super.drawWings(factor * 0.5);
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
      strokeWeight(LINEWEIGHT * 0.5);
      circle(0, 0, this.diam * factor);
    });
  }

  drawSeed() {
    let seed = this.getTrait(PROP.SEED);
    if (!seed) return;
    this.eye.radius *= min(seed, SIZE[TYPE.DROP]) / SIZE[TYPE.DROP];
    super.drawSeed(this.eye);
  }

  drawSick() {
    let sick = this.getTrait(PROP.SICK);
    if (!sick) return;
    super.drawSick(sick);
  }

  update() {
    if (this.done) return delete this;
    let dim = SIZE[TYPE.DROP] / FRAMERATE / 10; // lasts 5 seconds
    // virus and immunization
    let sick = this.getTrait(PROP.SICK);
    if (sick) {
      if (sick > SIZE[TYPE.DROP] * 0.5) {
        this.addTrait(PROP.PAIN, dim);
        this.acc.rotate(sin(4 * this.age / FRAMERATE) * map(sick, SIZE[TYPE.DROP] * 0.5, SIZE[TYPE.DROP], 0, 1) * PI * 0.62);
      }
      this.addTrait(PROP.SICK, -dim);
    }
    super.update();
    this.acc.limit(this.speed);

    // reduce traits
    // affect with time
    if (this.getTrait(PROP.GAIN)) this.size -= this.incTrait(PROP.GAIN, -0.2 * dim);
    if (this.getTrait(PROP.PAIN)) this.size += this.incTrait(PROP.PAIN, -0.2 * dim);
    // reduced with time
    if (this.getTrait(PROP.TAIL)) this.addTrait(PROP.TAIL, -dim);
    if (this.getTrait(PROP.HIDE)) this.addTrait(PROP.HIDE, -dim);
    if (this.getTrait(PROP.HURT)) this.addTrait(PROP.HURT, -dim); // 10s
    //Reproduction
    if (this.getTrait(PROP.SEED) && this.getTrait(PROP.OVUM)) {
      let redux = min(this.getTrait(PROP.SEED), this.getTrait(PROP.OVUM));
      this.addTrait(PROP.OVUM, -redux);
      this.addTrait(PROP.SEED, -redux);
    }
    let ovum = this.getTrait(PROP.OVUM);
    if (ovum) {
      this.size += dim;
      this.addTrait(PROP.OVUM, dim);
      if (ovum >= SIZE.BABY) this.split();
    }
  }

  //collision detection between this and another target
  isTouching(target) {
    if (!target.hasAgency) return super.isTouching(target);
    if (this.hasTrait(PROP.HIDE) || target.hasTrait(PROP.HIDE)) return;
    return super.isTouching(target, this.thorn);
  }

  //moves towards the closets out of a list of targets
  reach(targets = []) {
    if (!targets.length) return;
    let target = targets.reduce((o, a) => !o || this.pos.dist(a.pos) < this.pos.dist(o.pos) ? a : o);
    if (!target) return this.acc.mult(0.62);
    this.acc = p5.Vector.sub(target.pos, this.pos);
  }

  //selects a bullseye from a list of cells to point the gun to
  target(targets = []) {
    if (!targets.length) return;
    if (!this.hasTrait(PROP.HURL)) return;
    targets = targets.filter(target => target !== this && !target.hasTrait(PROP.HIDE));
    if (!targets.length) return;
    this.bullseye = targets.reduce((o, a) => !o || this.pos.dist(a.pos) < this.pos.dist(o.pos) ? a : o);
  }

  fire() {
    if (!this.hasTrait(PROP.HURL)) return;
    let shot = new Shot({
      x: this.pos.x + this.gun.x,
      y: this.pos.y + this.gun.y,
      vel: this.gun,
      shooter: this,
    });
    this.addTrait(PROP.HURL, -shot.size);
    this.addTrait(PROP.HALO, -shot.size);
    this.addTrait(PROP.SEED, -shot.size);
  }

  split(factor = 0.37, error = 0.37) {
    let size = factor * this.size;
    new Cell({
      x: this.pos.x,
      y: this.pos.y,
      size: size,
      color: this._color,
      mutation: sin(random(PI)) * error * 100
    });
    this.addTrait(PROP.PAIN, size);
    this.removeTrait(PROP.OVUM);
  }

  mutate(mutation) {
    this.color = colorAdd(this._color, mutation, 'h');
  }

  handleCollision(point, target) {
    super.handleCollision(point, target);
    let maxBite = SIZE[TYPE.DROP];
    let eat = min(maxBite, target.size);
    let gain = eat * target.gain;
    let pain = eat * target.pain + max(0, -gain);
    if (gain) {
      this.addTrait(PROP.GAIN, max(0, gain));
    }
    if (pain) {
      this.addTrait(PROP.PAIN, pain);
      this.vel.mult(-pain / maxBite); // recoil
    }
    if (!target.hasAgency) {
      if (eat >= target.size) {
        this.vel.add(target.vel.mult(4 * eat / this.size));
        target.props.forEach(prop => {
          if (prop === PROP.SICK && this.hasTrait(PROP.SICK)) return;
          this.addTrait(prop, SIZE[TYPE.DROP]);
        });
        target.size -= eat;
      }
    } else {
      if (this.hasTrait(PROP.HURT)) {
        let hurt = min(this.getTrait(PROP.HURT), SIZE[TYPE.DROP]);
        this.addTrait(PROP.HURT, -hurt);
        target.addTrait(this.hasTrait(PROP.HALO) ? PROP.GAIN : PROP.PAIN, 2 * hurt);
        this.addTrait(PROP.HALO, -hurt);
        target.vel.add(p5.Vector.sub(target.pos, point).setMag(sqrt(hurt / SIZE[TYPE.DOT])));
      }
      if (this.hasTrait(PROP.SEED)) {
        let seed = min(this.getTrait(PROP.SEED), SIZE[TYPE.DROP]);
        target.addTrait(PROP.OVUM, seed);
        this.addTrait(PROP.SEED, -seed);
      }
      if (this.hasTrait(PROP.SICK) && !target.hasTrait(PROP.SICK)) {
        //contagion only happens if the other is not contagious, and it is a set number
        target.addTrait(PROP.SICK, SIZE[TYPE.DROP]);
      }
    }
    return point;
  }
}

class Pearl extends Cell {
  constructor(opt = {}) {
    opt.type = TYPE.PEARL;
    super(opt);
    this.speed = SPEED * 1.62;
  }
}