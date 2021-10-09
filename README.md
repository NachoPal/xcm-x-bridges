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
* [DMP](https://github.com/NachoPal/xcm-x-bridges#dmp)

# Introduction

The goal of this repository is to describe and provide samples of all possible XCM interactions between Parachains, Relay Chains, and also an optional Bridged counterpart context. The samples are written in TypeScript and connect to a locally deployed infra thanks to [Polkadot JS API](https://github.com/polkadot-js/api).

The necessary infra to run and test the samples can be easily deployed with a single command. This repository depends on:
- [Polakadot](github.com/paritytech/polkadot) - Relay Chain
- [Cumulus](github.com/paritytech/cumulus) - Parachain
- [Bridges Common](github.com/paritytech/parity-bridges-common) - Bridge Relayers (optional)

# Versioning

Note that the three projects are in continous development. For that reason, it is very important to pay attention on using compatible versions between them. In addition, since XCM versioning and configuration differs for each runtime, it becomes an extra factor to take into account when running or building new samples.

To make sure you are able to successfully run the samples locally, checkout to one of the available releases in this repository. The release name format defines what are the compatible versions you should checkout for the rest of respositories and what runtimes were used.

<u>Release format</u>:
  ```
  release-<polkadot/cumulus_version>-<bridges_common_version>-<source_runtime>-<source_runtime>-<target_runtime>
  ```
For instance, `release-0.9.10-0.9-rococo-wococo` is telling us that the release was tested against the following versions
- Polkadot: `release-v0.9.10`
- Cumulus: `polkadot-v0.9.10`
- Bridges Common: `v0.9`
- Runtimes: `rococo-local` and `wococo-local`

It might be cases where a certain runtime is not yet supported by _Bridges Common_. Therefore, _Bridges Common_ and a target runtime are not necessary. For those cases, `release-0.9.10-rococo` woulde be telling us that the release was tested against the following versions
- Polkadot: `release-v0.9.10`
- Cumulus: `polkadot-v0.9.10`
- Runtime: `rococo-local`

# Set Up
Unless you want to run the samples against unimplemented runtimes, the default values should be valid and the only variables you should update in `./config.sh` are:
* `POLKADOT_REPO_PATH`, `PARACHAIN_REPO_PATH` and `BRIDGES_REPO_PATH` point to the directories where the three previously mentioned repositories were cloned. Remember also to checkout the corresponding versions.

To change the Relay Chain runtimes:
* `RUNTIME_SOURCE=<source_runtime>`
* `RUNTIME_TARGET=<target_runtime>`

# Deployment

`$ ./start`

# Destroy
`$ ./stop`

# Messaging Overview
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
  yarn start <MESSAGING> <TARGET> [OPTIONS] <XCM> [OPTIONS]
```

* `MESSAGING`: mechanism for message passing
  - `dmp`: Downward Message Passing
  - `ump`: Upward Message Passing
  - `hmp`: Horizontal Message Passing
</br>
* `TARGET`: context the message is going to be executed
  - `local`: the message is executed in the _Source Chain_
  - `remote`: the message is passed through the bridge to the _Target Chain_ and executed there.
    - `-l`: bridge message lane | `0x00000000` (Default)
    - `-f`: fee | `10000000000000` (Default)
    - `-o`: origin | `SourceAccount` (Default)
      - `SourceAccount`: represents an account without a private key on the target-chain. This account will be generated/derived using the account ID of the sender on the source-chain
      - `TargetAccount`: represents an account with a private key on the target-chain. The sender on the source-chain needs to prove ownership of this account by using their target-chain private key to sign a proof.
      - `SourceRoot`: represents the source-chain's Root account on the target-chain. This origin can only be dispatched on the target chain if the "send message" request was made by the Root origin of the source chain - otherwise the message will fail to be dispatched
</br>
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
      
