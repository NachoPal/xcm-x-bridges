import { AccountData, AccountId32, AccountInfo } from "@polkadot/types/interfaces";
import { KeyringPair } from "@polkadot/keyring/types";

export interface TeleportData {
  signer?: string,
  fee?: string,
  lane?: string,
  origin: string,
  beneficiary: string,
  amount: string,
  destWeight: string,
  parachain: number
}

export interface MessageData {
  relayChains: any,
  signer: KeyringPair,
  fee?: string,
  lane?: string,
  call: any,
  nonce: any
}
