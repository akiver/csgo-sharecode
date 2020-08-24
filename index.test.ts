import { decode, encode } from '.';

const samples = [
  {
    string: 'CSGO-L9spZ-ihuov-cyhtE-kxbqa-FkBAA',
    value: {
      matchId: BigInt('3400360672356205056'),
      reservationId: BigInt('3400367402569957763'),
      tvPort: 9725,
    },
  },
  {
    string: 'CSGO-GADqf-jjyJ8-cSP2r-smZRo-TO2xK',
    value: {
      matchId: BigInt('3230642215713767580'),
      reservationId: BigInt('3230647599455273103'),
      tvPort: 55788,
    },
  },
  {
    string: 'CSGO-bPQEz-PrYTq-u5w8E-ZbUy7-ZeQ3A',
    value: {
      matchId: BigInt('3325408798641750542'),
      reservationId: BigInt('3325410334092558852'),
      tvPort: 240,
    },
  },
  {
    string: 'CSGO-wBrm6-7fkM6-AzBC5-u6GmR-iHLHA',
    value: {
      matchId: BigInt('3302232779302895618'),
      reservationId: BigInt('3302241568953467250'),
      tvPort: 3085,
    },
  },
  {
    string: 'CSGO-TKDTJ-YrAXs-sDNfL-HOuKO-i84VH',
    value: {
      matchId: BigInt('3402250361329680757'),
      reservationId: BigInt('3402250801563828781'),
      tvPort: 61630,
    },
  },
  {
    string: 'CSGO-p4X9o-3Mfut-tpe5y-J8K6f-mj5ZJ',
    value: {
      matchId: BigInt('3402249502336221574'),
      reservationId: BigInt('3402252092201501292'),
      tvPort: 14119,
    },
  },
];

it('should decode', () => {
  samples.forEach(({ string, value }) => {
    expect(decode(string)).toEqual(value);
  });
});

it('should encode', () => {
  samples.forEach(({ string, value }) => {
    expect(encode(value)).toEqual(string);
  });
});
