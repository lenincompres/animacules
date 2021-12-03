let worlds = [WORLD,
  {
    prompt: {
      h2: 'This is Pearl.',
      p: 'Unlike other animacules, she has autonomy: can decide where to go, like <b>reach food </b>.',
    },
    heat: 0,
    food: [{
      x: WORLD.w2,
      y: WORLD.h - 100
    }],
    goal: {
      size: 1900,
      color: 'springGreen'
    }
  },
  {
    prompt: {
      h2: 'Gotta be big.',
      p: 'Nothing else to do, but eat and <b>get big</b>?',
    },
    heat: 0,
    goal: {
      size: 3000,
      color: 'springGreen'
    }
  },
  {
    prompt: {
      h2: "It's a hot one.",
      p: 'On hot days, pearl needs to <b>eat, in order to survive</b>.',
    },
    size: 0.5,
    foodcap: 1,
    foodrate: 50,
    heat: 2,
    goal: {
      time: 1000,
      color: 'skyBlue'
    }
  }, {
    prompt: {
      h2: "I'm not alone.",
      p: "Others will eat too. Pearl must <b>avoid them in order to survive</b>.",
    },
    foodcap: 2,
    anims: [
      {
        x: 0,
        y: WORLD.h
      }
    ],
    goal: {
      time: 1000,
      color: 'springGreen'
    }
  }, {
    prompt: {
      h2: "Short stacks",
      p: "Food is scarce. <b>Survive</b>.",
    },
    foodcap: 2,
    anims: [
      {
        x: 0,
        y: WORLD.h
      },
      {
        x: WORLD.w,
        y: WORLD.h
      }
    ],
    goal: {
      time: 1000
    }
  }, {
    prompt: {
      h2: "Yikes! Spikes.",
      p: "Some food have special abilities. <b>Survive</b>.",
    },
    food: [{
      x: WORLD.w2,
      y: WORLD.h - 100,
      props: [PROP.SPIKE]
    }],
    foodcap: 3,
    spikerate: 0.4,
    anims: [
      {
        x: 0,
        y: WORLD.h
      },
      {
        x: WORLD.w,
        y: WORLD.h
      }
    ],
    goal: {
      time: 1000
    }
  }, {
    prompt: {
      h2: "Speed boost.",
      p: "Some food have special abilities. <b>Survive</b>.",
    },
    food: [{
      x: WORLD.w2,
      y: WORLD.h - 100,
      props: [PROP.BOOST]
    }],
    foodcap: 3,
    spikerate: 0.2,
    boostrate: 0.4,
    anims: [
      {
        x: 0,
        y: WORLD.h
      },
      {
        x: WORLD.w,
        y: WORLD.h
      }
    ],
    goal: {
      time: 1000
    }
  }, {
    prompt: {
      h2: "Shoot'm up.",
      p: "Some food have special abilities. <b>Survive</b>.",
    },
    food: [{
      x: WORLD.w2,
      y: WORLD.h - 100,
      props: [PROP.SHOT]
    }],
    foodcap: 3,
    spikerate: 0.2,
    boostrate: 0.2,
    shotrate: 0.4,
    anims: [
      {
        x: 0,
        y: WORLD.h
      },
      {
        x: WORLD.w,
        y: WORLD.h
      }
    ],
    goal: {
      time: 1000
    }
  }, {
    prompt: {
      h2: "Have Fun.",
      p: "There's no time limit here.",
    },
    foodcap: 4,
    spikerate: 0.2,
    boostrate: 0.2,
    shotrate: 0.2,
    anims: [
      {
        x: 0,
        y: WORLD.h
      },
      {
        x: WORLD.w,
        y: WORLD.h
      },
      {
        x: WORLD.w,
        y: 0
      }
    ]
  }
]