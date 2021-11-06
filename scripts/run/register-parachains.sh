#!/bin/bash

dev=""

if $DEVELOPMENT
then
  dev="dev:"
fi  

# ###############################################################################
# ### Register Parachains #######################################################
# ###############################################################################
echo "Registering Parachains"

yarn "$dev"register-parachains\
  -g source-genesis\
  -w source-wasm\
  -i $PARA_ID_SOURCE\
  -p $SOURCE_PORT\
  -u //Alice &> ./logs/source-register-parachains.log&

if $BRIDGED
then
  yarn "$dev"register-parachains\
  -g target-genesis\
  -w target-wasm\
  -i $PARA_ID_SOURCE\
  -p $TARGET_PORT\
  -u //Alice &> ./logs/target-register-parachains.log&
fi