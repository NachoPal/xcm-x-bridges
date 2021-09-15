#!/bin/bash
. ./config.sh

dev=""

if $DEVELOPEMENT == true
then
  dev="dev:"
fi  

# ###############################################################################
# ### Register Parachains #######################################################
# ###############################################################################
echo "Registering Parachains"

yarn "$dev"register-parachains\
  -g para-rococo-2000-genesis para-wococo-2000-genesis\
  -w para-rococo-2000-wasm para-wococo-2000-wasm\
  -i 2000 2000\
  -p $ROCOCO_PORT $WOCOCO_PORT\
  -u //Alice //Alice &> ./logs/register-parachains.log&