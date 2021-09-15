# ./run.sh "exchange-relay-eth-tx" "./bin/ethereum-poa-relay eth-exchange-sub"

#GAWK_SCRIPT="{ print strftime(\"$1: [%Y-%m-%d %H:%M:%S]\"), \$0 }"
GAWK_SCRIPT="{ print \"$1: \", \$0 }"
unbuffer $2 2>&1 | \
	unbuffer -p gawk "$GAWK_SCRIPT" | \
	unbuffer -p tee logs/$1.log
