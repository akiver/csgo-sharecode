const DICTIONARY = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefhijkmnopqrstuvwxyz23456789';
const DICTIONARY_LENGTH = BigInt(DICTIONARY.length);
const SHARECODE_PATTERN = /CSGO(-?[\w]{5}){5}$/;

export interface ShareCode {
  matchId: bigint;
  reservationId: bigint;
  tvPort: number;
}

function bytesToHex(bytes: number[]): string {
  return Array.from(bytes, (byte) => {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
}

function bytesToBigInt(bytes: number[]): bigint {
  const hex = bytesToHex(bytes);

  return BigInt(`0x${hex}`);
}

function stringToByteArray(str: string): number[] {
  const bytes: number[] = [];

  for (let i = 0; i < str.length; i += 2) {
    bytes.push(parseInt(str.slice(i, i + 2), 16));
  }

  return bytes;
}

/**
 * Convert an int into a byte array (low bits only)
 */
function int16ToBytes(number: number): number[] {
  return [(number & 0x0000ff00) >> 8, number & 0x000000ff];
}

/**
 * Encode a share code from its ShareCode object and return its string representation.
 * Required fields should come from a CDataGCCStrike15_v2_MatchInfo protobuf message.
 * https://github.com/SteamDatabase/Protobufs/blob/master/csgo/cstrike15_gcmessages.proto (lookup for `CDataGCCStrike15_v2_MatchInfo`).
 */
const encode = ({ matchId, reservationId, tvPort }: ShareCode): string => {
  const matchBytes = stringToByteArray(matchId.toString(16)).reverse();
  const reservationBytes = stringToByteArray(reservationId.toString(16)).reverse();
  const tvBytes = int16ToBytes(tvPort).reverse();
  const bytes = Array.prototype.concat(matchBytes, reservationBytes, tvBytes);
  const hex = bytesToHex(bytes);

  let total = BigInt(`0x${hex}`);
  let c = '';
  let rem = BigInt(0);
  for (let i = 0; i < 25; i++) {
    rem = total % DICTIONARY_LENGTH;
    c += DICTIONARY[Number(rem)];
    total = total / DICTIONARY_LENGTH;
  }

  return `CSGO-${c.substr(0, 5)}-${c.substr(5, 5)}-${c.substr(10, 5)}-${c.substr(15, 5)}-${c.substr(20, 5)}`;
};

/**
 * Decode a CSGO share code from its string and return it as a ShareCode object type.
 * Share code format excepted: CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx
 */
const decode = (shareCode: string): ShareCode => {
  if (!shareCode.match(SHARECODE_PATTERN)) {
    throw new Error('Invalid share code');
  }

  shareCode = shareCode.replace(/CSGO|-/g, '');
  const chars = Array.from(shareCode).reverse();
  let big = BigInt(0);
  for (let i = 0; i < chars.length; i++) {
    big = big * DICTIONARY_LENGTH + BigInt(DICTIONARY.indexOf(chars[i]));
  }

  const str = big.toString(16).padStart(36, '0');
  const bytes = stringToByteArray(str);

  return {
    matchId: bytesToBigInt(bytes.slice(0, 8).reverse()),
    reservationId: bytesToBigInt(bytes.slice(8, 16).reverse()),
    tvPort: Number(bytesToBigInt(bytes.slice(16, 18).reverse())),
  };
};

export { encode, decode };
