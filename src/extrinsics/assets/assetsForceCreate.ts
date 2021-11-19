require('dotenv').config()
import commandLineArgs from 'command-line-args';
import connectToRelayChains from '../../common/connectToRelayChains';
// import { u8aToHex } from '@polkadot/util'
import getWallet from '../../common/getWallet';
import { signAndSendCallback } from '../../common/signAndSendCallback';
import { sudo, assets } from '../../config/eventsEvals';


const forceCreateAsset = async ({ api, id, owner, isSufficient, minBalance, wallet }) => {
  let nonce = await api.rpc.system.accountNextIndex(wallet.address);
  // console.log(u8aToHex(admin.addressRaw))
  let ownerObj = { Id: owner.address }

  let eventEvalSudo = { eventEval: sudo.Sudid, callback: () => {} }
  let eventEvalForceCreated = { eventEval: assets.ForceCreated, callback: () => { process.exit(0) }}

  await api.tx.sudo.
			sudo(api.tx.assets.forceCreate(id, ownerObj, isSufficient, minBalance)).
      signAndSend(
        wallet, 
        { nonce, era: 0 },
        signAndSendCallback([eventEvalSudo, eventEvalForceCreated])
      );

  // await api.tx.assets.create(id, adminObj, minBalance)
  //   .signAndSend(
  //     wallet, 
  //     { nonce, era: 0 },
  //     signAndSendCallback([eventEval])
  //   );
}

const main = async () => {
  const optionDefinitions = [
    { name: 'id', alias: 'i', type: Number },
    { name: 'owner', alias: 'o', type: String },
    { name: 'isSufficient', alias: 'u', type: Boolean },
    { name: 'minBalance', alias: 'm', type: Number },
    { name: 'signer', alias: 's', type: String }
  ]
  const options = commandLineArgs(optionDefinitions);
  const { id, owner, isSufficient, minBalance, signer } = options;

  const relayChain = await connectToRelayChains(process.env.PORT_PARA_SOURCE, undefined);

  const data = { // source
    api: relayChain.source.chain.api,
    id,
    owner: await getWallet(owner),
    isSufficient,
    minBalance,
    wallet: await getWallet(signer)
  }

  await forceCreateAsset(data)  
}

main()