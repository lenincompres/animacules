class Cell extends Drop {
  constructor(opt = {}) {
    if (!opt.type) opt.type = TYPE.CELL;
    super(opt);
    this.hasAgency = true;
    this.speed = SPEED;
    this.metab = 1;
    this.dew = this.metab;
    this.trait = {};
    Object.values(PROP).forEach(t => this.trait[t] = 0);
    if (opt.mutation) this.mutate({
      mutation: opt.mutation
    });
  }

  set color(colour) {
    super.color = colour;
  }

  get color() {
    let r = this.getTrait(PROP.PAIN);
    let g = this.getTrait(PROP.GAIN);
    let b = 0; //this.getTrait(PROP.SOUL);
    let colour = colorAdd(this._color, {
      r: r - (g + b) * 0.5,
      g: g - (r + b) * 0.5,
      b: b - (r + g) * 0.5,
    });
    if (!this.has(PROP.SOUL)) return colour;
    let a = 1.25 - pow(min(this.getTrait(PROP.SOUL), SIZE[TYPE.DROP]) / SIZE[TYPE.DROP], 0.25);
    return colorSet(colour, a);
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

  has(prop) {
    return super.has(prop) || !!this.getTrait(prop);
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
    super.draw(0);
    this.inDraw(() => {
      let diam = this.radius * 0.75;
      let x = map(this.acc.mag(), 0, this.speed, 0, this.radius - diam * 0.5);
      this.eye = {
        radius: diam * 0.5,
        x: x,
        angle: vectorAng(this.acc)
      };
      fill(this.color);
      rotate(this.eye.angle);
      translate(this.eye.x, 0);
      circle(0, 0, diam);
    });
    this.drawSeed();
  }

  drawGun() {
    if (!this.getTrait(PROP.HURL)) return;
    if (!this.pointAng) this.pointAng = 0;
    let ang = frameCount / FRAMERATE;
    if (this.bullseye && this.bullseye.pos) {
      let bAng = vectorAng(p5.Vector.sub(this.bullseye.pos, this.pos));
      bAng = [bAng + PI * 2, bAng - PI * 2].reduce((b, a) => abs(this.pointAng - b) < abs(this.pointAng - a) ? b : a, bAng);
      this.pointAng += (bAng - this.pointAng) / 4;
    }
    ang = this.pointAng;
    super.drawGun(ang, COLOR[this.has(PROP.HALO) ? TYPE.DROP : TYPE.SHOT]);
  }

  drawSpikes() {
    if (!this.getTrait(PROP.HURT)) return;
    let d = min(this.getTrait(PROP.HURT) / SIZE[TYPE.DOT], SIZE.LINE * 5);
    let h = this.has(PROP.HALO);
    super.drawSpikes(d + SIZE.LINE, h ? COLOR[TYPE.DROP] : COLOR[TYPE.SHOT]);
    super.drawSpikes(d);
  }

  drawFlag() {
    if (this.props.includes(PROP.TAIL)) super.drawFlag(0.68, 0);
    if (!this.getTrait(PROP.TAIL)) return;
    super.drawFlag(this.getTrait(PROP.TAIL) / SIZE[TYPE.DOT]);
  }

  drawHalo() {
    if (!this.getTrait(PROP.HALO)) return;
    super.drawHalo(this.getTrait(PROP.HALO) / SIZE[TYPE.DOT]);
  }

  drawOvum() {
    let ovum = this.getTrait(PROP.OVUM);
    if (!ovum) return;
    let diam = 2 * sqrt(SIZE.BABY / PI);
    let factor = ovum / SIZE.BABY;
    super.drawOvum(0.5 * diam * factor);
    this.inDraw(() => {
      noStroke();
      circle(0, 0, diam * factor);
      noFill();
      stroke(this.color);
      strokeWeight(SIZE.LINE * 0.34);
      circle(0, 0, diam);
    });
  }

  drawSeed() {
    let seed = this.getTrait(PROP.SEED);
    if (!seed) return;
    this.eye.radius *= min(seed, SIZE[TYPE.DROP]) / SIZE[TYPE.DROP];
    super.drawSeed(this.eye.x, this.eye.radius, this.eye.angle);
  }

  fire() {
    if (!this.getTrait(PROP.HURL)) return;
    let shot = new Shot({
      x: this.pos.x + this.gun.x,
      y: this.pos.y + this.gun.y,
      vel: this.gun,
      shooter: this
    });
    this.addTrait(PROP.HURL, -shot.size);
    this.addTrait(PROP.SEED, -shot.size);
  }

  split() {
    let baby = new Cell({
      x: this.pos.x,
      y: this.pos.y,
      size: SIZE.BABY,
    });
    baby.mutate({
      mom: this
    });
    this.addTrait(PROP.PAIN, SIZE.BABY * 0.5);
    this.removeTrait(PROP.OVUM);
  }

  mutate({
    mutation = sin(random(PI)) * 20,
    mom = this,
    dad
  }) {
    this.color = colorAdd(mom._color, {
      h: mutation
    });
  }

  update() {
    super.update();
    this.acc.limit(this.speed);
    // reduce traits
    let sec = 6 / FRAMERATE;
    if (this.getTrait(PROP.GAIN)) this.size -= this.incTrait(PROP.GAIN, -sec);
    if (this.getTrait(PROP.PAIN)) this.size += this.incTrait(PROP.PAIN, -sec);
    let dim = SIZE[TYPE.DOT] / FRAMERATE;
    if (this.getTrait(PROP.TAIL)) this.addTrait(PROP.TAIL, -dim);
    if (this.getTrait(PROP.HURT)) this.addTrait(PROP.HURT, -dim);
    if (this.getTrait(PROP.SOUL)) this.addTrait(PROP.SOUL, -dim);
    if (this.getTrait(PROP.HALO)) this.addTrait(PROP.HALO, -dim);
    //Reproduction
    if (this.getTrait(PROP.SEED) && this.getTrait(PROP.OVUM)) {
      let diff = abs(this.getTrait(PROP.SEED) - this.getTrait(PROP.OVUM));
      this.addTrait(PROP.OVUM, -diff);
      this.addTrait(PROP.SEED, -diff);
    }
    if (this.getTrait(PROP.SEED)) this.addTrait(PROP.SEED, -dim);
    if (this.getTrait(PROP.OVUM)) {
      this.addTrait(PROP.OVUM, dim);
      this.size += dim;
      if (this.size <= SIZE.BABY) this.removeTrait(PROP.OVUM);
      else if (this.getTrait(PROP.OVUM) >= SIZE.BABY) this.split();
    }
    // automaton
    if (this.type !== TYPE.PEARL) {
      // go to the closest drop
      if (anims.filter(a => a.type === TYPE.DROP).length) {
        let drop = anims.filter(a => a.type === TYPE.DROP).reduce((o, a) => !o || this.pos.dist(a.pos) < this.pos.dist(o.pos) ? a : o, false);
        if (!drop) this.acc.mult(0.68);
        else this.acc = p5.Vector.sub(drop.pos, this.pos);
      }
      //firing
      if (frameCount % (2 * FRAMERATE) < 1) this.fire();
    }
    let targets = anims.filter(a => this !== a && a.hasAgency && !a.has(PROP.SOUL));
    if (targets.length) this.bullseye = targets.reduce((b, a) => !b || this.pos.dist(a.pos) < this.pos.dist(b.pos) ? a : b);
  }

  isTouching(target) {
    if (target.hasAgency && (target.has(PROP.SOUL) || this.has(PROP.SOUL))) return false;
    return super.isTouching(target);
  }

  collide(target) {
    if (this.done) return;
    if (target === this) return;
    if (!this.isTouching(target)) return;
    let colVect = super.collide(target);
    if (!colVect) return;
    if (target.type === TYPE.DROP) {
      target.props.forEach(t => this.addTrait(t, target.size));
      this.addTrait(PROP.GAIN, target.size);
      target.size = 0;
    } else if (target.hasAgency) {
      if (this.has(PROP.HURT)) {
        let hurt = min(this.getTrait(PROP.HURT), SIZE[TYPE.DROP]);
        this.addTrait(PROP.HURT, -hurt);
        target.addTrait(this.has(PROP.HALO) ? PROP.GAIN : PROP.PAIN, 2 * hurt);
        target.vel.add(p5.Vector.sub(target.pos, colVect).setMag(sqrt(2 * hurt / SIZE[TYPE.DOT])));
      }
      if (this.has(PROP.SEED)) {
        let seed = min(this.getTrait(PROP.SEED), SIZE[TYPE.DROP]);
        target.addTrait(PROP.OVUM, seed);
        this.addTrait(PROP.SEED, -seed);
      }
    }
    return colVect;
  }
}