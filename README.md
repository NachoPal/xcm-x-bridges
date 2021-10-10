# Table of Contents
[Introduction](https://github.com/NachoPal/xcm-x-bridges#introduction)

[Versioning](https://github.com/NachoPal/xcm-x-bridges#versioning)

[Set Up](https://github.com/NachoPal/xcm-x-bridges#set-up)

[Deployment](https://github.com/NachoPal/xcm-x-bridges#deployment)

[Destroy](https://github.com/NachoPal/xcm-x-bridges#destroy)

[Messaging](https://github.com/NachoPal/xcm-x-bridges#messaging)
* [Vertical Message Passing](https://github.com/NachoPal/xcm-x-bridges#vertical-message-passing)
  - [DMP](https://github.com/NachoPal/xcm-x-bridges#dmp)
  - [UMP](https://github.com/NachoPal/xcm-x-bridges#ump)
* [Horizontal Message Passing](https://github.com/NachoPal/xcm-x-bridges#horizontal-message-passing)

[CLI](https://github.com/NachoPal/xcm-x-bridges#cli)

[Samples](https://github.com/NachoPal/xcm-x-bridges#samples)
* [DMP](https://github.com/NachoPal/xcm-x-bridges#dmp-1)
  - [Teleport Asset](https://github.com/NachoPal/xcm-x-bridges#teleport-asset)
    - [Local](https://github.com/NachoPal/xcm-x-bridges#local)
    - [Remote](https://github.com/NachoPal/xcm-x-bridges#remote)
  - [Transact](https://github.com/NachoPal/xcm-x-bridges#transact)
    - [Local](https://github.com/NachoPal/xcm-x-bridges#local-1)
    - [Remote](https://github.com/NachoPal/xcm-x-bridges#remote-1)

# Introduction

The goal of this repository is to describe and provide samples of all possible XCM interactions between Parachains, Relay Chains, and also an optional Bridged counterpart context. The samples are written in TypeScript and connect to a locally deployed infra thanks to [Polkadot JS API](https://github.com/polkadot-js/api).

The necessary infra to run and test the samples can be easily deployed with a single command. This repository depends on:
- [Polakadot](github.com/paritytech/polkadot) - Relay Chain
- [Cumulus](github.com/paritytech/cumulus) - Parachain
- [Bridges Common](github.com/paritytech/parity-bridges-common) - Bridge Relayers (optional)

# Versioning

Note that the three projects are in continous development. For that reason, it is very important to pay attention on using compatible versions between them. In addition, since XCM versioning and configuration differs for each runtime, it becomes an extra factor to take into account when running or building new samples.

To make sure you are able to successfully run the samples locally, checkout to one of the available releases in this repository. The release name format defines what are the compatible versions you should checkout for the rest of respositories and what runtimes were used.

**Release format**:
  ```
  release-<polkadot/cumulus_version>-<source_para_runtime>::<source_relay_runtime><><target_relay_runtime>::<target_para_runtime>-<bridges_common_version>
  ```
For instance, `release-0.9.10-rococo::rococo<>wococo::rococo-0.9` is telling us that the release was tested against the following versions
- **Polkadot**: `release-v0.9.10`
- **Cumulus**: `polkadot-v0.9.10`
- **Relay Chain Runtimes**: `rococo-local` and `wococo-local`
- **Parachains Runtimes**: `rococo-local` and `rococo-local`
- **Bridges Common**: `v0.9`

There might be cases where a certain runtime is not yet supported by _Bridges Common_, or we just do not want to implement it. Therefore, _Bridges Common_ and a target runtimes are not necessary. For those cases, `release-0.9.10-rococo::rococo` woulde be telling us that the release was tested against the following versions
- **Polkadot**: `release-v0.9.10`
- **Cumulus**: `polkadot-v0.9.10`
- **Relay Chain Runtime**: `rococo-local`
- **Parachains Runtime**: `rococo-local`

# Set Up
Unless you want to run the samples against unimplemented runtimes, the default values should be valid and the only variables you should update in `./config.sh` are:
* `POLKADOT_REPO_PATH`, `PARACHAIN_REPO_PATH` and `BRIDGES_REPO_PATH` point to the directories where the three previously mentioned repositories were cloned. Remember also to checkout the corresponding versions.

To change the Relay Chain runtimes:
* `RUNTIME_RELAY_SOURCE=<source_relay_runtime>`
* `RUNTIME_RELAY_TARGET=<target_relay_runtime>`

To change the Parachains runtimes:
* `RUNTIME_PARA_SOURCE=<source_para_runtime>`
* `RUNTIME_PARA_TARGET=<target_para_runtime>`

# Deployment

`$ ./start.sh`

# Destroy
`$ ./stop.sh`

# Messaging
Relay Chains have a few different mechanisms that are responsible for message passing. They can be generally divided on two categories: Horizontal and Vertical. Horizontal Message Passing (HMP) refers to mechanisms that are responsible for exchanging messages between parachains. Vertical Message Passing (VMP) is used for communication between the relay chain and parachains.

## Vertical Message Passing

### DMP
Downward Message Passing (DMP) is a mechanism for delivering messages to parachains from the relay chain.

### UMP
Upward Message Passing (UMP) is a mechanism responsible for delivering messages in the opposite direction: from a parachain up to the relay chain.

## Horizontal Message Passing

# CLI

A Comand Line Interface is available to run the samples. The command has the following format:

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
      - `SourceAccount`: represents an account without a private key on the target-chain. This account will be generated/derived using the account ID of the sender on the source-chain
      - `TargetAccount`: represents an account with a private key on the target-chain. The sender on the source-chain needs to prove ownership of this account by using their target-chain private key to sign a proof.
      - `SourceRoot`: represents the source-chain's Root account on the target-chain. This origin can only be dispatched on the target chain if the "send message" request was made by the Root origin of the source chain - otherwise the message will fail to be dispatched

* `XCM`: XCM instruction type. All instructions but `teleport-asset` will fallback to the `send()` dispatchable from the `xcmPallet`
  - `teleport-asset`: call to the `teleportAsset()` dispatachable call from the `xcmPallet`
    - `-p`: parachain ID destiantion | `2000` (Default)
    - `-s`: extrinsic signer account (uri or private key) | `//Alice` (Default)
    - `-b`: beneficiary account
    - `-a`: amount to teleport
    - `-w`: destination weight
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
$ yarn dev dmp local teleport-asset -s //Alice -p 2000 -b //Bob -a 1000000000000000 -w 100000000000
```

#### Remote

* `SourceAccount`:
The Xcm is executed by the _Companion Account_ in the target _Relay Chain_.
Therefore, the _Companion Account_ should have some balance (1K at least for the following sample). `//Alice` _Companion Account_ in Wococo is: `5GfixJndjo7RuMeaVGJFXiDBQogCHyhxKgGaBkjs6hj15smD`

                
      $ yarn dev dmp remote -f 10000000000000 -l 0x00000000 teleport-asset -s //Alice -p 2000 -b //Bob -a 1000000000000000 -w 100000000000
                

* `TargetAccount`:
The Xcm is executed by an owned account in the target _Relay Chain_

                
      $ yarn dev dmp remote -o TargetAccount -t //Alice -f 10000000000000 -l 0x00000000 teleport-asset -s //Alice -p 2000 -b //Bob -a 1000000000000000 -w 100000000000
                

### Transact
#### Local
Only _Root Account_ (sudo) is able to send a `Transact` XCM to a _Parachain_. The Call will be dispatched by the _Sovereign Account_ in the _Parachain_
Thus, the source _Sovereign Account_, `5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM` should have some balance (1K at least for the following sample)

The encoded `Call` that `Transact` instruction will dispatch is `0x1e00008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a480f0080c6a47e8d03` and corresponds to `balance.transfer()` of 1k to `//Bob`

```
$ yarn dev dmp local transact -s //Alice -p 2000 -t SovereignAccount -w 1000000000 -c 0x1e00008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a480f0080c6a47e8d03
```

NOTE: Sending a `Transact` with a encoded `bridgeWococoMessages.sendMessage()` dispatch is not possible as the bridge pallet is only implemented in the _Parachain_. Therefore, DMP messages are not possible. Only a UMP or HMP would work. The alternative would be to try to send a `Transact` with destination `Here` instead of the Parachain.
#### Remote

* `SourceAccount`:
This case is not possible because a `Transact` XCM can only be executed by Root.

* `TargetAccount`:
The Root Account private key of the target key should be know to be able to use this option. The _Sovereign Account_ `5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM` of the target _Parachain_ should have some balance.

                
      $ yarn dev dmp remote -o TargetAccount -t //Alice -f 10000000000000 -l 0x00000000 transact -s //Alice -p 2000 -t SovereignAccount -w 1000000000 -c 0x1e00008eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a480f0080c6a47e8d03
                