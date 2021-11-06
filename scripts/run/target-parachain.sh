#!/bin/bash

# ###############################################################################
# ### Target Parachain startup ##################################################
# ###############################################################################
echo "Target Parachain start up"

# ./bin/polkadot-collator build-spec\
#   --disable-default-bootnode\
#   --chain=$RUNTIME_PARA_TARGET > ./resources/chain-specs/target-parachain.json

# ./bin/polkadot-collator build-spec\
#   --chain=./resources/chain-specs/target-parachain.json\
#   --raw\
#   --disable-default-bootnode > ./resources/chain-specs/target-parachain-raw.json

./bin/polkadot-collator export-genesis-state\
  --parachain-id $PARA_ID_SOURCE\
  --chain=$RUNTIME_PARA_TARGET > ./resources/parachains/target-genesis

./bin/polkadot-collator export-genesis-wasm\
  --chain=$RUNTIME_PARA_TARGET > ./resources/parachains/target-wasm

RUST_LOG=cumulus:dmp-queue=debug,cumulus:parachain-system=debug,xcm:xcm-executor=debug,xcm:pallet-xcm=debug,xcm:currency_adapter=debug

# Collator 1
./bin/polkadot-collator\
  -lerror\
  --alice\
  --collator\
  --force-authoring\
  --parachain-id $PARA_ID_SOURCE\
  --base-path=data/target-parachain-collator-1.db\
  --port 40335\
  --ws-port $PORT_PARA_TARGET\
  --node-key-file=resources/node-keys/target-collator-1\
  --reserved-nodes /ip4/127.0.0.1/tcp/40336/p2p/12D3KooWNp1WdJUrxxFEY6h14V966UYWQqrHgXP1MzTwUovAAao3 \
  /ip4/127.0.0.1/tcp/30339/p2p/12D3KooWHwYX1uaahRooGfz7DCbRTRTDJq4yCZHrAF68qvipeVRP\
  --reserved-only\
  --execution Native\
  --chain=$RUNTIME_PARA_TARGET\
  --\
  -lerror\
  --execution Native\
  --node-key-file=resources/node-keys/target-node-1\
  --chain=resources/chain-specs/target-raw.json\
  --bootnodes=/ip4/127.0.0.1/tcp/30337/p2p/12D3KooWCNRrHY8vJgnh6trkWw9nGFM2h4MJvzSqCRisxDXkdX3E\
  --no-mdns\
  --ws-port 9950\
  --port 30339 &> ./logs/target-parachain-collator-1.log&

# Collator 2
./bin/polkadot-collator\
  -lerror\
  --bob\
  --collator\
  --force-authoring\
  --parachain-id $PARA_ID_SOURCE\
  --base-path=data/target-parachain-collator-2.db\
  --port 40336\
  --ws-port 8847\
  --node-key-file=resources/node-keys/target-collator-2\
  --reserved-nodes /ip4/127.0.0.1/tcp/40335/p2p/12D3KooWQfrbAh4WzWKQdEJQKBLyXbXS9E6gaYtopnzqmaLUjbbZ \
  /ip4/127.0.0.1/tcp/30340/p2p/12D3KooWJH3LSLjLoAzszuPPmJBjwB2VcSC5NZtYurW8ZddfCgrg\
  --reserved-only\
  --execution Native\
  --chain=$RUNTIME_PARA_TARGET\
  --\
  -lerror\
  --execution Native\
  --node-key-file=resources/node-keys/target-node-2\
  --chain=resources/chain-specs/target-raw.json\
  --bootnodes=/ip4/127.0.0.1/tcp/30337/p2p/12D3KooWCNRrHY8vJgnh6trkWw9nGFM2h4MJvzSqCRisxDXkdX3E\
  --no-mdns\
  --ws-port 9951\
  --port 30340 &> ./logs/target-parachain-collator-2.log&