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

/**
 * Constrains the `format` of each crosshair to a member of CrosshairFormat, so that adding an interface
 * without adding its format to the union above (or the other way around) does not compile.
 *
 * Not part of the public API, it is not re-exported by the entry point.
 */
export interface CrosshairWithFormat<TFormat extends CrosshairFormat> {
  format: TFormat;
}

export function isCs2Crosshair(
  crosshair: CrosshairWithFormat<CrosshairFormat>,
): crosshair is CrosshairWithFormat<CrosshairCs2Format> {
  return crosshair.format === 'cs2-v1';
}
