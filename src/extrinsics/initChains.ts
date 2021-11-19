import commandLineArgs from 'command-line-args';
import connectToRelayChains from '../common/connectToRelayChains';
import getWallet from '../common/getWallet';


const forceXcmVersion = async ({ api, location, version, wallet, pallet }) => {
  let nonce = await api.rpc.system.accountNextIndex(wallet.address);
  await api.tx.sudo
			.sudo(api.tx[pallet].forceXcmVersion(location, version))
			.signAndSend(wallet, { nonce, era: 0 });
}

const forceDefaultXcmVersion = async ({ api, version, wallet, pallet }) => {
  let nonce = await api.rpc.system.accountNextIndex(wallet.address);
  await api.tx.sudo
			.sudo(api.tx[pallet].forceDefaultXcmVersion(version))
			.signAndSend(wallet, { nonce, era: 0 });
}

const main = async () => {
  const optionDefinitions = [
    { name: 'chain', alias: 'c', type: String },
    { name: 'port', alias: 'p', type: String },
    { name: 'uri', alias: 'u', type: String },
    { name: 'id', alias: 'i', type: Number },
    { name: 'version', alias: 'v', type: Number}
  ]
  const options = commandLineArgs(optionDefinitions);
  const { chain, port, id, version, uri } = options;

  const relayChain = await connectToRelayChains(port, undefined);

  let location = chain === 'relay' ? 
    { parent: 0, interior: { x1: { parachain: id }}} : { parent: 1, interior: { here: true }}
  
  let pallet = chain === 'relay' ? 'xcmPallet' : 'polkadotXcm'

  const data = { // source
    api: relayChain.source.chain.api,
    location,
    version,
    wallet: await getWallet(uri),
    pallet
  }

  await forceDefaultXcmVersion(data)  
  await forceXcmVersion(data)
}

main()