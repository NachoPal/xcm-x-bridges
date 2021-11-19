import fs from 'fs';
import commandLineArgs from 'command-line-args';
import connectToRelayChains from '../common/connectToRelayChains';
import getWallet from '../common/getWallet';

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
  // await reserveParachainId(api, wallet);

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
    { name: 'port', alias: 'p', type: String },
    { name: 'uri', alias: 'u', type: String },
    { name: 'genesis', alias: 'g', type: String },
    { name: 'wasm', alias: 'w', type: String },
    { name: 'id', alias: 'i', type: Number }
  ]
  const options = commandLineArgs(optionDefinitions);
  const { port, genesis, wasm, uri, id } = options;

  const relayChains = await connectToRelayChains(port, undefined);
  const relayChain = { // source
      api: relayChains.source.chain.api,
      uri: uri,
      genesis: genesis,
      wasm: wasm,
      id: id
  }

  let parachainPromises: Array<Promise<void>> = [];

  setupParachain(relayChain)

  Promise.all(parachainPromises)
}

main()