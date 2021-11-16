# Table of Contents
[Introduction](https://github.com/NachoPal/xcm-x-bridges#introduction)

[Versioning](https://github.com/NachoPal/xcm-x-bridges#versioning)

[Set Up](https://github.com/NachoPal/xcm-x-bridges#set-up)

[Deployment](https://github.com/NachoPal/xcm-x-bridges#deployment)

[Destroy](https://github.com/NachoPal/xcm-x-bridges#destroy)

[Tests](https://github.com/NachoPal/xcm-x-bridges#tests)

[Local Messaging](https://github.com/NachoPal/xcm-x-bridges#local-messaging)

[Remote Messaging](https://github.com/NachoPal/xcm-x-bridges#remote-messaging)

[Vertical Message Passing](https://github.com/NachoPal/xcm-x-bridges#vertical-message-passing)
  * [DMP](https://github.com/NachoPal/xcm-x-bridges#dmp)
    - [Local](https://github.com/NachoPal/xcm-x-bridges#local)
    - [Remote](https://github.com/NachoPal/xcm-x-bridges#remote)
  * [UMP](https://github.com/NachoPal/xcm-x-bridges#ump)

[Horizontal Message Passing](https://github.com/NachoPal/xcm-x-bridges#horizontal-message-passing)

[CLI](https://github.com/NachoPal/xcm-x-bridges#cli)

[Samples](https://github.com/NachoPal/xcm-x-bridges#samples)
* [DMP](https://github.com/NachoPal/xcm-x-bridges#dmp-1)
  - [Teleport Asset](https://github.com/NachoPal/xcm-x-bridges#teleport-asset)
    - [Local](https://github.com/NachoPal/xcm-x-bridges#local-1)
    - [Remote](https://github.com/NachoPal/xcm-x-bridges#remote-1)
  - [Transact](https://github.com/NachoPal/xcm-x-bridges#transact)
    - [Local](https://github.com/NachoPal/xcm-x-bridges#local-2)
    - [Remote](https://github.com/NachoPal/xcm-x-bridges#remote-2)

[Contributions](https://github.com/NachoPal/xcm-x-bridges#contributions)
# Introduction

The goal of this repository is to describe and provide samples of all possible XCM interactions between Parachains, Relay Chains, and also an optional Bridged counterpart context. The samples are written in TypeScript and connect to a locally deployed infra thanks to [Polkadot JS API](https://github.com/polkadot-js/api).

In addition, a set of Integration Test are included under the `./test` folder. The tests are not limited to XCM and they also check functionality from _Common Good_ parachains such as _Statemint/mine_

The necessary infra to run and test the samples can be easily deployed with a single command. This repository depends on:
- [Polakadot](github.com/paritytech/polkadot) - Relay Chain
- [Cumulus](github.com/paritytech/cumulus) - Parachain
- [Bridges Common](github.com/paritytech/parity-bridges-common) - Bridge Relayers (optional)

# Versioning

Note that the three projects are in continous development. For that reason, it is very important to pay attention on using compatible versions between them. In addition, since XCM versioning and configuration differs for each runtime, it becomes an extra factor to take into account when running or building new samples.

To make sure you are able to successfully run the samples locally, checkout to one of the available releases in this repository. The release name format defines what are the compatible versions you should checkout for the rest of respositories and what runtimes were used.

**Release format**:
  ```
  release-<parachain_version>-<polkadot_version_relay>-<source_para_runtime>_<source_relay_runtime>-<target_relay_runtime>_<target_para_runtime>-<bridges_common_version>
  ```
For instance, `release-0.9.10-0.9.10-rococo_rococo-wococo_rococo-0.9` is telling us that the release was tested against the following versions
- **Polkadot**: `release-v0.9.10`
- **Cumulus**: `polkadot-v0.9.10`
- **Relay Chain Runtimes**: `rococo-local` and `wococo-local`
- **Parachains Runtimes**: `rococo-local` and `rococo-local`
- **Bridges Common**: `v0.9`

There might be cases where a certain runtime is not yet supported by _Bridges Common_, or we just do not want to implement it. Therefore, _Bridges Common_ and the target runtimes are not necessary. For those cases, `release-v5-0.9.12-westmint_wested` woulde be telling us that the release was tested against the following versions
- **Polkadot**: `release-v0.9.12`
- **Cumulus**: `release-statemine-v5`
- **Relay Chain Runtime**: `westend-local`
- **Parachains Runtime**: `westmint-local`

**NOTE**: any reference to _REMOTE MESSAGING_ in this document WILL NOT APPLY for those releases where the bridged counter part is not implemented.

# Set Up
The default values you can find in the `.env` file should be correct. The only variables you have to make sure to update accordingly to your local set up are:
* `POLKADOT_REPO_PATH`, `PARACHAIN_REPO_PATH` and `BRIDGES_REPO_PATH` should point to the directories where the three previously mentioned repositories were cloned. Remember to checkout the corresponding releases.

In addition, to avoid long wait times for the Parachain to be onboarded, reduce the session length in the relay chain:
```rust
pub const EPOCH_DURATION_IN_SLOTS: BlockNumber = 10;
```

In case you want to build your own release in this repository, you might want to modify the following variables:

* To change the Relay Chain runtimes:
  * `RUNTIME_RELAY_SOURCE`
  * `RUNTIME_RELAY_TARGET`

* To change the Parachains runtimes:
  * `RUNTIME_PARA_SOURCE`
  * `RUNTIME_PARA_TARGET`

* To define if a bridged counterpart is expected:
  * `BRIDGED` (true/false)

# Deployment
`$ ./start.sh`

# Destroy
`$ ./stop.sh`

# Tests
`$ yarn test`

Implemented tests:
- **xcm**
  - `$ yarn test:limited-teleport-asset` -> Limited Teleport Asset (DMP & UMP)
  - `$ yarn test:transact` -> Transact (DMP & UMP)

# Local Messaging
Relay Chains have a few different mechanisms that are responsible for message passing. They can be generally divided on two categories: Horizontal and Vertical. Horizontal Message Passing (HMP) refers to mechanisms that are responsible for exchanging messages between parachains. Vertical Message Passing (VMP) is used for communication between the relay chain and parachains.
# Remote Messaging
All previous mechanisms can also be encapsuladed in a bridge message and executed "remotely" in a target context.

![general view](/diagrams/general-view.png)

1.  A bridge message **payload** is formed by:
    ```javascript
      const payload = {
        call          
        origin        
        spec_version  
        weight       
      }
    ``` 
    - `call`: The **encoded call data** of the **XCM** to be executed in the _Target Relay Chain_
    - `origin`: Defines the Call origin to be used during the dispatch in the _Target Relay Chain_. There are three types:
      - `SourceAccount`: represents an account without a private key on the target-chain. This account (_Companion Account_) will be generated/derived using the account ID of the sender on the source-chain.
      - `TargetAccount`: represents an account with a private key on the target-chain. The sender on the source-chain needs to prove ownership of this account by using their target-chain private key to sign a proof.
      - `SourceRoot`: represents the source-chain's Root account on the target-chain. This origin can only be dispatched on the target chain if the "send message" request was made by the Root origin of the source chain - otherwise the message will fail to be dispatched
    - `spec_version`: The expected _Target Relay Chain_ runtime version. Message will not be dipatched if it does not match.
    - `weight`: Weight of the call, declared by the message sender. If it is less than actual static weight, the call is not dispatched.
2. A `bridgeMessages.sendMessage(laneId, payload, deliveryAndDispatchFee)` extrinsic is signed and sent by an origin in the source context. The bridge message pallet name varies based on the runtime implementation and the name of the _Target Relay Chain_ it is aiming to send the message. For example, for Rococo runtime the pallet name to bridge to Wococo is `bridgeWococoMessages`. Althought the bridge pallets might have different naming, all of them are instances of `pallet_bridge_messages`.
3. If the Message is accepted, it is stored on-chain in the `OutboundMessages` storage.
4. The Bridge Message Relayer queries the Messages Outbound Lane from the _Source Relay Chain_ and pass the message over to the Messages Inbound Lane of the _Target Relay Chain_
5. Finally, the XCM message is picked up from the Inbound Lane and dispatched by the corresponding `pallet_bridge_dispatch` in the Target context.

# Vertical Message Passing

## DMP
### Local
Downward Message Passing (DMP) is a mechanism for delivering messages to parachains from the relay chain.

### Remote
![dmp remote](/diagrams/dmp-remote.png)

1. XCM encoded call and messages payload are generated
2. Bridge Message is signed and sent with the XCM encoded call as part of its payload
3. Message is accepted and stored in `OtboundMessages`
4. The Bridge Message Relayer query the message from the _Source Relay Chain_ Outbound Lane and pass it over the _Target Relay Chain_
5. The XCM enconded call is dispatched in the _Target Relay Chain_

## UMP
Upward Message Passing (UMP) is a mechanism responsible for delivering messages in the opposite direction: from a parachain up to the relay chain.

## Horizontal Message Passing

# CLI

A Comand Line Interface with the following format is available to run the samples:

```
  yarn dev <MESSAGING> <TARGET> [OPTIONS] <XCM> [OPTIONS]
```

* `MESSAGING`: mechanism for message passing
  - `dmp`: Downward Message Passing
  - `ump`: Upward Message Passing
  - `hmp`: Horizontal Message Passing

* `TARGET`: context the message is going to be executed
  - `local`: the message is executed in the _Source Chain_
  - `remote`: the message is passed through the bridge to the _Target Chain_ and executed there.
    - `-l`: bridge message lane | `0x00000000` (Default)
    - `-f`: fee | `10000000000000` (Default)
    - `-o`: origin | `SourceAccount` (Default)
* `XCM`: XCM instruction type. All instructions but `teleport-asset` will fallback to the `send()` dispatchable from the `xcmPallet`
  - `teleport-asset`: call to the `teleportAsset()` dispatachable call from the `xcmPallet`
    - `-p`: parachain ID destiantion | `2000` (Default)
    - `-s`: extrinsic signer account (uri or private key) | `//Alice` (Default)
    - `-b`: beneficiary account
    - `-a`: amount to teleport
    - `-f`: fee asset item
  - `transact`: `Transact`
    - `-p`: parachain ID destiantion | `2000` (Default)
    - `-s`: extrinsic signer account (uri or private key) | `//Alice` (Default)
    - `-t`: origin type
      - `SovereignAccount`
      - `Native`
      - `Superuser`
      - `Xcm`
    - `-c`: encoded call to be executed in the parachain target
    - `-w`: required weight at most
      
# Samples

## DMP

### Teleport Asset
#### Local

```
yarn dev dmp local teleport-asset -s //Alice -p 2000 -b //Bob -a 1000000000000000 -f 0
```

![dmp local teleport](/diagrams/dmp-local-teleport-asset.png)

1. _Alice_ signs and sends a `xcmPallet.teleportAssets(destination, beneficiary, assets, destWeight)` extrinsic
2. A `WithdrawAsset` XCM is executed `Asset` amount is withdrawn from _Alice_ and deposited in the _Check Account_
3. A `InitiateTeleport` XCM with two effects (`BuyExecution` and `DepositAsset`) is stored in the Relay Chain storage
4. The XCM is read from the Relay Chain storage by the Parachain Full Node
5. `InitiateTeleport` is executed, `Asset` amount is minted and deposited in _Bob's_ account.

#### Remote

* `SourceAccount`:
The Xcm is executed by the _Companion Account_ in the target _Relay Chain_.
Therefore, the _Companion Account_ should have some balance (1K at least for the following sample). `//Alice` _Companion Account_ in Wococo is: `5GfixJndjo7RuMeaVGJFXiDBQogCHyhxKgGaBkjs6hj15smD`

                
      yarn dev dmp remote -f 10000000000000 -l 0x00000000 teleport-asset -s //Alice -p 2000 -b //Bob -a 1000000000000000 -f 0
                

* `TargetAccount`:
The Xcm is executed by an owned account in the target _Relay Chain_

                
      yarn dev dmp remote -o TargetAccount -t //Alice -f 10000000000000 -l 0x00000000 teleport-asset -s //Alice -p 2000 -b //Bob -a 1000000000000000 -f 0
                

### Transact
#### Local
Only _Root Account_ (sudo) is able to send a `Transact` XCM to a _Parachain_. The Call will be dispatched by the _Sovereign Account_ in the _Parachain_
Thus, the source _Sovereign Account_, `5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM` should have some balance (1K at least for the following sample)

The encoded `Call` that `Transact` instruction will dispatch is `0x1e00008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a480f0080c6a47e8d03` and corresponds to `balance.transfer()` of 1k to `//Bob`

```
yarn dev dmp local transact -s //Alice -p 2000 -t SovereignAccount -w 1000000000 -c 0x1e00008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a480f0080c6a47e8d03
```

![dmp local transact](/diagrams/dmp-local-transact.png)

1. The encoded call `balance.transfer(dest, value)` to be executed by the `Transact` XCM is generated.
2. The `Transact` XCM is formed with `originType = SovereignAccount`
      ```javascript
        const xcm = { Transact: { originType, requireWeightAtMost, encodedCall } }
      ```
3. _Alice_ signs and send the extrinsic `sudo.sudo(api.tx.xcmPallet.send(destination, xcm))`
4. The `Transact` XCM is stored in the Relay Chain
5. The XCM is read from the Relay Chain storage by the Parachain Full Node
6. The encoded call in the `Transact` XCM is executed in the Parachain by its Sovereign Account, transfering the balance value to _Bob_

**NOTE**: Sending a `Transact` with a encoded `bridgeWococoMessages.sendMessage()` dispatch is not possible as the bridge pallet is only implemented in the _Parachain_. Therefore, DMP messages are not possible. Only a UMP or HMP would work. The alternative would be to try to send a `Transact` with destination `Here` instead of the Parachain.
#### Remote

* `SourceAccount`:
This case is not possible because a `Transact` XCM can only be executed by Root.

* `TargetAccount`:
The Root Account private key of the target key should be know to be able to use this option. The _Sovereign Account_ `5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM` of the target _Parachain_ should have some balance.

                
      yarn dev dmp remote -o TargetAccount -t //Alice -f 10000000000000 -l 0x00000000 transact -s //Alice -p 2000 -t SovereignAccount -w 1000000000 -c 0x1e00008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a480f0080c6a47e8d03
                
# Contributions

PRs and contributions are welcome :)