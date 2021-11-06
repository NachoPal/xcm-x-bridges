#!/bin/bash

# ###############################################################################
# ### Headers+messages relay startup ############################################
# ###############################################################################
echo "Headers + Messages relayer startup"

RUST_LOG=bridge=trace
export RUST_LOG

# initialize SOURCE -> TARGET headers bridge
./bin/substrate-relay\
	init-bridge $HEADERS_BRIDGE_SOURCE\
	--source-host=127.0.0.1\
	--source-port=$SOURCE_PORT\
	--target-host=127.0.0.1\
	--target-port=$TARGET_PORT\
	--target-signer=//Alice &> ./logs/initialize-source-target.log&

# initialize TARGET -> SOURCE headers bridge
./bin/substrate-relay\
	init-bridge $HEADERS_BRIDGE_TARGET\
	--source-host=127.0.0.1\
	--source-port=$TARGET_PORT\
	--target-host=127.0.0.1\
	--target-port=$SOURCE_PORT\
	--target-signer=//Alice &> ./logs/initialize-target-source.log&

# start SOURCE-TARGET headers+messages relay
./bin/substrate-relay\
	relay-headers-and-messages $BRIDGE_RELAYERS\
  --relayer-mode=altruistic\
	--rococo-host=127.0.0.1\
	--rococo-port=$SOURCE_PORT\
	--rococo-signer=//Alice\
	--wococo-host=127.0.0.1\
	--wococo-port=$TARGET_PORT\
	--wococo-signer=//Alice\
	--lane=00000000\
	--prometheus-port=9700 &> ./logs/relay-target-source.log&