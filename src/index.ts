import commandLineArgs from 'command-line-args';
import connectToRelayChains from './common/connectToRelayChains';
import { TeleportData, TransactData, Xcm, BridgeData } from './interfaces/xcmData';
import { teleportAsset } from './teleportAssets';
import { sendXcm } from './sendXcm';

const subCommands = async (isLocal, targetCommands, relayChains) => {
  let argv = targetCommands._unknown || []

  let subDefinitions = [
    { name: 'xcm', defaultOption: true }
  ]

  const subCommand = commandLineArgs(subDefinitions, { argv, stopAtFirstUnknown: true })

  let bridgeData: BridgeData = {
    relayChains,
    signer: targetCommands?.signer,
    fee: targetCommands?.fee,
    lane: targetCommands?.lane,
  }

  if (subCommand.xcm === 'teleport-asset') {
    let type: "TeleportAsset" = "TeleportAsset";
    let argv = subCommand._unknown || []

    let optionDefinitions = [
      { name: 'origin', alias: 'o', type: String },
      { name: 'beneficiary', alias: 'b', type: String },
      { name: 'amount', alias: 'a', type: String },
      { name: 'destWeight', alias: 'w', type: String },
      { name: 'parachain', alias: 'p', type: Number }
    ]
    const optionsCommand = commandLineArgs(optionDefinitions, { argv, stopAtFirstUnknown: true });

    const validOptions = (
      optionsCommand.origin &&
      optionsCommand.beneficiary &&
      optionsCommand.amount &&
      optionsCommand.destWeight &&
      optionsCommand.parachain
    );

    if (!validOptions) {
      console.log(`Error: -o, -b, -a, -w and -p flags are mandatory for "${subCommand.xcm}"`);
      process.exit(1);
    }

    const { origin, beneficiary, parachain, amount, destWeight } = optionsCommand;

    let xcmMessage: TeleportData = {
      type,
      origin,
      beneficiary,
      amount,
      destWeight
    }

    let xcm: Xcm = {
      destination: { x1: { parachain }},
      message: xcmMessage,
      bridgeData,
    }

    await teleportAsset(xcm, isLocal)

  } else if (subCommand.xcm === 'transact') {
    let type: "Transact" = "Transact";

    let optionDefinitions = [
      { name: 'originType', alias: 'o', type: String },
      { name: 'requireWeightAtMost', alias: 'w', type: String },
      { name: 'encodedCall', alias: 'c', type: String },
      { name: 'parachain', alias: 'p', type: Number }
    ]

    const optionsCommand = commandLineArgs(optionDefinitions, { argv, stopAtFirstUnknown: true });

    const validOptions = (
      optionsCommand.originType &&
      optionsCommand.requireWeightAtMost &&
      optionsCommand.encodedCall &&
      optionsCommand.parachain
    );

    const validOriginTypes = (
      ['Native', 'SovereignAccount', 'Superuser', 'Xcm'].includes(optionsCommand.originType)
    );

    if (!validOptions) {
      console.log(`Error: -o, -w, -c and -p flags are mandatory for "${subCommand.xcm}"`);
      process.exit(1);
    }

    if (!validOriginTypes) {
      console.log(
        `Error: originType "${optionsCommand.originType}" is invalid. Only 
        'Native', 'SovereignAccount', 'Superuser', 'Xcm' are valid.
      `);
      process.exit(1);
    }

    const { originType, requireWeightAtMost , encodedCall, parachain } = optionsCommand;

    let xcmMessage: TransactData = {
      type,
      originType,
      requireWeightAtMost,
      encodedCall
    }

    let xcm: Xcm = {
      destination: { x1: { parachain }},
      message: xcmMessage,
      bridgeData,
    }

    await sendXcm(xcm, isLocal)

  } else {

    console.log('Error: Invalid XCM. Only "teleport-asset" and "transact" are valid');
    process.exit(1);
  }
}

const main = async () => {
  const relayChains = await connectToRelayChains(9944, 9948);

  let mainDefinitions = [
    { name: 'target', defaultOption: true },
  ]
  const mainCommand = commandLineArgs(mainDefinitions, { stopAtFirstUnknown: true })
  let argv = mainCommand._unknown || []

  let isLocal = mainCommand.target === 'local' ? true : false; 

  if (mainCommand.target === 'local') {
    await subCommands(isLocal, mainCommand, relayChains)

  } else if (mainCommand.target === 'remote') {
    let targetDefinitions = [
      { name: 'signer', alias: 's', type: String },
      { name: 'fee', alias: 'f', type: String },
      { name: 'lane', alias: 'l', type: String }
    ]

    const targetCommand = commandLineArgs(targetDefinitions, { argv, stopAtFirstUnknown: true })

    const validTarget = (
      targetCommand.signer && targetCommand.fee && targetCommand.lane
    )

    if (!validTarget) {
      console.log(`Error: -s, -f and -l flags are mandatory for "${mainCommand.target}" target`);
      process.exit(1);
    }

    await subCommands(isLocal, targetCommand, relayChains)
  } else {
    console.log('Error: Invalid target, only "local" or "remote" are valid');
    process.exit(1);
  }
}

main()

// ============================================================================================
// ============================ TELEPOT ASSET - LOCAL =========================================
// ============================================================================================

// yarn dev local teleport-asset -o //Alice -b //Bob -p 2000 -a 1000000000000000 -w 100000000000

// ============================================================================================
// ======================== TELEPOT ASSET - REMOTE - Source Origin ============================
// ============================================================================================

// # THE XCM IS EXECUTED BY THE COMPANION ACCOUNT IN THE TARGET RELAY CHAIN
// # If the Companion Target Account has no balance the Remote TELEPOR ASSETS will fail
// # TODO: 'origin.sourceAccount' can be changed in the Message Payload, so we could try to use the same account that the Source Chain

// yarn dev remote -s //Alice -f 10000000000000 -l 0x00000000 teleport-asset -o //Alice -b //Bob -p 2000 -a 1000000000000000 -w 100000000000

// ============================================================================================
// ======================== TELEPOT ASSET - REMOTE - Target Origin ============================
// ============================================================================================


// ============================================================================================
// =========================== TRANSACT - LOCAL ===============================================
// ============================================================================================


// ============================================================================================
// =========================== TRANSACT - REMOTE ==============================================
// ============================================================================================

