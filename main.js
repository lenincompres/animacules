const FOLLOW = {
  MOUSE: 'mouse',
  NOSE: 'nose',
  LEAN: 'lean',
  DIFF: 'diff'
}

// Video
let video;
let poseNet;
let poses = [];
let pause = false;

let foods = [];
let agents = [];
let t = 0;
let currentworld = 0;
let dest, lastDest, pointer;
let pearl = {};
let world = WORLD;

// Teachable Machine model URL:
let classifier;
//let soundModel = './tm/';
let soundModel = 'https://teachablemachine.withgoogle.com/models/_WKomoh3c/';

function loadWorld(n = 0) {
  if (!worlds[n]) return setPrompt({
    h2: "I'm done!",
    p: "That was the last level."
  });
  pause = true;

  world = Object.assign({}, worlds[0]);
  pearl = new Pearl({});
  anims = [pearl];
  foods = [];
  agents = [];
  if (n) Object.assign(world, worlds[n]);

  if (world.food) world.food.forEach(opt => new Drop(opt));
  if (world.anims) world.anims.forEach(opt => new Animacule(opt));

  setPrompt(world.prompt);

  currentworld = n;
  pause = false;
  t = 0;
}

function preload() {
  // Load the model
  classifier = ml5.soundClassifier(soundModel + 'model.json');
}

function setup() {
  frameRate(30);

  dest = createVector(WORLD.w2, WORLD.h2);
  pointer = createVector(0, 0);

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
        label: 'Follow your',
        select: {
          border: 'none',
          margin: 0,
          padding: 0,
          background: 'transparent',
          color: '#666',
          id: 'follow',
          option: [{
              text: 'Mouse',
              value: FOLLOW.MOUSE,
            },
            {
              text: 'Nose',
              value: FOLLOW.NOSE,
            },
            {
              text: 'Lean',
              value: FOLLOW.LEAN
            }
          ]
        }
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

  loadWorld(1);

  //pew model
  classifier.classify(soundMade);
}

// The model recognizing a sound will trigger this event
function soundMade(error, results) {
  if (error) return console.error(error);
  let label = results[0].label;
  if(label === 'pew') pearl.fire();
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
  fill(colorSet(0, 0.68));
  rect(0, 0, WORLD.w, WORLD.h);

  // find destination
  if (follow.value === FOLLOW.MOUSE || !poses[0]) {
    dest = {
      x: mouseX,
      y: mouseY
    };
  } else {
    dest = poses[0].pose.nose;
    dest.x = world.w - dest.x;
    if (dest.x < pearl.r || dest.y < pearl.r || dest.x > world.w - pearl.r|| dest.y > world.h - pearl.r) dest = lastDest;
    else {
      if (follow.value === FOLLOW.DIFF) {
        dest.x -= pearl.pos.x;
        dest.y -= pearl.pos.y;
      }
      if (follow.value === FOLLOW.LEAN) {
        dest.x -= world.w2;
        dest.y -= world.h2;
        if (dist(dest.x,dest.y,0,0) > world.w2) dest = createVector(lastDest.x, lastDest.y);
      }
    }
  }
  lastDest = createVector(dest.x, dest.y);
  dest = createVector(dest.x, dest.y);

  // draw objects
  anims.forEach(anim => anim.draw());

  if (follow.value === FOLLOW.LEAN) {
    // destination line
    pearl.inDraw(() => {
      strokeWeight(1);
      fill(pearl.bodyColor);
      stroke(pearl.bodyColor);
      drawArrow(dest.limit(pearl.r));
    });
  } else dest.sub(pearl.pos);

  pearl.acc = dest;
  // find pointer
  if (follow.value === FOLLOW.MOUSE || !poses[0]) {
    pointer = pearl.vel;
  } else {
    pointer = poses[0].pose.rightWrist;
    pointer.x = world.w - pointer.x;
    pointer = createVector(pointer.x, pointer.y);
  }

  if (pause) return;

  // updating things
  anims = anims.filter(anim => !anim.done);
  anims.forEach(anim => anim.update());
  foods = anims.filter(a => a.type === TYPE.FOOD);
  agents = anims.filter(a => a.type === TYPE.AGENT);
  agents.forEach(agent => anims.forEach(a => agent.collide(a)));
  if (world.foodrate && !(t % world.foodrate)) addFood();

  if (follow.value !== FOLLOW.MOUSE || !poses[0]) {
    let targets = agents.filter(a => pearl !== a)
    if (targets.length) {
      pointer.sub(pearl.pos);
      pearl.bullseye = targets.reduce((b, a) => {
        let angA = pointer.angleBetween(p5.Vector.sub(a.pos, pearl.pos));
        let angB = pointer.angleBetween(p5.Vector.sub(b.pos, pearl.pos));
        return !b || abs(angA) < abs(angB) ? a : b
      });
    } else pearl.bullseye = pointer;
  }

  // possible game ending
  if (pearl.done) gameOver();
  else if (world.goal) {
    if (world.goal.size && pearl.size >= world.goal.size) nextLevel();
    if (world.goal.time && t > world.goal.time) nextLevel();
  }

  // game status report
  info.set({
    p: [
      'level: ' + currentworld,
      'time: ' + t,
      'size: ' + pearl.size,
      ...Object.entries(pearl.trait).map(([key, value]) => key + ': ' + value)
    ]
  }, true);
}

function mouseClicked() {
  if (follow.value !== FOLLOW.MOUSE) return;
  pearl.fire();
}

function addFood(props = []) {
  if (typeof world.foodcap === 'number' && foods.length >= world.foodcap) return;
  if (world.boostrate && random(world.foodcap) < world.boostrate)
    props.push(PROP.BOOST);
  if (world.spiketrate && random(world.foodcap) < world.spiketrate)
    rops.push(PROP.SPIKE);
  if (world.shottrate && random(world.foodcap) < world.shottrate)
    props.push(PROP.SHOT);
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