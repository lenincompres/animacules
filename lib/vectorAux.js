function vectorMap(vect, max, newMax) {
  vect.limit(max);
  let mag = map(vect.mag(), 0, max, 0, newMax);
  return vect.normalize().mult(mag);
}

function vectorAng(vect) {
  return atan2(vect.y, vect.x) % (2 * PI);
}

function vectorRad(mag, ang) {
  return createVector(mag * sin(ang), mag * cos(ang));
}

function colorToObject(c) {
  if (['string', 'number'].includes(typeof c)) c = color(c);
  let a = colorAlpha(c);
  return {
    a: a,
    h: hue(c),
    s: saturation(c),
    br: brightness(c),
    l: lightness(c),
    r: red(c),
    g: green(c),
    b: blue(c),
  };
}

function objectToColor(o, mode = RGB) {
  push()
  let c;
  if (mode === HSB) c = color(o.h, o.s, o.br);
  if (mode === HSL) c = color(o.h, o.s, o.l);
  c = color(o.r, o.g, o.b);
  c.setAlpha(o.a * alpha(color(0)));
  pop();
  return c;
}

function colorSet(c, model = {}, prop = 'a', add = false) {
  if (['string', 'number'].includes(typeof c)) c = color(c);
  if (typeof model === 'number') {
    let val = model;
    model = {};
    model[prop] = val;
  }
  if (c.mode) c = colorToObject(c);
  Object.entries(model).forEach(([key, value]) => {
    c[key] = value + (add ? c[key] : 0);
  });
  let output = objectToColor(c);
  if (model.h || model.s || model.l) output = objectToColor(c, HSL);
  if (model.br) output = objectToColor(c, HSB);
  return output;
}

function colorAdd(c, model = {}, prop = 'a') {
  return colorSet(c, model, prop, true);
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

function colorAlpha(c) {
  return alpha(c) / alpha(color(0));
}