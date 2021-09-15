#!/bin/bash

killall -9 polkadot
killall -9 substrate-relay
killall -9 parachain-collator
killall -9 node
pkill -9 -f 'rococo-to-wococo-messages-generator.sh'
