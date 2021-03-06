#!/bin/bash
. ./config.sh

###############################################################################
### Source Parachain startup ##################################################
###############################################################################
echo "Source Parachain start up"

# ./bin/polkadot-collator build-spec\
#   --disable-default-bootnode\
#   --chain=$RUNTIME_PARA_SOURCE > ./resources/chain-specs/source-parachain.json

# ./bin/polkadot-collator build-spec\
#   --chain=./resources/chain-specs/source-parachain.json\
#   --raw\
#   --disable-default-bootnode > ./resources/chain-specs/source-parachain-raw.json

./bin/polkadot-collator export-genesis-state\
  --parachain-id 2000\
  --chain=$RUNTIME_PARA_SOURCE > ./resources/parachains/source-2000-genesis

./bin/polkadot-collator export-genesis-wasm\
  --chain=$RUNTIME_PARA_SOURCE > ./resources/parachains/source-2000-wasm

RUST_LOG=cumulus:dmp-queue=debug,cumulus:parachain-system=debug,xcm:xcm-executor=debug,xcm:pallet-xcm=debug,xcm:currency_adapter=debug,xcm:barrier=debug,xcm:origin-conversion=debug

# Collator 1
./bin/polkadot-collator\
  -lerror\
  --alice\
  --collator\
  --force-authoring\
  --parachain-id 2000\
  --base-path=data/source-parachain-collator-1.db\
  --port 40333\
  --ws-port 8844\
  --node-key-file=resources/node-keys/source-collator-1\
  --reserved-nodes /ip4/127.0.0.1/tcp/40334/p2p/12D3KooWJQbb7HMWicG7ySMYjeMVDbtdaVBFprSqZjTHU7KaBn4i \
  /ip4/127.0.0.1/tcp/30335/p2p/12D3KooWMRZp89siXBYKYTgpGAin4UeU2P3inpNTehnRTnU1nhAL\
  --reserved-only\
  --execution Native\
  --chain=$RUNTIME_PARA_SOURCE\
  --\
  -lerror\
  --execution Native\
  --node-key-file=resources/node-keys/source-node-1\
  --chain=resources/chain-specs/source-raw.json\
  --bootnodes=/ip4/127.0.0.1/tcp/30333/p2p/12D3KooWDso5DmDHFrGnFWXVWNWd7spQp6mw1CgDp4MKcacEk1QP\
  --no-mdns\
  --ws-port 9946\
  --port 30335 &> ./logs/source-parachain-collator-1.log&

# Collator 2
./bin/polkadot-collator\
  -lerror\
  --bob\
  --collator\
  --force-authoring\
  --parachain-id 2000\
  --base-path=data/source-parachain-collator-2.db\
  --port 40334\
  --ws-port 8845\
  --node-key-file=resources/node-keys/source-collator-2\
  --reserved-nodes /ip4/127.0.0.1/tcp/40333/p2p/12D3KooWLtRuSeyjeaH37PG76n5wFozrzjAZv4DXrdnRToRDCVUc \
  /ip4/127.0.0.1/tcp/30336/p2p/12D3KooWBJ8tpPYqriU9QemyfctXFcQ7nn9Qsavr6PYzxVDu781T\
  --reserved-only\
  --execution Native\
  --chain=$RUNTIME_PARA_SOURCE\
  --\
  -lerror\
  --execution Native\
  --node-key-file=resources/node-keys/source-node-2\
  --chain=resources/chain-specs/source-raw.json\
  --bootnodes=/ip4/127.0.0.1/tcp/30333/p2p/12D3KooWDso5DmDHFrGnFWXVWNWd7spQp6mw1CgDp4MKcacEk1QP\
  --no-mdns\
  --ws-port 9947\
  --port 30336 &> ./logs/source-parachain-collator-2.log&

  