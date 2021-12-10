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
  title: 'animalcules',
  tagline: 'by Lenino',
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
    tagline: 'by Lenino',
    credits: `Creado por ${LINK.lenino} usando ${LINK.p5}, ${LINK.ml5} y ${LINK.DOM}.`,
    goodJob: '¡Bien hecho!',
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
  heat: 1,
  droprate: 1, // one each second
  //dropcap: 2, //no cap means ond less than cells, down to 1
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
  YES: 'lime',
  HOT: 'gold',
  NOT: 'red',
};
COLOR[TYPE.DOT] = COLOR.LIGHT;
COLOR[TYPE.DROP] = COLOR.YES;
COLOR[TYPE.SHOT] = COLOR.NOT;
COLOR[TYPE.CELL] = COLOR.BRIGHT;
COLOR[TYPE.PEARL] = COLOR.PALE;

const LINEWEIGHT = WORLD.w * WORLD.h / 200000;
const MAXLENGTH = 10 * LINEWEIGHT;
const SPEED = 4 * LINEWEIGHT / FRAMERATE;
const SHOTSPEED = 120 * SPEED;

const SIZE = {};
SIZE[TYPE.DOT] = 20 * LINEWEIGHT;
SIZE[TYPE.SHOT] = 2 * SIZE[TYPE.DOT];
SIZE[TYPE.DROP] = 6 * SIZE[TYPE.DOT];
SIZE[TYPE.CELL] = 8 * SIZE[TYPE.DROP];
SIZE[TYPE.PEARL] = SIZE[TYPE.CELL]
SIZE.BABY = 3 * SIZE[TYPE.DROP];

const PROP = {
  GAIN: 'gain',
  PAIN: 'pain',
  TAIL: 'tail',
  HURT: 'hurt',
  SICK: 'sick',
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


let dots = [];