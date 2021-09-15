#!/bin/bash
. ./scripts/prelude.sh

# THIS SCRIPT IS NOT INTENDED FOR USE IN PRODUCTION ENVIRONMENT
#
# This scripts periodically calls relay binary to generate Rococo -> Wococo
# messages.

set -eu

# Path to relay binary
RELAY_BINARY_PATH=./bin/substrate-relay
# Rococo node host
ROCOCO_HOST=127.0.0.1
# Rococo node port
ROCOCO_PORT=9944
# Rococo signer
ROCOCO_SIGNER=//Bob
# Wococo signer
WOCOCO_SIGNER=//Bob
# Max delay before submitting transactions (s)
MAX_SUBMIT_DELAY_S=60
# Lane to send message over
LANE=00000000

# submit Millau to Rialto message
submit_message() {
	MESSAGE_PARAMS="$*"
	$RELAY_BINARY_PATH 2>&1 send-message rococo-to-wococo \
		--source-host=$ROCOCO_HOST\
		--source-port=$ROCOCO_PORT\
		--source-signer=$ROCOCO_SIGNER\
		--target-signer=$WOCOCO_SIGNER\
		--lane=$LANE\
		--origin Source \
		$MESSAGE_PARAMS
}

BATCH_TIME=0
while true
do
	SUBMIT_DELAY_S=`shuf -i 0-$MAX_SUBMIT_DELAY_S -n 1`
	# sleep some time
	echo "Sleeping $SUBMIT_DELAY_S seconds..."
	sleep $SUBMIT_DELAY_S

	# prepare message to send
	MESSAGE="remark"

	# submit message
	echo "Sending message from Rococo to Wococo"
	submit_message $MESSAGE
done
