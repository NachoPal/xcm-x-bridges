#!/bin/bash

###############################################################################
### Rococo Parachain startup ##################################################
###############################################################################
echo "Rococo Parachain start up"

./bin/polkadot-collator export-genesis-state --parachain-id 2000 > ./resources/para-rococo-2000-genesis
./bin/polkadot-collator export-genesis-wasm > ./resources/para-rococo-2000-wasm

# Collator 1
./bin/polkadot-collator\
  --alice\
  --collator\
  --force-authoring\
  --parachain-id 2000\
  --base-path=data/rococo-parachain-collator-1.db\
  --port 40333\
  --ws-port 8844\
  --\
  --execution wasm\
  --chain=resources/chain-spec-rococo-local-raw.json\
  --bootnodes=/ip4/127.0.0.1/tcp/30333/p2p/12D3KooWMF6JvV319a7kJn5pqkKbhR3fcM2cvK5vCbYZHeQhYzFE\
  --no-mdns\
  --ws-port 8849\
  --port 30335 &> ./logs/rococo-parachain-collator-1.log&

# Collator 2
./bin/polkadot-collator\
  --bob\
  --collator\
  --force-authoring\
  --parachain-id 2000\
  --base-path=data/rococo-parachain-collator-2.db\
  --port 40334\
  --ws-port 8845\
  --\
  --execution wasm\
  --chain=resources/chain-spec-rococo-local-raw.json\
  --bootnodes=/ip4/127.0.0.1/tcp/30333/p2p/12D3KooWMF6JvV319a7kJn5pqkKbhR3fcM2cvK5vCbYZHeQhYzFE\
  --no-mdns\
  --ws-port 8850\
  --port 30336 &> ./logs/rococo-parachain-collator-2.log&

# # Full Node
# ./bin/polkadot-collator\
#   --parachain-id 2000\
#   --base-path=data/rococo-parachain-node.db\
#   --port 40335\
#   --ws-port 8846\
#   --\
#   --execution wasm\
#   --chain=resources/chain-spec-rococo-local-raw.json\
#   --bootnodes=/ip4/127.0.0.1/tcp/30333/p2p/12D3KooWMF6JvV319a7kJn5pqkKbhR3fcM2cvK5vCbYZHeQhYzFE\
#   --no-mdns\
#   --ws-port 8849\
#   --port 30337 &> ./logs/rococo-parachain-node.log&

  