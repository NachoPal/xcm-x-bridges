import { AccountData, AccountId32, AccountInfo } from "@polkadot/types/interfaces";
import { KeyringPair } from "@polkadot/keyring/types";

type XcmMessage = TeleportData | TransactData

export interface Xcm {
  destination?: Object,
  message: XcmMessage,
  bridgeData: BridgeData
}
export interface BridgeData {
  relayChains: any,
  signer: any,
  fee: string,
  lane: string,
  call?: any
}
export type TeleportData = {
  type: "TeleportAsset",
  origin: string,
  beneficiary: string,
  amount: string,
  destWeight: string,
}
export type TransactData = {
  type: "Transact",
  origin: string,
  originType: string,
  requireWeightAtMost: string,
  encodedCall: string
}