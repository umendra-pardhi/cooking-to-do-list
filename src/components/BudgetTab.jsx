import React from 'react';
import { DollarSign, TrendingDown, CheckCircle2, AlertTriangle, AlertCircle, Award } from 'lucide-react';

export default function BudgetTab({ budgetFeasibility = {}, targetBudget = 20, groceryList = [], activeSubstitutions = {}, originalSubstitutes = [] }) {
  // Recalculate cost with applied substitutions
  let totalCost = 0;
  groceryList.forEach(item => {
    const originalNameLower = item.name.toLowerCase();
    const substitution = originalSubstitutes.find(s => s.original.toLowerCase() === originalNameLower);
    const isSubstituted = !!activeSubstitutions[originalNameLower];
    
    let displayCost = item.estimatedCost;

    if (isSubstituted && substitution) {
      const match = substitution.impact?.match(/\$?([0-9.]+)/);
      if (match && displayCost) {
        const savings = parseFloat(match[1]);
        if (!isNaN(savings)) {
          displayCost = Math.max(0.1, displayCost - savings);
        }
      }
    }
    totalCost += parseFloat(displayCost) || 0;
  });

  const parsedTarget = parseFloat(targetBudget) || 0;
  const isOver = totalCost > parsedTarget;
  const isTight = !isOver && totalCost > parsedTarget * 0.85;

  let statusColor = 'var(--color-success)';
  let statusText = 'Feasible & Within Budget';
  let StatusIcon = CheckCircle2;
  let progressColor = 'linear-gradient(90deg, #00e676 0%, #00b0ff 100%)';

  if (isOver) {
    statusColor = 'var(--color-danger)';
    statusText = 'Over Target Budget';
    StatusIcon = AlertCircle;
    progressColor = 'linear-gradient(90deg, #f44336 0%, #ff1744 100%)';
  } else if (isTight) {
    statusColor = 'var(--color-warning)';
    statusText = 'Tight Budget (Close to Target)';
    StatusIcon = AlertTriangle;
    progressColor = 'linear-gradient(90deg, #ffb300 0%, #ff8f00 100%)';
  }

  const percentUsed = parsedTarget > 0 ? Math.min(100, (totalCost / parsedTarget) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Overview Card */}
      <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-glass)' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <DollarSign size={18} style={{ color: 'var(--color-primary)' }} />
          Budget Feasibility Dashboard
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Target Daily Budget</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ${parsedTarget.toFixed(2)}
            </div>
          </div>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Current Meal Plan Cost</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: statusColor }}>
              ${totalCost.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {parsedTarget > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              <span>Budget Utilized</span>
              <span style={{ fontWeight: 600, color: statusColor }}>{percentUsed.toFixed(0)}%</span>
            </div>
            <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${percentUsed}%`, 
                  background: progressColor,
                  borderRadius: '5px',
                  transition: 'width 0.4s ease'
                }} 
              />
            </div>
          </div>
        )}

        {/* Status Alarm */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          padding: '1rem', 
          borderRadius: 'var(--radius-md)', 
          background: isOver ? 'rgba(244, 67, 54, 0.08)' : isTight ? 'rgba(255, 179, 0, 0.08)' : 'var(--color-success-alpha)',
          border: `1px solid ${isOver ? 'rgba(244, 67, 54, 0.2)' : isTight ? 'rgba(255, 179, 0, 0.2)' : 'var(--color-success)'}`,
          color: statusColor,
          marginBottom: '0.5rem'
        }}>
          <StatusIcon size={20} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{statusText}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
              {isOver 
                ? `You are over budget by $${(totalCost - parsedTarget).toFixed(2)}. Apply ingredient swaps to reduce the cost!`
                : isTight 
                ? `You've utilized most of your budget. Subscriptions could help save more.`
                : 'Excellent planning! You have room in your budget.'
              }
            </div>
          </div>
        </div>
      </div>

      {/* AI Budget Explanation */}
      {budgetFeasibility.breakdown && (
        <div className="glass-panel" style={{ padding: '1.25rem', border: '1px solid var(--border-glass)' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Cost Analysis</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            {budgetFeasibility.breakdown}
          </p>
        </div>
      )}

      {/* AI Saving Tips */}
      {budgetFeasibility.savingTips && budgetFeasibility.savingTips.length > 0 && (
        <div className="glass-panel animate-slide-up" style={{ padding: '1.25rem', border: '1px solid var(--border-glass)' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
            <TrendingDown size={16} style={{ color: 'var(--color-success)' }} />
            AI Cost-Saving Tips
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {budgetFeasibility.savingTips.map((tip, i) => (
              <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-success)' }}>•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
