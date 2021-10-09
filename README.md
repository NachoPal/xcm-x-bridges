# Introduction

The goal of this repository is to describe and provide samples of all possible XCM interactions between Parachains, Relay Chains, and a Bridged counterpart context. The samples are written in TypeScript and connect to a locally deployed infra thanks to [Polkadot JS API](https://github.com/polkadot-js/api).

The necessary infra to run and test the samples can be easily deployed with a single command. This repository depends on:
- [Polakadot](github.com/paritytech/polkadot) (Relay Chain)
- [Cumulus](github.com/paritytech/cumulus) (Parachain)
- [Bridges Common](github.com/paritytech/parity-bridges-common) (Bridge Relayers)

Note that the three projects are in continous development. For that reason, it is very important to pay attention on using compatible versions between them. In addition, since XCM versioning and configuration differs for each runtime, it becomes an extra factor to take into account when running or building new samples.

To make sure you are able to successfully run the samples locally, checkout to one of the available releases in this repository. The release name format defines what are the compatible versions you should checkout in the rest of respositories and what runtime was used.

<u>Release format</u>:
  ```
  release-<polkadot/cumulus_version>-<bridges_common_version>-<runtime>
  ```
For instance, `release-0.9.10-0.9-rococo` is telling us that the release was tested against the following versions
- Polkadot: `release-v0.9.10`
- Cumulus: `polkadot-v0.9.10`
- Bridges Common: `v0.9`
- Runtime: `rococo-local`

# Table of Contents
[Set Up](https://github.com/NachoPal/rococo-wococo-xcm#set-up)

[Deployment](https://github.com/NachoPal/rococo-wococo-xcm#deployment)

[Destroy](https://github.com/NachoPal/rococo-wococo-xcm#destroy)

# Set Up
Unless you want to run the samples against an unimplemented runtime, the default values should be valid and the only variables you should update in `./config.sh` are:
* `POLKADOT_REPO_PATH`, `PARACHAIN_REPO_PATH` and `BRIDGES_REPO_PATH` point to the directories where the three previously mentioned repositories were cloned. Remember also to checkout the corresponding versions.

To change the Relay Chain runtime:
* `RUNTIME = <runtime>`

# Deployment

`$ ./start`

# Destroy
`$ ./stop`
