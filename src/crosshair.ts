import type { CrosshairWithFormat } from './crosshair-format.js';
import {
  assertCrosshairChecksum,
  bytesToChars,
  charsToBytes,
  clamp,
  DICTIONARY,
  InvalidCrosshairShareCode,
  sumArray,
  uint8ToInt8,
} from './share-code.js';

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

const PREFIX = 'CS';
const CHAR_COUNT = 44;
const BYTE_LENGTH = 32;

export function isCs2ShareCode(shareCode: string) {
  const regex = new RegExp(`^${PREFIX}[${DICTIONARY}]{${CHAR_COUNT}}$`);

  return regex.test(shareCode);
}

function cs2CrosshairShareCodeToBytes(shareCode: string) {
  return charsToBytes(shareCode.slice(PREFIX.length), BYTE_LENGTH);
}

function cs2CrosshairBytesShareCode(bytes: number[]) {
  return `${PREFIX}${bytesToChars(bytes, CHAR_COUNT)}`;
}

export function decodeCs2CrosshairShareCode(shareCode: string): CrosshairV1 {
  const bytes = cs2CrosshairShareCodeToBytes(shareCode);
  assertCrosshairChecksum(bytes);

  switch (bytes[1]) {
    case 1:
      return decodeCrosshairV1(bytes);
    default:
      throw new InvalidCrosshairShareCode();
  }
}

export function encodeCs2Crosshair(crosshair: CrosshairV1): string {
  const bytes = crosshairV1ToBytes(crosshair);
  bytes[0] = sumArray(bytes) & 0xff;

  return cs2CrosshairBytesShareCode(bytes);
}

// The cs2 codes store every fractional value as a number of 0.01 steps.
const STEPS_PER_UNIT = 100; // 0.01 * 100 = 1
// The outer split alpha starts at 0.3 and the scope dot scale at 0.1, the stored values are the number of steps above those minimums.
const OUTER_SPLIT_ALPHA_MIN_STEPS = 30; // 0.3 * 100 = 30
const SCOPE_DOT_SCALE_MIN_STEPS = 10; // 0.1 * 100 = 10
// The scope dot scale byte can hold up to 2.65 but CS2 clamps the cl_ironsight_dot_scale ConVar to 2.
const SCOPE_DOT_SCALE_MIN = 0.1;
const SCOPE_DOT_SCALE_MAX = 2;

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
    innerSplitAlpha: ((bits >> 7) & 0x7f) / STEPS_PER_UNIT,
    outerSplitAlpha: (((bits >> 14) & 0x7f) + OUTER_SPLIT_ALPHA_MIN_STEPS) / STEPS_PER_UNIT,
    splitSizeRatio: ((bits >> 21) & 0x7f) / STEPS_PER_UNIT,
    screenHeight: bytes[2] | (bytes[3] << 8),
    scopeDotScale: Math.min((bytes[22] + SCOPE_DOT_SCALE_MIN_STEPS) / STEPS_PER_UNIT, SCOPE_DOT_SCALE_MAX),
    scopeDotUseCrosshairColor: ((bits >>> 28) & 1) === 1,
  };
}

function crosshairV1ToBytes(crosshair: CrosshairV1): number[] {
  // Rounded instead of truncated like CS2 does to absorb floating point errors, e.g. 0.29 * 100 = 28.999999999999996
  const innerSplitAlpha = Math.round(clamp(crosshair.innerSplitAlpha, 0, 1) * STEPS_PER_UNIT);
  const outerSplitAlpha =
    Math.round(clamp(crosshair.outerSplitAlpha, 0.3, 1) * STEPS_PER_UNIT) - OUTER_SPLIT_ALPHA_MIN_STEPS;
  const splitSizeRatio = Math.round(clamp(crosshair.splitSizeRatio, 0, 1) * STEPS_PER_UNIT);
  const bits =
    clamp(crosshair.splitDistance, 0, 127) |
    (innerSplitAlpha << 7) |
    (outerSplitAlpha << 14) |
    (splitSizeRatio << 21) |
    (Number(crosshair.scopeDotUseCrosshairColor) << 28);
  const screenHeight = clamp(crosshair.screenHeight, 0, 65535);
  const scopeDotScale =
    Math.round(clamp(crosshair.scopeDotScale, SCOPE_DOT_SCALE_MIN, SCOPE_DOT_SCALE_MAX) * STEPS_PER_UNIT) -
    SCOPE_DOT_SCALE_MIN_STEPS;

  const bytes = new Array<number>(BYTE_LENGTH).fill(0);
  bytes[1] = 1;
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

function crosshairV1ToConVars(crosshair: CrosshairV1): string {
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

export function cs2CrosshairToConVars(crosshair: CrosshairV1): string {
  return crosshairV1ToConVars(crosshair);
}
