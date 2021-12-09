const setRate = (prop, val) => new Object({
  prop: prop,
  val: val
});

const worlds = [{
  title: 'Hi, Pearl.',
  tagline: 'Try moving your head about and <b>get the droplet</b>.',
  ESP: {
    title: "Hola, Perla.",
    tagline: "Intenta mover tu cabeza y <b>alcanza la gotita</b>.",
  },
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
  ESP: {
    title: "Debes ser grande.",
    tagline: "Nada más que hacer que <b>tomar gotitas y crecer</b>.",
  },
  heat: 0,
  goal: {
    size: SIZE[TYPE.CELL] + SIZE[TYPE.DROP] * 4
  }
}, {
  title: "It's a hot one.",
  tagline: 'You need to <b>eat so not to shrink</b>.',
  ESP: {
    title: "Hoy hace calor.",
    tagline: "Hay que <b>comer para no encogerse</b>.",
  },
  dropcap: 1,
  droprate: 50,
  heat: 2,
  goal: {
    time: 30
  }
}, {
  title: "Wave your flagella.",
  tagline: "Tails make you <b>go faster</b>.",
  ESP: {
    title: "Agita tus flagelos.",
    tagline: "Las colas te hacen <b>ir más rápido</b>.",
  },
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
  title: "No longer alone.",
  tagline: "You and Zapphire may <b>bumb into each other</b>.",
  ESP: {
    title: "No más a solas.",
    tagline: "Zafiro y tú <b>pueden toparse por ahí</b>.",
  },
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
  title: "Face scarcity.",
  tagline: "Iris is here too. But, there's only <b>two droplets at any time</b>.",
  dropcap: 2,
  ESP: {
    title: "Enfrenta la escasez.",
    tagline: "Ha llegado Iris. Pero, solo hay <b>dos gotas en a la vez</b>.",
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
  rate: {
    tail: 0.2,
  },
  goal: {
    time: 30
  }
}, {
  title: "Ow! That hurts!",
  tagline: "You may sprout thorns and <b>hurt each other</b>.",
  ESP: {
    title: "¡Ay! ¡Eso duele!",
    tagline: "Pueden brotar espinas y <b>lastimarse entre sí</b>.",
  },
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
  ESP: {
    title: "Se escupen las cosas.",
    tagline: "Diciendo: <b>«¡Po, po!»</b>.",
  },
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
  tagline: "Grow steadily until <b>splitting into two</b>.",
  ESP: {
    title: "Acontece la reproducción.",
    tagline: "Podrán crecer más, hasta <b>dividirse en dos</b>.",
  },
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
  ESP: {
    title: "Provee y nutre.",
    tagline: "Un halo te hace <b> brotar y arrojar gotitas</b>.",
  },
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
  ESP: {
    title: "Una reproducción vil",
    tagline: "Reduce tu división pero <b>la provoca en les demás</b>.",
  },
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
  title: "And lastly, disembodiment.",
  tagline: "You will <b>not be seen or touched</b>.",
  ESP: {
    title: "Al fin, incorporeidad.",
    tagline: "El resto <b>No podrá verte ni tocarte</b>.",
  },
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