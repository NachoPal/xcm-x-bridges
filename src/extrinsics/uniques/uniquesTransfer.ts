require('dotenv').config()
import commandLineArgs from 'command-line-args';
import connectToRelayChains from '../../common/connectToRelayChains';
// import { u8aToHex } from '@polkadot/util'
import getWallet from '../../common/getWallet';
import { signAndSendCallback } from '../../common/signAndSendCallback';
import { assets, uniques } from '../../config/eventsEvals';


const mintUnique = async ({ api, id, instance, dest, wallet }) => {
  let nonce = await api.rpc.system.accountNextIndex(wallet.address);
  // console.log(u8aToHex(admin.addressRaw))
  let destObj = { Id: dest.address }

  let eventEval = { eventEval: uniques.Transferred, callback: () => { process.exit(0) }}

  await api.tx.uniques.transfer(id, instance, destObj)
    .signAndSend(
      wallet, 
      { nonce, era: 0 },
      signAndSendCallback([eventEval])
    );
}

const main = async () => {
  const optionDefinitions = [
    { name: 'id', alias: 'i', type: Number },
    { name: 'instance', alias: 't', type: Number },
    { name: 'dest', alias: 'd', type: String },
    { name: 'signer', alias: 's', type: String }
  ]
  const options = commandLineArgs(optionDefinitions);
  const { id, instance, dest, signer } = options;

  const relayChain = await connectToRelayChains(process.env.PORT_PARA_SOURCE, undefined);

  const data = { // source
    api: relayChain.source.chain.api,
    id,
    instance,
    dest: await getWallet(dest),
    wallet: await getWallet(signer)
  }

  await mintUnique(data)  
}

main()