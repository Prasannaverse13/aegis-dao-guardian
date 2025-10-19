import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/config/wagmi';
import { useAccount } from 'wagmi';
import WalletConnect from '@/components/WalletConnect';
import Dashboard from '@/components/Dashboard';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const AppContent = () => {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <WalletConnect />;
  }

  return <Dashboard />;
};

const Index = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: 'hsl(263, 70%, 50%)',
            accentColorForeground: 'white',
            borderRadius: 'large',
            fontStack: 'system',
          })}
          coolMode
        >
          <AppContent />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Index;
