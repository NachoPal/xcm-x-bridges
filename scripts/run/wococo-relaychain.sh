#!/bin/bash

# ###############################################################################
# ### Woocco chain startup ######################################################
# ###############################################################################
echo "Wococo Relaychain start up"

./bin/polkadot build-spec --disable-default-bootnode --chain wococo-local > ./resources/chain-spec-wococo-local.json
./bin/polkadot build-spec --chain ./resources/chain-spec-wococo-local.json --raw --disable-default-bootnode > ./resources/chain-spec-wococo-local-raw.json

# RUST_LOG=runtime=trace,runtime::bridge=trace,runtime::bridge-messages=trace
RUST_LOG=xcm::send_xcm=trace
export RUST_LOG

# start Wococo nodes
./bin/polkadot\
	--chain=wococo-local\
	--alice\
	--base-path=data/wococo-alice.db\
  --bootnodes=/ip4/127.0.0.1/tcp/30336/p2p/12D3KooWHTYUAtF6ry4mrYTufzLfDSJ725mYc85rSKFzuFkXEvFT\
	--node-key=79cf382988364291a7968ae7825c01f68c50d679796a8983237d07fe0ccf363c\
	--port=30338\
	--prometheus-port=9617\
	--rpc-port=9935\
	--ws-port=9946\
	--execution=Native\
  --no-mdns\
	--rpc-cors=all\
	--unsafe-rpc-external\
	--unsafe-ws-external &> ./logs/wococo-alice.log&

./bin/polkadot\
	--chain=wococo-local\
	--bob\
	--base-path=data/wococo-bob.db\
	--bootnodes=/ip4/127.0.0.1/tcp/30335/p2p/12D3KooWKWnNktXrugMMYa4NFB18qxwF49rABJgHiLGJq7uVfs5E\
	--node-key=79cf382988364291a7968ae7825c01f68c50d679796a8983237d07fe0ccf363d\
	--port=30339\
	--prometheus-port=9618\
	--rpc-port=9936\
	--ws-port=9947\
	--execution=Native\
  --no-mdns\
	--rpc-cors=all\
	--unsafe-rpc-external\
  --unsafe-ws-external &> ./logs/wococo-bob.log&