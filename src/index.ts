import { isCs2Crosshair } from './crosshair-format.js';
import {
  decodeCs2CrosshairShareCode,
  encodeCs2Crosshair,
  type CrosshairV1,
  isCs2ShareCode,
  cs2CrosshairToConVars,
} from './crosshair.js';
import {
  decodeLegacyCrosshairShareCode,
  encodeLegacyCrosshair,
  legacyCrosshairToConVars,
  type CrosshairLegacyV1,
  type CrosshairLegacyV3,
  type CrosshairLegacyV4,
} from './legacy-crosshair.js';

export type { MatchInformation } from './match.js';
export { encodeMatch, decodeMatchShareCode } from './match.js';
export { InvalidShareCode, InvalidCrosshairShareCode } from './share-code.js';
export type { CrosshairFormat, CrosshairLegacyFormat, CrosshairCs2Format } from './crosshair-format.js';
export type { CrosshairLegacyV1, CrosshairLegacyV3, CrosshairLegacyV4 } from './legacy-crosshair.js';
export type { CrosshairV1 } from './crosshair.js';

export type Crosshair = CrosshairLegacyV1 | CrosshairLegacyV3 | CrosshairLegacyV4 | CrosshairV1;

export function decodeCrosshairShareCode(shareCode: string): Crosshair {
  return isCs2ShareCode(shareCode) ? decodeCs2CrosshairShareCode(shareCode) : decodeLegacyCrosshairShareCode(shareCode);
}

export function encodeCrosshair(crosshair: Crosshair): string {
  return isCs2Crosshair(crosshair) ? encodeCs2Crosshair(crosshair) : encodeLegacyCrosshair(crosshair);
}

export function crosshairToConVars(crosshair: Crosshair): string {
  return isCs2Crosshair(crosshair) ? cs2CrosshairToConVars(crosshair) : legacyCrosshairToConVars(crosshair);
}
