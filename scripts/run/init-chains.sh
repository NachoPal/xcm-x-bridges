#!/bin/bash

dev=""

if $DEVELOPMENT
then
  dev="dev:"
fi  

# ###############################################################################
# ### Init Chains #######################################################
# ###############################################################################
echo "Init Chains"

yarn "$dev"init-chains\
  -i $PARA_ID_SOURCE\
  -p $PORT_SOURCE\
  -u //Alice \
  -v 2 &> ./logs/init-chains.log&