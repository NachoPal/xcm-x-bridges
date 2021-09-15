#!/bin/bash

. ./scripts/prelude.sh

mkdir bin || true
mkdir data || true
mkdir logs || true
mkdir resources || true
rm -rf data/*
rm -rf resources/*
rm -rf logs/*

. ./scripts/build-polkadot-node.sh
. ./scripts/build-substrate-relay.sh
. ./scripts/build-parachain-collator.sh

###############################################################################
### Rococo chain startup ######################################################
###############################################################################
echo "Rococo Relaychain start up"

./bin/polkadot build-spec --disable-default-bootnode --chain rococo-local > ./resources/chain-spec-rococo-local.json
./bin/polkadot build-spec --chain ./resources/chain-spec-rococo-local.json --raw --disable-default-bootnode > ./resources/chain-spec-rococo-local-raw.json

# RUST_LOG=runtime=trace,runtime::bridge=trace,runtime::bridge-messages=trace
RUST_LOG=xcm::send_xcm=trace
export RUST_LOG

# start Rococo nodes
./bin/polkadot\
  -lerror\
	--chain=rococo-local\
	--alice\
	--base-path=data/rococo-alice.db\
  --bootnodes=/ip4/127.0.0.1/tcp/30334/p2p/12D3KooWSEpHJj29HEzgPFcRYVc5X3sEuP3KgiUoqJNCet51NiMX\
	--node-key=79cf382988364291a7968ae7825c01f68c50d679796a8983237d07fe0ccf363b\
	--port=30333\
	--prometheus-port=9615\
	--rpc-port=9933\
	--ws-port=9944\
	--execution=Native\
  --no-mdns\
	--rpc-cors=all\
	--unsafe-rpc-external\
	--unsafe-ws-external &> ./logs/rococo-alice.log&

./bin/polkadot\
	--chain=rococo-local\
	--bob\
	--base-path=data/rococo-bob.db\
	--bootnodes=/ip4/127.0.0.1/tcp/30333/p2p/12D3KooWMF6JvV319a7kJn5pqkKbhR3fcM2cvK5vCbYZHeQhYzFE\
	--node-key=4f9d0146dd9b7b3bf5a8089e3880023d1df92057f89e96e07bb4d8c2ead75bbd\
	--port=30334\
	--prometheus-port=9616\
	--rpc-port=9934\
	--ws-port=9945\
	--execution=Native\
  --no-mdns\
	--rpc-cors=all\
	--unsafe-rpc-external\
	--unsafe-ws-external &> ./logs/rococo-bob.log&

###############################################################################
### Rococo Parachain startup ##################################################
###############################################################################
echo "Rococo Parachain start up"

./bin/parachain-collator export-genesis-state --parachain-id 2000 > ./resources/para-rococo-2000-genesis
./bin/parachain-collator export-genesis-wasm > ./resources/para-rococo-2000-wasm

./bin/parachain-collator\
  --alice\
  --collator\
  --force-authoring\
  --parachain-id 2000\
  --base-path=data/rococo-parachain.db\
  --port 40333\
  --ws-port 8844\
  --\
  --execution wasm\
  --chain=resources/chain-spec-rococo-local-raw.json\
  --no-mdns\
  --port 30343\
  --ws-port 9977\
  --bootnodes=/ip4/127.0.0.1/tcp/30333/p2p/12D3KooWMF6JvV319a7kJn5pqkKbhR3fcM2cvK5vCbYZHeQhYzFE &> ./logs/rococo-parachain.log&

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
	--port=30335\
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
	--port=30336\
	--prometheus-port=9618\
	--rpc-port=9936\
	--ws-port=9947\
	--execution=Native\
  --no-mdns\
	--rpc-cors=all\
	--unsafe-rpc-external\
  --unsafe-ws-external &> ./logs/wococo-bob.log&

# ###############################################################################
# ### Wococo Parachain startup ##################################################
# ###############################################################################
echo "Wococo Parachain start up"

./bin/parachain-collator export-genesis-state --parachain-id 2000 > ./resources/para-wococo-2000-genesis
./bin/parachain-collator export-genesis-wasm > ./resources/para-wococo-2000-wasm

./bin/parachain-collator\
  --alice\
  --collator\
  --force-authoring\
  --parachain-id 2000\
  --base-path=data/wococo-parachain.db\
  --port 40334\
  --ws-port 8845\
  --\
  --execution wasm\
  --chain=resources/chain-spec-wococo-local-raw.json\
  --no-mdns\
  --port 30344\
  --ws-port 9978\
  --bootnodes=/ip4/127.0.0.1/tcp/30335/p2p/12D3KooWKWnNktXrugMMYa4NFB18qxwF49rABJgHiLGJq7uVfs5E &> ./logs/wococo-parachain.log&

# ###############################################################################
# ### Headers+messages relay startup ############################################
# ###############################################################################
echo "Headers + Messages relay startup"

RUST_LOG=bridge=trace
export RUST_LOG


# RELAY_BINARY_PATH=./bin/substrate-relay

# initialize Rococo -> Wococo headers bridge
./bin/substrate-relay\
	init-bridge rococo-to-wococo\
	--source-host=$ROCOCO_HOST\
	--source-port=$ROCOCO_PORT\
	--target-host=$WOCOCO_HOST\
	--target-port=$WOCOCO_PORT\
	--target-signer=//Alice &> ./logs/initialize-rococo-wococo.log&

# initialize Wococo -> Rococo headers bridge
./bin/substrate-relay\
	init-bridge wococo-to-rococo\
	--source-host=$WOCOCO_HOST\
	--source-port=$WOCOCO_PORT\
	--target-host=$ROCOCO_HOST\
	--target-port=$ROCOCO_PORT\
	--target-signer=//Alice &> ./logs/initialize-wococo-rococo.log&

# start rococo-wococo headers+messages relay
./bin/substrate-relay\
	relay-headers-and-messages rococo-wococo\
  --relayer-mode=altruistic\
	--rococo-host=$ROCOCO_HOST\
	--rococo-port=$ROCOCO_PORT\
	--rococo-signer=//Alice\
	--wococo-host=$WOCOCO_HOST\
	--wococo-port=$WOCOCO_PORT\
	--wococo-signer=//Alice\
	--lane=00000000\
	--prometheus-port=9700 &> ./logs/relay-rococo-wococo.log&

# ###############################################################################
# ### Register Parachains #######################################################
# ###############################################################################
echo "Registering Parachains"

yarn run reserve-parachain -p $ROCOCO_PORT -u //Alice &> ./logs/rococo-reserve-parachain.log&
yarn run reserve-parachain -p $WOCOCO_PORT -u //Alice &> ./logs/wococo-reserve-parachain.log&

yarn register-parachain\
  -g para-rococo-2000-genesis\
  -w para-rococo-2000-wasm\
  -i 2000\
  -p $ROCOCO_PORT\
  -u //Alice &> ./logs/rococo-register-parachain.log&

yarn register-parachain\
  -g para-wococo-2000-genesis\
  -w para-wococo-2000-wasm\
  -i 2000\
  -p $WOCOCO_PORT\
  -u //Alice &> ./logs/wococo-register-parachain.log&

#Checkear en Polkadot App -> Network -> Parachains si aparece registarada
#registar.reserve Extrinsic for 2000 (coming from nextFreeId) in Rococo
#registar.reserve Extrinsic for 2000 in Wococo

###############################################################################
### Generate messages #########################################################
###############################################################################

# #start generating Rococo -> Wococo messages
# ./scripts/run-with-log.sh \
# 	rococo-to-wococo-messages-generator\
# 	./rococo-to-wococo-messages-generator.sh&
