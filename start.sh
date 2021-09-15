#!/bin/bash

. ./config.sh

mkdir bin || true
mkdir data || true
mkdir logs || true
mkdir resources || true
rm -rf data/*
rm -rf resources/*
rm -rf logs/*

. ./scripts/build/polkadot-node.sh
. ./scripts/build/substrate-relay.sh
. ./scripts/build/parachain-collator.sh

. ./scripts/run/rococo-relaychain.sh
. ./scripts/run/rococo-parachain.sh

. ./scripts/run/wococo-relaychain.sh
. ./scripts/run/wococo-parachain.sh

. ./scripts/run/headers-messages-relayer.sh

. ./scripts/run/register-parachains.sh