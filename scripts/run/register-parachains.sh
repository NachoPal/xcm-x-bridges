#!/bin/bash

# ###############################################################################
# ### Register Parachains #######################################################
# ###############################################################################
echo "Registering Parachains"

yarn run reserve-parachain -p $ROCOCO_PORT -u //Alice &> ./logs/rococo-reserve-parachain.log&
yarn run reserve-parachain -p $WOCOCO_PORT -u //Alice &> ./logs/wococo-reserve-parachain.log&

yarn register-parachain\
  -g para-rococo-2000-genesis\
  -w para-rococo-2000-wasm\
  -i 2000\
  -p $ROCOCO_PORT\
  -u //Alice &> ./logs/rococo-register-parachain.log&

yarn register-parachain\
  -g para-wococo-2000-genesis\
  -w para-wococo-2000-wasm\
  -i 2000\
  -p $WOCOCO_PORT\
  -u //Alice &> ./logs/wococo-register-parachain.log&