// import { compactAddLength } from '@polkadot/util';
// import { getSubstrateDynamicNames } from './common/getSubstrateDynamicNames';
// import connectToRelayChains from './common/connectToRelayChains';

// const main = async () => {

//   const relayChains = connectToRelayChains()

//   // console.log(account)

//   const {
//     sourceChainDetails: {
//       apiConnection: { api: sourceApi },
//       chain: sourceChain 
//     },
//     targetChainDetails: {
//       apiConnection: { api: targetApi },
//       chain: targetChain
//     }
//   } = connections;

//   const transferAmount = "1000000000000000";
//   const estimatedFee = "10000000000000"

//   // // // const secretSeed = '0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a'; //Alice
//   // // // const account = await generateKeyPair(secretSeed);
//   const receiverAddress = "5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL"


//   let weight: number = 0;
//   let call: Uint8Array | null = null;
//   const laneId = '0x00000000';

//   // let callHex: string = '0x6302000102001cbd2d43530a44705ad088af313e18f80b53ef16b36177cd4b77b846f2a5f07c040a00070010a5d4e80000000000000000';

//   console.log(await targetApi.tx.balances.transfer(receiverAddress, transferAmount));

//   call = (await targetApi.tx.balances.transfer(receiverAddress, transferAmount)).toU8a();
//   call = call.slice(2);

//   weight = (
//     await targetApi.tx.balances.transfer(receiverAddress, 100).paymentInfo(account)
//   ).weight.toNumber();

//   // console.log((await targetApi.tx.balances.transfer(keyringPair[1].address, 10000)))
//   //   // console.log(new BN(transferAmount))
//   //   // console.log(await targetApi.tx.balances.transfer(receiverAddress, new BN(transferAmount) || 0))

//   const payload = {
//     call: compactAddLength(call!),
//     origin: {
//       SourceAccount: account!.addressRaw
//     },
//     spec_version: targetApi.consts.system.version.specVersion.toNumber(),
//     weight
//   };

//   // // console.log(payload.spec_version)

//   let nonce = await sourceApi.rpc.system.accountNextIndex(account.address);

//   const { bridgedMessages } = getSubstrateDynamicNames(targetChain);
  
//   const bridgeMessage = sourceApi.tx[bridgedMessages].sendMessage(laneId, payload, estimatedFee);

//   // console.log(bridgeMessage)


//   // await bridgeMessage.signAndSend(account, { nonce });

//   // console.log(nonce)

//   // await connection.api.tx.balances.transfer("5s6GPQePgaQj86uGnZHUeoTWQh7aEcJvmgGA8sd3aUBpedbt", 1000).signAndSend(organisationWallet, {nonce})
//   // await sourceApi.tx.balances.transfer("5s6GPQePgaQj86uGnZHUeoTWQh7aEcJvmgGA8sd3aUBpedbt", 1000).signAndSend(account, { nonce })

//   process.exit(0)

// }

// main()



