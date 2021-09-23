// import commandLineArgs from 'command-line-args';
// import connectToRelayChains from './common/connectToRelayChains';
import { getApisFromRelays } from './common/getApisFromRelays';
import getWallet from './common/getWallet';
import { sendMessage } from './common/sendMessage';
import { MessageData, TeleportData } from './interfaces/xcmData';

export const teleportAsset = async (relayChains, data: TeleportData, isLocal) => {
  const { 
    signer,
    lane,
    fee,
    origin,
    beneficiary,
    amount,
    parachain,
    destWeight
  } = data;

  const { sourceApi, targetApi } = getApisFromRelays(relayChains);

  let api = isLocal ? sourceApi : targetApi;

  const signerAccount = await getWallet(signer || origin);
  const beneficiaryAccount = await getWallet(beneficiary);

  let destination = { x1: { parachain }}
  let beneficiaryObj = {
    x1: { accountId32: { network: { any: true }, id: beneficiaryAccount.address }}
  }
  let assets = [{ concreteFungible: { here: true, amount }}]

  let call = api.tx.xcmPallet.teleportAssets(destination, beneficiaryObj, assets, destWeight)
  let nonce = await api.rpc.system.accountNextIndex(signerAccount.address);

  if (isLocal) {
    await (await call).signAndSend(signerAccount, { nonce, era: 0 });
  } else {
    let message: MessageData = {
      signer: signerAccount,
      relayChains,
      fee,
      lane,
      call,
      nonce
    }
    await sendMessage(message)
  }  

  console.log("Assets Teleported")
  process.exit(0)
}