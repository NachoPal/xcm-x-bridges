#!/bin/bash
. ./config.sh

# ###############################################################################
# ### Headers+messages relay startup ############################################
# ###############################################################################
echo "Headers + Messages relayer startup"

RUST_LOG=bridge=trace
export RUST_LOG

# initialize Rococo -> Wococo headers bridge
./bin/substrate-relay\
	init-bridge rococo-to-wococo\
	--source-host=$ROCOCO_HOST\
	--source-port=$ROCOCO_PORT\
	--target-host=$WOCOCO_HOST\
	--target-port=$WOCOCO_PORT\
	--target-signer=//Alice &> ./logs/initialize-rococo-wococo.log&

# initialize Wococo -> Rococo headers bridge
./bin/substrate-relay\
	init-bridge wococo-to-rococo\
	--source-host=$WOCOCO_HOST\
	--source-port=$WOCOCO_PORT\
	--target-host=$ROCOCO_HOST\
	--target-port=$ROCOCO_PORT\
	--target-signer=//Alice &> ./logs/initialize-wococo-rococo.log&

# start rococo-wococo headers+messages relay
./bin/substrate-relay\
	relay-headers-and-messages rococo-wococo\
  --relayer-mode=altruistic\
	--rococo-host=$ROCOCO_HOST\
	--rococo-port=$ROCOCO_PORT\
	--rococo-signer=//Alice\
	--wococo-host=$WOCOCO_HOST\
	--wococo-port=$WOCOCO_PORT\
	--wococo-signer=//Alice\
	--lane=00000000\
	--prometheus-port=9700 &> ./logs/relay-rococo-wococo.log&