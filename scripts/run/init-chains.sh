#!/bin/bash

dev=""

if $DEVELOPMENT
then
  dev="dev:"
fi  

# ###############################################################################
# ### Init Relay Chains #######################################################
# ###############################################################################
echo "Init Relay Chains"

yarn "$dev"init-chains\
  -c relay\
  -i $PARA_ID_SOURCE\
  -p $PORT_SOURCE\
  -u //Alice \
  -v 2 &> ./logs/init-relay-chains.log&

# ###############################################################################
# ### Init ParaChains #######################################################
# ###############################################################################
echo "Init ParaChains"

yarn "$dev"init-chains\
  -c para\
  -i $PARA_ID_SOURCE\
  -p $PORT_PARA_SOURCE\
  -u //Alice \
  -v 2 &> ./logs/init-para-chains.log&