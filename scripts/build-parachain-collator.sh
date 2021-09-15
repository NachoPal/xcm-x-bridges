#!/bin/bash
. ./scripts/prelude.sh

cargo build $BUILD_TYPE --manifest-path=$PARACHAIN_REPO_PATH/Cargo.toml
cp $PARACHAIN_REPO_PATH/target/$BUILD_FOLDER/parachain-collator ./bin