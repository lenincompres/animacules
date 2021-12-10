const setRate = (prop, val) => new Object({
  prop: prop,
  val: val
});

const worlds = [{
  title: 'Hi, little Pearl.',
  tagline: 'Move your head about and get the <b>droplet</b>.',
  ESP: {
    title: "Hola, pequeña Perla.",
    tagline: "Mueve tu cabeza y alcanza la <b>gotita</b>.",
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
  tagline: "Nothing else to do but eat <b>droplets</b> and grow.",
  ESP: {
    title: "Debes ser grande.",
    tagline: "Nada más que hacer: tomar <b>gotitas</b> y crecer.",
  },
  size: 0.5 * SIZE[TYPE.CELL],
  dropcap: 1,
  heat: 0,
  goal: {
    size: 0.5 * SIZE[TYPE.CELL] + SIZE[TYPE.DROP] * 4
  }
}, {
  title: "It's hot outside.",
  tagline: 'You need to <b>eat</b> so not to shrink.',
  ESP: {
    title: "Afuera hace calor.",
    tagline: "Debes <b>comer</b> para no desaparecer.",
  },
  dropcap: 1,
  heat: 1.34,
  goal: {
    time: 30
  }
}, {
  title: "Wave your flagella.",
  tagline: "Limbs make you go faster.",
  ESP: {
    title: "Agita tus flagelos.",
    tagline: "Las extremidades te hacen ir más rápido.",
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
  title: "You won't be alone.",
  tagline: "You may bumb into <b class='indigo'>Sapphire<b>.",
  ESP: {
    title: "No estarás a solas.",
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
  title: "There's scarcity.",
  tagline: "<b class='violet'>Iris</b> is here too, but we have few droplets.",
  heat: 1.5,
  ESP: {
    title: "Hay escasez.",
    tagline: "Llegó <b class='violet'>Iris</b>, pero tenemos pocas gotas.",
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
  title: "Ouch!",
  tagline: "When thorns sprout, you get <i>hurt</i>.",
  ESP: {
    title: "¡Ay!",
    tagline: "Si brotan espinas, os haréis <i>daño</i>.",
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
    title: "Se arrojan las cosas.",
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
  title: "Now, nurture.",
  tagline: "A <b>halo</b> makes you sprout and spew <b>droplets</b>.",
  ESP: {
    title: "Ahora, nutre.",
    tagline: "Un <b>halo</b> te hace brotar y arrojar <b>gotitas</b>.",
  },
  drops: [{
    props: [PROP.HALO]
  }],
  heat: 1.5,
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
  title: "Seedy reproduction",
  tagline: "Reduces your splitting, but triggers it in others.",
  ESP: {
    title: "Una reproducción vil",
    tagline: "Reduce tu división, pero la provoca en otros.",
  },
  drops: [{
    props: [PROP.SEED]
  }],
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
  title: "Have Fun.",
  tagline: "There's no time limit, just survival.",
  ESP: {
    title: "¡Diviértete!",
    tagline: "No hay tiempo límite, solo rupervivencia.",
  },
  dropcap: 3,
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