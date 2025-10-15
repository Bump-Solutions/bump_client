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

export const CURRENCY_LABELS: Record<string, string> = {
  HUF: "Ft",
  EUR: "€",
  USD: "$",
  // ...
};

export const ORDER_ACTION_LABELS: Record<number, string> = {};

export const ORDER_STATE_LABELS: Record<number, string> = {
  0: "Elfogadásra vár",
  1: "Vevőre vár",
  2: "Hiba",
  3: "Fizetésre vár",
  4: "Fizetve",
  5: "Úton",
  6: "Átvehető",
  7: "Visszaigazolás",
  8: "Teljesítve",
  9: "Törölve",
  10: "Lejárt",
};

export const ORDER_STATE_VARIANTS = (
  isSeller: boolean
): Record<number, "success" | "warning" | "critical" | "info" | "neutral"> => ({
  0: isSeller ? "warning" : "info", // eladó jóváhagyás folyamatban
  1: isSeller ? "info" : "warning", // vevőn a sor
  2: "critical", // létrehozási hiba
  3: isSeller ? "info" : "warning", // fizetés hiányzik
  4: "success", // fizetve
  5: "info", // úton
  6: isSeller ? "info" : "warning", // átvételre vár
  7: "info", // visszaigazolásra vár
  8: "success", // teljesítve
  9: "critical", // törölve
  10: "neutral", // lejárt
});

export const ITEM_STATE_LABELS: Record<number, string> = {
  0: "Elérhető",
  1: "Archivált",
  2: "Jelentett",
  3: "Eladott",
  4: "Rendelés alatt",
};
