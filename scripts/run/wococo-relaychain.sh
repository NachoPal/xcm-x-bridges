#!/bin/bash

# ###############################################################################
# ### Woocco chain startup ######################################################
# ###############################################################################
echo "Wococo Relaychain start up"

./bin/polkadot build-spec --disable-default-bootnode --chain wococo-local > ./resources/chain-specs/wococo-local.json
./bin/polkadot build-spec --chain ./resources/chain-specs/wococo-local.json --raw --disable-default-bootnode > ./resources/chain-specs/wococo-local-raw.json

# RUST_LOG=runtime=trace,runtime::bridge=trace,runtime::bridge-messages=trace
RUST_LOG=xcm::send_xcm=trace
export RUST_LOG

# start Wococo nodes
./bin/polkadot\
	--chain=wococo-local\
	--alice\
	--base-path=data/wococo-alice.db\
	--node-key-file=resources/node-keys/wococo-alice\
	--port=30337\
	--prometheus-port=9617\
	--rpc-port=9935\
	--ws-port=9948\
	--execution=Native\
  --no-mdns\
	--rpc-cors=all\
	--unsafe-rpc-external\
	--unsafe-ws-external &> ./logs/wococo-alice.log&

./bin/polkadot\
	--chain=wococo-local\
	--bob\
	--base-path=data/wococo-bob.db\
  --node-key-file=resources/node-keys/wococo-bob\
	--bootnodes=/ip4/127.0.0.1/tcp/30337/p2p/12D3KooWCNRrHY8vJgnh6trkWw9nGFM2h4MJvzSqCRisxDXkdX3E\
	--port=30338\
	--prometheus-port=9618\
	--rpc-port=9936\
	--ws-port=9949\
	--execution=Native\
  --no-mdns\
	--rpc-cors=all\
	--unsafe-rpc-external\
  --unsafe-ws-external &> ./logs/wococo-bob.log&