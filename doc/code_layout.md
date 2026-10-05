# Share code byte layouts

Reference for the binary layout behind every share code format this library supports.

## The container

All share codes hold a single big integer written in base 57 with this dictionary:

```
ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789
```

Five of the 62 alphanumeric characters are missing, which brings the base down to 57: uppercase `I`, lowercase `g` and `l`, and the digits `0` and `1`. Valve never documented why, but they are mostly the ones easy to mix up when retyping a code.

The integer is written **least significant character first**, so decoding reverses the characters before accumulating them. The resulting number is then read as a **big-endian** byte array, which means the byte 0 is the most significant one and the trailing unused bytes are the least significant ones.

| Format                      | Prefix | Separators  | Characters | Bytes |
| --------------------------- | ------ | ----------- | ---------- | ----- |
| Match                       | `CSGO` | `-` every 5 | 25         | 18    |
| Crosshair `legacy-v1/v3/v4` | `CSGO` | `-` every 5 | 25         | 18    |
| Crosshair `cs2-v1`          | `CS`   | none        | 44         | 32    |

Every **crosshair** code stores a checksum in the byte 0:

```
bytes[0] === sum(bytes[1..]) % 256
```

Match codes have no checksum, their byte 0 is payload.

## Telling the formats apart

1. A code matching `^CS<44 dictionary characters>$` uses the cs2 container, and the byte 1 holds its version.
2. Otherwise the code must match `^CSGO(-?[\w]{5}){5}$`, and the byte 1 holds the legacy container version.

Each container numbers its own versions from 1, so the byte 1 alone is not enough: a `legacy-v1` code and a `cs2-v1` code both store `1`. The container has to be resolved first, which is why this library names the formats `<container>-v<version byte>` instead of using a single number. The `legacy` container is closed, any new format will be a `cs2-vX`.

There is no `legacy-v2`. CS2 went straight from the version 1 to the version 3 with the 23/09/2026 update, and the client rejects any code whose version is `2` or lower.

## Crosshair `legacy-v1`

CS:GO era and CS2 below 1.41.8.2. 18 bytes. Sizes are stored as tenths, so a gap of `-3.5` is stored as `-35`.

| Byte    | Bits | Property                   | Encoding                        |
| ------- | ---- | -------------------------- | ------------------------------- |
| 0       | 0-7  | checksum                   | `sum(bytes[1..]) % 256`         |
| 1       | 0-7  | version                    | always `1`                      |
| 2       | 0-7  | `gap`                      | signed, 0.1 steps               |
| 3       | 0-7  | `outline`                  | 0.5 steps                       |
| 4       | 0-7  | `red`                      | 0 to 255                        |
| 5       | 0-7  | `green`                    | 0 to 255                        |
| 6       | 0-7  | `blue`                     | 0 to 255                        |
| 7       | 0-7  | `alpha`                    | 0 to 255                        |
| 8       | 0-2  | `splitDistance`            | 0 to 7                          |
|         | 3-6  | unused                     |                                 |
|         | 7    | `followRecoil`             | CS2 only, always `0` with CS:GO |
| 9       | 0-7  | `fixedCrosshairGap`        | signed, 0.1 steps               |
| 10      | 0-2  | `color`                    | 0 to 7                          |
|         | 3    | `outlineEnabled`           |                                 |
|         | 4-7  | `innerSplitAlpha`          | 0.1 steps                       |
| 11      | 0-3  | `outerSplitAlpha`          | 0.1 steps                       |
|         | 4-7  | `splitSizeRatio`           | 0.1 steps                       |
| 12      | 0-7  | `thickness`                | 0.1 steps                       |
| 13      | 0    | unused                     |                                 |
|         | 1-3  | `style`                    | 0 to 5                          |
|         | 4    | `centerDotEnabled`         |                                 |
|         | 5    | `deployedWeaponGapEnabled` |                                 |
|         | 6    | `alphaEnabled`             |                                 |
|         | 7    | `tStyleEnabled`            |                                 |
| 14      | 0-7  | `length`                   | 0.1 steps                       |
| 15 - 17 | all  | unused                     |                                 |

## Crosshair `legacy-v3`

CS2 1.41.8.2 (23/09/2026). 18 bytes. Sizes became whole pixels authored at `screenHeight`, which consumers use to scale the crosshair to the current resolution.

| Byte    | Bits  | Property             | Encoding                |
| ------- | ----- | -------------------- | ----------------------- |
| 0       | 0-7   | checksum             | `sum(bytes[1..]) % 256` |
| 1       | 0-7   | version              | always `3`              |
| 2       | 0-3   | `style`              | 0 to 7                  |
|         | 4     | `followRecoil`       |                         |
|         | 5     | `outlineEnabled`     |                         |
|         | 6     | `centerDotEnabled`   |                         |
|         | 7     | `tStyleEnabled`      |                         |
| 3       | 0-7   | `red`                | 0 to 255                |
| 4       | 0-7   | `green`              | 0 to 255                |
| 5       | 0-7   | `blue`               | 0 to 255                |
| 6       | 0-7   | `alpha`              | 0 to 255                |
| 7       | 0-7   | `gap`                | 0 to 255, pixels        |
| 8       | 0-7   | `length`             | 0 to 255, pixels        |
| 9       | 0-7   | `dynamicSpreadLimit` | 0 to 255                |
| 10 - 13 | 0-6   | `splitDistance`      | 0 to 127                |
|         | 7-11  | `innerSplitAlpha`    | 0.05 steps              |
|         | 12-15 | `outerSplitAlpha`    | 0.05 steps, plus 0.3    |
|         | 16-22 | `splitSizeRatio`     | 0.01 steps              |
|         | 23-27 | `thickness`          | 0 to 31, pixels         |
|         | 28-31 | unused               |                         |
| 14 - 15 | 0-15  | `screenHeight`       | uint16                  |
| 16 - 17 | all   | unused               |                         |

The bytes 10 to 13 are a **little-endian** bit field, so the bit 0 is the least significant bit of the byte 10 and the bit 31 the most significant bit of the byte 13. The bytes 14 and 15 are a little-endian uint16.

`outerSplitAlpha` ranges from 0.3 to 1 and the stored value is the number of 0.05 steps **above** 0.3, so `0.35` is stored as `1`.

## Crosshair `legacy-v4`

CS2 1.41.8.3 (24/09/2026). 18 bytes. Identical to the `legacy-v3` except for the two rows marked below: the outline flag became a 3 state mode and the Static Square style was added.

| Byte    | Bits  | Property             | Encoding                    |
| ------- | ----- | -------------------- | --------------------------- |
| 0       | 0-7   | checksum             | `sum(bytes[1..]) % 256`     |
| 1       | 0-7   | version              | always `4`                  |
| 2       | 0-3   | `style`              | 0 to 8                      |
|         | 4     | `followRecoil`       |                             |
|         | 5     | unused               | held `outlineEnabled` in v3 |
|         | 6     | `centerDotEnabled`   |                             |
|         | 7     | `tStyleEnabled`      |                             |
| 3       | 0-7   | `red`                | 0 to 255                    |
| 4       | 0-7   | `green`              | 0 to 255                    |
| 5       | 0-7   | `blue`               | 0 to 255                    |
| 6       | 0-7   | `alpha`              | 0 to 255                    |
| 7       | 0-7   | `gap`                | 0 to 255, pixels            |
| 8       | 0-7   | `length`             | 0 to 255, pixels            |
| 9       | 0-7   | `dynamicSpreadLimit` | 0 to 255                    |
| 10 - 13 | 0-6   | `splitDistance`      | 0 to 127                    |
|         | 7-11  | `innerSplitAlpha`    | 0.05 steps                  |
|         | 12-15 | `outerSplitAlpha`    | 0.05 steps, plus 0.3        |
|         | 16-22 | `splitSizeRatio`     | 0.01 steps                  |
|         | 23-27 | `thickness`          | 0 to 31, pixels             |
|         | 28-29 | `outlineMode`        | 0 none, 1 full, 2 half      |
|         | 30-31 | unused               |                             |
| 14 - 15 | 0-15  | `screenHeight`       | uint16                      |
| 16 - 17 | all   | unused               |                             |

## Crosshair `cs2-v1`

CS2 1.41.8.8 (30/09/2026). **32 bytes**, and the code is neither prefixed with `CSGO` nor dash separated:

```
CSvbPubOq37zTGqtsPTP5QTrp5CB4xFXiKRLfzJsm49ZRe
```

| Byte    | Bits  | Property                    | Encoding                  |
| ------- | ----- | --------------------------- | ------------------------- |
| 0       | 0-7   | checksum                    | `sum(bytes[1..]) % 256`   |
| 1       | 0-7   | version                     | always `1`, per container |
| 2 - 3   | 0-15  | `screenHeight`              | uint16                    |
| 4       | 0-4   | `style`                     | 0 to 9                    |
|         | 5     | `followRecoil`              |                           |
|         | 6     | `centerDotEnabled`          |                           |
|         | 7     | `tStyleEnabled`             |                           |
| 5       | 0-7   | `red`                       | 0 to 255                  |
| 6       | 0-7   | `green`                     | 0 to 255                  |
| 7       | 0-7   | `blue`                      | 0 to 255                  |
| 8       | 0-7   | `alpha`                     | 0 to 255                  |
| 9       | 0-7   | `outlineRed`                | 0 to 255                  |
| 10      | 0-7   | `outlineGreen`              | 0 to 255                  |
| 11      | 0-7   | `outlineBlue`               | 0 to 255                  |
| 12      | 0-7   | `outlineAlpha`              | 0 to 255                  |
| 13      | 0-5   | `thickness`                 | 0 to 32, pixels           |
|         | 6-7   | `outlineMode`               | 0 none, 1 full, 2 half    |
| 14 - 15 | 0-15  | `gap`                       | **int16**, -3840 to 3840  |
| 16      | 0-7   | `length`                    | 0 to 255, pixels          |
| 17      | 0-7   | `dynamicSpreadLimit`        | 0 to 255                  |
| 18 - 21 | 0-6   | `splitDistance`             | 0 to 127                  |
|         | 7-13  | `innerSplitAlpha`           | 0.01 steps                |
|         | 14-20 | `outerSplitAlpha`           | 0.01 steps, plus 0.3      |
|         | 21-27 | `splitSizeRatio`            | 0.01 steps                |
|         | 28    | `scopeDotUseCrosshairColor` |                           |
|         | 29-31 | unused                      |                           |
| 22      | 0-7   | `scopeDotScale`             | 0.01 steps, plus 0.1      |
| 23 - 31 | all   | unused                      |                           |

### What changed from the `legacy-v4`

- The outline color was added as a full RGBA quad in the bytes 9 to 12.
- The scope dot preferences were added: `scopeDotScale` in the byte 22 and `scopeDotUseCrosshairColor` at the bit 28 of the bit field, the slot `legacy-v4` used for `outlineMode`.
- `style` widened from 4 to 5 bits, which pushed `followRecoil` from the bit 4 to the bit 5. The `legacy-v3` outline flag slot is gone.
- `thickness` and `outlineMode` moved out of the bit field into the byte 13, packed as 6 + 2 bits. `thickness` widened from 5 to 6 bits and CS2 clamps it to 32.
- The split alphas went from 0.05 to 0.01 steps, so they need 7 bits each instead of 5 and 4.
- `gap` became a signed 16-bit integer in the bytes 14-15, which is what allows negative gaps on the classic dynamic style. CS2 clamps it to -3840 to 3840.
- `screenHeight` moved from the bytes 14-15 to the bytes 2-3.
- The style `9`, Static Quad, was added.

### Ranges worth knowing

`scopeDotScale` maps to the `cl_ironsight_dot_scale` ConVar, whose value is `(byte + 10) / 100`. The byte could express up to `2.65` but CS2 clamps the ConVar to **2**, so the useful byte range is 0 to 190. Measured against CS2 1.41.8.8 by importing codes that differ only in that byte:

| Byte 22 | `cl_ironsight_dot_scale` |
| ------- | ------------------------ |
| 0       | 0.1                      |
| 45      | 0.55                     |
| 90      | 1                        |
| 255     | 2 (clamped)              |

`gap` is clamped to -3840 to 3840, the range of the `cl_crosshair_gap` ConVar. The settings UI slider only goes from -10 to 128, wider values can be set from the console and survive a round trip through a share code. `thickness` is clamped to 0 to 32, the range of `cl_crosshair_thickness`.

`outerSplitAlpha` keeps the `legacy-v3` convention: it ranges from 0.3 to 1 and the stored value is the number of 0.01 steps above 0.3, so `0.35` is stored as `5`.

The styles are, per the `cl_crosshairstyle` ConVar help text: 0 Dynamic Cross, 1 Dynamic Circle, 2 Dynamic Cross (Legacy), 3 Static Circle, 4 Static Cross, 5 Static Cross (Shot Feedback), 6 Dot Only, 7 Dynamic Quad, 8 Static Square, 9 Static Quad.

## Match code

18 bytes, and unlike the crosshair codes there is no checksum and no version.

| Byte    | Property        | Encoding      |
| ------- | --------------- | ------------- |
| 0 - 7   | `matchId`       | little-endian |
| 8 - 15  | `reservationId` | little-endian |
| 16 - 17 | `tvPort`        | little-endian |

The three fields come from a [`CDataGCCStrike15_v2_MatchInfo`](https://github.com/SteamDatabase/Protobufs/blob/master/csgo/cstrike15_gcmessages.proto) message.
