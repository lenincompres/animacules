const USE_MOUSE = true;

// Video
let video;
let poseNet;
let poses = [];
let pause = false;

let foods = [];
let agents = [];
let t = 0;
let currentworld = 0;

let pearl = {};

//Constances
const SPEED = 600 / 1000;

let world = WORLD;

function loadWorld(n = 0) {
  if (!worlds[n]) return setPrompt({
    h2: "I'm done!",
    p: "That was the last level."
  });
  pause = true;

  world = worlds[0];
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

function setup() {

  DOM.set({
    title: 'Animacules - Game',
    fontSize: '20pt',
    textAlign: 'center',
    backgroundColor: '#def',
    header: {
      color: 'black',
      fontFamily: 'fantasy',
      h1: 'Animacules'
    },
    main: {
      position: 'relative',
      width: world.w + 'px',
      margin: '0 auto',
      canvas: createCanvas(world.w, world.h),
      aside: {
        div: {
          id: 'promptElem',
          margin: '2em',
          fontFamily: 'fantasy',
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
      fontSize: '.5em',
      top: 0,
      margin: '1em',
      position: 'fixed',
    },
    footer: {
      width: '100%',
      position: 'fixed',
      bottom: 0,
      padding: '0.5em 1em',
      fontSize: '0.5em',
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

  frameRate(30);
}

function draw() {
  t += 1;
  background(0);

  const flippedVideo = ml5.flipImage(video);
  image(flippedVideo, 0, 0, world.w, world.h);

  fill(0, 0.68);
  noStroke();
  rect(0, 0, world.w, world.h);

  var target = !USE_MOUSE && poses[0] ? poses[0].pose.nose : {
    x: mouseX,
    y: mouseY
  };
  if (!USE_MOUSE) target.x = world.w - target.x;
  target = createVector(target.x, target.y).sub(pearl.pos);
  target = vectorMap(target, pearl.r, pearl.speed);
  pearl.acc = target;

  anims.forEach(anim => anim.draw());

  if (pause) return;

  anims.forEach(anim => anim.update());

  foods = anims.filter(a => a.type === TYPE.FOOD);
  agents = anims.filter(a => a.type === TYPE.AGENT);

  agents.forEach(agent => anims.forEach(food => agent.eat(food)));
  anims = anims.filter(anim => !anim.done);

  if (pearl.done) gameOver();

  if (world.goal) {
    if (world.goal.size && pearl.size >= world.goal.size) nextLevel();
    if (world.goal.time && t > world.goal.time) nextLevel();
  }

  if (world.foodrate && !(t % world.foodrate)) addFood();

  info.set({
    p: [
      'level: ' + currentworld,
      'time: ' + t,
      'size: ' + pearl.size,
    ]
  }, true);
}

function mouseClicked() {
  if (!USE_MOUSE) return;
  fireBullet(atan2(mouseX - pearl.x, mouseY - pearl.y));
}

function fireBullet(angle) {}

function addFood(traits = []) {
  if (typeof world.foodcap === 'number' && foods.length >= world.foodcap) return;
  let drop = new Drop();
  drop.traits = traits;
  if(world.boostrate && random(world.foodcap) < world.boostrate) drop.traits.push(TRAIT.BOOST);
  if(world.spiketrate && random(world.foodcap) < world.spiketrate) drop.traits.push(TRAIT.SPIKE);
  if(world.shottrate && random(world.foodcap) < world.shottrate) drop.traits.push(TRAIT.SHOT);
}

// Get a prediction for the current video frame
function modelReady() {

}

/* prompt */

function gameOver() {
  setPrompt({
    h2: 'Game Over',
    button: {
      text: 'Try again',
      onclick: e => closePrompt(() => loadWorld(currentworld))
    }
  }, false);
  pause = true;
}

function nextLevel() {
  setPrompt({
    h4: 'That was a nice day.',
    button: {
      text: 'Next',
      onclick: e => closePrompt(() => loadWorld(currentworld + 1))
    }
  }, false);
  pause = true;
}

let promptTimeout = false;

function setPrompt(model, close = true) {
  if (!model) return promptElem.set(true);
  if (promptTimeout) clearTimeout(promptTimeout);
  promptElem.set({
    model: model,
    opacity: 1,
    pointerEvents: 'all',
    button: !close ? undefined : {
      text: 'OK',
      onclick: closePrompt
    },
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