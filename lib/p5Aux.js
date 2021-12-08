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

function vectorClone(vect) {
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
  let oldMode = color(0).mode;
  colorMode(mode);
  let colour;
  if (mode === HSB) colour = color(o.h, o.s, o.br);
  else if (mode === HSL) colour = color(o.h, o.s, o.l);
  else colour = color(o.r, o.g, o.b);
  colorMode(oldMode);
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
    if (toAdd) {
      value += colour[key];
      if (key === 'h') {
        if (value < 0) value += 100;
        if (value < max) value -= 100;
      }
    }
    colour[key] = value;
  });
  let mode = RGB;
  if (typeof obj.br === 'number' ) mode = HSB;
  else if (typeof obj.h === 'number' || typeof obj.s === 'number'  || typeof obj.l === 'number' ) mode = HSL;
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

function arrow(vect, colour = 0, weight = 1) {
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