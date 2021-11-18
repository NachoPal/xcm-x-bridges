require('dotenv').config()
import commandLineArgs from 'command-line-args';
import connectToRelayChains from './common/connectToRelayChains';
// import { u8aToHex } from '@polkadot/util'
import getWallet from './common/getWallet';
import { signAndSendCallback } from './common/signAndSendCallback';
import { assets } from './config/eventsEvals';


const createAsset = async ({ api, id, name, symbol, decimals, wallet }) => {
  let nonce = await api.rpc.system.accountNextIndex(wallet.address);
  // console.log(u8aToHex(admin.addressRaw))
  // let adminObj = { Id: admin.address }

  let eventEval = { eventEval: assets.MetadataSet, callback: () => { process.exit(0) }}

  await api.tx.assets.setMetadata(id, name, symbol, decimals)
    .signAndSend(
      wallet, 
      { nonce, era: 0 },
      signAndSendCallback([eventEval])
    );
}

const main = async () => {
  const optionDefinitions = [
    { name: 'id', alias: 'i', type: Number },
    { name: 'name', alias: 'n', type: String },
    { name: 'symbol', alias: 'y', type: String },
    { name: 'decimals', alias: 'd', type: Number },
    { name: 'signer', alias: 's', type: String }
  ]
  const options = commandLineArgs(optionDefinitions);
  const { id, name, symbol, decimals, signer } = options;

  const relayChain = await connectToRelayChains(process.env.PORT_PARA_SOURCE, undefined);

  const data = { // source
    api: relayChain.source.chain.api,
    id,
    name,
    symbol,
    decimals,
    wallet: await getWallet(signer)
  }

  await createAsset(data)  
}

main()