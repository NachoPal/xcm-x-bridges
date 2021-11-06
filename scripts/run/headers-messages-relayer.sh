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
	--source-port=$PORT_SOURCE\
	--target-host=127.0.0.1\
	--target-port=$PORT_SOURCE\
	--target-signer=//Alice &> ./logs/initialize-source-target.log&

# initialize TARGET -> SOURCE headers bridge
./bin/substrate-relay\
	init-bridge $HEADERS_BRIDGE_TARGET\
	--source-host=127.0.0.1\
	--source-port=$PORT_TARGET\
	--target-host=127.0.0.1\
	--target-port=$PORT_SOURCE\
	--target-signer=//Alice &> ./logs/initialize-target-source.log&

# start SOURCE-TARGET headers+messages relay
./bin/substrate-relay\
	relay-headers-and-messages $BRIDGE_RELAYERS\
  --relayer-mode=altruistic\
	--rococo-host=127.0.0.1\
	--rococo-port=$PORT_SOURCE\
	--rococo-signer=//Alice\
	--wococo-host=127.0.0.1\
	--wococo-port=$PORT_TARGET\
	--wococo-signer=//Alice\
	--lane=00000000\
	--prometheus-port=9700 &> ./logs/relay-target-source.log&