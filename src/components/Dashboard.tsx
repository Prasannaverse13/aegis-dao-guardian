import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAccount, useDisconnect } from 'wagmi';
import { toast } from 'sonner';
import { AgentCard } from '@/components/AgentCard';
import { AnalysisResult, AgentStatus, SAMPLE_PROPOSALS } from '@/types/analysis';
import { ProposalAnalyzer } from '@/services/proposalAnalyzer';

const Dashboard = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [proposalUrl, setProposalUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  
  const [agents, setAgents] = useState<AgentStatus[]>([
    {
      id: 'orchestrator',
      name: 'Orchestrator Agent',
      role: 'Project Manager',
      status: 'idle',
      progress: 0,
      findings: []
    },
    {
      id: 'analyst',
      name: 'Analyst Agent',
      role: 'Strategist',
      status: 'idle',
      progress: 0,
      findings: []
    },
    {
      id: 'sentinel',
      name: 'Sentinel Agent',
      role: 'Security Specialist',
      status: 'idle',
      progress: 0,
      findings: []
    },
    {
      id: 'economist',
      name: 'Economist Agent',
      role: 'Financial Modeler',
      status: 'idle',
      progress: 0,
      findings: []
    }
  ]);

  const updateAgent = (agentId: string, updates: Partial<AgentStatus>) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, ...updates } : agent
    ));
  };

  const resetAgents = () => {
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: 'idle',
      progress: 0,
      findings: []
    })));
  };

  const handleAnalyze = async () => {
    if (!proposalUrl.trim()) {
      toast.error('Please enter a proposal URL');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    resetAgents();
    toast.info('🚀 Initializing multi-agent analysis system...');

    try {
      const analyzer = new ProposalAnalyzer(updateAgent);
      const result = await analyzer.analyze(proposalUrl);
      
      setAnalysisResult(result);
      toast.success('✅ Multi-agent analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed. Please try again.');
      resetAgents();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSampleProposal = (url: string) => {
    setProposalUrl(url);
    toast.info('Sample proposal loaded - click Analyze to begin');
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low':
        return 'text-green-400 bg-green-500/10 border-green-500/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background">
        <div className="absolute inset-0 bg-gradient-accent opacity-50" />
      </div>

      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-elevated">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Aegis
                </h1>
                <p className="text-sm text-muted-foreground">Multi-Agent DAO Analysis</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Connected</p>
                <p className="text-sm font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
              </div>
              <Button onClick={() => disconnect()} variant="outline">
                Disconnect
              </Button>
            </div>
          </div>
        </header>

        {/* Multi-Agent System Status */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
              isExpanded={expandedAgent === agent.id}
            />
          ))}
        </div>

        {/* Sample Proposals */}
        <Card className="p-6 mb-8 bg-card/50 backdrop-blur-sm border-border shadow-card">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Sample Test Proposals
          </h2>
          <div className="grid md:grid-cols-3 gap-3">
            {SAMPLE_PROPOSALS.map((sample, idx) => (
              <Button
                key={idx}
                variant="outline"
                onClick={() => loadSampleProposal(sample.url)}
                className="h-auto flex-col items-start text-left p-4 border-border hover:border-primary/50"
                disabled={isAnalyzing}
              >
                <p className="font-semibold text-sm mb-1">{sample.title}</p>
                <p className="text-xs text-muted-foreground">{sample.description}</p>
              </Button>
            ))}
          </div>
        </Card>

        {/* Input Section */}
        <Card className="p-6 mb-8 bg-card/50 backdrop-blur-sm border-border shadow-elevated">
          <h2 className="text-xl font-semibold mb-4">Analyze Governance Proposal</h2>
          <div className="flex gap-3">
            <Input
              placeholder="Enter DAO proposal URL (Snapshot, Tally, or Forum link)"
              value={proposalUrl}
              onChange={(e) => setProposalUrl(e.target.value)}
              className="flex-1 bg-background/50 border-border"
              disabled={isAnalyzing}
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="bg-gradient-primary hover:shadow-elevated transition-all duration-300"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Powered by Gemini AI • Multi-Agent Collaboration System
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              4 Agents Active
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">Real-time Analysis</span>
          </div>
        </Card>

        {/* Results */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Executive Summary */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-card">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Executive Summary
              </h3>
              <p className="text-muted-foreground leading-relaxed">{analysisResult.summary}</p>
            </Card>

            {/* Risk Assessment & Financial Data */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-card">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Risk Assessment
                </h3>
                <div className="space-y-3">
                  {analysisResult.risks.map((risk, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${getRiskColor(risk.level)}`}>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold text-sm">{risk.level}:</span>
                        <span className="text-sm flex-1">{risk.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-card">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Financial Impact
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Requested Amount</p>
                    <p className="text-2xl font-bold text-primary">{analysisResult.financialData.requestedAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Treasury Impact</p>
                    <p className="text-xl font-semibold">{analysisResult.financialData.treasuryImpact}</p>
                  </div>
                  {analysisResult.financialData.runwayReduction && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Treasury Runway</p>
                      <p className="text-sm font-medium">{analysisResult.financialData.runwayReduction}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Security Score</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-primary"
                          style={{ width: `${analysisResult.securityScore}%` }}
                        />
                      </div>
                      <span className="text-xl font-bold text-primary">{analysisResult.securityScore}/100</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Benefits */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Key Benefits
              </h3>
              <ul className="space-y-2">
                {analysisResult.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Specialist Agent Reports */}
            {(analysisResult.securityProfile || analysisResult.financialBrief) && (
              <div className="grid md:grid-cols-2 gap-6">
                {analysisResult.securityProfile && (
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-card">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-400" />
                      Sentinel Agent Report
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Audit Status</p>
                        <p className="font-medium">{analysisResult.securityProfile.auditStatus}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Wallet Age</p>
                        <p className="font-medium">{analysisResult.securityProfile.walletAge}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Vulnerabilities</p>
                        <p className="font-medium text-green-400">{analysisResult.securityProfile.vulnerabilities}</p>
                      </div>
                    </div>
                  </Card>
                )}

                {analysisResult.financialBrief && (
                  <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-card">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Economist Agent Report
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Treasury Runway</p>
                        <p className="font-medium">{analysisResult.financialBrief.treasuryRunway}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">ROI Projection</p>
                        <p className="font-medium text-green-400">{analysisResult.financialBrief.roiProjection}</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Sentiment & Recommendation */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border shadow-card">
                <h3 className="text-lg font-semibold mb-3">Community Sentiment</h3>
                <p className="text-muted-foreground">{analysisResult.sentiment}</p>
              </Card>

              <Card className="p-6 bg-gradient-primary border-primary/50 shadow-elevated">
                <h3 className="text-lg font-semibold mb-3 text-primary-foreground">Final Recommendation</h3>
                <p className="text-primary-foreground/90 font-medium">{analysisResult.recommendation}</p>
              </Card>
            </div>

            {/* View Proposal Button */}
            <div className="flex justify-center">
              <Button
                onClick={() => window.open(proposalUrl, '_blank')}
                variant="outline"
                className="border-primary/50 hover:bg-primary/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Original Proposal
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!analysisResult && !isAnalyzing && (
          <Card className="p-12 text-center bg-card/30 backdrop-blur-sm border-dashed border-2 border-border">
            <Shield className="w-16 h-16 mx-auto mb-4 text-primary/50" />
            <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Enter a DAO governance proposal URL or select a sample proposal to start the multi-agent analysis.
              Our 4 specialist AI agents will collaborate to provide comprehensive insights.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
              <div className="text-center p-3 rounded-lg bg-card/50 border border-border">
                <Shield className="w-6 h-6 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Orchestrator</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-card/50 border border-border">
                <CheckCircle className="w-6 h-6 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Analyst</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-card/50 border border-border">
                <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Sentinel</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-card/50 border border-border">
                <CheckCircle className="w-6 h-6 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Economist</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
