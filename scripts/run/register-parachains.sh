#!/bin/bash
. ./config.sh

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
  -g source-2000-genesis target-2000-genesis\
  -w source-2000-wasm target-2000-wasm\
  -i 2000 2000\
  -p $SOURCE_PORT $TARGET_PORT\
  -u //Alice //Alice &> ./logs/register-parachains.log&