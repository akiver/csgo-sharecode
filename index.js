'use strict';

const BigNumber = require('bignumber.js');

const DICTIONARY = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789';
const DICTIONARY_LENGTH = DICTIONARY.length;
const SHARECODE_PATTERN = /CSGO(-?[\w]{5}){5}/;

/**
 * Convert a byte array into a hexadecimal string
 *
 * @param bytes
 * @returns {string}
 */
function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}

/**
 * Convert a hexadecimal string into a byte array
 *
 * @param str
 * @returns {Array}
 */
function hexToBytes(str) {
  let array = [];
  for (var i = 0, j = 0; i < str.length; i += 2, j++) {
    array[j] = parseInt('0x' + str.substr(i, 2));
  }

  return array;
}

/**
 * Convert a 64 bit 2 complement integer into a byte array (big endian byte representation)
 *
 * @param high
 * @param low
 * @returns Array
 */
function longToBytesBE(high, low) {
  return [
    (high >>> 24) & 0xff,
    (high >>> 16) & 0xff,
    (high >>> 8) & 0xff,
    (high & 0xff),
    (low >>> 24) & 0xff,
    (low >>> 16) & 0xff,
    (low >>> 8) & 0xff,
    (low & 0xff)
  ];
}

/**
 * Convert an int into a byte array (low bits only)
 *
 * @param number
 * @returns Array
 */
function int16ToBytes(number) {
  return [
    (number & 0x0000ff00) >> 8,
    (number & 0x000000ff)
  ];
}

/**
 * Convert a byte array into an int32
 *
 * @param bytes
 * @returns {number}
 */
function bytesToInt32(bytes) {
  let number = 0;
  for (let i = 0; i < bytes.length; i++) {
    number += bytes[i];
    if (i < bytes.length - 1) {
      number = number << 8;
    }
  }

  return number;
}

module.exports = {
  /**
   * Encode a share code from its object data and return its string representation.
   * Required fields should come from a CDataGCCStrike15_v2_MatchInfo protobuf message.
   * https://github.com/SteamRE/SteamKit/blob/master/Resources/Protobufs/csgo/cstrike15_gcmessages.proto#L773
   * @param matchId {Object|Long} match_id
   * @param reservationId {Object|Long} reservation_id
   * @param tvPort number tv_port
   * @return {string} Share code as string
   */
  encode: (matchId, reservationId, tvPort) => {
    const matchBytes = longToBytesBE(matchId.high, matchId.low).reverse();
    const reservationBytes = longToBytesBE(reservationId.high, reservationId.low).reverse();
    const tvBytes = int16ToBytes(tvPort).reverse();
    const bytes = Array.prototype.concat(matchBytes, reservationBytes, tvBytes);
    const bytesHex = bytesToHex(bytes);
    let total = new BigNumber(bytesHex, 16);

    let c = '';
    let rem = 0;
    for (let i = 0; i < 25; i++) {
      rem = total.mod(DICTIONARY_LENGTH);
      c += DICTIONARY[rem.floor()];
      total = total.div(DICTIONARY_LENGTH);
    }

    return `CSGO-${c.substr(0, 5)}-${c.substr(5, 5)}-${c.substr(10, 5)}-${c.substr(15, 5)}-${c.substr(20, 5)}`;
  },
  /**
   * Decode a CSGO share code from its string and return its object data representation.
   * Share code format excepted: CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx
   * @param shareCode Share code as string
   * @return {{matchId: {low: number, high: number}, reservationId: {low: number, high: number}, tvPort: number}}
   */
  decode: (shareCode) => {
    if (!shareCode.match(SHARECODE_PATTERN)) {
      throw new Error('Invalid share code');
    }

    shareCode = shareCode.replace(/CSGO|-/g, '');
    shareCode = Array.from(shareCode).reverse();
    let big = new BigNumber(0);
    for (let i = 0; i < shareCode.length; i++) {
      big = big.mul(DICTIONARY_LENGTH).add(DICTIONARY.indexOf(shareCode[i]));
    }

    const bytes = hexToBytes(big.toString(16));

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
    };
  }
};
