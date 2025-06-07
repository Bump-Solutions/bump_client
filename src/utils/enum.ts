export const ENUM = {
  BRAND: {
    NAME: "Bump",
    URL: "https://bumpmarket.hu",
  },

  AUTH: {
    ROLES: {
      Guest: 4001,
      User: 5002,
      Contributor: 6003,
      Admin: 7004,
      Authenticated: [4001, 5002, 6003, 7004],
      Validated: [5002, 6003, 7004],
      All: [4001, 5002, 6003, 7004],
    },

    GENDER_OPTIONS: [
      { label: "Most nem", value: 0 },
      { label: "Férfi", value: 1 },
      { label: "Nő", value: 2 },
      { label: "Egyéb", value: 3 },
    ],
  },

  PRODUCT: {
    GENDER_OPTIONS: [
      { label: "Férfi", value: 1 },
      { label: "Női", value: 2 },
      { label: "Uniszex", value: 3 },
      { label: "Gyerek", value: 4 },
    ],

    SIZE_OPTIONS: [
      { label: "EU 35", value: 35 },
      { label: "EU 37", value: 37 },
      { label: "EU 39", value: 39 },
      { label: "EU 41", value: 41 },
      { label: "EU 43", value: 43 },
    ],

    CONDITION_OPTIONS: [
      {
        label: "DSWT",
        value: 0,
        description: "(Dead Stock With Tags) Vadonatúj, címkével együtt.",
      },
      {
        label: "NIB",
        value: 1,
        description: "(New In Box) Vadonatúj, dobozában.",
      },
      {
        label: "DS",
        value: 2,
        description: "(Dead stock) Vadonatúj, címke nélkül.",
      },
      {
        label: "VNDS",
        value: 3,
        description:
          "(Very Near Dead Stock) Nagyon jó állapotú, éppen csak felpróbálva.",
      },
      {
        label: "NDS",
        value: 4,
        description: "(Near Dead Stock) Jó állapotú, enyhe kopásokkal.",
      },
      {
        label: "Beater",
        value: 5,
        description: "Kopott, gyakran viselt állapot.",
      },
      { label: "Egyéb", value: 6, description: "Egyéb állapot." },
    ],

    COLOR_OPTIONS: [
      { label: "Fehér", hex: "#FFFFFF" },
      { label: "Szürke", hex: "#909090" },
      { label: "Fekete", hex: "#000000" },
      { label: "Bézs", hex: "#dcbe8c" },
      { label: "Barna", hex: "#654321" },
      { label: "Piros", hex: "#ff0000" },
      { label: "Narancssárga", hex: "#ff8c14" },
      { label: "Sárga", hex: "#ffbf44" },
      { label: "Zöld", hex: "#039039" },
      { label: "Kék", hex: "#093093" },
      { label: "Lila", hex: "#6e41a0" },
      { label: "Rózsaszín", hex: "#ff2cb7" },
      {
        label: "Többszínű",
        hex: "conic-gradient(from 90deg,violet,indigo,blue,green,yellow,orange,red,violet)",
      },
    ],
  },
  MEDIA_MOBILE: 900,
};
