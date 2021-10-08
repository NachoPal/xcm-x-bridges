#!/bin/bash

set -e

POLKADOT_REPO_PATH=../polkadot
PARACHAIN_REPO_PATH=../cumulus
BRIDGES_REPO_PATH=../parity-bridges-common


ROCOCO_HOST=127.0.0.1
ROCOCO_PORT=9944
WOCOCO_HOST=127.0.0.1
WOCOCO_PORT=9948

SKIP_WASM_BUILD=0
#SKIP_POLKADOT_BUILD=1
# following two variables must be changed at once: either to ("", "debug") or to ("--release", "release")
BUILD_TYPE=--release
BUILD_FOLDER=release

DEVELOPMENT=true
