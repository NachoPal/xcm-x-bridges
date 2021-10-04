// import commandLineArgs from 'command-line-args';
// import connectToRelayChains from './common/connectToRelayChains';
import { getApisFromRelays } from './common/getApisFromRelays';
import getWallet from './common/getWallet';
import { sendMessage } from './common/sendMessage';
import { Xcm, BridgeData } from './interfaces/xcmData';

export const sendXcm = async (xcm: Xcm, isLocal) => {
  switch (xcm.message.type) {
    case "Transact":
      const { 
        destination,
        message: {
          originType,
          requireWeightAtMost,
          encodedCall,
        },
        bridgeData: {
          relayChains,
          signer,
          lane,
          fee
        }
      } = xcm;

      const { sourceApi, targetApi } = getApisFromRelays(relayChains);

      let api = isLocal ? sourceApi : targetApi;
    
      const signerAccount = await getWallet(signer);
    
      let messageObj = {
        Transact: { originType, requireWeightAtMost, encodedCall }
      }
    
      let call = api.tx.xcmPallet.send(destination, messageObj)
      let nonce = await api.rpc.system.accountNextIndex(signerAccount.address);
    
      if (isLocal) {
        await (await call).signAndSend(signerAccount, { nonce, era: 0 });
      } else {
        let message: BridgeData = {
          relayChains,
          signer: signerAccount,
          fee,
          lane,
          call
        }
        await sendMessage(message)
      }  
    
      console.log("Assets Teleported")
      process.exit(0)
  }    
}