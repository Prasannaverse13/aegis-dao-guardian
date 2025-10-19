import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Shield } from 'lucide-react';

const WalletConnect = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background">
        <div className="absolute inset-0 bg-gradient-primary opacity-10 gradient-animate" />
      </div>

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-6 shadow-elevated animate-pulse-glow">
            <Shield className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Aegis
          </h1>
          
          <p className="text-2xl text-muted-foreground mb-2">
            DAO Proposal Analysis System
          </p>
          
          <p className="text-lg text-muted-foreground/80">
            Multi-Agent AI for Intelligent Due Diligence
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-elevated">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Connect Your Wallet</h2>
              <p className="text-muted-foreground">
                Connect your Web3 wallet to access the Aegis analysis platform
              </p>
            </div>

            <div className="flex justify-center">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {
                  const ready = mounted && authenticationStatus !== 'loading';
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus || authenticationStatus === 'authenticated');

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              type="button"
                              className="px-8 py-4 bg-gradient-primary text-primary-foreground rounded-xl font-semibold text-lg hover:shadow-elevated transition-all duration-300 hover:scale-105 animate-pulse-glow"
                            >
                              Connect Wallet
                            </button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <button
                              onClick={openChainModal}
                              type="button"
                              className="px-8 py-4 bg-destructive text-destructive-foreground rounded-xl font-semibold text-lg hover:shadow-elevated transition-all duration-300"
                            >
                              Wrong network
                            </button>
                          );
                        }

                        return (
                          <div className="flex gap-3">
                            <button
                              onClick={openChainModal}
                              type="button"
                              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-all duration-300"
                            >
                              {chain.hasIcon && (
                                <div
                                  style={{
                                    background: chain.iconBackground,
                                    width: 24,
                                    height: 24,
                                    borderRadius: 999,
                                    overflow: 'hidden',
                                    marginRight: 8,
                                    display: 'inline-block',
                                  }}
                                >
                                  {chain.iconUrl && (
                                    <img
                                      alt={chain.name ?? 'Chain icon'}
                                      src={chain.iconUrl}
                                      style={{ width: 24, height: 24 }}
                                    />
                                  )}
                                </div>
                              )}
                              {chain.name}
                            </button>

                            <button
                              onClick={openAccountModal}
                              type="button"
                              className="px-6 py-3 bg-gradient-primary text-primary-foreground rounded-xl font-medium hover:shadow-elevated transition-all duration-300"
                            >
                              {account.displayName}
                              {account.displayBalance ? ` (${account.displayBalance})` : ''}
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">3</div>
                <div className="text-sm text-muted-foreground">AI Agents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">5</div>
                <div className="text-sm text-muted-foreground">Data Sources</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">∞</div>
                <div className="text-sm text-muted-foreground">Insights</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Powered by ADK-TS Multi-Agent System</p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;
