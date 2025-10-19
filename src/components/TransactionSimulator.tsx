import { useState } from 'react';
import { useAccount, useBalance, usePublicClient } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { normalize } from 'viem/ens';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Loader2, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface GasEstimate {
  gasUnits: bigint;
  baseFee: bigint;
  priorityFee: bigint;
  totalCostETH: string;
  totalCostUSD: string;
}

export function TransactionSimulator() {
  const { address, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const publicClient = usePublicClient();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [estimate, setEstimate] = useState<GasEstimate | null>(null);

  const fetchETHPrice = async (): Promise<number> => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      const data = await response.json();
      return data.ethereum.usd;
    } catch (error) {
      console.error('Failed to fetch ETH price:', error);
      return 0;
    }
  };

  const resolveAddress = async (addressOrENS: string): Promise<`0x${string}`> => {
    if (addressOrENS.endsWith('.eth')) {
      try {
        const resolved = await publicClient?.getEnsAddress({
          name: normalize(addressOrENS),
        });
        if (!resolved) throw new Error('ENS name not found');
        return resolved;
      } catch (error) {
        throw new Error(`Failed to resolve ENS name: ${addressOrENS}`);
      }
    }
    return addressOrENS as `0x${string}`;
  };

  const simulateTransaction = async () => {
    if (!publicClient || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!recipient || !amount) {
      toast.error('Please enter recipient and amount');
      return;
    }

    setIsSimulating(true);
    setEstimate(null);

    try {
      // Resolve ENS if needed
      const resolvedRecipient = await resolveAddress(recipient);

      // Parse amount
      const valueInWei = parseEther(amount);

      // Get current gas fees
      const feeData = await publicClient.estimateFeesPerGas();
      const baseFee = feeData.maxFeePerGas || 0n;
      const priorityFee = feeData.maxPriorityFeePerGas || 0n;

      // Estimate gas for transaction
      const gasEstimate = await publicClient.estimateGas({
        account: address,
        to: resolvedRecipient,
        value: valueInWei,
      });

      // Calculate total cost
      const totalGasCost = gasEstimate * baseFee;
      const totalCostETH = formatEther(totalGasCost);

      // Get ETH price for USD conversion
      const ethPrice = await fetchETHPrice();
      const totalCostUSD = (parseFloat(totalCostETH) * ethPrice).toFixed(2);

      setEstimate({
        gasUnits: gasEstimate,
        baseFee,
        priorityFee,
        totalCostETH,
        totalCostUSD,
      });

      toast.success('Transaction simulated successfully');
    } catch (error: any) {
      console.error('Simulation error:', error);
      toast.error(error.message || 'Failed to simulate transaction');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-background via-background to-primary/5 border-primary/20">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-primary">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Transaction Simulator
            </h2>
            <p className="text-sm text-muted-foreground">
              Estimate gas fees before sending transactions
            </p>
          </div>
        </div>

        {/* Wallet Info */}
        {address && balance && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Your Balance</span>
              <span className="font-mono font-bold">
                {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">Network</span>
              <Badge variant="outline">{chain?.name}</Badge>
            </div>
          </div>
        )}

        {/* Simulation Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Recipient Address or ENS</label>
            <Input
              placeholder="vitalik.eth or 0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (ETH)</label>
            <Input
              type="number"
              step="0.001"
              placeholder="0.5"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="font-mono"
            />
          </div>

          <Button
            onClick={simulateTransaction}
            disabled={isSimulating || !address}
            className="w-full"
            size="lg"
          >
            {isSimulating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Simulating...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Simulate Transaction
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        {estimate && (
          <div className="space-y-4 animate-in fade-in-50 duration-500">
            <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <TrendingUp className="h-4 w-4" />
                Gas Estimation Results
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-xs text-muted-foreground mb-1">Estimated Gas</div>
                  <div className="font-mono font-bold">
                    {estimate.gasUnits.toString()} units
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-xs text-muted-foreground mb-1">Base Fee</div>
                  <div className="font-mono font-bold text-sm">
                    {(Number(estimate.baseFee) / 1e9).toFixed(2)} Gwei
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-accent/50 border border-accent">
                  <div className="text-xs text-muted-foreground mb-1">Total Cost (ETH)</div>
                  <div className="font-mono font-bold text-accent-foreground">
                    {parseFloat(estimate.totalCostETH).toFixed(6)} ETH
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-accent/50 border border-accent">
                  <div className="text-xs text-muted-foreground mb-1">Total Cost (USD)</div>
                  <div className="font-mono font-bold text-accent-foreground">
                    ${estimate.totalCostUSD}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-500">
                  This is an estimate. Actual gas costs may vary based on network conditions.
                  Total transaction cost will be <strong>{amount} ETH + {parseFloat(estimate.totalCostETH).toFixed(6)} ETH gas</strong>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
