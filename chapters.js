const setRate = (prop, val) => new Object({
  prop: prop,
  val: val
});

const worlds = [{
  title: 'Hello, Pearl.',
  tagline: 'Try moving your head about and <b>eat the droplet</b>.',
  heat: 0,
  drops: [{
    x: WORLD.w2,
    y: WORLD.h * 0.86
  }],
  goal: {
    size: SIZE[TYPE.CELL] + SIZE[TYPE.DROP]
  }
}, {
  title: 'You gotta be big.',
  tagline: "There's nothing else to do, but <b>eat droplets and grow</b>.",
  heat: 0,
  goal: {
    size: SIZE[TYPE.CELL] + SIZE[TYPE.DROP] * 4
  }
}, {
  title: "It's a hot one.",
  tagline: 'You need to eat to <b>survive long enough</b>.',
  dropcap: 1,
  droprate: 50,
  heat: 2,
  goal: {
    time: 30
  }
}, {
  title: "Wave your flagella.",
  tagline: "Tails make you <b>go faster</b> for a while.",
  drops: [{
    x: WORLD.w2,
    y: WORLD.h * 0.86,
    props: [PROP.TAIL]
  }],
  heat: 2.5,
  dropcap: 2,
  rate: {
    tail: 0.4,
  },
  goal: {
    time: 30
  }
}, {
  title: "You've got company.",
  tagline: "You and Zuli <b>bumb heads and compete</b> for droplets.",
  dropcap: 2,
  cells: [{
    x: 0,
    y: WORLD.h
  }],
  rate: {
    tail: 0.2,
  },
  goal: {
    time: 30
  }
}, {
  title: "Face scarsity.",
  tagline: "Iris is here too, yet there's only <b>two droplets at a time</b>.",
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
  rate: {
    tail: 0.2,
  },
  goal: {
    time: 30
  }
}, {
  title: "Ow! That hurts!",
  tagline: "You may become prickly and <b>hurt each other</b>.",
  drops: [{
    x: WORLD.w2,
    y: WORLD.h * 0.86,
    props: [PROP.HURT]
  }],
  dropcap: 2,
  rate: {
    tail: 0.2,
    hurt: 0.4,
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
  title: "Spew pew pew.",
  tagline: ["Hurl unpleasantries, saying: <b>pew pew!<b>"],
  drops: [{
    x: WORLD.w2,
    y: WORLD.h * 0.86,
    props: [PROP.HURL]
  }],
  dropcap: 2,
  rate: {
    tail: 0.2,
    hurt: 0.2,
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
  tagline: "Experience a steady growth <b>until you split</b>.",
  drops: [{
    x: WORLD.w2,
    y: WORLD.h * 0.86,
    props: [PROP.OVUM]
  }],
  dropcap: 2,
  rate: {
    tail: 0.2,
    hurt: 0.2,
    hurl: 0.2,
    ovum: 0.4,
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
  tagline: "A halo makes you <b>bloom and spew droplets</b>.",
  drops: [{
    x: WORLD.w2,
    y: WORLD.h * 0.86,
    props: [PROP.HALO]
  }],
  dropcap: 2,
  rate: {
    tail: 0.2,
    hurt: 0.2,
    hurl: 0.2,
    ovum: 0.2,
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
  title: "Reproduction gets weird",
  tagline: "These reduce your eggs, but <b>triggers them in others</b>.",
  drops: [{
    x: WORLD.w2,
    y: WORLD.h * 0.86,
    props: [PROP.SEED]
  }],
  dropcap: 2,
  rate: {
    tail: 0.2,
    hurt: 0.2,
    hurl: 0.2,
    ovum: 0.2,
    halo: 0.2,
    seed: 0.4,
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
  title: "And lastly, disembodiment",
  tagline: "You will <b>not be seen or touched</b> by others.",
  dropcap: 4,
  drops: [{
    x: WORLD.w2,
    y: WORLD.h * 0.86,
    props: [PROP.SOUL]
  }],
  rate: {
    tail: 0.2,
    hurt: 0.2,
    hurl: 0.2,
    ovum: 0.2,
    halo: 0.2,
    seed: 0.2,
    soul: 0.4,
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
    tail: 0.2,
    hurt: 0.2,
    hurl: 0.2,
    ovum: 0.2,
    halo: 0.2,
    seed: 0.2,
    soul: 0.2,
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
}]