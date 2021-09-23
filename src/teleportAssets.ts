import commandLineArgs from 'command-line-args';
import connectToRelayChains from './common/connectToRelayChains';
import getWallet from './common/getWallet';

const teleportAsset = async (api, uri) => {
  const wallet = await getWallet(uri);
  let nonce = await api.rpc.system.accountNextIndex(wallet.address);

  let destination = { x1: { parachain: 2000 }}

  let beneficiary = {
    x1: { accountId32: { network: { any: true }, id: wallet.address }}
  }

  let assets = [{ concreteFungible: { here: true, amount: "1000000000000000" }}]

  await api.tx.xcmPallet
			.teleportAssets(
        destination, beneficiary, assets, "10000000000" 
      )
			.signAndSend(wallet, { nonce, era: 0 }); 

  console.log("Sent")    
}



const main = async () => {
  const optionDefinitions = [
    { name: 'port', alias: 'p', type: String, multiple: true },
    { name: 'uri', alias: 'u', type: String, multiple: true },
    // { name: 'genesis', alias: 'g', type: String, multiple: true },
    // { name: 'wasm', alias: 'w', type: String, multiple: true },
    // { name: 'id', alias: 'i', type: Number, multiple: true }
  ]
  const options = commandLineArgs(optionDefinitions);
  const { port, uri } = options;


  const relayChains = await connectToRelayChains(port[0], port[1]);


  // console.log("[erra")

  // console.log(relayChains.source.chain.api.runtimeMetadata.asV13.modules[45].calls.value[0].args[0].toHuman())
  // console.log(relayChains.source.chain.api.runtimeMetadata.asV13.toHuman())
  // const relayChainsArray = [
  //   { // source
  //     api: relayChains.source.chain.api,
  //     uri: uri[0],
  //     genesis: genesis[0],
  //     wasm: wasm[0],
  //     id: id[0]
  //   },
  //   { // target
  //     api: relayChains.target.chain.api,
  //     uri: uri[1],
  //     genesis: genesis[1],
  //     wasm: wasm[1],
  //     id: id[1]
  //   },
  // ]

  await teleportAsset(relayChains.source.chain.api, uri[0]);
  process.exit(0)
}

main()