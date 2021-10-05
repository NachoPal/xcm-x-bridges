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
    call
  } = message;

  const { sourceApi, targetApi } = getApisFromRelays(relayChains);

  let callPayload = (await call).toU8a().slice(2)
  let weight = (await call.paymentInfo(signer)).weight.toNumber();

  const payload = {
    call: compactAddLength(callPayload!),
    origin: {
      SourceAccount: signer!.addressRaw
    },
    spec_version: targetApi.consts.system.version.specVersion.toNumber(),
    weight
  };

  const { bridgedMessages } = getSubstrateDynamicNames(relayChains.target.chain.name);
  
  const bridgeMessage = sourceApi.tx[bridgedMessages].sendMessage(lane, payload, fee);

  let nonce = await sourceApi.rpc.system.accountNextIndex(signer.address);

  await bridgeMessage.signAndSend(signer, { nonce });
}