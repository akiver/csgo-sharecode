export interface MatchInformation {
  matchId: bigint;
  reservationId: bigint;
  tvPort: number;
}

/**
 * Identifies the layout of a crosshair share code as `<container>-v<version byte>`.
 *
 * There are two containers. The `legacy` one is the `CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx` code CS2 no
 * longer accepts on import, and it is closed: its last version is the `legacy-v4` of the 24/09/2026
 * update. The `cs2` one is the code CS2 produces today, prefixed with `CS` and not dash separated.
 *
 * Each container numbers its own versions from 1, which is why the format is not a number: a
 * `legacy-v1` code and a `cs2-v1` code both store the version byte `1`.
 */
export type CrosshairFormat = CrosshairLegacyFormat | CrosshairCs2Format;

/**
 * Formats of the `CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx` container.
 */
export type CrosshairLegacyFormat = 'legacy-v1' | 'legacy-v3' | 'legacy-v4';

/**
 * Formats of the `CS` container.
 */
export type CrosshairCs2Format = 'cs2-v1';

interface CrosshairWithFormat<TFormat extends CrosshairFormat> {
  format: TFormat;
}

export interface CrosshairLegacyV1 extends CrosshairWithFormat<'legacy-v1'> {
  length: number;
  red: number;
  green: number;
  blue: number;
  gap: number;
  alphaEnabled: boolean;
  alpha: number;
  outlineEnabled: boolean;
  outline: number;
  color: number;
  thickness: number;
  centerDotEnabled: boolean;
  splitDistance: number;
  followRecoil: boolean; // CS2 only, always false with CS:GO
  fixedCrosshairGap: number;
  innerSplitAlpha: number;
  outerSplitAlpha: number;
  splitSizeRatio: number;
  tStyleEnabled: boolean;
  deployedWeaponGapEnabled: boolean;
  /**
   * CS:GO
   * 0 => Default
   * 1 => Default static
   * 2 => Classic
   * 3 => Classic dynamic
   * 4 => Classic static
   */
  /**
   * CS2
   * 0 to 3 => Classic
   * 4 => Classic static
   * 5 => Legacy
   */
  style: number;
}

export interface CrosshairLegacyV3 extends CrosshairWithFormat<'legacy-v3'> {
  /**
   * 0 => Dynamic Cross
   * 1 => Dynamic Circle
   * 2 => Dynamic Cross (Legacy)
   * 3 => Static Circle
   * 4 => Static Cross
   * 5 => Static Cross (Shot Feedback)
   * 6 => Dot Only
   * 7 => Dynamic Quad
   */
  style: number;
  followRecoil: boolean;
  outlineEnabled: boolean;
  centerDotEnabled: boolean;
  tStyleEnabled: boolean;
  red: number;
  green: number;
  blue: number;
  alpha: number;
  gap: number; // 0 to 255
  length: number; // 0 to 255
  thickness: number; // 0 to 31
  dynamicSpreadLimit: number; // 0 to 255
  splitDistance: number; // 0 to 127
  innerSplitAlpha: number; // 0 to 1, 0.05 steps
  outerSplitAlpha: number; // 0.3 to 1, 0.05 steps
  splitSizeRatio: number; // 0 to 1, 0.01 steps
  screenHeight: number; // 0 to 65535
}

type PixelCrosshair = Omit<CrosshairLegacyV3, 'format' | 'outlineEnabled'>;

export interface CrosshairLegacyV4 extends PixelCrosshair, CrosshairWithFormat<'legacy-v4'> {
  /**
   * 0 => Dynamic Cross
   * 1 => Dynamic Circle
   * 2 => Dynamic Cross (Legacy)
   * 3 => Static Circle
   * 4 => Static Cross
   * 5 => Static Cross (Shot Feedback)
   * 6 => Dot Only
   * 7 => Dynamic Quad
   * 8 => Static Square
   */
  style: number;
  /**
   * 0 => No outline
   * 1 => Full outline
   * 2 => Half outline
   */
  outlineMode: number;
}

/**
 * Crosshair of a `cs2-v1` share code, the format CS2 produces since the 30/09/2026 update.
 *
 * These codes are neither prefixed with `CSGO` nor dash separated, they look like
 * `CSvbPubOq37zTGqtsPTP5QTrp5CB4xFXiKRLfzJsm49ZRe`.
 *
 */
export interface CrosshairV1 extends CrosshairWithFormat<'cs2-v1'> {
  /**
   * 0 => Dynamic Cross
   * 1 => Dynamic Circle
   * 2 => Dynamic Cross (Legacy)
   * 3 => Static Circle
   * 4 => Static Cross
   * 5 => Static Cross (Shot Feedback)
   * 6 => Dot Only
   * 7 => Dynamic Quad
   * 8 => Static Square
   * 9 => Static Quad
   */
  style: number;
  followRecoil: boolean;
  centerDotEnabled: boolean;
  tStyleEnabled: boolean;
  /**
   * 0 => No outline
   * 1 => Full outline
   * 2 => Half outline
   */
  outlineMode: number;
  red: number; // 0 to 255
  green: number; // 0 to 255
  blue: number; // 0 to 255
  alpha: number; // 0 to 255
  outlineRed: number; // 0 to 255
  outlineGreen: number; // 0 to 255
  outlineBlue: number; // 0 to 255
  outlineAlpha: number; // 0 to 255
  gap: number; // -128 to 127, negative values are allowed since the 30/09/2026 update
  length: number; // 0 to 255
  thickness: number; // 0 to 255
  dynamicSpreadLimit: number; // 0 to 255
  splitDistance: number; // 0 to 127
  innerSplitAlpha: number; // 0 to 1, 0.01 steps
  outerSplitAlpha: number; // 0.3 to 1, 0.01 steps
  splitSizeRatio: number; // 0 to 1, 0.01 steps
  screenHeight: number; // 0 to 65535
  scopeDotScale: number; // 0.1 to 2, 0.01 steps
  scopeDotUseCrosshairColor: boolean;
}

export type Crosshair = CrosshairLegacyV1 | CrosshairLegacyV3 | CrosshairLegacyV4 | CrosshairV1;

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

const DICTIONARY = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789';
const DICTIONARY_LENGTH = BigInt(DICTIONARY.length);
const SHARECODE_PATTERN = /^CSGO(-?[\w]{5}){5}$/;
const SHARECODE_BYTE_LENGTH = 18;
const SHARECODE_CHAR_COUNT = 25;
// The legacy-v3 and legacy-v4 codes store the split alphas as a number of 0.05 steps and the split size ratio as a number of 0.01 steps.
// Dividing by the number of steps per unit (instead of multiplying by 0.05 / 0.01) avoids floating point errors.
const SPLIT_ALPHA_STEPS_PER_UNIT = 20; // 0.05 * 20 = 1
const SPLIT_SIZE_RATIO_STEPS_PER_UNIT = 100; // 0.01 * 100 = 1
// The outer split alpha starts at 0.3 (6 steps), the stored value is the number of steps above it.
const OUTER_SPLIT_ALPHA_MIN_STEPS = 6; // 0.3 * 20 = 6

// The cs2 codes are neither prefixed with "CSGO" nor dash separated and they hold 32 bytes instead of 18.
const CROSSHAIR_CS2_PREFIX = 'CS';
const CROSSHAIR_CS2_BYTE_LENGTH = 32;
const CROSSHAIR_CS2_CHAR_COUNT = 44;
const CROSSHAIR_CS2_SHARECODE_PATTERN = new RegExp(
  `^${CROSSHAIR_CS2_PREFIX}[${DICTIONARY}]{${CROSSHAIR_CS2_CHAR_COUNT}}$`,
);
// The version byte of the only cs2 container layout known so far.
const CROSSHAIR_CS2_V1_VERSION_BYTE = 1;
// The cs2 codes store every fractional value as a number of 0.01 steps.
const CS2_STEPS_PER_UNIT = 100; // 0.01 * 100 = 1
// The outer split alpha starts at 0.3 and the scope dot scale at 0.1, the stored values are the number of steps above those minimums.
const CS2_OUTER_SPLIT_ALPHA_MIN_STEPS = 30; // 0.3 * 100 = 30
const CS2_SCOPE_DOT_SCALE_MIN_STEPS = 10; // 0.1 * 100 = 10
// The scope dot scale byte can hold up to 2.65 but CS2 clamps the cl_ironsight_dot_scale ConVar to 2.
const CS2_SCOPE_DOT_SCALE_MIN = 0.1;
const CS2_SCOPE_DOT_SCALE_MAX = 2;

function bytesToHex(bytes: number[]): string {
  return Array.from(bytes, (byte) => {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}

function bytesToBigInt(bytes: number[]): bigint {
  const hex = bytesToHex(bytes);

  return BigInt(`0x${hex}`);
}

function stringToBytes(str: string): number[] {
  const bytes: number[] = [];

  for (let i = 0; i < str.length; i += 2) {
    bytes.push(parseInt(str.slice(i, i + 2), 16));
  }

  return bytes;
}

function int16ToBytes(number: number): number[] {
  return [(number & 0x0000ff00) >> 8, number & 0x000000ff];
}

function uint8ToInt8(number: number) {
  return (number << 24) >> 24;
}

function sumArray(array: number[]) {
  return array.reduce((previousValue, value) => {
    return previousValue + value;
  }, 0);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// Share codes hold a big number written in base 57 with the dictionary characters, least significant character first.
function charsToBytes(chars: string, byteLength: number): number[] {
  const reversedChars = Array.from(chars).reverse();
  let big = BigInt(0);
  for (let i = 0; i < reversedChars.length; i++) {
    big = big * DICTIONARY_LENGTH + BigInt(DICTIONARY.indexOf(reversedChars[i]));
  }

  const str = big.toString(16).padStart(byteLength * 2, '0');
  const bytes = stringToBytes(str);

  return bytes;
}

function bytesToChars(bytes: number[], charCount: number): string {
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

function shareCodeToBytes(shareCode: string) {
  if (!shareCode.match(SHARECODE_PATTERN)) {
    throw new InvalidShareCode();
  }

  return charsToBytes(shareCode.replace(/CSGO|-/g, ''), SHARECODE_BYTE_LENGTH);
}

function bytesToShareCode(bytes: number[]) {
  const chars = bytesToChars(bytes, SHARECODE_CHAR_COUNT);

  return `CSGO-${chars.slice(0, 5)}-${chars.slice(5, 10)}-${chars.slice(10, 15)}-${chars.slice(15, 20)}-${chars.slice(
    20,
    25,
  )}`;
}

function crosshairCs2ShareCodeToBytes(shareCode: string) {
  return charsToBytes(shareCode.slice(CROSSHAIR_CS2_PREFIX.length), CROSSHAIR_CS2_BYTE_LENGTH);
}

function bytesToCrosshairCs2ShareCode(bytes: number[]) {
  return `${CROSSHAIR_CS2_PREFIX}${bytesToChars(bytes, CROSSHAIR_CS2_CHAR_COUNT)}`;
}

function assertCrosshairChecksum(bytes: number[]) {
  const checksum = sumArray(bytes.slice(1)) % 256;

  if (bytes[0] !== checksum) {
    throw new InvalidCrosshairShareCode();
  }
}

/**
 * Match fields should come from a CDataGCCStrike15_v2_MatchInfo protobuf message.
 * https://github.com/SteamDatabase/Protobufs/blob/master/csgo/cstrike15_gcmessages.proto (lookup for `CDataGCCStrike15_v2_MatchInfo`).
 */
export function encodeMatch({ matchId, reservationId, tvPort }: MatchInformation): string {
  const matchBytes = stringToBytes(matchId.toString(16)).reverse();
  const reservationBytes = stringToBytes(reservationId.toString(16)).reverse();
  const tvBytes = int16ToBytes(tvPort).reverse();
  const bytes = [...matchBytes, ...reservationBytes, ...tvBytes];
  const shareCode = bytesToShareCode(bytes);

  return shareCode;
}

export function decodeMatchShareCode(shareCode: string): MatchInformation {
  const bytes = shareCodeToBytes(shareCode);

  return {
    matchId: bytesToBigInt(bytes.slice(0, 8).reverse()),
    reservationId: bytesToBigInt(bytes.slice(8, 16).reverse()),
    tvPort: Number(bytesToBigInt(bytes.slice(16, 18).reverse())),
  };
}

export function decodeCrosshairShareCode(shareCode: string): Crosshair {
  if (CROSSHAIR_CS2_SHARECODE_PATTERN.test(shareCode)) {
    const cs2Bytes = crosshairCs2ShareCodeToBytes(shareCode);
    assertCrosshairChecksum(cs2Bytes);

    if (cs2Bytes[1] !== CROSSHAIR_CS2_V1_VERSION_BYTE) {
      throw new InvalidCrosshairShareCode();
    }

    return decodeCrosshairV1(cs2Bytes);
  }

  const bytes = shareCodeToBytes(shareCode);
  assertCrosshairChecksum(bytes);

  switch (bytes[1]) {
    case 1:
      return decodeCrosshairLegacyV1(bytes);
    case 2:
      // CS2 went straight from version 1 to version 3 with the 23/09/2026 update.
      // The CS2 client itself rejects codes with a version <= 2, so there is no known layout to decode.
      throw new InvalidCrosshairShareCode();
    case 3:
      return decodeCrosshairLegacyV3(bytes);
    case 4:
      return decodeCrosshairLegacyV4(bytes);
    default:
      throw new InvalidCrosshairShareCode();
  }
}

function decodeCrosshairLegacyV1(bytes: number[]): CrosshairLegacyV1 {
  return {
    format: 'legacy-v1',
    gap: uint8ToInt8(bytes[2]) / 10,
    outline: bytes[3] / 2,
    red: bytes[4],
    green: bytes[5],
    blue: bytes[6],
    alpha: bytes[7],
    splitDistance: bytes[8] & 7,
    followRecoil: ((bytes[8] >> 4) & 8) === 8,
    fixedCrosshairGap: uint8ToInt8(bytes[9]) / 10,
    color: bytes[10] & 7,
    outlineEnabled: (bytes[10] & 8) === 8,
    innerSplitAlpha: (bytes[10] >> 4) / 10,
    outerSplitAlpha: (bytes[11] & 0xf) / 10,
    splitSizeRatio: (bytes[11] >> 4) / 10,
    thickness: bytes[12] / 10,
    centerDotEnabled: ((bytes[13] >> 4) & 1) === 1,
    deployedWeaponGapEnabled: ((bytes[13] >> 4) & 2) === 2,
    alphaEnabled: ((bytes[13] >> 4) & 4) === 4,
    tStyleEnabled: ((bytes[13] >> 4) & 8) === 8,
    style: (bytes[13] & 0xf) >> 1,
    length: bytes[14] / 10,
  };
}

function decodePixelCrosshair(bytes: number[]): PixelCrosshair {
  // Bytes 10 to 13 are a little-endian bit field.
  const bits = bytes[10] | (bytes[11] << 8) | (bytes[12] << 16) | (bytes[13] << 24);

  return {
    style: bytes[2] & 0xf,
    followRecoil: (bytes[2] & 0x10) === 0x10,
    centerDotEnabled: (bytes[2] & 0x40) === 0x40,
    tStyleEnabled: (bytes[2] & 0x80) === 0x80,
    red: bytes[3],
    green: bytes[4],
    blue: bytes[5],
    alpha: bytes[6],
    gap: bytes[7],
    length: bytes[8],
    dynamicSpreadLimit: bytes[9],
    splitDistance: bits & 0x7f,
    innerSplitAlpha: ((bits >> 7) & 0x1f) / SPLIT_ALPHA_STEPS_PER_UNIT,
    outerSplitAlpha: (((bits >> 12) & 0xf) + OUTER_SPLIT_ALPHA_MIN_STEPS) / SPLIT_ALPHA_STEPS_PER_UNIT,
    splitSizeRatio: ((bits >> 16) & 0x7f) / SPLIT_SIZE_RATIO_STEPS_PER_UNIT,
    thickness: (bits >> 23) & 0x1f,
    screenHeight: bytes[14] | (bytes[15] << 8),
  };
}

function decodeCrosshairLegacyV3(bytes: number[]): CrosshairLegacyV3 {
  return {
    format: 'legacy-v3',
    ...decodePixelCrosshair(bytes),
    outlineEnabled: (bytes[2] & 0x20) === 0x20,
  };
}

function decodeCrosshairLegacyV4(bytes: number[]): CrosshairLegacyV4 {
  return {
    format: 'legacy-v4',
    ...decodePixelCrosshair(bytes),
    // Bits 28 and 29 of the bytes 10 to 13 bit field - bits 30 and 31 are unused.
    outlineMode: (bytes[13] >> 4) & 3,
  };
}

function decodeCrosshairV1(bytes: number[]): CrosshairV1 {
  // Bytes 18 to 21 are a little-endian bit field of four 7 bits values followed by the scope dot
  // color flag at the bit 28 - bits 29 to 31 are unused.
  const bits = bytes[18] | (bytes[19] << 8) | (bytes[20] << 16) | (bytes[21] << 24);

  return {
    format: 'cs2-v1',
    style: bytes[4] & 0xf,
    followRecoil: (bytes[4] & 0x10) === 0x10,
    // The bit 5 of the byte 4 is unused, it held the outline flag of the legacy-v3 codes.
    centerDotEnabled: (bytes[4] & 0x40) === 0x40,
    tStyleEnabled: (bytes[4] & 0x80) === 0x80,
    outlineMode: bytes[14],
    red: bytes[5],
    green: bytes[6],
    blue: bytes[7],
    alpha: bytes[8],
    outlineRed: bytes[9],
    outlineGreen: bytes[10],
    outlineBlue: bytes[11],
    outlineAlpha: bytes[12],
    gap: uint8ToInt8(bytes[15]),
    length: bytes[16],
    thickness: bytes[13],
    dynamicSpreadLimit: bytes[17],
    splitDistance: bits & 0x7f,
    innerSplitAlpha: ((bits >> 7) & 0x7f) / CS2_STEPS_PER_UNIT,
    outerSplitAlpha: (((bits >> 14) & 0x7f) + CS2_OUTER_SPLIT_ALPHA_MIN_STEPS) / CS2_STEPS_PER_UNIT,
    splitSizeRatio: ((bits >> 21) & 0x7f) / CS2_STEPS_PER_UNIT,
    screenHeight: bytes[2] | (bytes[3] << 8),
    scopeDotScale: Math.min((bytes[22] + CS2_SCOPE_DOT_SCALE_MIN_STEPS) / CS2_STEPS_PER_UNIT, CS2_SCOPE_DOT_SCALE_MAX),
    scopeDotUseCrosshairColor: ((bits >>> 28) & 1) === 1,
  };
}

export function encodeCrosshair(crosshair: Crosshair): string {
  if (crosshair.format === 'cs2-v1') {
    const cs2Bytes = crosshairV1ToBytes(crosshair);
    cs2Bytes[0] = sumArray(cs2Bytes) & 0xff;

    return bytesToCrosshairCs2ShareCode(cs2Bytes);
  }

  let bytes: number[];
  switch (crosshair.format) {
    case 'legacy-v1':
      bytes = crosshairLegacyV1ToBytes(crosshair);
      break;
    case 'legacy-v3':
      bytes = crosshairLegacyV3ToBytes(crosshair);
      break;
    case 'legacy-v4':
      bytes = crosshairLegacyV4ToBytes(crosshair);
      break;
    default:
      throw new InvalidCrosshairShareCode();
  }
  bytes[0] = sumArray(bytes) & 0xff;

  return bytesToShareCode(bytes);
}

function crosshairLegacyV1ToBytes(crosshair: CrosshairLegacyV1): number[] {
  return [
    0,
    1,
    (crosshair.gap * 10) & 0xff,
    crosshair.outline * 2,
    crosshair.red,
    crosshair.green,
    crosshair.blue,
    crosshair.alpha,
    (crosshair.splitDistance & 7) | (Number(crosshair.followRecoil) << 7),
    (crosshair.fixedCrosshairGap * 10) & 0xff,
    (crosshair.color & 7) | (Number(crosshair.outlineEnabled) << 3) | ((crosshair.innerSplitAlpha * 10) << 4),
    (crosshair.outerSplitAlpha * 10) | ((crosshair.splitSizeRatio * 10) << 4),
    crosshair.thickness * 10,
    (crosshair.style << 1) |
      (Number(crosshair.centerDotEnabled) << 4) |
      (Number(crosshair.deployedWeaponGapEnabled) << 5) |
      (Number(crosshair.alphaEnabled) << 6) |
      (Number(crosshair.tStyleEnabled) << 7),
    crosshair.length * 10,
    0,
    0,
    0,
  ];
}

function pixelCrosshairToBytes(crosshair: PixelCrosshair, maxStyle: number): number[] {
  // Rounded instead of truncated like CS2 does to absorb floating point errors, e.g. 0.29 * 100 = 28.999999999999996
  const innerSplitAlpha = Math.round(clamp(crosshair.innerSplitAlpha, 0, 1) * SPLIT_ALPHA_STEPS_PER_UNIT);
  const outerSplitAlpha =
    Math.round(clamp(crosshair.outerSplitAlpha, 0.3, 1) * SPLIT_ALPHA_STEPS_PER_UNIT) - OUTER_SPLIT_ALPHA_MIN_STEPS;
  const splitSizeRatio = Math.round(clamp(crosshair.splitSizeRatio, 0, 1) * SPLIT_SIZE_RATIO_STEPS_PER_UNIT);
  const bits =
    clamp(crosshair.splitDistance, 0, 127) |
    (innerSplitAlpha << 7) |
    (outerSplitAlpha << 12) |
    (splitSizeRatio << 16) |
    (clamp(crosshair.thickness, 0, 31) << 23);
  const screenHeight = clamp(crosshair.screenHeight, 0, 65535);

  return [
    0,
    0,
    clamp(crosshair.style, 0, maxStyle) |
      (Number(crosshair.followRecoil) << 4) |
      (Number(crosshair.centerDotEnabled) << 6) |
      (Number(crosshair.tStyleEnabled) << 7),
    clamp(crosshair.red, 0, 255),
    clamp(crosshair.green, 0, 255),
    clamp(crosshair.blue, 0, 255),
    clamp(crosshair.alpha, 0, 255),
    clamp(crosshair.gap, 0, 255),
    clamp(crosshair.length, 0, 255),
    clamp(crosshair.dynamicSpreadLimit, 0, 255),
    bits & 0xff,
    (bits >> 8) & 0xff,
    (bits >> 16) & 0xff,
    (bits >>> 24) & 0xff,
    screenHeight & 0xff,
    screenHeight >> 8,
    0,
    0,
  ];
}

function crosshairLegacyV3ToBytes(crosshair: CrosshairLegacyV3): number[] {
  const bytes = pixelCrosshairToBytes(crosshair, 7);
  bytes[1] = 3;
  bytes[2] |= Number(crosshair.outlineEnabled) << 5;

  return bytes;
}

function crosshairLegacyV4ToBytes(crosshair: CrosshairLegacyV4): number[] {
  const bytes = pixelCrosshairToBytes(crosshair, 8);
  bytes[1] = 4;
  bytes[13] |= clamp(crosshair.outlineMode, 0, 2) << 4;

  return bytes;
}

function crosshairV1ToBytes(crosshair: CrosshairV1): number[] {
  // Rounded instead of truncated like CS2 does to absorb floating point errors, e.g. 0.29 * 100 = 28.999999999999996
  const innerSplitAlpha = Math.round(clamp(crosshair.innerSplitAlpha, 0, 1) * CS2_STEPS_PER_UNIT);
  const outerSplitAlpha =
    Math.round(clamp(crosshair.outerSplitAlpha, 0.3, 1) * CS2_STEPS_PER_UNIT) - CS2_OUTER_SPLIT_ALPHA_MIN_STEPS;
  const splitSizeRatio = Math.round(clamp(crosshair.splitSizeRatio, 0, 1) * CS2_STEPS_PER_UNIT);
  const bits =
    clamp(crosshair.splitDistance, 0, 127) |
    (innerSplitAlpha << 7) |
    (outerSplitAlpha << 14) |
    (splitSizeRatio << 21) |
    (Number(crosshair.scopeDotUseCrosshairColor) << 28);
  const screenHeight = clamp(crosshair.screenHeight, 0, 65535);
  const scopeDotScale =
    Math.round(clamp(crosshair.scopeDotScale, CS2_SCOPE_DOT_SCALE_MIN, CS2_SCOPE_DOT_SCALE_MAX) * CS2_STEPS_PER_UNIT) -
    CS2_SCOPE_DOT_SCALE_MIN_STEPS;

  const bytes = new Array<number>(CROSSHAIR_CS2_BYTE_LENGTH).fill(0);
  bytes[1] = CROSSHAIR_CS2_V1_VERSION_BYTE;
  bytes[2] = screenHeight & 0xff;
  bytes[3] = screenHeight >> 8;
  bytes[4] =
    clamp(crosshair.style, 0, 9) |
    (Number(crosshair.followRecoil) << 4) |
    (Number(crosshair.centerDotEnabled) << 6) |
    (Number(crosshair.tStyleEnabled) << 7);
  bytes[5] = clamp(crosshair.red, 0, 255);
  bytes[6] = clamp(crosshair.green, 0, 255);
  bytes[7] = clamp(crosshair.blue, 0, 255);
  bytes[8] = clamp(crosshair.alpha, 0, 255);
  bytes[9] = clamp(crosshair.outlineRed, 0, 255);
  bytes[10] = clamp(crosshair.outlineGreen, 0, 255);
  bytes[11] = clamp(crosshair.outlineBlue, 0, 255);
  bytes[12] = clamp(crosshair.outlineAlpha, 0, 255);
  bytes[13] = clamp(crosshair.thickness, 0, 255);
  bytes[14] = clamp(crosshair.outlineMode, 0, 2);
  bytes[15] = clamp(crosshair.gap, -128, 127) & 0xff;
  bytes[16] = clamp(crosshair.length, 0, 255);
  bytes[17] = clamp(crosshair.dynamicSpreadLimit, 0, 255);
  bytes[18] = bits & 0xff;
  bytes[19] = (bits >> 8) & 0xff;
  bytes[20] = (bits >> 16) & 0xff;
  bytes[21] = (bits >>> 24) & 0xff;
  bytes[22] = scopeDotScale;

  return bytes;
}

export function crosshairToConVars(crosshair: Crosshair): string {
  if (crosshair.format === 'legacy-v1') {
    return `
cl_crosshair_drawoutline "${Number(crosshair.outlineEnabled)}"
cl_crosshair_dynamic_maxdist_splitratio "${crosshair.splitSizeRatio}"
cl_crosshair_dynamic_splitalpha_innermod "${crosshair.innerSplitAlpha}"
cl_crosshair_dynamic_splitalpha_outermod "${crosshair.outerSplitAlpha}"
cl_crosshair_dynamic_splitdist "${crosshair.splitDistance}"
cl_crosshair_outlinethickness "${crosshair.outline}"
cl_crosshair_t "${Number(crosshair.tStyleEnabled)}"
cl_crosshairalpha "${crosshair.alpha}"
cl_crosshaircolor "${crosshair.color}"
cl_crosshaircolor_b "${crosshair.blue}"
cl_crosshaircolor_g "${crosshair.green}"
cl_crosshaircolor_r "${crosshair.red}"
cl_crosshairdot "${Number(crosshair.centerDotEnabled)}"
cl_crosshairgap "${crosshair.gap}"
cl_crosshairgap_useweaponvalue "${Number(crosshair.deployedWeaponGapEnabled)}"
cl_crosshairsize "${crosshair.length}"
cl_crosshairstyle "${crosshair.style}"
cl_crosshairthickness "${crosshair.thickness}"
cl_crosshairusealpha "${Number(crosshair.alphaEnabled)}"
cl_fixedcrosshairgap "${crosshair.fixedCrosshairGap}"
cl_crosshair_recoil "${Number(crosshair.followRecoil)}"
`;
  }

  if (crosshair.format === 'cs2-v1') {
    return `
cl_crosshair_drawoutline "${crosshair.outlineMode}"
cl_crosshair_dynamic_maxdist_splitratio "${crosshair.splitSizeRatio}"
cl_crosshair_dynamic_splitalpha_innermod "${crosshair.innerSplitAlpha}"
cl_crosshair_dynamic_splitalpha_outermod "${crosshair.outerSplitAlpha}"
cl_crosshair_dynamic_splitdist "${crosshair.splitDistance}"
cl_crosshair_dynamic_spread_limit "${crosshair.dynamicSpreadLimit}"
cl_crosshair_gap "${crosshair.gap}"
cl_crosshair_length "${crosshair.length}"
cl_crosshair_recoil "${Number(crosshair.followRecoil)}"
cl_crosshair_screen_height "${crosshair.screenHeight}"
cl_crosshair_t "${Number(crosshair.tStyleEnabled)}"
cl_crosshair_thickness "${crosshair.thickness}"
cl_crosshaircolor_a "${crosshair.alpha}"
cl_crosshaircolor_b "${crosshair.blue}"
cl_crosshaircolor_g "${crosshair.green}"
cl_crosshaircolor_r "${crosshair.red}"
cl_crosshairdot "${Number(crosshair.centerDotEnabled)}"
cl_crosshairoutline_a "${crosshair.outlineAlpha}"
cl_crosshairoutline_b "${crosshair.outlineBlue}"
cl_crosshairoutline_g "${crosshair.outlineGreen}"
cl_crosshairoutline_r "${crosshair.outlineRed}"
cl_crosshairstyle "${crosshair.style}"
cl_ironsight_dot_scale "${crosshair.scopeDotScale}"
cl_ironsight_usecrosshaircolor "${Number(crosshair.scopeDotUseCrosshairColor)}"
`;
  }

  const outline = crosshair.format === 'legacy-v4' ? crosshair.outlineMode : Number(crosshair.outlineEnabled);
  return `
cl_crosshair_drawoutline "${outline}"
cl_crosshair_dynamic_maxdist_splitratio "${crosshair.splitSizeRatio}"
cl_crosshair_dynamic_splitalpha_innermod "${crosshair.innerSplitAlpha}"
cl_crosshair_dynamic_splitalpha_outermod "${crosshair.outerSplitAlpha}"
cl_crosshair_dynamic_splitdist "${crosshair.splitDistance}"
cl_crosshair_dynamic_spread_limit "${crosshair.dynamicSpreadLimit}"
cl_crosshair_gap "${crosshair.gap}"
cl_crosshair_length "${crosshair.length}"
cl_crosshair_recoil "${Number(crosshair.followRecoil)}"
cl_crosshair_screen_height "${crosshair.screenHeight}"
cl_crosshair_t "${Number(crosshair.tStyleEnabled)}"
cl_crosshair_thickness "${crosshair.thickness}"
cl_crosshaircolor_a "${crosshair.alpha}"
cl_crosshaircolor_b "${crosshair.blue}"
cl_crosshaircolor_g "${crosshair.green}"
cl_crosshaircolor_r "${crosshair.red}"
cl_crosshairdot "${Number(crosshair.centerDotEnabled)}"
cl_crosshairstyle "${crosshair.style}"
`;
}
