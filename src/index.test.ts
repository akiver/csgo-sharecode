import { describe, it, expect } from 'vitest';
import {
  InvalidShareCode,
  MatchInformation,
  decodeMatchShareCode,
  encodeMatch,
  InvalidCrosshairShareCode,
  Crosshair,
  decodeCrosshairShareCode,
  encodeCrosshair,
  crosshairToConVars,
} from '.';

const invalidShareCodes = [
  'CSGO-12345-12345-12345-12345-1234',
  'whateverCSGO-12345-12345-12345-12345-12345',
  'CSGO-12345-12345-12345-12345-12345whatever',
];

describe('Match share code', () => {
  const matchSamples: Array<{ shareCode: string; matchInformation: MatchInformation }> = [
    {
      shareCode: 'CSGO-L9spZ-ihuov-cyhtE-kxbqa-FkBAA',
      matchInformation: {
        matchId: BigInt('3400360672356205056'),
        reservationId: BigInt('3400367402569957763'),
        tvPort: 9725,
      },
    },
    {
      shareCode: 'CSGO-GADqf-jjyJ8-cSP2r-smZRo-TO2xK',
      matchInformation: {
        matchId: BigInt('3230642215713767580'),
        reservationId: BigInt('3230647599455273103'),
        tvPort: 55788,
      },
    },
    {
      shareCode: 'CSGO-bPQEz-PrYTq-u5w8E-ZbUy7-ZeQ3A',
      matchInformation: {
        matchId: BigInt('3325408798641750542'),
        reservationId: BigInt('3325410334092558852'),
        tvPort: 240,
      },
    },
    {
      shareCode: 'CSGO-wBrm6-7fkM6-AzBC5-u6GmR-iHLHA',
      matchInformation: {
        matchId: BigInt('3302232779302895618'),
        reservationId: BigInt('3302241568953467250'),
        tvPort: 3085,
      },
    },
    {
      shareCode: 'CSGO-TKDTJ-YrAXs-sDNfL-HOuKO-i84VH',
      matchInformation: {
        matchId: BigInt('3402250361329680757'),
        reservationId: BigInt('3402250801563828781'),
        tvPort: 61630,
      },
    },
    {
      shareCode: 'CSGO-p4X9o-3Mfut-tpe5y-J8K6f-mj5ZJ',
      matchInformation: {
        matchId: BigInt('3402249502336221574'),
        reservationId: BigInt('3402252092201501292'),
        tvPort: 14119,
      },
    },
  ];

  it('should decode', () => {
    matchSamples.forEach(({ shareCode, matchInformation }) => {
      expect(decodeMatchShareCode(shareCode)).toEqual(matchInformation);
    });
  });

  it('should encode', () => {
    matchSamples.forEach(({ shareCode, matchInformation }) => {
      expect(encodeMatch(matchInformation)).toEqual(shareCode);
    });
  });

  it('should throw an error if the share code is invalid', () => {
    invalidShareCodes.forEach((shareCode) => {
      expect(() => {
        decodeMatchShareCode(shareCode);
      }).toThrow(new InvalidShareCode());
    });
  });
});

describe('Crosshair share code', () => {
  const crosshairSamples: Array<{ shareCode: string; crosshair: Crosshair }> = [
    {
      shareCode: 'CSGO-Cn37R-YE7vo-pLCAL-aURmZ-z6zkG',
      crosshair: {
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
        followRecoil: false,
      },
    },
    {
      shareCode: 'CSGO-LibdP-VCVEd-ESayK-rSivi-2UBtG',
      crosshair: {
        gap: 1,
        outline: 1,
        red: 50,
        green: 250,
        blue: 50,
        alpha: 200,
        splitDistance: 7,
        fixedCrosshairGap: 3,
        color: 1,
        innerSplitAlpha: 1,
        outlineEnabled: false,
        outerSplitAlpha: 0.5,
        splitSizeRatio: 0.3,
        thickness: 0.5,
        centerDotEnabled: false,
        alphaEnabled: false,
        tStyleEnabled: false,
        style: 3,
        length: 5,
        deployedWeaponGapEnabled: false,
        followRecoil: false,
      },
    },
    {
      shareCode: 'CSGO-9JzcN-4dZtA-DdXis-8qz5T-rCnkP',
      crosshair: {
        gap: 1,
        outline: 1,
        red: 50,
        green: 250,
        blue: 50,
        alpha: 200,
        splitDistance: 7,
        fixedCrosshairGap: 4.3,
        color: 5,
        innerSplitAlpha: 1,
        outlineEnabled: false,
        outerSplitAlpha: 0.5,
        splitSizeRatio: 0.3,
        thickness: 0.5,
        centerDotEnabled: true,
        alphaEnabled: true,
        tStyleEnabled: false,
        style: 1,
        length: 5,
        deployedWeaponGapEnabled: true,
        followRecoil: false,
      },
    },
    {
      shareCode: 'CSGO-fCUBz-CBHss-a74RP-SEdO8-mvZpG',
      crosshair: {
        gap: 1,
        outline: 1,
        red: 50,
        green: 250,
        blue: 50,
        alpha: 200,
        splitDistance: 7,
        fixedCrosshairGap: 4.3,
        color: 5,
        innerSplitAlpha: 1,
        outlineEnabled: false,
        outerSplitAlpha: 0.5,
        splitSizeRatio: 0.3,
        thickness: 0.5,
        centerDotEnabled: true,
        alphaEnabled: true,
        tStyleEnabled: false,
        style: 2,
        length: 5,
        deployedWeaponGapEnabled: true,
        followRecoil: true,
      },
    },
    {
      shareCode: 'CSGO-WsnnD-eHaMw-QNDf9-oxuDh-ydOUD',
      crosshair: {
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
      },
    },
    {
      shareCode: 'CSGO-ZrEjo-yASEP-OAdce-Sf44w-rhK5O',
      crosshair: {
        gap: -1.2,
        outline: 1,
        red: 232,
        green: 88,
        blue: 227,
        alpha: 136,
        splitDistance: 7,
        fixedCrosshairGap: 3,
        color: 5,
        innerSplitAlpha: 0.5,
        outlineEnabled: false,
        outerSplitAlpha: 0.6,
        splitSizeRatio: 0.5,
        thickness: 1.5,
        centerDotEnabled: true,
        alphaEnabled: false,
        tStyleEnabled: true,
        style: 2,
        length: 7.2,
        deployedWeaponGapEnabled: false,
        followRecoil: true,
      },
    },
  ];

  it('should decode', () => {
    crosshairSamples.forEach(({ shareCode, crosshair }) => {
      expect(decodeCrosshairShareCode(shareCode)).toEqual(crosshair);
    });
  });

  it('should encode', () => {
    crosshairSamples.forEach(({ shareCode, crosshair }) => {
      expect(encodeCrosshair(crosshair)).toEqual(shareCode);
    });
  });

  it('should generate ConVars from crosshair', () => {
    crosshairSamples.forEach(({ crosshair }) => {
      expect(crosshairToConVars(crosshair)).toMatchSnapshot();
    });
  });

  it('should throw an error if the share code is invalid', () => {
    invalidShareCodes.forEach((shareCode) => {
      expect(() => {
        decodeCrosshairShareCode(shareCode);
      }).toThrow(new InvalidShareCode());
    });
  });

  it('should throw an error if the crosshair share code is invalid', () => {
    const invalidCrosshairCodes = [
      'CSGO-L9spZ-ihuov-cyhtE-kxbqa-FkBAA',
      'CSGO-12345-12345-12345-12345-12345',
      'CSGO-11111-22222-33333-44444-55555',
    ];

    invalidCrosshairCodes.forEach((shareCode) => {
      expect(() => {
        decodeCrosshairShareCode(shareCode);
      }).toThrow(new InvalidCrosshairShareCode());
    });
  });
});
