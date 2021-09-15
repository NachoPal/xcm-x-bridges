import { getApiConnection } from './getApiConnection';

export async function getConnections(chainsConnections: any) {
  const [connectionDetails1, connectionDetails2] = chainsConnections;

  const { 
    configs: chain1Configs, 
    api: chain1ApiPromise, 
    isApiReady: chain1ApiReady
  } = await getApiConnection(connectionDetails1);

  const { 
    configs: chain2Configs, 
    api: chain2ApiPromise, 
    isApiReady: chain2ApiReady
  } = await getApiConnection(connectionDetails2);

  const chainName1 = chain1Configs.chainName;
  const chainName2 = chain2Configs.chainName;
  // const apiReady = chain1ApiReady && chain2ApiReady;
  
  const connections = {
    sourceChain: {
      name: chainName1,
      configs: chain1Configs,
      api: chain1ApiPromise,
      isApiReady: chain1ApiReady,
      subscriptions: {}
    },
    targetChain: {
      name: chainName2,
      configs: chain2Configs,
      api: chain2ApiPromise,
      isApiReady: chain2ApiReady,
      subscriptions: {}
    }
  };

  return { connections };
}