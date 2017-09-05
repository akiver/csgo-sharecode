# csgo-sharecode

Node module to decode / encode the CSGO share codes used to share game replays between players.

# Installation

`npm install csgo-sharecode`

# Usage

## Decode

Decode a share code from its string to an object.

```
const ShareCode = require('csgo-sharecode');

const shareCode = 'CSGO-GADqf-jjyJ8-cSP2r-smZRo-TO2xK';
const info = ShareCode.decode(shareCode);
console.log(info);
// output:
// {
//    matchId: { low: -2147483492, high: 752192506 },
//    reservationId: { low: 143, high: 752193760 },
//    tvPort: 55788
// }
```

## Encode

Encode a [CDataGCCStrike15_v2_MatchInfo](https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/csgo/cstrike15_gcmessages.proto#L773) message into a share code (string).  
The object `match` used in the example below use values coming from a real *CDataGCCStrike15_v2_MatchInfo* message.  
You should get it from the *Steam Game Coordinator* or from a *.info* file.

```
const ShareCode = require('csgo-sharecode');

const match = {
  matchId: {
    high: 752192506,
    low: -2147483492,
  },
  reservationId: {
    high: 752193760,
    low: 143,
  },
  tvPort: 599906796,
};

const code = ShareCode.encode(match.matchId, match.reservationId, match.tvPort);
console.log(code); // output: "CSGO-GADqf-jjyJ8-cSP2r-smZRo-TO2xK"
```

# License

[GPL v2](https://github.com/akiver/csgo-sharecode/blob/master/LICENSE)
