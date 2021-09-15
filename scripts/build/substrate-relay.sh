#!/bin/bash
. ./config.sh

cargo build $BUILD_TYPE --manifest-path=$BRIDGES_REPO_PATH/relays/bin-substrate/Cargo.toml
cp $BRIDGES_REPO_PATH/target/$BUILD_FOLDER/substrate-relay ./bin