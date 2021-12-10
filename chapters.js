const setRate = (prop, val) => new Object({
  prop: prop,
  val: val
});

const chapters = [{
  title: 'Hi, little Pearl!',
  tagline: 'Can you move your head until you get the <b>droplet</b>?',
  ESP: {
    title: "¡Hola, pequeña Perla!",
    tagline: "¿Pueder mover tu cabeza hasta alcanzar la <b>gotita</b>?",
  },
  size: 0.34 * SIZE[TYPE.CELL],
  dropcap: 1,
  heat: 0,
  drops: [{
    x: WORLD.w2,
    y: WORLD.h * 0.86
  }],
  goal: {
    size: 0.34 * SIZE[TYPE.CELL] + SIZE[TYPE.DROP]
  }
}, {
  title: 'You gotta be big.',
  tagline: "Nothing else to do but <b>eat</b> and grow.",
  ESP: {
    title: "Debes ser grande.",
    tagline: "Nada más que hacer que <b>comer</b> y crecer.",
  },
  size: 0.5 * SIZE[TYPE.CELL],
  dropcap: 1,
  heat: 0,
  goal: {
    size: 0.5 * SIZE[TYPE.CELL] + SIZE[TYPE.DROP] * 4
  }
}, {
  title: "It's hot out there.",
  tagline: "You need to eat so not to <b class='hot'>shrink</b>.",
  ESP: {
    title: "Hace calor afuera.",
    tagline: "Debes comer para no <b class='hot'>desaparecer</b>.",
  },
  dropcap: 1,
  heat: 1.34,
  goal: {
    time: 30
  }
}, {
  title: "Let's run!",
  tagline: "Bigger limbs will make you go faster.",
  ESP: {
    title: "¡Vamos a correr!",
    tagline: "Las extemidades grandes te harán ir más rápido.",
  },
  drops: [{
    props: [PROP.TAIL]
  }],
  heat: 1.5,
  rate: {
    tail: 0.4,
  },
  goal: {
    time: 30
  }
}, {
  title: "Have a playmate.",
  tagline: "You may bumb into <b class='indigo'>Sapphire</b>.",
  ESP: {
    title: "Tienes compañía.",
    tagline: "Puedes toparte con <b class='indigo'>Zafiro</b>.",
  },
  heat: 1.5,
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
  tagline: "Do we have enough for <b class='violet'>Iris</b> too?",
  heat: 1.6,
  ESP: {
    title: "Hay escasez.",
    tagline: "¿Habrá suficiente para <b class='violet'>Iris</b> también?",
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
  title: "Be careful!",
  tagline: "You'll get <i>hurt</i> when thorns sprout.",
  ESP: {
    title: "¡Con cuidado!",
    tagline: "Os haréis <i>daño</i> cuando broten espinas.",
  },
  drops: [{
    props: [PROP.HURT]
  }],
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
  tagline: ["Say: <i>Pew pew!<i>"],
  ESP: {
    title: "Ahora se arrojan cosas.",
    tagline: "Diciendo: <i>¡Piu, piu!</i>.",
  },
  drops: [{
    props: [PROP.HURL]
  }],
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
  tagline: "You will <b>grow</b> until you <i>split</i>.",
  ESP: {
    title: "Llega la reproducción.",
    tagline: "Vais a <b>crecer</b> hasta <i>dividiros</i>.",
  },
  drops: [{
    props: [PROP.OVUM]
  }],
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
  title: "Seedy reproduction",
  tagline: "Reduces your splitting, and triggers it in others.",
  ESP: {
    title: "Una reproducción vil",
    tagline: "Reduce tu división y la provoca en los demás.",
  },
  drops: [{
    props: [PROP.SEED]
  }],
  rate: {
    tail: 0.2,
    hurt: 0.2,
    hurl: 0.2,
    ovum: 0.2,
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
  title: "Time to nurture.",
  tagline: "A <b>halo</b> makes you sprout and spew droplets.",
  ESP: {
    title: "Toca nutrir.",
    tagline: "Un <b>halo</b> te hace brotar y arrojar gotitas.",
  },
  drops: [{
    props: [PROP.HALO]
  }],
  heat: 1.7,
  rate: {
    tail: 0.2,
    hurt: 0.2,
    hurl: 0.2,
    ovum: 0.2,
    seed: 0.2,
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
  title: "Lastly, disembodiment.",
  tagline: "You will not be seen or touched.",
  ESP: {
    title: "Para terminar, incorporeidad.",
    tagline: "No podrán verte ni tocarte.",
  },
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
    hide: 0.4,
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
  title: "Goodbye! Have Fun!",
  tagline: "There're no limits, just survival.",
  ESP: {
    title: "¡Adiós y Diviértete!",
    tagline: "No hay límites, solo rupervivencia.",
  },
  rate: {
    tail: 0.2,
    hurt: 0.2,
    hurl: 0.2,
    ovum: 0.2,
    halo: 0.2,
    seed: 0.2,
    hide: 0.2,
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