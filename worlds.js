const setRate = (prop, val) => new Object({
  prop: prop,
  val: val
});

const worlds = [
  {
    prompt: {
      h2: 'This is <b style=color:skyblue>Pearl</b> the animacule.',
      p: 'She can decide where to go; like to <b>eat droplets</b>.',
    },
    heat: 0,
    drops: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86
    }],
    goal: {
      size: SIZE[TYPE.CELL] + 1,
      color: 'springGreen'
    }
  }, {
    prompt: {
      h2: 'Gotta be big.',
      p: 'Nothing else to do, but <b>eat and grow</b>?',
    },
    heat: 0,
    goal: {
      size: SIZE[TYPE.CELL] + SIZE[TYPE.DROP] * 4,
      color: 'springGreen'
    }
  }, {
    prompt: {
      h2: "It's a hot day.",
      p: 'Pearl needs to eat, in order to <b>survive (for 30 counts)</b>.',
    },
    dropcap: 1,
    droprate: 50,
    heat: 2,
    goal: {
      time: 30,
      color: 'skyBlue'
    }
  }, {
    prompt: {
      h2: "Competition",
      p: "Pearl must <b>compete for droplets</b> in order to survive.",
    },
    dropcap: 2,
    cells: [{
      x: 0,
      y: WORLD.h
    }],
    goal: {
      time: 30,
      color: 'springGreen'
    }
  }, {
    prompt: {
      h2: "Scarcity",
      p: "There's 3 animacules, yet only <b>2 droplets at a time</b>.",
    },
    dropcap: 2,
    cells: [{
        x: 0,
        y: WORLD.h
      },
      {
        x: WORLD.w,
        y: WORLD.h
      }
    ],
    goal: {
      time: 30
    }
  }, {
    prompt: {
      h2: "Yikes!",
      p: "Some droplets give abilities, like <b>spikes that hurt others</b>.",
    },
    drops: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86,
      props: [PROP.SPIKE]
    }],
    dropcap: 3,
    rate: {
      spike: 0.4,
    },
    cells: [{
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
  }, {
    prompt: {
      h2: "Wave your flagella.",
      p: "This one gives a tail to <b>move faster</b> for a limited time.",
    },
    drops: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86,
      props: [PROP.TAIL]
    }],
    dropcap: 3,
    rate: {
      spike: 0.2,
      boost: 0.4,
    },
    cells: [{
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
  }, {
    prompt: {
      h2: "Shoot'm up.",
      p: "Hurl projetiles at the nearest animacule by <b>shouting: «PEW PEW!»<b>.",
    },
    drops: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86,
      props: [PROP.HURL]
    }],
    dropcap: 3,
    rate: {
      spike: 0.2,
      boost: 0.2,
      shot: 0.4,
    },
    cells: [{
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
  }, {
    prompt: {
      h2: "Reproduction happens.",
      p: "Grow eggs inside until you <b>get big enought to split</b>.",
    },
    drops: [{
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
    cells: [{
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
  }, {
    prompt: {
      h2: "Now nurture",
      p: "With a halo around you, projectiles and spikes will <b>feed others</b>.",
    },
    drops: [{
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
    cells: [{
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
  }, {
    prompt: {
      h2: "Go invisible.",
      p: "With this neat trick <b>others won't see or touch you</b>.",
    },
    dropcap: 4,
    drops: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86,
      props: [PROP.GHOST]
    }],
    rate: {
      spike: 0.2,
      boost: 0.2,
      shot: 0.2,
      egg: 0.2,
      halo: 0.2,
      ghost: 0.4,
    },
    cells: [{
        x: 0,
        y: WORLD.h
      },
      {
        x: WORLD.w,
        y: WORLD.h
      }
    ]
  }, {
    prompt: {
      h2: "Have Fun.",
      p: "There's no time limit here.",
    },
    dropcap: 4,
    rate: {
      spike: 0.1,
      boost: 0.1,
      shot: 0.1,
      egg: 0.1,
      halo: 0.1,
      ghost: 0.1,
    },
    cells: [{
        x: 0,
        y: WORLD.h
      },
      {
        x: WORLD.w,
        y: WORLD.h
      }
    ]
  }
]