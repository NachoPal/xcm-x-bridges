// import commandLineArgs from 'command-line-args';
// import connectToRelayChains from './common/connectToRelayChains';
import { OnReadOpts } from 'net';
import { getApisFromRelays } from './common/getApisFromRelays';
import getWallet from './common/getWallet';
import { sendMessage } from './common/sendMessage';
import { BridgeData, Xcm } from './interfaces/xcmData';

export const teleportAsset = async ({ relayChains, paraChains }, xcm: Xcm, isLocal) => {
  switch (xcm.message.type) {
    case "TeleportAsset":
      const { 
        message: {
          messaging,
          parachain,
          signer,
          beneficiary,
          amount,
          feeAssetItem
        },
        bridgeData: {
          lane,
          fee,
          target,
          origin
        }
      } = xcm;

      let destination = {};
      // Default are DMP values
      let chains = relayChains
      let palletName = 'xcmPallet';
      let parents = 0

      if (messaging === 'dmp') {   
        destination = { v1: { parents, interior: { x1: { parachain }}}}
      } else if (messaging === 'ump') {
        parents = 1;
        chains = paraChains
        palletName = "polkadotXcm"
        destination = { v1: { parents, interior: { here: true }}}
      }

      const { sourceApi, targetApi } = getApisFromRelays(chains);
    
      let api = isLocal ? sourceApi : targetApi;
    
      const signerAccount = await getWallet(signer);
      const beneficiaryAccount = await getWallet(beneficiary);
    
      let beneficiaryObj = {
        v1: { parents: 0, interior: { x1: { accountId32: { network: { any: true }, id: beneficiaryAccount.addressRaw }}}}
      }
      // let assets = { v1: [{ concreteFungible: { here: true, amount }}]}
      let assets = { v1: [{id: { concrete: { parents, interior: { here: true }}}, fun: { fungible: amount }}]}

      console.log("DESTINATION ", destination)
      console.log("BENEFICIARY ", beneficiaryObj)
      console.log("ASSETS ", assets.v1[0].id)
      console.log("ASSETS ", assets.v1[0].fun)

      let call = api.tx[palletName].limitedTeleportAssets(destination, beneficiaryObj, assets, feeAssetItem, { unlimited: true })
      let nonce = await api.rpc.system.accountNextIndex(signerAccount.address);
    
      if (isLocal) {
        await (await call).signAndSend(signerAccount, { nonce, era: 0 });
      } else {
        const targetAccount = target ? await getWallet(target) : undefined;

        let message: BridgeData = {
          signer: signerAccount,
          fee,
          lane,
          call,
          origin,
          target: targetAccount
        }
        await sendMessage(relayChains, message)
      }  
    
      console.log("Assets Teleported")
      process.exit(0)
  }
}