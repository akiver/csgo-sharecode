import BigNumber from 'bignumber.js'

const DICTIONARY = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789'
const DICTIONARY_LENGTH = DICTIONARY.length
const SHARECODE_PATTERN = /CSGO(-?[\w]{5}){5}$/

export interface TwoComplementInteger64 {
  low: number
  high: number
  unsigned?: boolean
}

export interface Sharecode {
  matchId: TwoComplementInteger64
  reservationId: TwoComplementInteger64
  tvPort: number
}

/**
 * Convert a byte array into a hexadecimal string
 */
function bytesToHex(bytes: number[]) {
  return Array.from(bytes, byte => {
    return ('0' + (byte & 0xff).toString(16)).slice(-2)
  }).join('')
}

/**
 * Convert a BigNumber into a byte array.
 */
function bigNumberToByteArray(big: BigNumber) {
  const str = big.toString(16).padStart(36, '0')
  const bytes = []
  for (let i = 0; i < str.length; i += 2) {
    bytes.push(parseInt(str.slice(i, i + 2), 16))
  }

  return bytes
}

/**
 * Convert a 64 bit 2 complement integer into a byte array (big endian byte representation)
 */
function longToBytesBE(high: number, low: number) {
  return [
    (high >>> 24) & 0xff,
    (high >>> 16) & 0xff,
    (high >>> 8) & 0xff,
    high & 0xff,
    (low >>> 24) & 0xff,
    (low >>> 16) & 0xff,
    (low >>> 8) & 0xff,
    low & 0xff,
  ]
}

/**
 * Convert an int into a byte array (low bits only)
 */
function int16ToBytes(number: number) {
  return [(number & 0x0000ff00) >> 8, number & 0x000000ff]
}

/**
 * Convert a byte array into an int32
 */
function bytesToInt32(bytes: number[]) {
  let number = 0
  for (let i = 0; i < bytes.length; i++) {
    number += bytes[i]
    if (i < bytes.length - 1) {
      number = number << 8
    }
  }

  return number
}

/**
 * Encode a share code from its ShareCode object type and return its string representation.
 * Required fields should come from a CDataGCCStrike15_v2_MatchInfo protobuf message.
 * https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/csgo/cstrike15_gcmessages.proto#L785
 */
const encode = (
  matchId: TwoComplementInteger64,
  reservationId: TwoComplementInteger64,
  tvPort: number
): string => {
  const matchBytes = longToBytesBE(matchId.high, matchId.low).reverse()
  const reservationBytes = longToBytesBE(
    reservationId.high,
    reservationId.low
  ).reverse()
  const tvBytes = int16ToBytes(tvPort).reverse()
  const bytes = Array.prototype.concat(matchBytes, reservationBytes, tvBytes)
  const bytesHex = bytesToHex(bytes)
  let total = new BigNumber(bytesHex, 16)

  let c = ''
  let rem: BigNumber = new BigNumber(0)
  for (let i = 0; i < 25; i++) {
    rem = total.mod(DICTIONARY_LENGTH)
    c += DICTIONARY[rem.integerValue(BigNumber.ROUND_FLOOR).toNumber()]
    total = total.div(DICTIONARY_LENGTH)
  }

  return `CSGO-${c.substr(0, 5)}-${c.substr(5, 5)}-${c.substr(
    10,
    5
  )}-${c.substr(15, 5)}-${c.substr(20, 5)}`
}

/**
 * Decode a CSGO share code from its string and return it as a ShareCode object type.
 * Share code format excepted: CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx
 */
const decode = (shareCode: string): Sharecode => {
  if (!shareCode.match(SHARECODE_PATTERN)) {
    throw new Error('Invalid share code')
  }

  shareCode = shareCode.replace(/CSGO|-/g, '')
  const chars = Array.from(shareCode).reverse()
  let big = new BigNumber(0)
  for (let i = 0; i < chars.length; i++) {
    big = big.multipliedBy(DICTIONARY_LENGTH).plus(DICTIONARY.indexOf(chars[i]))
  }

  const bytes = bigNumberToByteArray(big)

  return {
    matchId: {
      low: bytesToInt32(bytes.slice(0, 4).reverse()),
      high: bytesToInt32(bytes.slice(4, 8).reverse()),
    },
    reservationId: {
      low: bytesToInt32(bytes.slice(8, 12).reverse()),
      high: bytesToInt32(bytes.slice(12, 16).reverse()),
    },
    tvPort: bytesToInt32(bytes.slice(16, 18).reverse()),
  }
}

export { encode, decode }
