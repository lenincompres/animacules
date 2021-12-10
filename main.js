// Video


function loadLevel(level) {
  console.log('loadLevel URL', level);
  loadLevelHere(level);
  //  window.location.src = `?level=${level}&language=${language}&control=${control}`
}

let levelTime = 1;
let pointer;
let pearl;
let cells = [];
let drops = [];
let world = WORLD;
let pause = false;
let goalMet = false;
let showInfo = false;
const dayTime = new Binder(0);
const heat = new Binder(1);
const copyText = new Binder(COPY);

function getLevelText(tag) {
  return world[language] ? world[language][tag] : world[tag];
}

// poseNet
let video;
let poses = [];

// Teachable Machine model URL:
let classifier;
let soundModel = 'https://teachablemachine.withgoogle.com/models/_WKomoh3c/';

/* P5 and DOM */
const QS = DOM.querystring();
let currentLevel = QS.level ? QS.level : 0;
let language = QS.language ? QS.language : 'ENG';
let control = QS.control ? QS.control : CONTROL.DEFAULT;
setLanguage(language);

function preload() {
  classifier = ml5.soundClassifier(soundModel + 'model.json');
}

function setup() {
  DOM.style({
    body: {
      background: COLOR.LIGHT,
      color: COLOR.DARK
    },
    b: {
      color: COLOR.YES,
      fontWeight: 'bold',
    },
    b_indigo: {
      color: 'cornflowerblue',
    },
    b_violet: {
      color: 'mediumorchid',
    },
    i: {
      color: COLOR.NOT
    },
    small: {
      textTransform: 'uppercase',
      fontSize: '0.68em'
    },
    a: {
      color: COLOR.BRIGHT,
      hover: {
        color: COLOR.PALE
      }
    },
    h: {
      textTransform: 'capitalize',
      color: COLOR.DIM,
      fontFamily: 'title'
    },
    main: {
      _h: {
        color: COLOR.PALE
      }
    },
    select: {
      border: 'none',
      margin: '0 2em 0 0',
      padding: 0,
      background: 'transparent',
      color: COLOR.DIM,
    },
    label: {
      textTransform: 'capitalize',
      after: {
        content: '": "'
      }
    },
  });

  DOM.set({
    title: 'Animacules - Game',
    description: 'Use gestures and voice to survive as a microscopic organism.',
    keywords: 'game,p5,ml5,poseNet,lenino,lenin compres',
    viewport: 'width=device-width,initial-scale=1',
    font: [{
      fontFamily: 'main',
      src: 'url(assets/Biryani-Light.ttf)'
    }, {
      fontFamily: 'title',
      src: 'url(assets/FredokaOne-Regular.ttf)'
    }],
    fontFamily: 'main',
    textAlign: 'center',
    header: {
      position: 'relative',
      zIndex: 1,
      h1: {
        fontSize: '3em',
        text: copyText.bind(c => c.title),
        onclick: e => window.location.href = './'
      },
      p: {
        fontSize: '1.25em',
        textTransform: 'capitalize',
        id: 'levelTitle'
      }
    },
    section: {
      width: world.w + 'px',
      margin: '0.5em auto ',
      main: {
        position: 'relative',
        width: world.w + 'px',
        height: world.h + 'px',
        backgroundColor: 'black',
        canvas: createCanvas(WORLD.w, WORLD.h),
        aside: [{
          div: {
            id: 'promptElem',
            pointerEvents: 'none',
            margin: WORLD.h * 0.25 + 'px 2em',
            fontSize: '1.34em',
            transition: '0.5s',
            opacity: 1,
            color: COLOR.LIGHT,
            text: 'This game requires camera and mic access to follow your head movement and commands as a controller.'
          },
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          color: 'white'
        }, {
          id: 'infoElem',
          position: 'absolute',
          color: 'gray',
          textAlign: 'left',
          top: 0,
          margin: '1em',
        }, {
          position: 'fixed',
          background: COLOR.HOT,
          width: heat.bind(val => val * MAXLENGTH + 'pt'),
          height: heat.bind(val => val * MAXLENGTH + 'pt'),
          zIndex: 0,
          borderRadius: '100%',
          left: dayTime.bind(val => val + '%'),
          display: dayTime.bind(val => val ? 'block' : 'none'),
          top: 0,
          margin: heat.bind(val => -0.34 * val * MAXLENGTH + 'pt'),
          boxShadow: `0 0 2em ${COLOR.HOT}`
        }]
      },
      menu: {
        margin: '0 0 0.5em',
        ul: {
          display: 'flex',
          placeContent: 'center',
          li: [{
              label: {
                text: copyText.bind(c => c.menu.language)
              },
              select: {
                option: Object.entries(COPY.languages).map(([key, value]) => new Object({
                  text: value,
                  value: key,
                })),
                onchange: e => setLanguage(e.target.value)
              }
            }, {
              label: {
                text: copyText.bind(c => c.menu.controls)
              },
              select: {
                content: copyText.bind(c => {
                  return {
                    option: Object.values(CONTROL).map((value) => new Object({
                      text: c.controls[value],
                      value: value,
                    }))
                  }
                }),
                value: control,
                onchange: e => control = e.target.value
              }
            },
            {
              label: {
                text: copyText.bind(c => c.menu.chapter)
              },
              select: {
                id: 'levelSelect',
                onchange: e => loadLevel(e.target.value),
                option: worlds.map((w, i) => new Object({
                  text: i + 1,
                  value: i
                }))
              }
            }
          ]
        }
      }
    },
    footer: {
      width: '100%',
      position: 'fixed',
      bottom: 0,
      padding: '0.5em 1em',
      p: {
        content: copyText.bind(c => c.credits)
      }
    }
  });

  // Create a new poseNet method with a single detection
  video = createCapture(VIDEO);
  video.size(world.w, world.h);
  video.hide();
  let poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', results => poses = results);

  // sound model from teachable machine
  classifier.classify(soundMade);

  frameRate(FRAMERATE);
  pointer = createVector(WORLD.w2, WORLD.h2);
  loadLevelHere(currentLevel);
}

function setLanguage(l) {
  language = l;
  copyText.value = language === 'ENG' ? COPY : COPY[language];
  if (pearl) loadLevel(currentLevel);
}

function loadLevelHere(level = 0) {
  level = parseInt(level);
  if (level < 0) level = 0;
  if (!worlds[level]) return;

  pause = true;
  // reinitiate variables
  world = Object.assign({}, WORLD);
  Object.assign(world, worlds[level]);
  dots.forEach(dot => delete dot);
  dots = [];
  pearl = new Cell({
    x: world.w2,
    y: world.h2,
    size: world.size,
    type: TYPE.PEARL,
    props: [PROP.TAIL],
    speed: SPEED * 1.68
  });
  // add level items
  if (world.drops) world.drops.forEach(opt => new Drop(opt));
  if (world.cells) world.cells.forEach((opt, i) => {
    opt.mutation = i * 30;
    new Cell(opt);
  });
  let title = getLevelText('title');
  prompt({
    h2: title,
    p: getLevelText('tagline')
  });
  levelTitle.set(`${copyText.value.menu.chapter} ${level+1} — ${title}`);
  // start level
  currentLevel = level;
  levelSelect.value = level;
  levelTime = 1;
  goalMet = false;
  dayTime.value = 0;
  heat.value = world.heat;
  pause = false;
}

// The model recognizing a sound will trigger this event
function soundMade(error, results) {
  if (error) return console.error(error);
  let label = results[0].label;
  if (label === 'pew') pearl.fire();
}

function draw() {
  levelTime += 1;
  // black base
  clear();
  // draw video
  if (control !== CONTROL.MOUSE) image(ml5.flipImage(video), 0, 0, world.w, world.h);
  // dark heat film
  push();
  noStroke();
  fill(colorSet(0, {
    r: heat.value * 10,
    g: heat.value * 5,
    a: 0.86
  }));
  rect(0, 0, WORLD.w, WORLD.h);
  pop();

  // find nose/mouse
  if (control === CONTROL.MOUSE) {
    pointer = createVector(mouseX, mouseY);
  } else if (poses[0] && poses[0].pose && poses[0].pose.nose) {
    pointer = poses[0].pose.nose;
    pointer = createVector(WORLD.w - pointer.x, pointer.y);
    if (control === CONTROL.DEFAULT) pointer = createVector(pearl.pos.x + pointer.x - world.w2, pearl.pos.y + pointer.y - world.h2);
  }

  // pearl updates
  if (!pearl.done) {
    let intent = p5.Vector.sub(pointer, pearl.pos);
    pearl.acc = vectorClone(intent);
    // draw intendend movement
    push();
    noFill();
    let colour = colorSet(pearl.color, 0.68)
    stroke(colour);
    translate(pearl.pos.x, pearl.pos.y);
    if (control === CONTROL.NOSE) circle(intent.x, intent.y, pearl.r * 0.68);
    else if (control === CONTROL.DEFAULT) arrow(intent, colour);
    pop()
  }

  // draw objects
  dots.forEach(dot => dot.draw());

  if (pause) return;

  // updating things
  dots = dots.filter(dot => !dot.done);
  dots.forEach(dot => dot.update());

  // colliding targetting
  cells = dots.filter(a => a.hasAgency);
  drops = dots.filter(a => a.gain > a.pain);
  cells.forEach(cell => {
    dots.forEach(a => cell.collide(a));
    if (cell !== pearl) cell.reach(drops);
    cell.target(cells);
  });

  //adding food
  if (world.droprate && !((levelTime/ world.droprate) % FRAMERATE)) addDrop();

  // possible game endings
  if (pearl.done) gameOver();
  else if (!goalMet && world.goal) {
    if (world.goal.size && pearl.size >= world.goal.size) {
      nextLevel();
      goalMet = true;
    }
    if (world.goal.time) {
      if (levelTime > world.goal.time * FRAMERATE) {
        nextLevel();
        goalMet = true;
      }
      dayTime.value = 100 * (levelTime / FRAMERATE) / world.goal.time;
    }
  }

  // game status report
  if (showInfo) {
    infoElem.set({
      p: [
        'level: ' + currentLevel,
        'levelTime: ' + levelTime,
        'size: ' + round(pearl.size),
        ...Object.entries(pearl.trait).map(([key, value]) => key + ': ' + value)
      ]
    }, true);
  }
}

function mouseClicked() {
  if (control !== CONTROL.MOUSE) return;
  pearl.fire();
}

function addDrop(props = []) {
  if (typeof world.dropcap !== 'number') return;
  let cap = world.dropcap * SIZE[TYPE.DROP];
  let food = drops.reduce((o, a) => o += a.size, 0);
  if (food > cap - SIZE[TYPE.DROP]) return;
  if (world.rate) Object.values(PROP).forEach(prop => {
    let rate = world.rate[prop];
    if (!rate) return;
    if (random() <= rate) props.push(prop);
  })
  new Drop({
    props: props
  });
}

// Get a prediction for the current video frame
function modelReady() {

}

/*  */

function keyPressed() {
  if (keyCode === UP_ARROW) return loadLevel(currentLevel + 1);
  if (keyCode === DOWN_ARROW) return loadLevel(currentLevel - 1);
  if (key === 'a') return new Drop({
    props: [PROP.TAIL]
  });
  if (key === 's') return new Drop({
    props: [PROP.HURT]
  });
  if (key === 'd') return new Drop({
    props: [PROP.HURL]
  });
  if (key === 'f') return new Drop({
    props: [PROP.OVUM]
  });
  if (key === 'g') return new Drop({
    props: [PROP.SEED]
  });
  if (key === 'v') return new Drop({
    props: [PROP.HALO]
  });
  if (key === 'c') return new Drop({
    props: [PROP.HIDE]
  });
  if (key === 'i') {
    infoElem.set({}, true);
    showInfo = !showInfo
  };
}

/* prompt */

function gameOver() {
  pause = true;
  prompt({
    info: {
      h2: 'Game Over',
    },
    callback: () => loadLevel(currentLevel),
    close: 3
  });
}

function nextLevel() {
  pause = true;
  prompt({
    info: {
      h4: copyText.value.goodJob
    },
    callback: () => loadLevel(currentLevel + 1),
    close: 3
  });
}

let promptTimeout = false;

function prompt(input) {
  if (!input) return closePrompt();
  if (promptTimeout) clearTimeout(promptTimeout);
  promptTimeout = false;
  if (!input.info) input = {
    info: input,
    close: 5,
  };
  promptElem.set({
    model: input.info,
    opacity: 1,
    pointerEvents: input.close ? 'none' : 'all'
  }, true);
  if (input.close) promptTimeout = setTimeout(() => closePrompt(input.callback), input.close * 1000);
}

function closePrompt(callback) {
  if (promptTimeout) clearTimeout(promptTimeout);
  promptTimeout = false;
  promptElem.set({
    pointerEvents: 'none',
    opacity: 0
  });
  if (callback) promptTimeout = setTimeout(() => callback(), 1000);
}

function drawArrow(vect, z = 5) {
  line(0, 0, vect.x, vect.y);
  translate(vect.x, vect.y);
  rotate(vectorAng(vect))
  polygon(0, 0, z, 3);
}