// import fs from 'fs';
import commandLineArgs from 'command-line-args';
import connectToRelayChains from './common/connectToRelayChains';
import getWallet from './common/getWallet';


const forceXcmVersion = async ({ api, uri, id, version }) => {
  const wallet = await getWallet(uri);

  const location = { parent: 0, interior: { x1: { parachain: id }}}
  let nonce = await api.rpc.system.accountNextIndex(wallet.address);
  await api.tx.sudo
			.sudo(api.tx.xcmPallet.forceXcmVersion(location, version))
			.signAndSend(wallet, { nonce, era: 0 });
}

// const setupParachain = async (relayChain) => {
//   const { uri, api, genesis, wasm, id } = relayChain;
//   const wallet = await getWallet(uri);
//   await reserveParachainId(api, wallet);

//   const { 
//     genesis: genesisHex, 
//     wasm: wasmHex 
//   } = getGenesisAndWasm(genesis, wasm);

//   const paraGenesisArgs = {
//     genesis_head: genesisHex,
//     validation_code: wasmHex,
//     parachain: true,
//   };
//   let genesisArgs = api.createType("ParaGenesisArgs", paraGenesisArgs);

//   await registerParachain(api, wallet, id, genesisArgs);
// }

const main = async () => {
  const optionDefinitions = [
    { name: 'port', alias: 'p', type: String },
    { name: 'uri', alias: 'u', type: String },
    { name: 'id', alias: 'i', type: Number },
    { name: 'version', alias: 'v', type: Number}
  ]
  const options = commandLineArgs(optionDefinitions);
  const { port, id, version, uri } = options;

  const relayChain = await connectToRelayChains(port, undefined);

  const data = { // source
    api: relayChain.source.chain.api,
    uri,
    id,
    version,
  }

  // let parachainPromises: Array<Promise<void>> = [];

  await forceXcmVersion(data)

  // Promise.all(parachainPromises)
}

main()