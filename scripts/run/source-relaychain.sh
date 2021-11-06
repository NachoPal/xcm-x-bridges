#!/bin/bash

###############################################################################
### Source chain startup ######################################################
###############################################################################
echo "Source Relaychain start up"

./bin/polkadot build-spec\
  --disable-default-bootnode\
  --chain $RUNTIME_RELAY_SOURCE > ./resources/chain-specs/source.json

./bin/polkadot build-spec\
  --chain ./resources/chain-specs/source.json\
  --raw\
  --disable-default-bootnode > ./resources/chain-specs/source-raw.json

# RUST_LOG=runtime=trace,runtime::bridge=trace,runtime::bridge-messages=trace
RUST_LOG=xcm::send_xcm=trace,nacho=debug
export RUST_LOG

# start Source nodes
./bin/polkadot\
  -lerror\
	--chain=$RUNTIME_RELAY_SOURCE\
	--alice\
	--base-path=data/source-alice.db\
  --node-key-file=resources/node-keys/source-alice\
	--port=30333\
	--prometheus-port=9615\
	--rpc-port=9933\
	--ws-port=$SOURCE_PORT\
	--execution Native\
  --no-mdns\
	--rpc-cors=all\
	--unsafe-rpc-external\
	--unsafe-ws-external &> ./logs/source-alice.log&

./bin/polkadot\
  -lerror\
	--chain=$RUNTIME_RELAY_SOURCE\
	--bob\
	--base-path=data/source-bob.db\
  --node-key-file=resources/node-keys/source-bob\
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
	--unsafe-ws-external &> ./logs/source-bob.log&