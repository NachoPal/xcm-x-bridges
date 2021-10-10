#!/bin/bash

set -e

POLKADOT_REPO_PATH=../polkadot
PARACHAIN_REPO_PATH=../cumulus
BRIDGES_REPO_PATH=../parity-bridges-common

RUNTIME_RELAY_SOURCE=rococo-local
RUNTIME_RELAY_TARGET=wococo-local

RUNTIME_PARA_SOURCE="" #Fallback to Rococo
RUNTIME_PARA_TARGET="" #Fallback to Rococo

HEADERS_BRIDGE_SOURCE=rococo-to-wococo
HEADERS_BRIDGE_TARGET=wococo-to-rococo
BRIDGE_RELAYERS=rococo-wococo
SOURCE_PORT=9944
TARGET_PORT=9948

SKIP_WASM_BUILD=0
#SKIP_POLKADOT_BUILD=1
# following two variables must be changed at once: either to ("", "debug") or to ("--release", "release")
BUILD_TYPE=--release
BUILD_FOLDER=release

DEVELOPMENT=true
