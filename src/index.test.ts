import { describe, it, expect } from 'vitest';
import {
  InvalidShareCode,
  MatchInformation,
  decodeMatchShareCode,
  encodeMatch,
  InvalidCrosshairShareCode,
  CrosshairLegacyV1,
  CrosshairLegacyV3,
  CrosshairLegacyV4,
  CrosshairV1,
  decodeCrosshairShareCode,
  encodeCrosshair,
  crosshairToConVars,
} from '.';

const invalidShareCodes = [
  'CSGO-12345-12345-12345-12345-1234',
  'whateverCSGO-12345-12345-12345-12345-12345',
  'CSGO-12345-12345-12345-12345-12345whatever',
  // Characters outside the base 57 dictionary (0, 1, I, g, l and _ are excluded)
  'CSGO-12345-12345-12345-12345-12345',
  'CSGO-11111-22222-33333-44444-55555',
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
  const crosshairLegacyV1Samples: Array<{ shareCode: string; crosshair: CrosshairLegacyV1 }> = [
    {
      shareCode: 'CSGO-Cn37R-YE7vo-pLCAL-aURmZ-z6zkG',
      crosshair: {
        format: 'legacy-v1',
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
        format: 'legacy-v1',
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
        format: 'legacy-v1',
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
        format: 'legacy-v1',
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
        format: 'legacy-v1',
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
        format: 'legacy-v1',
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

  const crosshairLegacyV3Samples: Array<{ shareCode: string; crosshair: CrosshairLegacyV3 }> = [
    {
      shareCode: 'CSGO-MnUCC-89iG7-2cVar-wy7Yn-amCpF',
      crosshair: {
        format: 'legacy-v3',
        style: 6,
        followRecoil: false,
        outlineEnabled: true,
        centerDotEnabled: true,
        tStyleEnabled: false,
        red: 252,
        green: 15,
        blue: 192,
        alpha: 255,
        gap: 4,
        length: 8,
        thickness: 3,
        dynamicSpreadLimit: 255,
        splitDistance: 7,
        innerSplitAlpha: 1,
        outerSplitAlpha: 0.45,
        splitSizeRatio: 0.3,
        screenHeight: 1080,
      },
    },
    {
      shareCode: 'CSGO-tsJdC-2PFX6-fw8qD-6GDaX-rYCUM',
      crosshair: {
        format: 'legacy-v3',
        style: 4,
        followRecoil: false,
        outlineEnabled: false,
        centerDotEnabled: true,
        tStyleEnabled: false,
        red: 0,
        green: 40,
        blue: 255,
        alpha: 255,
        gap: 0,
        length: 0,
        thickness: 3,
        dynamicSpreadLimit: 181,
        splitDistance: 4,
        innerSplitAlpha: 1,
        outerSplitAlpha: 0.3,
        splitSizeRatio: 0,
        screenHeight: 768,
      },
    },
    {
      shareCode: 'CSGO-vcmKL-TWb8f-ddSDD-qM2Xx-T66VH',
      crosshair: {
        format: 'legacy-v3',
        style: 4,
        followRecoil: true,
        outlineEnabled: true,
        centerDotEnabled: true,
        tStyleEnabled: false,
        red: 172,
        green: 14,
        blue: 61,
        alpha: 255,
        gap: 0,
        length: 4,
        thickness: 5,
        dynamicSpreadLimit: 255,
        splitDistance: 3,
        innerSplitAlpha: 0,
        outerSplitAlpha: 1,
        splitSizeRatio: 1,
        screenHeight: 1080,
      },
    },
    {
      shareCode: 'CSGO-cA4U9-hiJwT-Wo9NA-YmTS8-WfH4C',
      crosshair: {
        format: 'legacy-v3',
        style: 6,
        followRecoil: false,
        outlineEnabled: true,
        centerDotEnabled: false,
        tStyleEnabled: false,
        red: 0,
        green: 255,
        blue: 14,
        alpha: 255,
        gap: 2,
        length: 2,
        thickness: 2,
        dynamicSpreadLimit: 227,
        splitDistance: 6,
        innerSplitAlpha: 1,
        outerSplitAlpha: 0.4,
        splitSizeRatio: 0.3,
        screenHeight: 960,
      },
    },
    {
      shareCode: 'CSGO-p4NqQ-mV2es-p2UF3-Q9HWe-fVmoE',
      crosshair: {
        format: 'legacy-v3',
        style: 3,
        followRecoil: false,
        outlineEnabled: true,
        centerDotEnabled: false,
        tStyleEnabled: false,
        red: 0,
        green: 255,
        blue: 0,
        alpha: 255,
        gap: 4,
        length: 8,
        thickness: 1,
        dynamicSpreadLimit: 255,
        splitDistance: 7,
        innerSplitAlpha: 1,
        outerSplitAlpha: 0.45,
        splitSizeRatio: 0.3,
        screenHeight: 1080,
      },
    },
    {
      shareCode: 'CSGO-hLbCn-69VT6-Bok83-9MOqW-SWzwQ',
      crosshair: {
        format: 'legacy-v3',
        style: 4,
        followRecoil: false,
        outlineEnabled: false,
        centerDotEnabled: false,
        tStyleEnabled: false,
        red: 50,
        green: 250,
        blue: 50,
        alpha: 255,
        gap: 4,
        length: 8,
        thickness: 2,
        dynamicSpreadLimit: 255,
        splitDistance: 7,
        innerSplitAlpha: 1,
        outerSplitAlpha: 0.4,
        splitSizeRatio: 0.3,
        screenHeight: 1080,
      },
    },
  ];

  const crosshairLegacyV4Samples: Array<{ shareCode: string; crosshair: CrosshairLegacyV4 }> = [
    {
      shareCode: 'CSGO-G8oAC-RyvWc-Hi3CZ-voSwn-QJbfE',
      crosshair: {
        format: 'legacy-v4',
        style: 8,
        followRecoil: false,
        outlineMode: 1,
        centerDotEnabled: true,
        tStyleEnabled: false,
        red: 124,
        green: 57,
        blue: 57,
        alpha: 255,
        gap: 25,
        length: 7,
        thickness: 20,
        dynamicSpreadLimit: 181,
        splitDistance: 3,
        innerSplitAlpha: 1,
        outerSplitAlpha: 0.35,
        splitSizeRatio: 0,
        screenHeight: 768,
      },
    },
    {
      shareCode: 'CSGO-sP6xU-TSyN9-sZcO5-2D48M-UppkP',
      crosshair: {
        format: 'legacy-v4',
        style: 2,
        followRecoil: true,
        centerDotEnabled: true,
        tStyleEnabled: false,
        red: 255,
        green: 0,
        blue: 0,
        alpha: 255,
        gap: 0,
        length: 5,
        dynamicSpreadLimit: 255,
        splitDistance: 3,
        innerSplitAlpha: 1,
        outerSplitAlpha: 0.3,
        splitSizeRatio: 0,
        thickness: 1,
        screenHeight: 768,
        outlineMode: 0,
      },
    },
  ];

  const crosshairV1Samples: Array<{ shareCode: string; crosshair: CrosshairV1 }> = [
    // Code generated by CS2 1.41.8.8, its values have been checked against the cl_* ConVars written by the game.
    {
      shareCode: 'CSvbPubOq37zTGqtsPTP5QTrp5CB4xFXiKRLfzJsm49ZRe',
      crosshair: {
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
      },
    },
    // Same crosshair as above with cl_ironsight_usecrosshaircolor enabled, generated by CS2 1.41.8.8.
    {
      shareCode: 'CSoYQNXCQtL5b44fPZKwPPZZCUpsywopyvJW3koh75uFih',
      crosshair: {
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
        scopeDotUseCrosshairColor: true,
      },
    },
    // Same crosshair as above with a scope dot scale of 0.55, CS2 1.41.8.8 reports that exact value
    // through the cl_ironsight_dot_scale ConVar once the code is imported.
    {
      shareCode: 'CSHt3ObzKS3ikGJLRBVrKjPUrhOCikyke53na8cJFtNZKa',
      crosshair: {
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
        scopeDotScale: 0.55,
        scopeDotUseCrosshairColor: true,
      },
    },
    // Not a code generated by CS2, it exercises the fields left untouched by the samples above.
    {
      shareCode: 'CS3LZnPmFiVjknQhyb79bfOK9OuhnUqKHtdA6i4WqyKJ8G',
      crosshair: {
        format: 'cs2-v1',
        style: 9,
        followRecoil: true,
        centerDotEnabled: false,
        tStyleEnabled: true,
        outlineMode: 2,
        red: 10,
        green: 20,
        blue: 30,
        alpha: 200,
        outlineRed: 40,
        outlineGreen: 50,
        outlineBlue: 60,
        outlineAlpha: 128,
        gap: -7,
        length: 255,
        thickness: 12,
        dynamicSpreadLimit: 64,
        splitDistance: 127,
        innerSplitAlpha: 0.29,
        outerSplitAlpha: 0.97,
        splitSizeRatio: 0.63,
        screenHeight: 1440,
        scopeDotScale: 2,
        scopeDotUseCrosshairColor: true,
      },
    },
  ];

  const crosshairSamples = [
    ...crosshairLegacyV1Samples,
    ...crosshairLegacyV3Samples,
    ...crosshairLegacyV4Samples,
    ...crosshairV1Samples,
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
      // Valid checksum but unknown version (2)
      'CSGO-eRqP8-AkrwM-3Wsqh-pKDTh-eAPtQ',
      // cs2 container code with a valid checksum but an unknown version byte (2)
      'CSuZhVyU8icUwjTjopBSVi6ctEbq5GiOXJBRdC6LNLKaFL',
      // cs2 container code with an invalid checksum
      'CSkSCHQKunGr2yPsJr2U3RTd8ycMA2pEs9jWnxK5KjMmWL',
    ];

    invalidCrosshairCodes.forEach((shareCode) => {
      expect(() => {
        decodeCrosshairShareCode(shareCode);
      }).toThrow(new InvalidCrosshairShareCode());
    });
  });
});
