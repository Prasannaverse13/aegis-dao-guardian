import { Shield, TrendingUp, Search, Brain, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AgentStatus } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface AgentCardProps {
  agent: AgentStatus;
  onClick?: () => void;
  isExpanded?: boolean;
}

const agentIcons = {
  orchestrator: Shield,
  analyst: Brain,
  sentinel: Search,
  economist: TrendingUp,
};

const agentGradients = {
  orchestrator: 'from-purple-500/20 to-blue-500/20',
  analyst: 'from-blue-500/20 to-cyan-500/20',
  sentinel: 'from-red-500/20 to-orange-500/20',
  economist: 'from-green-500/20 to-emerald-500/20',
};

export const AgentCard = ({ agent, onClick, isExpanded }: AgentCardProps) => {
  const Icon = agentIcons[agent.id as keyof typeof agentIcons] || Shield;
  const gradient = agentGradients[agent.id as keyof typeof agentGradients];

  const getStatusIcon = () => {
    switch (agent.status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (agent.status) {
      case 'active':
      case 'processing':
        return 'text-primary';
      case 'complete':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-4 bg-card/50 backdrop-blur-sm border-border shadow-card transition-all duration-300',
        onClick && 'cursor-pointer hover:shadow-elevated hover:scale-105',
        agent.status === 'processing' && 'ring-2 ring-primary/50',
        isExpanded && 'shadow-elevated'
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center', gradient)}>
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{agent.name}</p>
              <p className={cn('font-semibold text-sm', getStatusColor())}>
                {agent.status === 'idle' ? 'Standby' : agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
              </p>
            </div>
          </div>
          {getStatusIcon()}
        </div>

        {agent.status === 'processing' && (
          <div className="space-y-1">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all duration-500 animate-gradient-shift"
                style={{ width: `${agent.progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{agent.progress}% complete</p>
          </div>
        )}

        {isExpanded && agent.findings && agent.findings.length > 0 && (
          <div className="mt-3 space-y-1 animate-fade-in">
            <p className="text-xs font-semibold text-primary">Recent Activity:</p>
            {agent.findings.map((finding, idx) => (
              <p key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                <span className="text-primary mt-0.5">•</span>
                {finding}
              </p>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
