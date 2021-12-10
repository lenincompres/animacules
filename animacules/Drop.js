class Drop extends Dot {
  constructor(opt = {}) {
    if (!opt.type) opt.type = TYPE.DROP;
    super(opt);
    this.dew = 0.5;
    this.pain = 0; // from 0 to 1
    this.gain = 1; // from -1 (harmful) to 1
    this.props = opt.props ? opt.props : [];
    this.velFactor = 0.25;
    this.ang = random(TWO_PI);
    this.toggle = true;
    if (this.hasProp(PROP.TAIL))
      this.acc = vectorRad(this.velFactor * SPEED, this.ang);
    if (this.hasProp(PROP.OVUM, PROP.SEED))
      this.removeProp(PROP.OVUM, PROP.SEED);
    console.log(this.props);
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

  hasProp(...props) {
    return props.reduce((o, a) => o && this.props.includes(a), true);
  }

  addProp(...props) {
    this.props.push(...props);
  }

  removeProp(...props) {
    this.props = this.props.filter(p => !props.includes(p));
  }

  get color() {
    return colorSet(this._color, {
      r: 255 * (this.pain - min(0, this.gain)),
      g: 255 * (max(0, this.gain) - this.pain),
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

  drawTail(lenFactor = 1, ang = 0) {
    lenFactor = min(lenFactor, 1);
    this.inDraw(() => {
      noFill();
      rotate(PI + vectorAng(this.acc) + ang);
      translate(this.radius, 0);
      let len = this.radius * lenFactor;
      let swing = len * sin(15 * frameCount / FRAMERATE) * 0.34;
      beginShape();
      curveVertex(0, 0);
      curveVertex(0, 0);
      curveVertex(len * 0.5, swing * 0.5);
      curveVertex(len, -swing);
      curveVertex(len, -swing);
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
    let delta = PI / n;
    push();
    while (n) {
      rotate(delta);
      line(0, dist, 0, dist + len);
      line(0, -dist, 0, -dist - len);
      n -= 1;
    }
    pop();
  }

  drawHurl(ang = this.ang, colour) {
    this.inDraw(() => {
      rotate(ang);
      translate(this.radius, 0);
      let side = min(2 * SIZE[TYPE.DROP], this.size);
      side = 0.8 * sqrt(side / PI);
      if (colour) {
        stroke(colour);
        line(0, 0, side * 1.5, 0);
        noStroke();
      }
      fill(this.getStroke());
      polygon(side * 0.3, 0, side, 3);
    });
    this.gun = vectorRad(this.radius * 1.5, ang);
  }

  drawOvum(radius = this.radius) {
    this.inDraw(() => {
      radius = min(radius, sqrt(SIZE.BABY / PI)) * 0.5;
      stroke(colorSet(this.color, -25, 'l'));
      line(-radius, 0, radius, 0);
      line(0, -radius, 0, radius);
    });
  }

  drawSeed(x = 0, radius = this.radius, angle = 0) {
    this.inDraw(() => {
      radius *= 0.5;
      stroke(colorSet(this.color, -25, 'l'));
      rotate(angle);
      translate(x, 0);
      line(-radius, 0, radius, 0);
    });
  }

  drawHalo(alpha = 1) {
    this.inDraw(() => {
      noFill();
      strokeWeight(LINEWEIGHT * 0.68);
      stroke(colorSet(COLOR[TYPE.DROP], alpha * colorAlpha(this.color)));
      circle(0, 0, this.diam + LINEWEIGHT * 4);
    });
  }

  update() {
    if (this.done) return delete this;
    super.update();
    this.size -= SIZE[TYPE.DOT] * world.heat * this.dew / FRAMERATE;

    // this is non for pearl
    if (this === pearl) return;
    let toggle = cos(this.age / FRAMERATE) > 0;
    if (toggle !== this.toggle) {
      this.fire();
      this.toggle = toggle;
    }

    // this is only for food
    if (this.hasAgency) return;
    if (this.hasProp(PROP.HALO))
      return [this.pain, this.gain] = [0, 1];
    if (this.hasProp(PROP.HURT) && !this.hasProp(PROP.HURL))
      return this.gain = 3 + 9 * sin(2 * this.age / FRAMERATE);
    this.pain = this.vel.mag() / LINEWEIGHT - 1;
  }

  fire() {
    if (!this.hasProp(PROP.HURL)) return;
    this.vel.add(this.gun.setMag(this.velFactor * SHOTSPEED));
  }
}