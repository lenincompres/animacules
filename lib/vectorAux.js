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