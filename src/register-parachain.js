const fs = require('fs');
const commandLineArgs = require('command-line-args');
const connectToProvider = require('./common/connect-to-provider');
const getWallet = require('./common/get-wallet');

const optionDefinitions = [
  { name: 'port', alias: 'p', type: String},
  { name: 'uri', alias: 'u', type: String},
  { name: 'genesis', alias: 'g', type: String},
  { name: 'wasm', alias: 'w', type: String},
  { name: 'id', alias: 'i', type: Number }
]

const getGenesisAndWasm = (genesisFile, wasmFile) => {
  const genesis = fs.readFileSync(process.cwd() + "/resources/" + genesisFile).toString();
  const wasm = fs.readFileSync(process.cwd() + "/resources/" + wasmFile).toString();

  return { genesis, wasm }
}

const registerParachain = async (api, wallet, id, genesis) => {
  let nonce = await api.rpc.system.accountNextIndex(wallet.address);
  await api.tx.sudo
			.sudo(api.tx.parasSudoWrapper.sudoScheduleParaInitialize(id, genesis))
			.signAndSend(wallet, { nonce, era: 0 });
}

const main = async () => {
  const options = commandLineArgs(optionDefinitions);
  const api = await connectToProvider(`ws://localhost:${options.port}`);
  const wallet = await getWallet(options.uri);

  const { genesis, wasm } = getGenesisAndWasm(options.genesis, options.wasm);

  const paraGenesisArgs = {
    genesis_head: genesis,
    validation_code: wasm,
    parachain: true,
  };

  let genesisArgs = api.createType("ParaGenesisArgs", paraGenesisArgs);

  await registerParachain(api, wallet, options.id, genesisArgs);

  process.exit(0);
}

main()