const setRate = (prop, val) => new Object({
  prop: prop,
  val: val
});

const worlds = [{
    prompt: {
      h2: 'This is Pearl.',
      p: 'Unlike other animacules, she has autonomy: can decide where to go, like <b>reach drop </b>.',
    },
    heat: 0,
    drop: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86
    }],
    goal: {
      size: SIZE[TYPE.CELL] + 1,
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
      size: 2 * SIZE[TYPE.CELL],
      color: 'springGreen'
    }
  },
  {
    prompt: {
      h2: "It's a hot one.",
      p: 'On hot days, pearl needs to <b>eat, in order to survive</b>.',
    },
    dropcap: 1,
    droprate: 50,
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
    dropcap: 2,
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
    dropcap: 2,
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
      p: "Some drop have special abilities. <b>Survive</b>.",
    },
    drop: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86,
      props: [PROP.SPIKE]
    }],
    dropcap: 3,
    rate: {
      spike: 0.4,
    },
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
      p: "Some drop have special abilities. <b>Survive</b>.",
    },
    drop: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86,
      props: [PROP.BOOST]
    }],
    dropcap: 3,
    rate: {
      spike: 0.2,
      boost: 0.4,
    },
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
      p: "Some drop have special abilities. <b>Survive</b>.",
    },
    drop: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86,
      props: [PROP.SHOT]
    }],
    dropcap: 3,
    rate: {
      spike: 0.2,
      boost: 0.2,
      shot: 0.4,
    },
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
      h2: "Split up.",
      p: "Some drop have special abilities. <b>Survive</b>.",
    },
    drop: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86,
      props: [PROP.EGG]
    }],
    dropcap: 3,
    rate: {
      spike: 0.2,
      boost: 0.2,
      shot: 0.2,
      egg: 0.4,
    },
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
      h2: "Help out.",
      p: "Some drop have special abilities. <b>Survive</b>.",
    },
    drop: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86,
      props: [PROP.HALO]
    }],
    dropcap: 3,
    rate: {
      spike: 0.2,
      boost: 0.2,
      shot: 0.2,
      egg: 0.2,
      halo: 0.4,
    },
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
    dropcap: 4,
    rate: {
      spike: 0.2,
      boost: 0.2,
      shot: 0.2,
      egg: 0.2,
      halo: 0.2,
      ghost: 0.2,
    },
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