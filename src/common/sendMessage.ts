import { BridgeData } from '../interfaces/xcmData';
import { compactAddLength } from '@polkadot/util';
import { getSubstrateDynamicNames } from './getSubstrateDynamicNames';
import { getApisFromRelays } from './getApisFromRelays';

export const sendMessage = async (message: BridgeData) => {
  const {
    relayChains,
    fee,
    lane,
    signer,
    call,
    origin,
    target
  } = message;

  const { sourceApi, targetApi } = getApisFromRelays(relayChains);

  let callPayload = (await call).toU8a().slice(2)
  let weight = (await call.paymentInfo(signer)).weight.toNumber();

  let callCompact = compactAddLength(callPayload!)
  let specVersion = targetApi.consts.system.version.specVersion.toNumber();

  let sourceChainAccountId = signer!.addressRaw
  let targetChainAccountPublic = target.addressRaw

  // DIGITAL SIGNATURE
  // Concat of [callPlayload.encode(), sourceChainAccountId.encode(), specVersion.encode(), sourceChainBridgeId.encode(), targetChainBridgeId.encode()] and signed
  // let message = [callPlayload.encode(), sourceChainAccountId.encode(), specVersion.encode(), sourceChainBridgeId.encode(), targetChainBridgeId.encode()]
  // let targetChainSignature = signer.sign(message)

  // let message = (callPlayload, sourceChainAccountId, specVersion, sourceChainBridgeId).toU8a()
  let targetChainSignature = {}

  let originPayload: Object;

  if (origin.type === "TargetAccount") {
    originPayload = { TargetAccount: [sourceChainAccountId, targetChainAccountPublic, targetChainSignature] }
  } else if (origin.type === "SourceRoot") {
    // Not Implemented
    originPayload = { RootSource: signer!.addressRaw }
  } else {
    originPayload = { SourceAccount: signer!.addressRaw }
  }

  const payload = {
    call: callCompact,
    origin: originPayload,
    spec_version: specVersion,
    weight
  };

  const { bridgedMessages } = getSubstrateDynamicNames(relayChains.target.chain.name);
  
  const bridgeMessage = sourceApi.tx[bridgedMessages].sendMessage(lane, payload, fee);

  let nonce = await sourceApi.rpc.system.accountNextIndex(signer.address);

  await bridgeMessage.signAndSend(signer, { nonce });
}