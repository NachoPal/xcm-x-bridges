import connectToRelayChains from './connectToRelayChains';
import { getApisFromRelays } from './getApisFromRelays';
import { getBalance } from './getBalance';
import getWallet from './getWallet';

export const beforeConnectToProviders = (
    { relay: { senderRelay, receiverRelay }, para: { senderPara, receiverPara }}
  ) => {
    return(
      before(async function() {
        const relayChains = await connectToRelayChains(process.env.PORT_SOURCE, process.env.PORT_TARGET);
        const paraChains = await connectToRelayChains(process.env.PORT_PARA_SOURCE, process.env.PORT_PARA_TARGET);
      
        const { sourceApi: relaySourceApi } = getApisFromRelays(relayChains);
        const { sourceApi: paraSourceApi } = getApisFromRelays(paraChains);
      
        this.paraSourceApi = paraSourceApi
        this.relaySourceApi = relaySourceApi

        this.senderRelay = await getWallet(senderRelay)
        this.receiverRelay = await getWallet(receiverRelay)

        this.senderPara = await getWallet(senderPara)
        this.receiverPara = await getWallet(receiverPara)
      
        this.senderRelayBalance = await getBalance(relaySourceApi, this.senderRelay.address)
        this.receiverParaBalance = await getBalance(paraSourceApi, this.receiverPara.address)
      
        this.senderParaBalance = await getBalance(paraSourceApi, this.senderPara.address)
        this.receiverRelayBalance = await getBalance(relaySourceApi, this.receiverRelay.address)
      })
    )
}