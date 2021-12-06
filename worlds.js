const setRate = (prop, val) => new Object({
  prop: prop,
  val: val
});

const worlds = [
  {
    title: 'This is Pearl, the animacule.',
    tagline: 'Move your head about and <b>eat droplets</b>.',
    heat: 0,
    drops: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86
    }],
    goal: {
      size: SIZE[TYPE.CELL] + SIZE[TYPE.DROP]
    }
  }, {
    title: 'Gotta be big.',
    tagline: 'Nothing else to do, but <b>eat and grow</b>.',
    heat: 0,
    goal: {
      size: SIZE[TYPE.CELL] + SIZE[TYPE.DROP] * 4,
      color: 'springGreen'
    }
  }, {
    title: "It's a hot day.",
    tagline: 'Pearl needs to eat to <b>survive long enough</b>.',
    dropcap: 1,
    droprate: 50,
    heat: 2,
    goal: {
      time: 30
    }
  }, {
    title: "You're not alone.",
    tagline: "Pearl must <b>compete for droplets</b>.",
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
    title: "Face scarsity.",
    tagline: "There's 3 or you, yet <b>2 droplets at a time</b>.",
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
    title: "Ow! That hurts!",
    tagline: "You can get <b>temporary traits</b>, like spikes.",
    drops: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86,
      props: [PROP.SPIKE]
    }],
    dropcap: 2,
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
      time: 30
    }
  }, {
    title: "Wave your flagella.",
    tagline: "This one has a <b>tail to move faster</b> for a limited time.",
    drops: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86,
      props: [PROP.TAIL]
    }],
    dropcap: 2,
    rate: {
      spike: 0.2,
      tail: 0.4,
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
      time: 30
    }
  }, {
    title: "Spew, pew, pew.",
    tagline: ["Hurl projetiles at nearest animacule, by saying: <b>pew pew!<b>"],
    drops: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86,
      props: [PROP.HURL]
    }],
    dropcap: 2,
    rate: {
      spike: 0.2,
      boost: 0.2,
      hurl: 0.4,
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
      time: 30
    }
  }, {
    title: "Reproduction happens.",
    tagline: "Grow an egg until it splits.You'll <b>grow with it</b>.",
    drops: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86,
      props: [PROP.EGG]
    }],
    dropcap: 2,
    rate: {
      spike: 0.2,
      boost: 0.2,
      hurl: 0.2,
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
      time: 30
    }
  }, {
    title: "And now, nurture",
    tagline: "A halo makes projectiles and spikes <b>feed others</b>.",
    drops: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86,
      props: [PROP.HALO]
    }],
    dropcap: 2,
    rate: {
      spike: 0.2,
      boost: 0.2,
      hurl: 0.2,
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
      time: 30
    }
  }, {
    title: "Disembodied, at last",
    tagline: "You will <b>not be seen or touched</b>.",
    dropcap: 4,
    drops: [{
      x: WORLD.w2,
      y: WORLD.h * 0.86,
      props: [PROP.GHOST]
    }],
    rate: {
      spike: 0.2,
      boost: 0.2,
      hurl: 0.2,
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
    ],
    goal: {
      time: 30
    }
  }, {
    title: "Have Fun.",
    tagline: "There's <b>no time limit</b> here.",
    dropcap: 4,
    rate: {
      spike: 0.1,
      boost: 0.1,
      hurl: 0.1,
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