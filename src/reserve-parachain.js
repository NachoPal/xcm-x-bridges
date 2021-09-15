const commandLineArgs = require('command-line-args');
const connectToProvider = require('./common/connect-to-provider');
const getWallet = require('./common/get-wallet');

const optionDefinitions = [
  { name: 'port', alias: 'p', type: String},
  { name: 'uri', alias: 'u', type: String}
]

const reserveParachainId = async (api, wallet) => {
  let nonce = await api.rpc.system.accountNextIndex(wallet.address);
  await api.tx.registrar.reserve().signAndSend(wallet, { nonce });
}

const main = async () => {
  const options = commandLineArgs(optionDefinitions);
  const api = await connectToProvider(`ws://localhost:${options.port}`);
  const wallet = await getWallet(options.uri);

  await reserveParachainId(api, wallet);

  process.exit(0);
}

main()