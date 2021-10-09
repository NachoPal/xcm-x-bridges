#!/bin/bash

./stop.sh

. ./config.sh

mkdir bin || true
mkdir data || true
mkdir logs || true
mkdir resources/parachains || true
mkdir resources/chain-specs || true
rm -rf data/*
rm -rf resources/parachains/*
rm -rf resources/chain-specs/*
rm -rf logs/*
rm -rf bin/src/*

yarn

if ! $DEVELOPMENT
then
  yarn build
fi  

. ./scripts/build/polkadot-node.sh
. ./scripts/build/parachain-collator.sh
. ./scripts/build/substrate-relay.sh 

# Source Context
. ./scripts/run/source-relaychain.sh
. ./scripts/run/source-parachain.sh

# Target Context
. ./scripts/run/target-relaychain.sh
. ./scripts/run/target-parachain.sh

. ./scripts/run/headers-messages-relayer.sh

. ./scripts/run/register-parachains.sh