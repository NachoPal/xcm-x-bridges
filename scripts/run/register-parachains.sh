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
  -g rococo-2000-genesis wococo-2000-genesis\
  -w rococo-2000-wasm wococo-2000-wasm\
  -i 2000 2000\
  -p $ROCOCO_PORT $WOCOCO_PORT\
  -u //Alice //Alice &> ./logs/register-parachains.log&