const DICTIONARY = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789';
const DICTIONARY_LENGTH = BigInt(DICTIONARY.length);
const SHARECODE_PATTERN = /^CSGO(-?[\w]{5}){5}$/;

export interface MatchInformation {
  matchId: bigint;
  reservationId: bigint;
  tvPort: number;
}

export interface Crosshair {
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
  fixedCrosshairGap: number;
  innerSplitAlpha: number;
  outerSplitAlpha: number;
  splitSizeRatio: number;
  tStyleEnabled: boolean;
  deployedWeaponGapEnabled: boolean;
  /**
   * 0 => Default
   * 1 => Default static
   * 2 => Classic
   * 3 => Classic dynamic
   * 4 => Classic static
   */
  style: number;
}

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

function shareCodeToBytes(shareCode: string) {
  if (!shareCode.match(SHARECODE_PATTERN)) {
    throw new InvalidShareCode();
  }

  shareCode = shareCode.replace(/CSGO|-/g, '');
  const chars = Array.from(shareCode).reverse();
  let big = BigInt(0);
  for (let i = 0; i < chars.length; i++) {
    big = big * DICTIONARY_LENGTH + BigInt(DICTIONARY.indexOf(chars[i]));
  }

  const str = big.toString(16).padStart(36, '0');
  const bytes = stringToBytes(str);

  return bytes;
}

function bytesToShareCode(bytes: number[]) {
  const hex = bytesToHex(bytes);
  let total = BigInt(`0x${hex}`);
  let chars = '';
  let rem = BigInt(0);
  for (let i = 0; i < 25; i++) {
    rem = total % DICTIONARY_LENGTH;
    chars += DICTIONARY[Number(rem)];
    total = total / DICTIONARY_LENGTH;
  }

  return `CSGO-${chars.slice(0, 5)}-${chars.slice(5, 10)}-${chars.slice(10, 15)}-${chars.slice(15, 20)}-${chars.slice(
    20,
    25
  )}`;
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
  const bytes = shareCodeToBytes(shareCode);
  const size = sumArray(bytes.slice(1)) % 256;

  if (bytes[0] !== size) {
    throw new InvalidCrosshairShareCode();
  }

  const crosshair: Crosshair = {
    gap: uint8ToInt8(bytes[2]) / 10,
    outline: bytes[3] / 2,
    red: bytes[4],
    green: bytes[5],
    blue: bytes[6],
    alpha: bytes[7],
    splitDistance: bytes[8],
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

  return crosshair;
}

export function encodeCrosshair(crosshair: Crosshair): string {
  const bytes: number[] = [
    0,
    1,
    (crosshair.gap * 10) & 0xff,
    crosshair.outline * 2,
    crosshair.red,
    crosshair.green,
    crosshair.blue,
    crosshair.alpha,
    crosshair.splitDistance,
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

  bytes[0] = sumArray(bytes) & 0xff;

  const shareCode = bytesToShareCode(bytes);

  return shareCode;
}

export function crosshairToConVars(crosshair: Crosshair): string {
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
`;
}
