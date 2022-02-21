# csgo-sharecode

JS module to decode / encode CSGO share codes used to share game replays/crosshairs between players.

# Installation

`npm install csgo-sharecode`

**This module relies on [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt), your target platform must support it!**

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

### Decoding

Decodes a crosshair share code into a `Crosshair` object.

```ts
import { decodeCrosshairShareCode, Crosshair } from 'csgo-sharecode';

const shareCode = 'CSGO-Cn37R-YE7vo-pLCAL-aURmZ-z6zkG';
const crosshair: Crosshair = decodeCrosshairShareCode(shareCode);
console.log(crosshair);
// output:
//
// {
//   gap: -1.3,
//   outline: 2,
//   red: 175,
//   green: 81,
//   blue: 213,
//   alpha: 137,
//   splitDistance: 6,
//   fixedCrosshairGap: 3,
//   color: 5,
//   outlineEnabled: true,
//   innerSplitAlpha: 0.6,
//   outerSplitAlpha: 0.4,
//   splitSizeRatio: 0.5,
//   thickness: 1.2,
//   centerDotEnabled: true,
//   deployedWeaponGapEnabled: true,
//   alphaEnabled: true,
//   tStyleEnabled: true,
//   style: 2,
//   length: 4.6
// }
```

### Encoding

Encodes a `Crosshair` object into a crosshair share code.

```ts
import { encodeCrosshair, Crosshair } from 'csgo-sharecode';

const crosshair: Crosshair = {
  gap: -1.3,
  outline: 2,
  red: 175,
  green: 81,
  blue: 213,
  alpha: 137,
  splitDistance: 6,
  fixedCrosshairGap: 3,
  color: 5,
  innerSplitAlpha: 0.6,
  outlineEnabled: true,
  outerSplitAlpha: 0.4,
  splitSizeRatio: 0.5,
  thickness: 1.2,
  centerDotEnabled: true,
  alphaEnabled: true,
  tStyleEnabled: true,
  style: 2,
  length: 4.6,
  deployedWeaponGapEnabled: true,
};

const shareCode = encodeCrosshair(crosshair);
console.log(shareCode);
// output:
//
// "CSGO-Cn37R-YE7vo-pLCAL-aURmZ-z6zkG"
```

### Generating CSGO ConVars

Utility function to generate CSGO ConVars for a given crosshair.

```ts
import { crosshairToConVars, Crosshair } from 'csgo-sharecode';

const crosshair: Crosshair = {
  gap: -1.3,
  outline: 2,
  red: 175,
  green: 81,
  blue: 213,
  alpha: 137,
  splitDistance: 6,
  fixedCrosshairGap: 3,
  color: 5,
  innerSplitAlpha: 0.6,
  outlineEnabled: true,
  outerSplitAlpha: 0.4,
  splitSizeRatio: 0.5,
  thickness: 1.2,
  centerDotEnabled: true,
  alphaEnabled: true,
  tStyleEnabled: true,
  style: 2,
  length: 4.6,
  deployedWeaponGapEnabled: true,
};

const conVars = crosshairToConVars(crosshair);
console.log(conVars);
// Output:
//
// cl_crosshair_drawoutline "1"
// cl_crosshair_dynamic_maxdist_splitratio "0.5"
// cl_crosshair_dynamic_splitalpha_innermod "0.6"
// cl_crosshair_dynamic_splitalpha_outermod "0.4"
// cl_crosshair_dynamic_splitdist "6"
// cl_crosshair_outlinethickness "2"
// cl_crosshair_t "1"
// cl_crosshairalpha "137"
// cl_crosshaircolor "5"
// cl_crosshaircolor_b "213"
// cl_crosshaircolor_g "81"
// cl_crosshaircolor_r "175"
// cl_crosshairdot "1"
// cl_crosshairgap "-1.3"
// cl_crosshairgap_useweaponvalue "1"
// cl_crosshairsize "4.6"
// cl_crosshairstyle "2"
// cl_crosshairthickness "1.2"
// cl_crosshairusealpha "1"
// cl_fixedcrosshairgap "3"
```

# License

[GPL v2](https://github.com/akiver/csgo-sharecode/blob/master/LICENSE)
