class Drop extends Dot {
  constructor(opt = {}) {
    if (!opt.type) opt.type = TYPE.DROP;
    super(opt);
    this.dew = 0;
    this.pain = 0; // from 0 to 1
    this.gain = 1; // from -1 (harmful) to 1
    this.props = opt.props ? opt.props : [];
    this.speed = SHOTSPEED * SIZE[TYPE.DROP] / SIZE[TYPE.CELL];

    // props
    this.addProp(PROP.FOOD);
    // tails give acceleration
    if (this.hasProp(PROP.TAIL)) this.acc = vectorRad(SPEED * SIZE[TYPE.DROP] / SIZE[TYPE.CELL], random(TWO_PI));
    // can't have OVUM and SEED
    if (this.hasProp(PROP.OVUM) && this.hasProp(PROP.SEED)) {
      this.removeProp(PROP.OVUM);
      this.removeProp(PROP.SEED);
    }
  }

  set pain(val) {
    this._pain = constrain(val, 0, 1);
  }

  get pain() {
    return this._pain;
  }

  set gain(val) {
    this._gain = constrain(val, -1, 1);
  }

  get gain() {
    return this._gain;
  }

  hasProp(prop) {
    return this.props.includes(prop);
  }

  addProp(prop) {
    if (this.hasProp(prop)) return;
    this.props.push(prop);
  }

  removeProp(props = []) {
    if (!Array.isArray(props)) props = [props];
    this.prop = this.props.filter(p => !props.includes[p]);
  }

  get color() {
    let r = this.pain - min(0, this.gain);
    let g = max(0, this.gain) - this.pain;
    return colorSet(this._color, {
      r: r * 255,
      g: g * 255,
    });
  }

  set color(colour) {
    super.color = colour;
  }

  getFill() {
    if (this.hasProp(PROP.HIDE)) return colorSet(this.color, 0.17);
    return super.getFill();
  }

  getStroke() {
    if (this.hasProp(PROP.HIDE)) return colorSet(this.color, 0.34);
    return super.getStroke();
  }

  draw() {
    super.draw();
    if (this.hasProp(PROP.OVUM)) this.drawOvum();
    if (this.hasProp(PROP.SEED)) this.drawSeed();
    if (this.hasProp(PROP.HALO)) this.drawHalo();
    if (this.hasProp(PROP.TAIL)) this.drawTail();
    if (this.hasProp(PROP.HURL)) this.drawHurl();
    if (this.hasProp(PROP.HURT)) this.drawHurt();
  }

  drawTail(factor = 1, ang = 0) {
    factor = min(factor, 1);
    this.inDraw(() => {
      noFill();
      rotate(PI + vectorAng(this.acc) + ang);
      translate(this.radius, 0);
      let len = this.radius * factor;
      let s = len * sin(15 * frameCount / FRAMERATE) * 0.34;
      beginShape();
      curveVertex(0, 0);
      curveVertex(0, 0);
      curveVertex(len * 0.5, s * 0.5);
      curveVertex(len, -s);
      curveVertex(len, -s);
      endShape();
    });
  }

  drawHurt(thorn, colour) {
    if (!thorn) {
      thorn = LINEWEIGHT;
      colour = this.color;
    }
    this.inDraw(() => {
      stroke(colour);
      strokeWeight(min(thorn + 1, LINEWEIGHT * 3));
      this.drawAround(this.radius + thorn);
      stroke(this.color);
      strokeWeight(LINEWEIGHT);
      this.drawAround(this.radius, thorn);
    });
  }

  drawAround(dist = 0, len = 0, n = 6) {
    let i = n;
    let delta = PI / n;
    push();
    for (i = n; i; i -= 1) {
      rotate(delta);
      line(0, dist, 0, dist + len);
      line(0, -dist, 0, -dist - len);
    }
    pop();
  }

  drawHurl(ang = frameCount / FRAMERATE, colour) {
    this.inDraw(() => {
      rotate(ang);
      translate(this.radius, 0);
      let d = min(2 * SIZE[TYPE.DROP], this.size);
      d = sqrt(d / PI);
      if (colour) stroke(colour);
      line(0, 0, d * 1.5, 0);
      noStroke();
      fill(this.color);
      polygon(d * 0.3, 0, d, 3);
    });
    this.gun = vectorRad(this.radius * 1.5, ang);
  }

  drawOvum(radius = this.radius) {
    this.inDraw(() => {
      radius = min(radius, sqrt(SIZE.BABY / PI));
      radius *= 0.5;
      stroke(colorSet(this.color, {
        l: -25
      }));
      line(-radius, 0, radius, 0);
      line(0, -radius, 0, radius);
    });
  }

  drawSeed(x = 0, radius = this.radius, angle = 0) {
    this.inDraw(() => {
      radius *= 0.5;
      stroke(colorSet(this.color, {
        l: -25
      }));
      rotate(angle);
      translate(x, 0);
      line(-radius, 0, radius, 0);
    });
  }

  drawHalo(alpha = 1) {
    this.inDraw(() => {
      noFill();
      alpha *= colorAlpha(this.color);
      strokeWeight(LINEWEIGHT * 0.68);
      stroke(colorSet(COLOR[TYPE.DROP], alpha));
      circle(0, 0, this.diam + LINEWEIGHT * 4);
    });
  }

  update() {
    if (this.done) return delete this;
    super.update();
    this.size -= SIZE[TYPE.DOT] * world.heat * this.dew / FRAMERATE;

    //this is only for non pearl
    if (this === pearl) return;
    if (!(this.age % (2 * FRAMERATE))) this.fire();

    //this is only for food
    if (this.hasAgency) return;
    if (this.hasProp(PROP.HALO)) {
      this.pain = 0;
      this.gain = 1;
    }
    this.pain = this.vel.mag() / LINEWEIGHT;
    if (this.hasProp(PROP.HURT)) this.gain = 10 * sin(this.age / FRAMERATE);
  }

  fire() {
    if (this.hasAgency) return;
    if (!this.hasProp(PROP.HURL)) return;
    this.vel.add(this.gun.setMag(this.speed));
  }
}