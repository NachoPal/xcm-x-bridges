#!/bin/bash

set -e

POLKADOT_REPO_PATH=../polkadot
BRIDGES_REPO_PATH=../parity-bridges-common
PARACHAIN_REPO_PATH=../substrate-parachain-template

ROCOCO_HOST=127.0.0.1
ROCOCO_PORT=9944
WOCOCO_HOST=127.0.0.1
WOCOCO_PORT=9946

SKIP_WASM_BUILD=1
#SKIP_POLKADOT_BUILD=1
# following two variables must be changed at once: either to ("", "debug") or to ("--release", "release")
BUILD_TYPE=--release
BUILD_FOLDER=release

DEVELOPMENT=true
