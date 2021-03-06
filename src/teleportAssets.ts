// import commandLineArgs from 'command-line-args';
// import connectToRelayChains from './common/connectToRelayChains';
import { getApisFromRelays } from './common/getApisFromRelays';
import getWallet from './common/getWallet';
import { sendMessage } from './common/sendMessage';
import { BridgeData, Xcm } from './interfaces/xcmData';

export const teleportAsset = async (xcm: Xcm, isLocal) => {
  switch (xcm.message.type) {
    case "TeleportAsset":
      const { 
        destination,
        message: {
          signer,
          beneficiary,
          amount,
          destWeight
        },
        bridgeData: {
          relayChains,
          lane,
          fee,
          target,
          origin
        }
      } = xcm;
    
      const { sourceApi, targetApi } = getApisFromRelays(relayChains);
    
      let api = isLocal ? sourceApi : targetApi;
    
      const signerAccount = await getWallet(signer);
      const beneficiaryAccount = await getWallet(beneficiary);

    
      let beneficiaryObj = {
        x1: { accountId32: { network: { any: true }, id: beneficiaryAccount.address }}
      }
      let assets = [{ concreteFungible: { here: true, amount }}]
    
      let call = api.tx.xcmPallet.teleportAssets(destination, beneficiaryObj, assets, destWeight)
      let nonce = await api.rpc.system.accountNextIndex(signerAccount.address);
    
      if (isLocal) {
        await (await call).signAndSend(signerAccount, { nonce, era: 0 });
      } else {
        const targetAccount = target ? await getWallet(target) : undefined;

        let message: BridgeData = {
          relayChains,
          signer: signerAccount,
          fee,
          lane,
          call,
          origin,
          target: targetAccount
        }
        await sendMessage(message)
      }  
    
      console.log("Assets Teleported")
      process.exit(0)
  }
}