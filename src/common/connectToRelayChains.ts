import { getAccountsInformation, loadAccounts } from './getAccounts'
import { substrateProviders } from '../config'
import { getConnections } from './getConnections'


const connectToProviders = async (sourceChainPort, targetChainPort) => {
  const [
    connectionDetails1, 
    connectionDetails2
  ] = substrateProviders(sourceChainPort, targetChainPort);
  const { connections } = await getConnections([connectionDetails1, connectionDetails2]);
  const { sourceChain, targetChain } = connections;

  const keyringPair = loadAccounts();
  const sourceAccounts = await getAccountsInformation(sourceChain, targetChain, keyringPair);
  const targetAccounts = await getAccountsInformation(targetChain, sourceChain, keyringPair);

  return { 
    source: { chain: sourceChain, accounts: sourceAccounts }, 
    target: { chain: targetChain, accounts: targetAccounts }
  }
}

export default connectToProviders;