export const GENDER_LABELS: Record<number, string> = {
  1: "Férfi",
  2: "Női",
  3: "Uniszex",
  4: "Gyerek",
};

export const CONDITION_LABELS: Record<number, string> = {
  0: "DSWT",
  1: "NIB",
  2: "DS",
  3: "VNDS",
  4: "NDS",
  5: "Beater",
  6: "Egyéb",
};

export const ORDER_ACTION_LABELS: Record<number, string> = {};

export const ORDER_STATE_LABELS: Record<number, string> = {
  0: "Elfogadásra vár", // ha letrehozom a rendelest, az eladonak meg kell erositenie azt
  1: "",
};

export const CURRENCY_LABELS: Record<string, string> = {
  HUF: "Ft",
  EUR: "€",
  USD: "$",
  // ...
};
