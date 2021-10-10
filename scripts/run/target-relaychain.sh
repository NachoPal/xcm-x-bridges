#!/bin/bash
. ./config.sh

# ###############################################################################
# ### Target chain startup ######################################################
# ###############################################################################
echo "Target Relaychain start up"

./bin/polkadot build-spec\
  --disable-default-bootnode\
  --chain $RUNTIME_RELAY_TARGET > ./resources/chain-specs/target.json

./bin/polkadot build-spec\
  --chain ./resources/chain-specs/target.json\
  --raw\
  --disable-default-bootnode > ./resources/chain-specs/target-raw.json

# RUST_LOG=runtime=trace,runtime::bridge=trace,runtime::bridge-messages=trace
RUST_LOG=xcm::send_xcm=trace,nacho=debug
export RUST_LOG

# start Target nodes
./bin/polkadot\
  -lerror\
	--chain=$RUNTIME_RELAY_TARGET\
	--alice\
	--base-path=data/target-alice.db\
	--node-key-file=resources/node-keys/target-alice\
	--port=30337\
	--prometheus-port=9617\
	--rpc-port=9935\
	--ws-port=$TARGET_PORT\
	--execution=Native\
  --no-mdns\
	--rpc-cors=all\
	--unsafe-rpc-external\
	--unsafe-ws-external &> ./logs/target-alice.log&

./bin/polkadot\
  -lerror\
	--chain=$RUNTIME_RELAY_TARGET\
	--bob\
	--base-path=data/target-bob.db\
  --node-key-file=resources/node-keys/target-bob\
	--bootnodes=/ip4/127.0.0.1/tcp/30337/p2p/12D3KooWCNRrHY8vJgnh6trkWw9nGFM2h4MJvzSqCRisxDXkdX3E\
	--port=30338\
	--prometheus-port=9618\
	--rpc-port=9936\
	--ws-port=9949\
	--execution=Native\
  --no-mdns\
	--rpc-cors=all\
	--unsafe-rpc-external\
  --unsafe-ws-external &> ./logs/target-bob.log&