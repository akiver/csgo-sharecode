import { bytesToBigInt, bytesToShareCode, int16ToBytes, shareCodeToBytes, stringToBytes } from './share-code.js';

export interface MatchInformation {
  matchId: bigint;
  reservationId: bigint;
  tvPort: number;
}

/**
 * Match fields should come from a CDataGCCStrike15_v2_MatchInfo protobuf message.
 * https://github.com/SteamTracking/GameTracking-CS2/blob/master/Protobufs/cstrike15_gcmessages.proto (lookup for `CDataGCCStrike15_v2_MatchInfo`).
 */
export function encodeMatch({ matchId, reservationId, tvPort }: MatchInformation): string {
  const matchBytes = stringToBytes(matchId.toString(16)).reverse();
  const reservationBytes = stringToBytes(reservationId.toString(16)).reverse();
  const tvBytes = int16ToBytes(tvPort).reverse();
  const bytes = [...matchBytes, ...reservationBytes, ...tvBytes];
  const shareCode = bytesToShareCode(bytes);

  return shareCode;
}

export function decodeMatchShareCode(shareCode: string): MatchInformation {
  const bytes = shareCodeToBytes(shareCode);

  return {
    matchId: bytesToBigInt(bytes.slice(0, 8).reverse()),
    reservationId: bytesToBigInt(bytes.slice(8, 16).reverse()),
    tvPort: Number(bytesToBigInt(bytes.slice(16, 18).reverse())),
  };
}
