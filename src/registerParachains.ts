import fs from 'fs';
import commandLineArgs from 'command-line-args';
import connectToRelayChains from './common/connectToRelayChains';
import getWallet from './common/getWallet';

const getGenesisAndWasm = (genesisFile: string, wasmFile: string) => {
  const genesis = fs.readFileSync(process.cwd() + "/resources/parachains/" + genesisFile).toString();
  const wasm = fs.readFileSync(process.cwd() + "/resources/parachains/" + wasmFile).toString();

  return { genesis, wasm }
}

const reserveParachainId = async (api, wallet) => {
  let nonce = await api.rpc.system.accountNextIndex(wallet.address);
  await api.tx.registrar.reserve().signAndSend(wallet, { nonce });
}

const registerParachain = async (api, wallet, id, genesis) => {
  let nonce = await api.rpc.system.accountNextIndex(wallet.address);
  await api.tx.sudo
			.sudo(api.tx.parasSudoWrapper.sudoScheduleParaInitialize(id, genesis))
			.signAndSend(wallet, { nonce, era: 0 });
}

const setupParachain = async (relayChain) => {
  const { uri, api, genesis, wasm, id } = relayChain;
  const wallet = await getWallet(uri);
  await reserveParachainId(api, wallet);

  const { 
    genesis: genesisHex, 
    wasm: wasmHex 
  } = getGenesisAndWasm(genesis, wasm);

  const paraGenesisArgs = {
    genesis_head: genesisHex,
    validation_code: wasmHex,
    parachain: true,
  };
  let genesisArgs = api.createType("ParaGenesisArgs", paraGenesisArgs);

  await registerParachain(api, wallet, id, genesisArgs);
}



const main = async () => {
  const optionDefinitions = [
    { name: 'port', alias: 'p', type: String, multiple: true },
    { name: 'uri', alias: 'u', type: String, multiple: true },
    { name: 'genesis', alias: 'g', type: String, multiple: true },
    { name: 'wasm', alias: 'w', type: String, multiple: true },
    { name: 'id', alias: 'i', type: Number, multiple: true }
  ]
  const options = commandLineArgs(optionDefinitions);
  const { port, genesis, wasm, uri, id } = options;

  const relayChains = await connectToRelayChains(port[0], port[1]);
  const relayChainsArray = [
    { // source
      api: relayChains.source.chain.api,
      uri: uri[0],
      genesis: genesis[0],
      wasm: wasm[0],
      id: id[0]
    },
    { // target
      api: relayChains.target.chain.api,
      uri: uri[1],
      genesis: genesis[1],
      wasm: wasm[1],
      id: id[1]
    },
  ]

  let parachainPromises: Array<Promise<void>> = [];

  relayChainsArray.forEach((relayChain) => {
    parachainPromises.push(
      setupParachain(relayChain)
    ) 
  })

  Promise.all(parachainPromises)
}

main()