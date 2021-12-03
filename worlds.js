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
      size: 3900,
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
      size: 5000,
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
      h2: "Three's company.",
      p: "The competition is fierce. <b>Avoid them in order to survive</b>.",
    },
    foodcap: 3,
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
      h2: "New abilities",
      p: "Some food have special abilities. <b>Survive</b>.",
    },
    foodcap: 4,
    spikerate: 1,
    boostrate: 1,
    shottrate: 1,
    anims: [
      {
        x: 0,
        y: WORLD.h
      }
    ],
    goal: {
      time: 3000
    }
  }, {
    prompt: {
      h2: "Life's tough",
      p: "Just <b>survive</b>.",
    },
    foodcap: 4,
    spikerate: 1,
    boostrate: 1,
    shottrate: 1,
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
      time: 3000
    }
  }
]