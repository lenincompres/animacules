const FOLLOW = {
  DEFAULT: 'default',
  NOSE: 'nose',
  MOUSE: 'mouse',
  //DIFF: 'diff'
}

// Video
let video;
let poses = [];

let t = 0;
let currentworld = 0;
let pointer;
let pearl = {};
let world = WORLD;
let pause = false;
let showInfo = false;

// Teachable Machine model URL:
let classifier;
let soundModel = 'https://teachablemachine.withgoogle.com/models/_WKomoh3c/';

function preload() {
  classifier = ml5.soundClassifier(soundModel + 'model.json');
}

function setup() {
  DOM.style({
    b: {
      color: COLOR[TYPE.DROP],
      fontWeight: 'bold'
    },
    i: {
      color: COLOR[TYPE.PEARL]
    },
    small: {
      textTransform: 'uppercase',
      fontSize: '0.68em'
    },
    h: {
      fontFamily: 'title'
    },
    select: {
      border: 'none',
      margin: '0 2em 0 0',
      padding: 0,
      background: 'transparent',
      color: '#666',
    }
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
    backgroundColor: '#def',
    header: {
      color: 'black',
      h1: {
        fontSize: '3em',
        text: 'Animacules'
      },
      p: {
        fontSize: '1.25em',
        id: 'levelTitle'
      }
    },
    section: {
      main: {
        position: 'relative',
        width: world.w + 'px',
        height: world.h + 'px',
        margin: '0 auto',
        canvas: createCanvas(WORLD.w, WORLD.h),
        aside: [{
            css:{
              _h2:{
                color: COLOR[TYPE.PEARL]
              }
            },
          div: {
            id: 'promptElem',
            margin: WORLD.h * 0.25 + 'px 2em',
            fontSize: '1.34em',
            transition: '0.5s',
            opacity: 0,
          },
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          color: 'white'
        }, {
          id: 'infoElem',
          color: 'gray',
          textAlign: 'left',
          top: 0,
          margin: '1em',
          position: 'absolute',
        }, {
          id: 'timeline',
          position: 'absolute',
          background: COLOR[TYPE.DROP],
          bottom: 0,
          left: 0,
          width: 0,
          height: 2 * SIZE.LINE + 'pt',
        }]
      },
      menu: {
        margin: '0 0 0.5em',
        span: [{
          label: 'Control:',
          select: {
            id: 'follow',
            option: Object.values(FOLLOW).map(f => new Object({
              text: f,
              value: f,
            }))
          }
        }, {
          id: 'levelSelect',
          label: 'Level:',
          select: {
            id: 'levelSelect',
            onchange: e => loadLevel(e.target.value),
            option: worlds.map((w, i) => new Object({
              text: i + 1,
              value: i
            }))
          }
        }]
      }
    },
    footer: {
      width: '100%',
      position: 'fixed',
      bottom: 0,
      padding: '0.5em 1em',
      color: 'white',
      textShadow: '1px 1px 1px black',
      p: 'Created by Lenin A. Compres.'
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
  loadLevel(0);
}

function loadLevel(level = 0) {
  level = parseInt(level);

  if (!worlds[level]) return setPrompt({
    h2: "All done!",
    p: "That was the last level."
  });

  pause = true;
  // reinitiate variables
  world = Object.assign({}, WORLD);
  anims = [];
  pearl = new Pearl({});
  Object.assign(world, worlds[level]);
  // add level items
  if (world.drops) world.drops.forEach(opt => new Drop(opt));
  if (world.cells) world.cells.forEach(opt => new Cell(opt));
  setPrompt({
    h2: world.title,
    p: world.tagline
  });
  // start level
  currentworld = level;
  levelSelect.value = level;
  t = 0;
  pause = false;

  levelTitle.set(`Chapter ${level+1}: ${world.title}`);
  timeline.set(0, 'width');
}

// The model recognizing a sound will trigger this event
function soundMade(error, results) {
  if (error) return console.error(error);
  let label = results[0].label;
  if (label === 'pew') pearl.fire();
}

function draw() {
  t += 1;
  // black base
  background(0);
  // draw video
  image(ml5.flipImage(video), 0, 0, world.w, world.h);
  // dark heat film
  push();
  fill(colorSet(0, {
    r: world.heat * 10,
    g: world.heat * 5,
    a: 0.86
  }));
  rect(0, 0, WORLD.w, WORLD.h);
  pop();

  // find nose/mouse
  if (follow.value === FOLLOW.MOUSE) {
    pointer = createVector(mouseX, mouseY);
  } else if (poses[0] && poses[0].pose && poses[0].pose.nose) {
    pointer = poses[0].pose.nose;
    pointer = createVector(WORLD.w - pointer.x, pointer.y);
    if (follow.value === FOLLOW.DEFAULT) pointer = createVector(pearl.pos.x + pointer.x - world.w2, pearl.pos.y + pointer.y - world.h2);
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
    if (follow.value === FOLLOW.NOSE) circle(intent.x, intent.y, pearl.r * 0.68);
    else if (follow.value === FOLLOW.DEFAULT) arrow(intent, colour);
    pop()
  }

  // draw objects
  anims.forEach(anim => anim.draw());

  if (pause) return;

  // updating things
  anims = anims.filter(anim => !anim.done);
  anims.forEach(anim => anim.update());
  anims.filter(a => a.hasAgency).forEach(cell => anims.forEach(a => cell.collide(a)));
  if (world.droprate && !(t % world.droprate)) addFood();

  // possible game endings
  if (pearl.done) gameOver();
  else if (world.goal) {
    if (world.goal.size && pearl.size >= world.goal.size) nextLevel();
    if (world.goal.time) {
      if (t > world.goal.time * FRAMERATE) nextLevel();
      timeline.set((t / FRAMERATE) * 100 / world.goal.time + '%', 'width');
    }
  }

  // game status report
  if (showInfo) {
    infoElem.set({
      p: [
        'level: ' + currentworld,
        'time: ' + t,
        'size: ' + round(pearl.size),
        ...Object.entries(pearl.trait).map(([key, value]) => key + ': ' + value)
      ]
    }, true);
  }
}

function mouseClicked() {
  if (follow.value !== FOLLOW.MOUSE) return;
  pearl.fire();
}

function addFood(props) {
  if (typeof world.dropcap === 'number' && anims.filter(a => a.type === TYPE.DROP).length >= world.dropcap) return;
  if (!props && world.rate) {
    props = [];
    Object.values(PROP).forEach(prop => {
      let rate = world.rate[prop];
      if (rate && random() <= rate) props.push(prop);
    })
  }
  new Drop({
    props: props
  });
}

// Get a prediction for the current video frame
function modelReady() {

}

/*  */

function keyPressed() {
  if (keyCode === UP_ARROW) return loadLevel(currentworld + 1);
  if (keyCode === DOWN_ARROW) return loadLevel(currentworld - 1);
  if (key === 'a') return new Drop({
    props: [PROP.TAIL]
  });
  if (key === 's') return new Drop({
    props: [PROP.HURL]
  });
  if (key === 'd') return new Drop({
    props: [PROP.SPIKE]
  });
  if (key === 'f') return new Drop({
    props: [PROP.HURL, PROP.SPIKE, PROP.TAIL]
  });
  if (key === 'i') {
    infoElem.set({}, true);
    showInfo = !showInfo
  };
}

/* prompt */

function gameOver() {
  setPrompt({
    h2: 'Game Over',
  });
  setTimeout(() => loadLevel(currentworld), 3000);
  pause = true;
}

function nextLevel() {
  setPrompt({
    h4: 'Good job, Pearl!'
  });
  setTimeout(() => loadLevel(currentworld + 1), 3000);
  pause = true;
}

let promptTimeout = false;

function setPrompt(model, close = true) {
  if (!model) return promptElem.set(true);
  if (promptTimeout) clearTimeout(promptTimeout);
  promptElem.set({
    model: model,
    opacity: 1,
    pointerEvents: 'all'
  }, true);
  if (close) promptTimeout = setTimeout(closePrompt, 5000);
}

function closePrompt(callback) {
  if (promptTimeout) clearTimeout(promptTimeout);
  promptElem.set({
    pointerEvents: 'none',
    opacity: 0
  });
  if (callback) promptTimeout = setTimeout(callback, 1000);
}

function drawArrow(vect, z = 5) {
  line(0, 0, vect.x, vect.y);
  translate(vect.x, vect.y);
  rotate(vectorAng(vect))
  polygon(0, 0, z, 3);
}