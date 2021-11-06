#!/bin/bash

./stop.sh

set -o allexport; source .env; set +o allexport

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

# Source Context
. ./scripts/run/source-relaychain.sh
. ./scripts/run/source-parachain.sh

if $BRIDGED
then
  . ./scripts/build/substrate-relay.sh

  # Target Context
  . ./scripts/run/target-relaychain.sh
  . ./scripts/run/target-parachain.sh

  . ./scripts/run/headers-messages-relayer.sh
fi

. ./scripts/run/register-parachains.sh
. ./scripts/run/init-chains.sh