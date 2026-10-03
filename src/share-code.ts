export const DICTIONARY = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789';
const DICTIONARY_LENGTH = BigInt(DICTIONARY.length);
const SHARECODE_BYTE_LENGTH = 18;
const SHARECODE_CHAR_COUNT = 25;

export class InvalidShareCode extends Error {
  public constructor() {
    super('Invalid share code');
    Object.setPrototypeOf(this, InvalidShareCode.prototype);
  }
}

export class InvalidCrosshairShareCode extends Error {
  public constructor() {
    super('Invalid crosshair share code');
    Object.setPrototypeOf(this, InvalidCrosshairShareCode.prototype);
  }
}

function bytesToHex(bytes: number[]): string {
  return Array.from(bytes, (byte) => {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}

export function bytesToBigInt(bytes: number[]): bigint {
  const hex = bytesToHex(bytes);

  return BigInt(`0x${hex}`);
}

export function stringToBytes(str: string): number[] {
  const bytes: number[] = [];

  for (let i = 0; i < str.length; i += 2) {
    bytes.push(parseInt(str.slice(i, i + 2), 16));
  }

  return bytes;
}

export function int16ToBytes(number: number): number[] {
  return [(number & 0x0000ff00) >> 8, number & 0x000000ff];
}

export function uint8ToInt8(number: number) {
  return (number << 24) >> 24;
}

export function sumArray(array: number[]) {
  return array.reduce((previousValue, value) => {
    return previousValue + value;
  }, 0);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// Share codes hold a big number written in base 57 with the dictionary characters, least significant character first.
export function charsToBytes(chars: string, byteLength: number): number[] {
  const reversedChars = Array.from(chars).reverse();
  let big = BigInt(0);
  for (let i = 0; i < reversedChars.length; i++) {
    big = big * DICTIONARY_LENGTH + BigInt(DICTIONARY.indexOf(reversedChars[i]));
  }

  const str = big.toString(16).padStart(byteLength * 2, '0');
  const bytes = stringToBytes(str);

  return bytes;
}

export function bytesToChars(bytes: number[], charCount: number): string {
  const hex = bytesToHex(bytes);
  let total = BigInt(`0x${hex}`);
  let chars = '';
  let rem = BigInt(0);
  for (let i = 0; i < charCount; i++) {
    rem = total % DICTIONARY_LENGTH;
    chars += DICTIONARY[Number(rem)];
    total = total / DICTIONARY_LENGTH;
  }

  return chars;
}

// The CSGO container is shared by the match codes and the legacy crosshair codes.
export function shareCodeToBytes(shareCode: string) {
  const regex = new RegExp(`^CSGO(-?[${DICTIONARY}]{5}){5}$`);
  if (!shareCode.match(regex)) {
    throw new InvalidShareCode();
  }

  return charsToBytes(shareCode.replace(/CSGO|-/g, ''), SHARECODE_BYTE_LENGTH);
}

export function bytesToShareCode(bytes: number[]) {
  const chars = bytesToChars(bytes, SHARECODE_CHAR_COUNT);

  return `CSGO-${chars.slice(0, 5)}-${chars.slice(5, 10)}-${chars.slice(10, 15)}-${chars.slice(15, 20)}-${chars.slice(
    20,
    25,
  )}`;
}

export function assertCrosshairChecksum(bytes: number[]) {
  const checksum = sumArray(bytes.slice(1)) % 256;

  if (bytes[0] !== checksum) {
    throw new InvalidCrosshairShareCode();
  }
}
