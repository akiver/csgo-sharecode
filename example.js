// const ShareCode = require('csgo-sharecode');
// OR using ES modules
// import ShareCode from 'csgo-sharecode';
// import { encode, decode } from 'csgo-sharecode';
// When using TS you can import the ShareCode (object representation of a full share code) and TwoComplementInteger64 types
// import { ShareCode, TwoComplementInteger64 } from 'csgo-sharecode';
const ShareCode = require('./dist');

// sample example:
// share code: CSGO-GADqf-jjyJ8-cSP2r-smZRo-TO2xK
// matchId: high: 752192506 low: -2147483492 unsigned: true
// reservationId: high: 752193760 low: 143 unsigned: true
// tvPort: 599906796

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

console.log('encoding share code:\n', match);
const code = ShareCode.encode(match.matchId, match.reservationId, match.tvPort);
console.log('result:\n', code);

const shareCode = 'CSGO-GADqf-jjyJ8-cSP2r-smZRo-TO2xK';
console.log('decoding share code:\n', shareCode);
const info = ShareCode.decode(shareCode);
console.log('result:\n', info);
