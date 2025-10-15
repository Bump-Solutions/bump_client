import ColorThief from "color-thief-ts";

export const rgbToHex = (rgb?: number[]): string | null => {
  if (!rgb) return null;

  return (
    "#" +
    rgb
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

export const getImageDominantColor = async (
  image: string
): Promise<string | null> => {
  if (!image) return null;

  const colorThief = new ColorThief();
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = image;

  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
  });

  const color = colorThief.getColor(img, {
    colorType: "hex",
  });
  return color;
};

export const getImagePalette = async (
  image: string,
  count: number = 5
): Promise<(string | null)[]> => {
  if (!image) return [];

  const colorThief = new ColorThief();
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = image;

  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
  });

  return colorThief.getPalette(img, count).map((rgb) => rgbToHex(rgb));
};

export const getImageDominantColorAndPalette = async (
  image: string,
  count: number = 5
): Promise<{
  dominantColor: string | null;
  palette: (string | null)[];
}> => {
  if (!image) {
    return { dominantColor: null, palette: [] };
  }

  const colorThief = new ColorThief();
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = image;

  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
  });

  const dominantColor = colorThief.getColor(img, { colorType: "hex" });
  const palette = colorThief
    .getPalette(img, count, { colorType: "hex" })
    .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

  return { dominantColor, palette };
};

export const isLightColor = (hex?: string): boolean => {
  if (!hex) return false;

  const c = hex.substring(1); // strip #
  const rgb = parseInt(c, 16); // convert rrggbb to decimal
  const r = (rgb >> 16) & 0xff; // extract red
  const g = (rgb >> 8) & 0xff; // extract green
  const b = (rgb >> 0) & 0xff; // extract blue

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  return luma > 128;
};

export const generateValidOTP = (length: number): string | undefined => {
  if (!length) return undefined;

  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T => {
  let debounceTimer: ReturnType<typeof setTimeout>;

  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(this, args), delay);
  } as T;
};

export const formatPhoneNumber = (number: string): string => {
  // Replace "06" with "+36"
  if (number.startsWith("0") || number.startsWith("06")) {
    number = `+36${number.slice(2)}`;
  }

  let sanitized = number.startsWith("+") ? number : `+${number}`;

  // Remove all characters except digits and '+'
  sanitized = sanitized.replace(/[^\d+]/g, "");

  // Format based on length of the input
  if (sanitized.startsWith("+36")) {
    sanitized = sanitized.replace(
      /(\+36)(\d{0,2})?(\d{0,3})?(\d{0,4})?/,
      (match, p1, p2, p3, p4) => {
        let result = p1; // Start with the country code
        if (p2) result += p2;
        if (p3) result += `-${p3}`;
        if (p4) result += `-${p4}`;
        return result;
      }
    );
  }

  return sanitized;
};

// Returns a random subset of the array of the specified size
export const getRandomSubset = <T>(arr: T[], size: number): T[] => {
  const shuffled = [...arr];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, size);
};

// Displays a shortened version of a UUID (first 8 characters, uppercase, prefixed with #)
export const displayUuid = (uuid: string) => {
  return `#${uuid.slice(0, 8).toLocaleUpperCase()}`;
};
