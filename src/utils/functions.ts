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
