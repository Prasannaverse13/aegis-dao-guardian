import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Aegis - DAO Proposal Analysis',
  projectId: '91f167f5889a649b993ea6fddb741d88',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: false,
});
