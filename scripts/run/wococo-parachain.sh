#!/bin/bash

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