#!/bin/bash

###############################################################################
### Rococo Parachain startup ##################################################
###############################################################################
echo "Rococo Parachain start up"

./bin/polkadot-collator export-genesis-state --parachain-id 2000 > ./resources/parachains/rococo-2000-genesis
./bin/polkadot-collator export-genesis-wasm > ./resources/parachains/rococo-2000-wasm

RUST_LOG=cumulus:dmp-queue=debug,cumulus:parachain-system=debug,xcm:xcm-executor=debug,xcm:pallet-xcm=debug,xcm:currency_adapter=debug,xcm:barrier=debug,xcm:origin-conversion=debug

# Collator 1
./bin/polkadot-collator\
  -lerror\
  --alice\
  --collator\
  --force-authoring\
  --parachain-id 2000\
  --base-path=data/rococo-parachain-collator-1.db\
  --port 40333\
  --ws-port 8844\
  --node-key-file=resources/node-keys/rococo-collator-1\
  --reserved-nodes /ip4/127.0.0.1/tcp/40334/p2p/12D3KooWJQbb7HMWicG7ySMYjeMVDbtdaVBFprSqZjTHU7KaBn4i \
  /ip4/127.0.0.1/tcp/30335/p2p/12D3KooWMRZp89siXBYKYTgpGAin4UeU2P3inpNTehnRTnU1nhAL\
  --reserved-only\
  --execution Native\
  --\
  -lerror\
  --execution Native\
  --node-key-file=resources/node-keys/rococo-node-1\
  --chain=resources/chain-specs/rococo-local-raw.json\
  --bootnodes=/ip4/127.0.0.1/tcp/30333/p2p/12D3KooWDso5DmDHFrGnFWXVWNWd7spQp6mw1CgDp4MKcacEk1QP\
  --no-mdns\
  --ws-port 9946\
  --port 30335 &> ./logs/rococo-parachain-collator-1.log&

# Collator 2
./bin/polkadot-collator\
  -lerror\
  --bob\
  --collator\
  --force-authoring\
  --parachain-id 2000\
  --base-path=data/rococo-parachain-collator-2.db\
  --port 40334\
  --ws-port 8845\
  --node-key-file=resources/node-keys/rococo-collator-2\
  --reserved-nodes /ip4/127.0.0.1/tcp/40333/p2p/12D3KooWLtRuSeyjeaH37PG76n5wFozrzjAZv4DXrdnRToRDCVUc \
  /ip4/127.0.0.1/tcp/30336/p2p/12D3KooWBJ8tpPYqriU9QemyfctXFcQ7nn9Qsavr6PYzxVDu781T\
  --reserved-only\
  --execution Native\
  --\
  -lerror\
  --execution Native\
  --chain=resources/chain-specs/rococo-local-raw.json\
  --node-key-file=resources/node-keys/rococo-node-2\
  --bootnodes=/ip4/127.0.0.1/tcp/30333/p2p/12D3KooWDso5DmDHFrGnFWXVWNWd7spQp6mw1CgDp4MKcacEk1QP\
  --no-mdns\
  --ws-port 9947\
  --port 30336 &> ./logs/rococo-parachain-collator-2.log&

  