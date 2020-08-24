// const { encode, decode } = require('csgo-sharecode');
// OR using ES modules
// import { encode, decode } from 'csgo-sharecode';
const { encode, decode } = require('./dist');

// sample example:
// share code: CSGO-GADqf-jjyJ8-cSP2r-smZRo-TO2xK
// matchId: 3230642215713767580
// reservationId: 3230647599455273103
// tvPort: 55788

const shareCodeObject = {
  matchId: BigInt('3230642215713767580'),
  reservationId: BigInt('3230647599455273103'),
  tvPort: 55788,
};

console.log('encoding share code:\n', shareCodeObject);
const code = encode(shareCodeObject);
console.log('result:\n', code);

const shareCode = 'CSGO-GADqf-jjyJ8-cSP2r-smZRo-TO2xK';
console.log('decoding share code:\n', shareCode);
const info = decode(shareCode);
console.log('result:\n', info);
