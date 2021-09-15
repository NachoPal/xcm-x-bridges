#!/bin/bash
. ./config.sh

if [ -z "$SKIP_POLKADOT_BUILD" ]; then

cargo build $BUILD_TYPE --manifest-path=$POLKADOT_REPO_PATH/Cargo.toml
cp $POLKADOT_REPO_PATH/target/$BUILD_FOLDER/polkadot ./bin

fi