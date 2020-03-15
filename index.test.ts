import { decode, encode } from '.'

const samples = [
  {
    string: 'CSGO-L9spZ-ihuov-cyhtE-kxbqa-FkBAA',
    value: {
      matchId: { low: 512, high: 791708164 },
      reservationId: { low: 387, high: 791709731 },
      tvPort: 9725,
    },
  },
  {
    string: 'CSGO-GADqf-jjyJ8-cSP2r-smZRo-TO2xK',
    value: {
      matchId: { low: -2147483492, high: 752192506 },
      reservationId: { low: 143, high: 752193760 },
      tvPort: 55788,
    },
  },
  {
    string: 'CSGO-bPQEz-PrYTq-u5w8E-ZbUy7-ZeQ3A',
    value: {
      matchId: { low: 526, high: 774257071 },
      reservationId: { low: -2147483132, high: 774257428 },
      tvPort: 240,
    },
  },
  {
    string: 'CSGO-wBrm6-7fkM6-AzBC5-u6GmR-iHLHA',
    value: {
      matchId: { low: -2147483646, high: 768860983 },
      reservationId: { low: 370, high: 768863030 },
      tvPort: 3085,
    },
  },
  {
    string: 'CSGO-TKDTJ-YrAXs-sDNfL-HOuKO-i84VH',
    value: {
      matchId: { low: -2147483275, high: 792148141 },
      reservationId: { low: 557, high: 792148244 },
      tvPort: 61630,
    },
  },
  {
    string: 'CSGO-p4X9o-3Mfut-tpe5y-J8K6f-mj5ZJ',
    value: {
      matchId: { low: -2147483258, high: 792147941 },
      reservationId: { low: -2147483028, high: 792148544 },
      tvPort: 14119,
    },
  },
]

it('should decode', () => {
  samples.forEach(({ string, value }) => {
    expect(decode(string)).toEqual(value)
  })
})

it('should encode', () => {
  samples.forEach(({ string, value }) => {
    expect(encode(value.matchId, value.reservationId, value.tvPort)).toEqual(
      string
    )
  })
})
