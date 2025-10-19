export interface AnalysisResult {
  summary: string;
  risks: Array<{ level: string; description: string }>;
  benefits: string[];
  financialData: {
    requestedAmount: string;
    treasuryImpact: string;
    runwayReduction?: string;
    marketImpact?: string;
  };
  securityScore: number;
  sentiment: string;
  recommendation: string;
  securityProfile?: {
    auditStatus: string;
    walletAge: string;
    vulnerabilities: string;
  };
  financialBrief?: {
    treasuryRunway: string;
    roiProjection: string;
  };
}

export interface AgentStatus {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'active' | 'processing' | 'complete' | 'error';
  progress: number;
  findings?: string[];
}

export const SAMPLE_PROPOSALS = [
  {
    title: 'Complex Grant Proposal',
    url: 'https://snapshot.org/#/arbitrum.eth/proposal/0x2f8a3c8b4b8a2e1d7b3f5c8d6e0a8a7b9b0c7d4f1e3a9b8c6a5d4e3f2b1a0c9e',
    description: 'Arbitrum Gaming Catalyst Program - Tests financial analysis & treasury impact'
  },
  {
    title: 'Technical Upgrade',
    url: 'https://snapshot.org/#/uniswap.eth/proposal/0x5a1b3c9d8e7f6a0b2c4d6e8f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2b1a',
    description: 'Deploy Uniswap v3 on Base - Tests smart contract security analysis'
  },
  {
    title: 'Ecosystem & Parameter Change',
    url: 'https://snapshot.org/#/ens.eth/proposal/0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    description: 'ENS Working Group Budget - Tests sentiment analysis & governance modeling'
  }
];
