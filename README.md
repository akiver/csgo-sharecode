# csgo-sharecode

Node module to decode / encode the CSGO share codes used to share game replays between players.

# Installation

`npm i csgo-sharecode` or `yarn add csgo-sharecode`

**Since the version 2, this module relies on native [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) which is available since Node 10.8.0. For Node < 10.8.0, please use the version 1.**

# Usage

## Decode

Decode a share code from its string to an object.

```js
const { decode } = require('csgo-sharecode');

const shareCode = 'CSGO-GADqf-jjyJ8-cSP2r-smZRo-TO2xK';
const info = decode(shareCode);
console.log(info);
// output:
// {
//    matchId: 3230642215713767580n,
//    reservationId: 3230647599455273103n,
//    tvPort: 55788
// }
```

## Encode

Encode a [CDataGCCStrike15_v2_MatchInfo](https://github.com/SteamDatabase/Protobufs/blob/master/csgo/cstrike15_gcmessages.proto) (lookup for `CDataGCCStrike15_v2_MatchInfo`) message into a share code (string).  
The object `match` used in the example below use values coming from a real _CDataGCCStrike15_v2_MatchInfo_ message.  
You should get it from the _Steam Game Coordinator_ or from a _.info_ file.

```js
const { encode } = require('csgo-sharecode');

const match = {
  matchId: BigInt('3230642215713767580'),
  reservationId: BigInt('3230647599455273103'),
  tvPort: 599906796,
};

const shareCode = encode(match.matchId, match.reservationId, match.tvPort);
console.log(shareCode);
// output: "CSGO-GADqf-jjyJ8-cSP2r-smZRo-TO2xK"
```

# License

[GPL v2](https://github.com/akiver/csgo-sharecode/blob/master/LICENSE)
