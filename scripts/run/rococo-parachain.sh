#!/bin/bash

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