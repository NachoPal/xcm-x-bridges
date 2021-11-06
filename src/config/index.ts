import { WsProvider } from '@polkadot/api';
import { ApiOptions } from '@polkadot/api/types';
import rococoTypes from './rococoTypes.json';
import wococoTypes from './wococoTypes.json';

const getProviderInfo = (providerPort: string, types: ApiOptions['types']) => {
  const hasher = null;

  return {
    hasher,
    provider: new WsProvider(`ws://localhost:${providerPort}`),
    types
  };
};

export const substrateProviders = (sourceChainPort, targetChainPort) => {
  const sourceChain = getProviderInfo(sourceChainPort, rococoTypes);
  const targetChain = targetChainPort ? getProviderInfo(targetChainPort, wococoTypes) : undefined;

  return [
    {
      hasher: sourceChain.hasher,
      types: sourceChain.types,
      provider: sourceChain.provider
    },
    {
      hasher: targetChain?.hasher,
      types: targetChain?.types,
      provider: targetChain?.provider
    }
  ];
};
