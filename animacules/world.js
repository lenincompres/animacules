const FRAMERATE = 26;

const CONTROL = {
  DEFAULT: 'default',
  MOUSE: 'mouse',
  NOSE: 'nose',
}

const LINK = {
  p5: '<a href="https://p5js.org/">p5.js</a>',
  ml5: '<a href="https://ml5js.org/">ml5.js</a>',
  lenino: '<a href="http://lenino.net">Lenin A. Compres</a>',
  DOM: '<a href="https://github.com/lenincompres/DOM.js">DOM.js</a>'
}

const COPY = {
  title: 'animacules',
  credits: `Created by ${LINK.lenino} using ${LINK.p5}, ${LINK.ml5} and ${LINK.DOM}.`,
  goodJob: 'Good job!',
  menu: {
    language: 'language',
    controls: 'controls',
    chapter: 'chapter',
  },
  controls: {
    nose: 'nose',
    mouse: 'mouse',
    default: 'default',
  },
  languages: {
    ENG: 'English',
    ESP: 'Español',
  },
  ESP: {
    title: 'animalucos',
    credits: `Creado por ${LINK.lenino} usando ${LINK.p5}, ${LINK.ml5} y ${LINK.DOM}.`,
    goodJob: '¡Buen trabajo!',
    menu: {
      language: 'lenguaje',
      controls: 'control',
      chapter: 'capítulo',
    },
    controls: {
      nose: 'nariz',
      mouse: 'mouse',
      default: 'normal',
    }
  }
}

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
  BRIGHT: 'royalBlue',
  LIGHT: 'aliceBlue',
  PALE: 'lightskyblue',
  DIM: 'steelblue',
  DARK: '#060501',
  YES: 'lawngreen',
  HOT: 'gold',
  NOT: 'red',
};
COLOR[TYPE.DOT] = COLOR.LIGHT;
COLOR[TYPE.DROP] = COLOR.YES;
COLOR[TYPE.SHOT] = COLOR.NOT;
COLOR[TYPE.CELL] = COLOR.BRIGHT;
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
  HIDE: 'hide',
  JAWS: 'jaws',
  SICK: 'sick'
}

const SAY = {
  PEW: 'pew', // shoot
  BANG: 'bang', // shoot 3
  BOOM: 'boom', // shoot all
}

const SPEED = 4 * SIZE.LINE / FRAMERATE;

let dots = [];