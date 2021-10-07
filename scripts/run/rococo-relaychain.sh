#!/bin/bash

###############################################################################
### Rococo chain startup ######################################################
###############################################################################
echo "Rococo Relaychain start up"

./bin/polkadot build-spec --disable-default-bootnode --chain rococo-local > ./resources/chain-specs/rococo-local.json
./bin/polkadot build-spec --chain ./resources/chain-specs/rococo-local.json --raw --disable-default-bootnode > ./resources/chain-specs/rococo-local-raw.json

# RUST_LOG=runtime=trace,runtime::bridge=trace,runtime::bridge-messages=trace
RUST_LOG=xcm::send_xcm=trace,nacho=debug
export RUST_LOG

# start Rococo nodes
./bin/polkadot\
  -lerror\
	--chain=rococo-local\
	--alice\
	--base-path=data/rococo-alice.db\
  --node-key-file=resources/node-keys/rococo-alice\
	--port=30333\
	--prometheus-port=9615\
	--rpc-port=9933\
	--ws-port=9944\
	--execution Native\
  --no-mdns\
	--rpc-cors=all\
	--unsafe-rpc-external\
	--unsafe-ws-external &> ./logs/rococo-alice.log&

./bin/polkadot\
  -lerror\
	--chain=rococo-local\
	--bob\
	--base-path=data/rococo-bob.db\
  --node-key-file=resources/node-keys/rococo-bob\
	--bootnodes=/ip4/127.0.0.1/tcp/30333/p2p/12D3KooWDso5DmDHFrGnFWXVWNWd7spQp6mw1CgDp4MKcacEk1QP\
	--node-key=4f9d0146dd9b7b3bf5a8089e3880023d1df92057f89e96e07bb4d8c2ead75bbd\
	--port=30334\
	--prometheus-port=9616\
	--rpc-port=9934\
	--ws-port=9945\
	--execution Native\
  --no-mdns\
	--rpc-cors=all\
	--unsafe-rpc-external\
	--unsafe-ws-external &> ./logs/rococo-bob.log&