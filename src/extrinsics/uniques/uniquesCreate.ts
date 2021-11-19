require('dotenv').config()
import commandLineArgs from 'command-line-args';
import connectToRelayChains from '../../common/connectToRelayChains';
// import { u8aToHex } from '@polkadot/util'
import getWallet from '../../common/getWallet';
import { signAndSendCallback } from '../../common/signAndSendCallback';
import { uniques } from '../../config/eventsEvals';


const createUnique = async ({ api, id, admin, wallet }) => {
  let nonce = await api.rpc.system.accountNextIndex(wallet.address);
  // console.log(u8aToHex(admin.addressRaw))
  let adminObj = { Id: admin.address }

  let eventEval = { eventEval: uniques.Created, callback: () => { process.exit(0) }}

  await api.tx.uniques.create(id, adminObj)
    .signAndSend(
      wallet, 
      { nonce, era: 0 },
      signAndSendCallback([eventEval])
    );
}

const main = async () => {
  const optionDefinitions = [
    { name: 'id', alias: 'i', type: Number },
    { name: 'admin', alias: 'a', type: String },
    { name: 'signer', alias: 's', type: String }
  ]
  const options = commandLineArgs(optionDefinitions);
  const { id, admin, signer } = options;

  const relayChain = await connectToRelayChains(process.env.PORT_PARA_SOURCE, undefined);

  const data = { // source
    api: relayChain.source.chain.api,
    id,
    admin: await getWallet(admin),
    wallet: await getWallet(signer)
  }

  await createUnique(data)  
}

main()