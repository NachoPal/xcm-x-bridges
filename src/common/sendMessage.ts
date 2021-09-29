import { MessageData } from '../interfaces/xcmData';
import { compactAddLength } from '@polkadot/util';
import { getSubstrateDynamicNames } from './getSubstrateDynamicNames';
import { getApisFromRelays } from './getApisFromRelays';

export const sendMessage = async (message: MessageData) => {
  const {
    relayChains,
    fee,
    lane,
    signer,
    call,
    nonce
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
  
  console.log(fee)
  const bridgeMessage = sourceApi.tx[bridgedMessages].sendMessage(lane, payload, fee);

  let nonce2 = await sourceApi.rpc.system.accountNextIndex(signer.address);

  await bridgeMessage.signAndSend(signer, { nonce2 });
}