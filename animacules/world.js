const CONTROL = {
  MOUSE: 'mouse',
  DEFAULT: 'default',
  NOSE: 'nose',
}

const COPY = {
  title: 'animacules',
  controls: 'controls',
  chapter: 'chapter',
  language: 'language',
  nose: 'nose',
  mouse: 'mouse',
  default: 'default',
  languages: {
    ENG: 'English',
    ESP: 'Español',
  },
  ESP: {
    title: 'animalucos',
    language: 'lenguaje',
    controls: 'control',
    chapter: 'capítulo',
    nose: 'nariz',
    mouse: 'mouse',
    default: 'normal',
  }
}

const FRAMERATE = 26;

const WORLD = {
  w: 800,
  h: 600,
  frix: 0.9,
  droprate: 50,
  dropcap: 1,
  heat: 1
}
WORLD.w2 = WORLD.w * 0.5;
WORLD.h2 = WORLD.h * 0.5;

const TYPE = {
  DOT: 'dot',
  SHOT: 'shot',
  DROP: 'drop',
  CELL: 'cell',
  PEARL: 'pearl'
}

const COLOR = {
  LIGHT: 'aliceBlue',
  STRONG: 'royalBlue',
  PALE: 'lightskyblue',
  BASE: 'steelblue',
  GOOD: 'lawngreen',
  BAD: 'red',
  DARK: '#060501',
};
COLOR[TYPE.DOT] = COLOR.LIGHT;
COLOR[TYPE.SHOT] = COLOR.BAD;
COLOR[TYPE.DROP] = COLOR.GOOD;
COLOR[TYPE.CELL] = COLOR.STRONG;
COLOR[TYPE.PEARL] = COLOR.PALE;

const SIZE = {
  LINE: WORLD.w * WORLD.h / 200000
};
SIZE[TYPE.DOT] = SIZE.LINE * 20;
SIZE[TYPE.SHOT] = 2 * SIZE[TYPE.DOT];
SIZE[TYPE.DROP] = 5 * SIZE[TYPE.DOT];
SIZE[TYPE.CELL] = 10 * SIZE[TYPE.DROP];
SIZE[TYPE.PEARL] = 10 * SIZE[TYPE.DROP];
SIZE.BABY = 4 * SIZE[TYPE.DROP];
SIZE.MAX = 4 * SIZE[TYPE.CELL];

const PROP = {
  GAIN: 'gain',
  PAIN: 'pain',
  TAIL: 'tail',
  HURT: 'hurt',
  HURL: 'hurl',
  MAIL: 'mail',
  OVUM: 'ovum',
  SEED: 'seed',
  HALO: 'halo',
  SOUL: 'soul',
  JAWS: 'jaws',
  SICK: 'sick'
}

const SAY = {
  PEW: 'pew', // shoot
  BANG: 'bang', // shoot 3
  BOOM: 'boom', // shoot all
}

const SPEED = 4 * SIZE.LINE / FRAMERATE;

let anims = [];