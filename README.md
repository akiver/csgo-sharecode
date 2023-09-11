# csgo-sharecode

JS module to decode / encode CS:GO and CS2 share codes used to share game replays/crosshairs between players.

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

const shareCode = 'CSGO-WsnnD-eHaMw-QNDf9-oxuDh-ydOUD';
const crosshair: Crosshair = decodeCrosshairShareCode(shareCode);
console.log(crosshair);
// output:
//
// {
//   gap: -2.2,
//   outline: 1,
//   red: 50,
//   green: 250,
//   blue: 50,
//   alpha: 200,
//   splitDistance: 3,
//   followRecoil: true,
//   fixedCrosshairGap: 3,
//   color: 1,
//   outlineEnabled: true,
//   innerSplitAlpha: 0,
//   outerSplitAlpha: 1,
//   splitSizeRatio: 1,
//   thickness: 0.6,
//   centerDotEnabled: false,
//   deployedWeaponGapEnabled: true,
//   alphaEnabled: true,
//   tStyleEnabled: false,
//   style: 2,
//   length: 10
// }
```

### Encoding

Encodes a `Crosshair` object into a crosshair share code.

```ts
import { encodeCrosshair, Crosshair } from 'csgo-sharecode';

const crosshair: Crosshair = {
  gap: -2.2,
  outline: 1,
  red: 50,
  green: 250,
  blue: 50,
  alpha: 200,
  splitDistance: 3,
  fixedCrosshairGap: 3,
  color: 1,
  innerSplitAlpha: 0,
  outlineEnabled: true,
  outerSplitAlpha: 1,
  splitSizeRatio: 1,
  thickness: 0.6,
  centerDotEnabled: false,
  alphaEnabled: true,
  tStyleEnabled: false,
  style: 2,
  length: 10,
  deployedWeaponGapEnabled: true,
  followRecoil: true,
};

const shareCode = encodeCrosshair(crosshair);
console.log(shareCode);
// output:
//
// "CSGO-WsnnD-eHaMw-QNDf9-oxuDh-ydOUD"
```

### Generating CSGO ConVars

Utility function to generate CSGO ConVars for a given crosshair.

```ts
import { crosshairToConVars, Crosshair } from 'csgo-sharecode';

const crosshair: Crosshair = {
  gap: -2.2,
  outline: 1,
  red: 50,
  green: 250,
  blue: 50,
  alpha: 200,
  splitDistance: 3,
  fixedCrosshairGap: 3,
  color: 1,
  innerSplitAlpha: 0,
  outlineEnabled: true,
  outerSplitAlpha: 1,
  splitSizeRatio: 1,
  thickness: 0.6,
  centerDotEnabled: false,
  alphaEnabled: true,
  tStyleEnabled: false,
  style: 2,
  length: 10,
  deployedWeaponGapEnabled: true,
  followRecoil: true,
};

const conVars = crosshairToConVars(crosshair);
console.log(conVars);
// Output:
//
// cl_crosshair_drawoutline "1"
// cl_crosshair_dynamic_maxdist_splitratio "1"
// cl_crosshair_dynamic_splitalpha_innermod "0"
// cl_crosshair_dynamic_splitalpha_outermod "1"
// cl_crosshair_dynamic_splitdist "3"
// cl_crosshair_outlinethickness "1"
// cl_crosshair_t "0"
// cl_crosshairalpha "200"
// cl_crosshaircolor "1"
// cl_crosshaircolor_b "50"
// cl_crosshaircolor_g "250"
// cl_crosshaircolor_r "50"
// cl_crosshairdot "0"
// cl_crosshairgap "-2.2"
// cl_crosshairgap_useweaponvalue "1"
// cl_crosshairsize "10"
// cl_crosshairstyle "2"
// cl_crosshairthickness "0.6"
// cl_crosshairusealpha "1"
// cl_fixedcrosshairgap "3"
// cl_crosshair_recoil "1"
```

# License

[GPL v2](https://github.com/akiver/csgo-sharecode/blob/master/LICENSE)
