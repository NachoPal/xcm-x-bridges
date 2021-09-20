#!/bin/bash

# ###############################################################################
# ### Wococo Parachain startup ##################################################
# ###############################################################################
echo "Wococo Parachain start up"

./bin/polkadot-collator export-genesis-state --parachain-id 2000 > ./resources/parachains/wococo-2000-genesis
./bin/polkadot-collator export-genesis-wasm > ./resources/parachains/wococo-2000-wasm

# Collator 1
./bin/polkadot-collator\
  --alice\
  --collator\
  --force-authoring\
  --parachain-id 2000\
  --base-path=data/wococo-parachain-collator-1.db\
  --port 40335\
  --ws-port 8846\
  --node-key-file=resources/node-keys/wococo-collator-1\
  --reserved-nodes /ip4/127.0.0.1/tcp/40336/p2p/12D3KooWNp1WdJUrxxFEY6h14V966UYWQqrHgXP1MzTwUovAAao3 \
  /ip4/127.0.0.1/tcp/30339/p2p/12D3KooWHwYX1uaahRooGfz7DCbRTRTDJq4yCZHrAF68qvipeVRP\
  --reserved-only\
  --\
  --execution wasm\
  --node-key-file=resources/node-keys/wococo-node-1\
  --chain=resources/chain-specs/wococo-local-raw.json\
  --bootnodes=/ip4/127.0.0.1/tcp/30337/p2p/12D3KooWCNRrHY8vJgnh6trkWw9nGFM2h4MJvzSqCRisxDXkdX3E\
  --no-mdns\
  --ws-port 9950\
  --port 30339 &> ./logs/wococo-parachain-collator-1.log&

# Collator 2
./bin/polkadot-collator\
  --bob\
  --collator\
  --force-authoring\
  --parachain-id 2000\
  --base-path=data/wococo-parachain-collator-2.db\
  --port 40336\
  --ws-port 8847\
  --node-key-file=resources/node-keys/wococo-collator-2\
  --reserved-nodes /ip4/127.0.0.1/tcp/40335/p2p/12D3KooWQfrbAh4WzWKQdEJQKBLyXbXS9E6gaYtopnzqmaLUjbbZ \
  /ip4/127.0.0.1/tcp/30340/p2p/12D3KooWJH3LSLjLoAzszuPPmJBjwB2VcSC5NZtYurW8ZddfCgrg\
  --reserved-only\
  --\
  --execution wasm\
  --chain=resources/chain-specs/wococo-local-raw.json\
  --node-key-file=resources/node-keys/wococo-node-2\
  --bootnodes=/ip4/127.0.0.1/tcp/30337/p2p/12D3KooWCNRrHY8vJgnh6trkWw9nGFM2h4MJvzSqCRisxDXkdX3E\
  --no-mdns\
  --ws-port 9951\
  --port 30340 &> ./logs/wococo-parachain-collator-2.log&

# ./bin/parachain-collator\
#   --alice\
#   --collator\
#   --force-authoring\
#   --parachain-id 2000\
#   --base-path=data/wococo-parachain.db\
#   --port 40336\
#   --ws-port 8847\
#   --\
#   --execution wasm\
#   --chain=resources/chain-spec-wococo-local-raw.json\
#   --no-mdns\
#   --port 30344\
#   --ws-port 9978\
#   --bootnodes=/ip4/127.0.0.1/tcp/30335/p2p/12D3KooWKWnNktXrugMMYa4NFB18qxwF49rABJgHiLGJq7uVfs5E &> ./logs/wococo-parachain.log&