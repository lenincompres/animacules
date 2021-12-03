function vectorMap(vect, max, newMax) {
  vect.limit(max);
  let mag = map(vect.mag(), 0, max, 0, newMax);
  return vect.normalize().mult(mag);
}

function vectorAng(vect) {
  return atan2(vect.y, vect.x);
}

function vectorRad(mag, ang) {
  return createVector(mag * sin(ang), mag * cos(ang));
}

function colorToObject(c) {
  if(['string','number'].includes(typeof c)) c = color(c);
  return {
    a: alpha(c),
    h: hue(c),
    s: saturation(c),
    br: brightness(c),
    l: lightness(c),
    r: red(c),
    g: green(c),
    b: blue(c),
  }
}

function objectToColor(o, mode = RGB) {
  let oldMode = colorMode();
  colorMode(mode);
  if (mode === HSB) return color(o.h, o.s, o.br);
  if (mode === HSL) return color(o.h, o.s, o.l);
  let c = color(o.r, o.g, o.b);
  c.setAlpha(mode === RGB ? o.a * 225 : o.a);
  colorMode(oldMode);
  return c;
}

function colorSet(c, model = {}, prop = 'a') {
  if(['string','number'].includes(typeof c)) c = color(c);
  if (typeof model === 'number') {
    let val = model;
    model = {};
    model[prop] = val;
  }
  if (c.mode) c = colorToObject(c);
  Object.entries(model).forEach(([key, value]) => {
    c[key] = value;
  });
  if (model.h || model.s || model.l) return objectToColor(c, HSL);
  if (model.br) return objectToColor(c, HSB);
  return objectToColor(c);
}

function colorAdd(c, model = {}) {
  if(['string','number'].includes(typeof c)) c = color(c);
  if (c.mode) c = colorToObject(c);
  Object.entries(model).forEach(([key, value]) => {
    c[key] += value;
  });
  if (model.h || model.s || model.l) return objectToColor(c, HSL);
  if (model.br) return objectToColor(c, HSB);
  return objectToColor(c);
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}