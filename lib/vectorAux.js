function vectorMap(vect, max, newMax) {
  vect.limit(max);
  let mag = map(vect.mag(), 0, max, 0, newMax);
  return vectorRad(mag, vectorAng(vect));
}

function vectorAng(vect) {
  return atan2(vect.x, vect.y);
}

function vectorRad(mag, ang) {
  return createVector(mag * sin(ang), mag * cos(ang));
}



function colorToObject(c) {
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
  colorMode(mode);
  console.log(mode);
  if(mode === RGB) return color(o.r, o.g, o.b);
  if(mode === HSL) return color(o.h, o.s, o.l);
  return color(o.h, o.s, o.br);
}

function colorAdd(c, v = 1, prop = 'a') {
  if(c.mode) c = colorToObject(c);
  return colorSet(c, c[prop] + v, prop);
}

function colorSet(c, v = 1, prop = 'a') {
  if(c.mode) c = colorToObject(c);
  c[prop] = v;
  if (['h', 's', 'l'].includes(prop)) return objectToColor(c, HSL);
  if (prop === 'br') return objectToColor(c, HSB);
  return objectToColor(c, RGB);
}