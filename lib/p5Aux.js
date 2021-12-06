/* vector auxiliary */

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

function vectorClone(vect){
  return createVector(vect.x, vect.y);
}

/* color auxiliary */

function colorToObject(colour) {
  if (!colour.mode) colour = color(colour);
  return {
    a: colorAlpha(colour),
    h: hue(colour),
    s: saturation(colour),
    br: brightness(colour),
    l: lightness(colour),
    r: red(colour),
    g: green(colour),
    b: blue(colour),
  };
}

function objectToColor(o, mode = RGB) {
  let colour;
  if (mode === HSB) colour = color(o.h, o.s, o.br);
  if (mode === HSL) colour = color(o.h, o.s, o.l);
  colour = color(o.r, o.g, o.b);
  colour.setAlpha(o.a * alpha(color(0)));
  return colour;
}

function colorAlpha(c) {
  return alpha(c) / alpha(color(0));
}

function colorAdd(colour, model = {}, prop = 'a') {
  return colorSet(colour, model, prop, true);
}

function colorSet(colour, obj = {}, prop = 'a', toAdd = false) {
  if (['string', 'number'].includes(typeof colour)) colour = color(colour);
  if (typeof obj === 'number') {
    let val = obj;
    obj = {};
    obj[prop] = val;
  }
  if (colour.mode) colour = colorToObject(colour);
  Object.entries(obj).forEach(([key, value]) => {
    let add = toAdd ? colour[key] : 0;
    colour[key] = value + add;
  });
  let mode = RGB;
  if (obj.br !== undefined) mode = HSB;
  else if (obj.h !== undefined || obj.s !== !undefined || obj.l !== undefined) mode = HSL;
  return objectToColor(colour, mode);
}

/* draw shape auxiliary */

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

function arrow(vect, colour = 0, weight = 1){
  push();
  stroke(colour);
  strokeWeight(weight);
  line(0, 0, vect.x, vect.y);
  noStroke();
  fill(colour);
  translate(vect.x, vect.y);
  rotate(vectorAng(vect));
  polygon(0, 0, 5 * weight, 3);
  pop();
}