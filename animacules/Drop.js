class Drop extends Dot {
  constructor(opt = {}) {
    if (!opt.type) opt.type = TYPE.DROP;
    super(opt);
    this.dew = 0;
    this.props = opt.props ? opt.props : [];
    // can't have both OVUM and SEED
    if (this.has(PROP.OVUM) && this.has(PROP.SEED)) this.props = this.props.filter(prop => prop !== PROP.OVUM && prop !== PROP.SEED);
  }

  has(prop) {
    return this.props.includes(prop);
  }

  get color() {
    if (this.has(PROP.SOUL)) return colorSet(this._color, 0.25);
    return this._color;
  }

  set color(colour) {
    super.color = colour;
  }

  draw(full = true) {
    super.draw(full);
    if (this.has(PROP.OVUM)) this.drawOvum();
    if (this.has(PROP.SEED)) this.drawSeed();
    if (this.has(PROP.TAIL)) this.drawFlag();
    if (this.has(PROP.HURT)) this.drawSpikes();
    if (this.has(PROP.HURL)) this.drawGun();
    if (this.has(PROP.HALO)) this.drawHalo();
    if (this.has(PROP.TAIL)) this.drawFlag();
    if (this.props.includes(PROP.TAIL)) this.drawFlag(1, PI);
  }

  drawFlag(a = 1, ang = 0) {
    a = min(a, 1);
    this.inDraw(() => {
      noFill();
      rotate(PI + vectorAng(this.acc) + ang);
      translate(this.radius, 0);
      let len = this.radius * a;
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

  drawSpikes(d, c) {
    let n = 6;
    let delta = PI / n;
    if (!d) d = SIZE.LINE * 2;
    this.inDraw(() => {
      if (c) stroke(colorSet(c, colorAlpha(this.color)));
      while (n) {
        rotate(delta);
        line(0, this.radius, 0, this.radius + d);
        line(0, -this.radius, 0, -this.radius - d);
        n -= 1;
      }
    });
  }

  drawGun(ang = frameCount / FRAMERATE, colour) {
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
    this.gun = createVector(cos(ang), sin(ang)).setMag(this.radius * 1.5);
  }

  drawOvum(radius, color) {
    this.inDraw(() => {
      if (!radius) radius = this.radius;
      radius *= 0.5;
      if (!color) stroke(colorSet(this.color, {
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
    alpha = min(alpha, 1);
    this.inDraw(() => {
      noFill();
      alpha *= colorAlpha(this.color);
      stroke(colorSet(COLOR[TYPE.DROP], 0.86 * alpha));
      circle(0, 0, this.diam + SIZE.LINE * 4);
    });
  }

  update() {
    super.update();
    this.size -= SIZE[TYPE.DOT] * world.heat * this.dew / FRAMERATE;
  }
}