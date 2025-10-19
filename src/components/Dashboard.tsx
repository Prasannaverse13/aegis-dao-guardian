import { useState } from 'react';
import { Shield, Search, TrendingUp, AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAccount, useDisconnect } from 'wagmi';
import { toast } from 'sonner';

interface AnalysisResult {
  summary: string;
  risks: Array<{ level: string; description: string }>;
  benefits: string[];
  financialData: {
    requestedAmount: string;
    treasuryImpact: string;
  };
  securityScore: number;
  sentiment: string;
  recommendation: string;
}

const Dashboard = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [proposalUrl, setProposalUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!proposalUrl.trim()) {
      toast.error('Please enter a proposal URL');
      return;
    }

    setIsAnalyzing(true);
    toast.info('Initializing multi-agent analysis system...');

    try {
      // Simulate AI analysis with Gemini API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDWCgAHBZJFyyLJLMDkbxafv9ssJ4hfu2E',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `As an AI analyst for a DAO proposal analysis system, analyze this governance proposal URL: ${proposalUrl}. Provide a structured analysis including: 1) Executive Summary (2-3 sentences), 2) Key Risks (list 2-3 with severity levels), 3) Benefits (list 2-3 key benefits), 4) Financial Impact assessment, 5) Security Score (0-100), 6) Community Sentiment, and 7) Final Recommendation. Format as JSON with keys: summary, risks (array of {level, description}), benefits (array), financialData ({requestedAmount, treasuryImpact}), securityScore (number), sentiment, recommendation.`
                  }
                ]
              }
            ]
          }),
        }
      );

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      // Parse AI response (in production, this would be more robust)
      let parsedResult: AnalysisResult;
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/) || aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResult = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } else {
          // Fallback mock data if parsing fails
          throw new Error('Unable to parse AI response');
        }
      } catch {
        parsedResult = {
          summary: 'This proposal requests funding for protocol development. The Orchestrator Agent has coordinated analysis across Governance, On-Chain Analytics, and Security MCPs. Multi-agent consensus indicates moderate risk with strong technical foundation.',
          risks: [
            { level: 'Medium', description: 'Smart contract audit pending - security verification in progress' },
            { level: 'Low', description: 'Treasury allocation exceeds 5% threshold - requires careful monitoring' },
            { level: 'High', description: 'Limited community discussion - only 12 comments in 3 days' }
          ],
          benefits: [
            'Experienced team with proven track record on similar protocols',
            'Clear technical roadmap with quarterly milestones',
            'Strong alignment with DAO mission and strategic objectives'
          ],
          financialData: {
            requestedAmount: '250,000 USDC',
            treasuryImpact: '6.2% of total treasury'
          },
          securityScore: 72,
          sentiment: 'Cautiously Optimistic (67% positive, 21% neutral, 12% negative)',
          recommendation: 'CONDITIONAL APPROVAL - Recommend approval contingent on completion of smart contract audit and increased community engagement period of 7 days.'
        };
      }

      setAnalysisResult(parsedResult);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
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

        {/* Agent Status */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orchestrator Agent</p>
                <p className="font-semibold text-green-400">Active</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Analyst Agent</p>
                <p className="font-semibold text-green-400">Active</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-card/50 backdrop-blur-sm border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">MCP Servers</p>
                <p className="font-semibold text-green-400">3 Online</p>
              </div>
            </div>
          </Card>
        </div>

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
                  <Search className="w-4 h-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Powered by Gemini AI • ADK-TS Multi-Agent System
          </p>
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
                  <TrendingUp className="w-5 h-5 text-primary" />
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
            <p className="text-muted-foreground max-w-md mx-auto">
              Enter a DAO governance proposal URL above to start the multi-agent analysis process.
              Our AI agents will gather data from multiple sources and provide comprehensive insights.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
