// import commandLineArgs from 'command-line-args';
// import connectToRelayChains from './common/connectToRelayChains';
import { getApisFromRelays } from './common/getApisFromRelays';
import getWallet from './common/getWallet';
import { sendMessage } from './common/sendMessage';
import { Xcm, BridgeData } from './interfaces/xcmData';
import { hexToU8a, compactAddLength } from '@polkadot/util';

export const sendXcm = async (xcm: Xcm, isLocal) => {
  switch (xcm.message.type) {
    case "Transact":
      const { 
        destination,
        message: {
          signer,
          originType,
          requireWeightAtMost,
          encodedCall,
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
    
      let messageObj = {
        Transact: { originType, requireWeightAtMost, call: compactAddLength(hexToU8a(encodedCall)) }
      }
      let call = api.tx.sudo.sudo(api.tx.xcmPallet.send(destination, messageObj))

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
    
      console.log(`${xcm.message.type} Sent`)
      process.exit(0)
  }    
}