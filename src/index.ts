import commandLineArgs from 'command-line-args';
import connectToRelayChains from './common/connectToRelayChains';
import { TeleportData, TransactData, Xcm, BridgeData, BridgeOrigin } from './interfaces/xcmData';
import { teleportAsset } from './teleportAssets';
import { sendXcm } from './sendXcm';

const subCommands = async (isLocal, targetCommands, relayChains) => {
  let argv = targetCommands._unknown || []

  let subDefinitions = [
    { name: 'xcm', defaultOption: true }
  ]

  const subCommand = commandLineArgs(subDefinitions, { argv, stopAtFirstUnknown: true })

  let origin: BridgeOrigin = { type: targetCommands?.bridgeOrigin }

  let bridgeData: BridgeData = {
    relayChains,
    signer: targetCommands?.signer,
    fee: targetCommands?.fee,
    lane: targetCommands?.lane,
    origin, 
    target: targetCommands?.bridgeTargetAccount
  }

  if (subCommand.xcm === 'teleport-asset') {
    let type: "TeleportAsset" = "TeleportAsset";
    let argv = subCommand._unknown || []

    let optionDefinitions = [
      { name: 'signer', alias: 's', type: String },
      { name: 'beneficiary', alias: 'b', type: String },
      { name: 'amount', alias: 'a', type: String },
      { name: 'destWeight', alias: 'w', type: String },
      { name: 'parachain', alias: 'p', type: Number }
    ]
    const optionsCommand = commandLineArgs(optionDefinitions, { argv, stopAtFirstUnknown: true });

    const validOptions = (
      optionsCommand.signer &&
      optionsCommand.beneficiary &&
      optionsCommand.amount &&
      optionsCommand.destWeight &&
      optionsCommand.parachain
    );

    if (!validOptions) {
      console.log(`Error: -s, -b, -a, -w and -p flags are mandatory for "${subCommand.xcm}"`);
      process.exit(1);
    }

    const { signer, beneficiary, parachain, amount, destWeight } = optionsCommand;

    let xcmMessage: TeleportData = {
      type,
      signer,
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
    let argv = subCommand._unknown || []

    let optionDefinitions = [
      { name: 'signer', alias: 's', type: String },
      { name: 'originType', alias: 't', type: String  },
      { name: 'requireWeightAtMost', alias: 'w', type: String },
      { name: 'encodedCall', alias: 'c', type: String },
      { name: 'parachain', alias: 'p', type: Number }
    ]

    const optionsCommand = commandLineArgs(optionDefinitions, { argv, stopAtFirstUnknown: true });

    const validOptions = (
      optionsCommand.signer &&
      optionsCommand.originType &&
      optionsCommand.requireWeightAtMost &&
      optionsCommand.encodedCall &&
      optionsCommand.parachain
    );

    const validOriginTypes = (
      ['Native', 'SovereignAccount', 'Superuser', 'Xcm'].includes(optionsCommand.originType)
    );

    if (!validOptions) {
      console.log(`Error: -s, -t, -w, -c and -p flags are mandatory for "${subCommand.xcm}"`);
      process.exit(1);
    }

    if (!validOriginTypes) {
      console.log(
        `Error: originType "${optionsCommand.originType}" is invalid. Only 
        'Native', 'SovereignAccount', 'Superuser', 'Xcm' are valid.
      `);
      process.exit(1);
    }

    const { signer, originType, requireWeightAtMost , encodedCall, parachain } = optionsCommand;

    let xcmMessage: TransactData = {
      type,
      signer,
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
      { name: 'fee', alias: 'f', type: String },
      { name: 'lane', alias: 'l', type: String },
      { name: 'bridgeOrigin', alias: 'o', type: String, defaultValue: "SourceAccount" },
      { name: 'bridgeTargetAccount', alias: 't', type: String },
    ]

    const targetCommand = commandLineArgs(targetDefinitions, { argv, stopAtFirstUnknown: true })

    const { fee, lane, bridgeOrigin, bridgeTargetAccount } = targetCommand;

    const validTarget = (fee && lane && (bridgeOrigin === "TargetAccount" ? bridgeTargetAccount : true ))

    if (!validTarget) {
      console.log(`Error: -o, -f and -l flags are mandatory for "${mainCommand.target}" target`);
      process.exit(1);
    }

    const validBridgeTarget = ["TargetAccount", "SourceAccount", "SourceRoot"].includes(bridgeOrigin)

    if (!validBridgeTarget) {
      console.log(
        `Error: "${mainCommand.bridgeTarget}" is invalid. Only "SourceAccount", "TargetAccount" and "SourceRoot" are valid`
      );
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

// $ yarn dev local teleport-asset -s //Alice -p 2000 -b //Bob -a 1000000000000000 -w 100000000000

// ============================================================================================
// ============================ TELEPOT ASSET - REMOTE ========================================
// ============================================================================================

// -------------------------------- SOURCE ORIGIN ---------------------------------------------
// # The Xcm is executed by the companion account if the target Relay Chain of the account that signed
// the extrinsic in the source Relay Chain
// # If the Companion Target Account has no balance the Remote TELEPOR ASSETS will fail
// # Companion Account for Alice in Wococo -> 5GfixJndjo7RuMeaVGJFXiDBQogCHyhxKgGaBkjs6hj15smD

// $ yarn dev remote -f 10000000000000 -l 0x00000000 teleport-asset -s //Alice -p 2000 -b //Bob -a 1000000000000000 -w 100000000000

// -------------------------------- TARGET ORIGIN ---------------------------------------------
// # The Xcm is executed by an account in the target Relay Chain where an account private key is owned
// # To prove the source account owns that target account also, it will have to send a Digital Signature along
// # with the message payload

// # TODO: 'origin.sourceAccount' can be changed in the Message Payload, so we could try to use the same account that the Source Chain

// $ yarn dev remote -o TargetAccount -t //Alice -f 10000000000000 -l 0x00000000 teleport-asset -s //Alice -p 2000 -b //Bob -a 1000000000000000 -w 100000000000

// ============================================================================================
// =========================== TRANSACT - LOCAL ===============================================
// ============================================================================================
// # Only SUDO Account is able to send a Transact XCM to a Parachain
// # The Call will be dispatched by the Sovereign account in the Parachain, which is 5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM or
// # public key: 0x0000000000000000000000000000000000000000000000000000000000000000
// # Thus, the Sovereign Account should have some balance (1K at least for the following samples)

// ----------------------------- TRANSFER BALANCE ---------------------------------------------
// # Transact Call -> 0x1e00008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a480f0080c6a47e8d03 ->
// # in Parachain -> balance.transfer 1k to Bob

// $ yarn dev local transact -s //Alice -p 2000 -t SovereignAccount -w 1000000000 -c 0x1e00008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a480f0080c6a47e8d03

// ------------------- TRANSFER BALANCE IN A BRIDGE MESSAGE -----------------------------------
// # It will be only possible for a UMP, since the Relay Chain is the one who implements the Bridges pallet
// # For DMP, it would be only possible if the parachain implements the bridge pallet
// # An alternative can be trying to send a Xcm to HERE, and see if the Relay Chain is able to executed the
// # bridge dispachable encoded in the Transact Xcm

// ============================================================================================
// =========================== TRANSACT - REMOTE ==============================================
// ============================================================================================

// -------------------------------- SOURCE ORIGIN ---------------------------------------------
// It is expected that only TARGET ORIGIN will work, as the Transact Xcm signer should execute a sudo dispatchable
// Remember to send some balance to the Sovereign Account in Target contest (Rococo) -> 5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM
//
// -------------------------------- TARGET ORIGIN ---------------------------------------------
//
// $ yarn dev remote -o TargetAccount -t //Alice -f 10000000000000 -l 0x00000000 transact -s //Alice -p 2000 -t SovereignAccount -w 1000000000 -c 0x1e00008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a480f0080c6a47e8d03
