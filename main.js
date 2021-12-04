const FOLLOW = {
  DEFAULT: 'default',
  NOSE: 'nose',
  MOUSE: 'mouse',
  //DIFF: 'diff'
}

// Video
let video;
let poseNet;
let poses = [];
let pause = false;

let t = 0;
let currentworld = 0;
let dest, nose, lastNose, pointer;
let pearl = {};
let world = WORLD;

let showInfo = true;

// Teachable Machine model URL:
let classifier;
//let soundModel = './tm/';
let soundModel = 'https://teachablemachine.withgoogle.com/models/_WKomoh3c/';

function loadWorld(n = 0) {
  n = parseInt(n);
  if (!worlds[n]) return setPrompt({
    h2: "All done!",
    p: "That was the last level."
  });
  pause = true;

  world = Object.assign({}, WORLD);
  anims = [];
  pearl = new Pearl({});
  Object.assign(world, worlds[n]);

  if (world.drop) world.drop.forEach(opt => new Drop(opt));
  if (world.anims) world.anims.forEach(opt => new Cell(opt));

  setPrompt(world.prompt);

  currentworld = n;
  levelSelect.value = n;
  pause = false;
  t = 0;
}

function preload() {
  // Load the model
  classifier = ml5.soundClassifier(soundModel + 'model.json');
}

function setup() {
  frameRate(FRAMERATE);

  dest = createVector(WORLD.w2, WORLD.h2);
  nose = createVector(WORLD.w2, WORLD.h2);
  lastNose = createVector(WORLD.w2, WORLD.h2);
  pointer = createVector(WORLD.w2, WORLD.h2);

  DOM.style({
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
    textAlign: 'center',
    backgroundColor: '#def',
    header: {
      color: 'black',
      fontFamily: 'fantasy',
      h1: 'Animacules',
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
            onchange: e => loadWorld(e.target.value),
            option: worlds.map((w, i) => new Object({
              text: i + 1,
              value: i
            }))
          }
        }]
      }
    },
    main: {
      position: 'relative',
      width: world.w + 'px',
      margin: '0 auto',
      canvas: createCanvas(WORLD.w, WORLD.h),
      aside: {
        div: {
          id: 'promptElem',
          margin: '2em',
          fontFamily: 'fantasy',
          fontSize: '1.34em',
          transition: '0.5s',
          opacity: 0,
        },
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        color: 'white'
      }
    },
    aside: {
      id: 'info',
      textAlign: 'left',
      top: 0,
      margin: '1em',
      position: 'fixed',
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

  video = createCapture(VIDEO);
  video.size(world.w, world.h);
  video.hide();
  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', results => poses = results);

  loadWorld(0);

  //pew model
  classifier.classify(soundMade);
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
  const flippedVideo = ml5.flipImage(video);
  image(flippedVideo, 0, 0, world.w, world.h);
  // dark film
  noStroke();
  fill(colorSet(0, 0.86));
  rect(0, 0, WORLD.w, WORLD.h);

  // find destination
  lastNose = createVector(nose.x, nose.y);
  if (follow.value === FOLLOW.MOUSE) {
    nose = createVector(mouseX, mouseY);
  } else if (poses[0] && poses[0].pose && poses[0].pose.nose) {
    nose = poses[0].pose.nose;
    nose = createVector(WORLD.w - nose.x, nose.y);
    if (follow.value === FOLLOW.DEFAULT) nose = createVector(pearl.pos.x + nose.x - world.w2, pearl.pos.y + nose.y - world.h2);
  }

  // deal with pearl
  if (!pearl.done) {
    pearl.acc = p5.Vector.sub(nose, pearl.pos);
    // draw destination
    push();
    noFill();
    let c = colorSet(pearl.color, 0.68)
    stroke(c);
    if (follow.value === FOLLOW.DEFAULT) {
      line(pearl.pos.x, pearl.pos.y, nose.x, nose.y);
      noStroke();
      fill(c);
      translate(nose.x, nose.y);
      rotate(vectorAng(pearl.acc));
      polygon(0, 0, 5, 3);
    } else if (follow.value === FOLLOW.NOSE) circle(nose.x, nose.y, pearl.r * 0.68);
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
    if (world.goal.time && t > world.goal.time) nextLevel();
  }

  // game status report
  if (showInfo) {
    info.set({
      p: [
        'level: ' + currentworld,
        'time: ' + t,
        'size: ' + pearl.size,
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
      console.log(prop,rate);
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
  if (keyCode === UP_ARROW) return loadWorld(currentworld + 1);
  if (keyCode === DOWN_ARROW) return loadWorld(currentworld - 1);
  if (key === 'a') return new Drop({
    props: [PROP.BOOST]
  });
  if (key === 's') return new Drop({
    props: [PROP.SHOT]
  });
  if (key === 'd') return new Drop({
    props: [PROP.SPIKE]
  });
  if (key === 'f') return new Drop({
    props: [PROP.SHOT, PROP.SPIKE, PROP.BOOST]
  });
}

/* prompt */

function gameOver() {
  setPrompt({
    h2: 'Game Over',
  });
  setTimeout(() => loadWorld(currentworld), 3000);
  pause = true;
}

function nextLevel() {
  setPrompt({
    h4: 'Good job.'
  });
  setTimeout(() => loadWorld(currentworld + 1), 3000);
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

  setTimeout(() => {
    let bs = promptElem.get('b');
    if (!bs || !world.goal.color) return;
    bs.forEach(b => b.set(world.goal.color, 'color'))
  }, 100);
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