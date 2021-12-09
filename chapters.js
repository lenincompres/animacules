const setRate = (prop, val) => new Object({
  prop: prop,
  val: val
});

const worlds = [{
  title: 'Hi, Pearl.',
  tagline: 'Try moving your head about and <b>get the droplet</b>.',
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
  tagline: "Nothing else to do but <b>eat droplets and grow</b>.",
  heat: 0,
  goal: {
    size: SIZE[TYPE.CELL] + SIZE[TYPE.DROP] * 4
  }
}, {
  title: "It's a hot one.",
  tagline: 'You need to <b>eat so not to shrink</b>.',
  dropcap: 1,
  droprate: 50,
  heat: 2,
  goal: {
    time: 30
  }
}, {
  title: "Wave your flagella.",
  tagline: "Tails make you <b>go faster</b>.",
  drops: [{
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
  tagline: "You and Zapphire may <b>bumb into each other</b>.",
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
  tagline: "Iris is here. But, there's only <b>two droplets at any time</b>.",
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
  tagline: "You may sprout thorns and <b>hurt each other</b>.",
  drops: [{
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
  title: "Spew unpleasantries.",
  tagline: ["Say: <b>«Pew pew!»<b>"],
  drops: [{
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
  tagline: "Grow steadily until you <b>split into two</b>.",
  drops: [{
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
  title: "Provide and nurture.",
  tagline: "A halo makes you <b>sprout and spew droplets</b>.",
  drops: [{
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
  title: "A seedy reproduction",
  tagline: "Prevents you from splitting but <b>triggers it in others</b>.",
  drops: [{
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
  tagline: "You will <b>not be seen or touched</b>.",
  dropcap: 4,
  drops: [{
    props: [PROP.HIDE]
  }],
  rate: {
    tail: 0.2,
    hurt: 0.2,
    hurl: 0.2,
    ovum: 0.2,
    halo: 0.2,
    seed: 0.2,
    HIDE: 0.4,
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
  tagline: "There's <b>no time limit</b>, just survival.",
  dropcap: 4,
  rate: {
    tail: 0.2,
    hurt: 0.2,
    hurl: 0.2,
    ovum: 0.2,
    halo: 0.2,
    seed: 0.2,
    HIDE: 0.2,
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