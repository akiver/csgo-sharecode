# csgo-sharecode

JS module to decode / encode CS:GO and CS2 share codes used to share game replays/crosshairs between players.

# Installation

```bash
npm install csgo-sharecode
```

# Usage

## Match

### Decoding

Decodes a match share code into a `MatchInformation` object.

```ts
import { decodeMatchShareCode, MatchInformation } from 'csgo-sharecode';

const shareCode = 'CSGO-GADqf-jjyJ8-cSP2r-smZRo-TO2xK';
const matchInformation: MatchInformation = decodeMatchShareCode(shareCode);
console.log(matchInformation);
// output:
//
// {
//    matchId: 3230642215713767580n,
//    reservationId: 3230647599455273103n,
//    tvPort: 55788
// }
```

### Encoding

Encodes a `MatchInformation` object into a match share code.
The example below use values coming from a real [CDataGCCStrike15_v2_MatchInfo](https://github.com/SteamDatabase/Protobufs/blob/master/csgo/cstrike15_gcmessages.proto) (lookup for `CDataGCCStrike15_v2_MatchInfo`) message.  
You should get them from the _Steam Game Coordinator_ or from a _.info_ file.

```ts
import { encodeMatch, MatchInformation } from 'csgo-sharecode';

const matchInformation: MatchInformation = {
  matchId: BigInt('3230642215713767580'),
  reservationId: BigInt('3230647599455273103'),
  tvPort: 599906796,
};

const shareCode = encodeMatch(matchInformation);
console.log(shareCode);
// output:
//
// "CSGO-GADqf-jjyJ8-cSP2r-smZRo-TO2xK"
```

## Crosshair

The crosshair share code format has changed over time, the `format` property of the `Crosshair` object indicates which layout the code uses. It is named `<container>-v<version byte>`.

| Format      | Type                | Release date   | CS2 version |
| ----------- | ------------------- | -------------- | ----------- |
| `legacy-v1` | `CrosshairLegacyV1` | CS:GO era      | < 1.41.8.2  |
| -           | Not supported       | Never released | -           |
| `legacy-v3` | `CrosshairLegacyV3` | 23/09/2026     | 1.41.8.2    |
| `legacy-v4` | `CrosshairLegacyV4` | 24/09/2026     | 1.41.8.3    |
| `cs2-v1`    | `CrosshairV1`       | 30/09/2026     | 1.41.8.8    |

- `CrosshairLegacyV3`: Sizes (`gap`, `length`, `thickness`...) are integers expressed in pixels at the screen height the crosshair was created for, the `screenHeight` property is used to scale the crosshair to the current screen height.
- `CrosshairLegacyV4`: Same as `legacy-v3` with `outlineMode` (none, full or half outline) instead of `outlineEnabled` and the Static Square style.
- `CrosshairV1`: Adds the outline color (`outlineRed`, `outlineGreen`, `outlineBlue`, `outlineAlpha`), the scope dot preferences (`scopeDotScale` from 0.1 to 2, `scopeDotUseCrosshairColor`) and the Static Quad style. `gap` may now be negative and the split alphas use 0.01 steps instead of 0.05.

> [!IMPORTANT]
> There are two containers. `legacy` is the `CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx` code, which CS2 no longer accepts on import. `cs2` is the code CS2 produces today: prefixed with `CS`, not dash separated, and it looks like `CSvbPubOq37zTGqtsPTP5QTrp5CB4xFXiKRLfzJsm49ZRe`. Note that `legacy-v3` and `legacy-v4` are CS2 era formats, they simply kept the old container.
>
> Each container numbers its own versions from 1, which is why the format is a string and not a number: a `legacy-v1` code and a `cs2-v1` code both store the version byte `1`. There is no `legacy-v2`, CS2 went straight from the version 1 to the version 3 and the client rejects any code below the version 3. The `legacy` container is closed, any new format will be a `cs2-vX`.

See [doc/code_layout.md](doc/code_layout.md) for the byte by byte layout of every format.

### Decoding

Decodes a crosshair share code into a `Crosshair` object.

```ts
import { decodeCrosshairShareCode, Crosshair } from 'csgo-sharecode';

const shareCode = 'CSvbPubOq37zTGqtsPTP5QTrp5CB4xFXiKRLfzJsm49ZRe';
const crosshair: Crosshair = decodeCrosshairShareCode(shareCode);
console.log(crosshair);
// output:
//
// {
//   format: 'cs2-v1',
//   style: 2,
//   followRecoil: false,
//   centerDotEnabled: true,
//   tStyleEnabled: false,
//   outlineMode: 0,
//   red: 255,
//   green: 0,
//   blue: 0,
//   alpha: 255,
//   outlineRed: 0,
//   outlineGreen: 0,
//   outlineBlue: 0,
//   outlineAlpha: 255,
//   gap: 0,
//   length: 5,
//   thickness: 1,
//   dynamicSpreadLimit: 181,
//   splitDistance: 3,
//   innerSplitAlpha: 1,
//   outerSplitAlpha: 0.35,
//   splitSizeRatio: 0,
//   screenHeight: 768,
//   scopeDotScale: 1,
//   scopeDotUseCrosshairColor: false
// }
```

### Encoding

Encodes a `Crosshair` object into a crosshair share code, the produced code matches the `format` property.

```ts
import { encodeCrosshair, CrosshairV1 } from 'csgo-sharecode';

const crosshair: CrosshairV1 = {
  format: 'cs2-v1',
  style: 2,
  followRecoil: false,
  centerDotEnabled: true,
  tStyleEnabled: false,
  outlineMode: 0,
  red: 255,
  green: 0,
  blue: 0,
  alpha: 255,
  outlineRed: 0,
  outlineGreen: 0,
  outlineBlue: 0,
  outlineAlpha: 255,
  gap: 0,
  length: 5,
  thickness: 1,
  dynamicSpreadLimit: 181,
  splitDistance: 3,
  innerSplitAlpha: 1,
  outerSplitAlpha: 0.35,
  splitSizeRatio: 0,
  screenHeight: 768,
  scopeDotScale: 1,
  scopeDotUseCrosshairColor: false,
};

const shareCode = encodeCrosshair(crosshair);
console.log(shareCode);
// output:
//
// "CSvbPubOq37zTGqtsPTP5QTrp5CB4xFXiKRLfzJsm49ZRe"
```

### Generating ConVars

Utility function to generate the ConVars for a given crosshair. ConVar names depend on the crosshair format.

```ts
import { crosshairToConVars } from 'csgo-sharecode';

const crosshair: CrosshairV1 = {
  format: 'cs2-v1',
  style: 2,
  followRecoil: false,
  centerDotEnabled: true,
  tStyleEnabled: false,
  outlineMode: 0,
  red: 255,
  green: 0,
  blue: 0,
  alpha: 255,
  outlineRed: 0,
  outlineGreen: 0,
  outlineBlue: 0,
  outlineAlpha: 255,
  gap: 0,
  length: 5,
  thickness: 1,
  dynamicSpreadLimit: 181,
  splitDistance: 3,
  innerSplitAlpha: 1,
  outerSplitAlpha: 0.35,
  splitSizeRatio: 0,
  screenHeight: 768,
  scopeDotScale: 1,
  scopeDotUseCrosshairColor: false,
};
const conVars = crosshairToConVars(crosshair);
console.log(conVars);
// Output:
//
// cl_crosshair_drawoutline "0"
// cl_crosshair_dynamic_maxdist_splitratio "0"
// cl_crosshair_dynamic_splitalpha_innermod "1"
// cl_crosshair_dynamic_splitalpha_outermod "0.35"
// cl_crosshair_dynamic_splitdist "3"
// cl_crosshair_dynamic_spread_limit "181"
// cl_crosshair_gap "0"
// cl_crosshair_length "5"
// cl_crosshair_recoil "0"
// cl_crosshair_screen_height "768"
// cl_crosshair_t "0"
// cl_crosshair_thickness "1"
// cl_crosshaircolor_a "255"
// cl_crosshaircolor_b "0"
// cl_crosshaircolor_g "0"
// cl_crosshaircolor_r "255"
// cl_crosshairdot "1"
// cl_crosshairoutline_a "255"
// cl_crosshairoutline_b "0"
// cl_crosshairoutline_g "0"
// cl_crosshairoutline_r "0"
// cl_crosshairstyle "2"
// cl_ironsight_dot_scale "1"
// cl_ironsight_usecrosshaircolor "0"
```

# License

[MIT](https://github.com/akiver/csgo-sharecode/blob/main/LICENSE)
