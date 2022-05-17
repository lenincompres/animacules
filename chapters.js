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
  title: "Gotta be big.",
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
  title: "It's hot outside.",
  tagline: "You need to eat so not to <b class='hot'>shrink</b>.",
  ESP: {
    title: "Hace calor afuera.",
    tagline: "Debes comer para no <b class='hot'>desaparecer</b>.",
  },
  dropcap: 1,
  heat: 1.36,
  goal: {
    time: 30
  }
}, {
  title: "Let's wiggle!",
  tagline: "Limbs will make you go faster.",
  ESP: {
    title: "¡Vamos, muévete!",
    tagline: "Las extemidades te harán ir más rápido.",
  },
  drops: [{
    props: [PROP.TAIL]
  }],
  heat: 1.5,
  rate: {
    tail: 0.3,
  },
  goal: {
    time: 30
  }
}, {
  title: "Meet others.",
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
    tail: 0.1,
  },
  goal: {
    time: 30
  }
}, {
  title: "Face scarcity.",
  tagline: "Is there enough for <b class='violet'>Iris</b> too?",
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
    tail: 0.1,
  },
  goal: {
    time: 30
  }
}, {
  title: "Be careful!",
  tagline: "You may get <i>hurt</i> and hurt others.",
  ESP: {
    title: "¡Con cuidado!",
    tagline: "Os podréis hacer <i>daño</i>.",
  },
  drops: [{
    props: [PROP.HURT]
  }],
  rate: {
    tail: 0.1,
    hurt: 0.3,
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
  tagline: ["Say: <i>“Pew pew!”</i> to shoot."],
  ESP: {
    title: "Ahora se arrojan cosas.",
    tagline: "Diciendo: <i>«¡Piu, piu!»</i> para disparar.",
  },
  drops: [{
    props: [PROP.HURL]
  }],
  rate: {
    tail: 0.1,
    hurt: 0.1,
    hurl: 0.3,
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
  title: "Sick and contagious.",
  tagline: "Fever, dizziness, but also immunity.",
  ESP: {
    title: "Enfermedad y contagio.",
    tagline: "Fiebre, mareo, pero también immunidad.",
  },
  drops: [{
    props: [PROP.SICK]
  }],
  rate: {
    tail: 0.1,
    hurt: 0.1,
    hurl: 0.1,
    sick: 0.3,
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
  title: "Add, divide and multiply.",
  tagline: "You will <b>grow</b> until you split.",
  ESP: {
    title: "Suma, divide y multiplica.",
    tagline: "<b>Crecereis</b> hasta dividiros.",
  },
  drops: [{
    props: [PROP.OVUM]
  }],
  rate: {
    tail: 0.1,
    hurt: 0.1,
    hurl: 0.1,
    sick: 0.1,
    ovum: 0.3,
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
  tagline: "Reduces your division, but triggers it in others.",
  ESP: {
    title: "Una vil reproducción",
    tagline: "Reduce tu división y la provoca en los demás.",
  },
  drops: [{
    props: [PROP.SEED]
  }],
  rate: {
    tail: 0.1,
    hurt: 0.1,
    hurl: 0.1,
    sick: 0.1,
    ovum: 0.1,
    seed: 0.3,
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
  title: "Be a nurturer.",
  tagline: "<b>Halos</b> makes you sprout and spew droplets.",
  ESP: {
    title: "Toca nutrir.",
    tagline: "El <b>halo</b> te hace brotar y arrojar gotitas.",
  },
  drops: [{
    props: [PROP.HALO]
  }],
  heat: 1.7,
  rate: {
    tail: 0.1,
    hurt: 0.1,
    hurl: 0.1,
    sick: 0.1,
    ovum: 0.1,
    seed: 0.1,
    halo: 0.3,
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
/*}, {
  title: "Lastly, disembodiment.",
  tagline: "You will not be seen or touched.",
  ESP: {
    title: "Para terminar, incorporeidad.",
    tagline: "No podrán verte ni tocarte.",
  },
  heat: 1.5,
  drops: [{
    props: [PROP.HIDE]
  }],
  rate: {
    tail: 0.1,
    hurt: 0.1,
    hurl: 0.1,
    sick: 0.1,
    ovum: 0.1,
    halo: 0.1,
    seed: 0.1,
    hide: 0.3,
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
*/}, {
  title: "Goodbye, and have Fun!",
  tagline: "There's no goal, but survival.",
  ESP: {
    title: "¡Adiós y Diviértete!",
    tagline: "No hay un fin, solo rupervivencia.",
  },
  rate: {
    tail: 0.1,
    hurt: 0.1,
    hurl: 0.1,
    sick: 0.1,
    ovum: 0.1,
    halo: 0.1,
    seed: 0.1,
    //hide: 0.1,
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