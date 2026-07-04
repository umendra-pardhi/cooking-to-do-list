import React from 'react';
import { ArrowLeftRight, Check, AlertCircle, Sparkles } from 'lucide-react';

export default function SubstitutionsTab({ substitutions = [], appliedSubstitutions = {}, onToggleSubstitution }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div>
        <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeftRight size={18} style={{ color: 'var(--color-primary)' }} />
          Smart Ingredient Substitutions
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Swap ingredients for budget savings, allergy alternatives, or vegan options. Swapping updates your grocery checklist and recipes!
        </p>
      </div>

      {substitutions.length === 0 ? (
        <div className="glass-panel empty-state">
          <div className="empty-state-icon">🔄</div>
          <div className="empty-state-title">No Substitutions Found</div>
          <div className="empty-state-desc">The AI didn't recommend any substitutions for this particular meal plan.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {substitutions.map((sub, index) => {
            const isApplied = !!appliedSubstitutions[sub.original.toLowerCase()];
            
            return (
              <div 
                key={index} 
                className="glass-panel animate-slide-up"
                style={{ 
                  padding: '1.25rem',
                  border: isApplied ? '1px solid var(--color-success)' : '1px solid var(--border-glass)',
                  background: isApplied ? 'rgba(0, 230, 118, 0.02)' : 'var(--bg-glass)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                  {/* Swap display */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ 
                      fontWeight: 600, 
                      fontSize: '1rem', 
                      textDecoration: isApplied ? 'line-through' : 'none',
                      color: isApplied ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}>
                      {sub.original}
                    </span>
                    <ArrowLeftRight size={14} style={{ color: 'var(--text-secondary)' }} />
                    <span style={{ 
                      fontWeight: 700, 
                      fontSize: '1.05rem', 
                      color: isApplied ? 'var(--color-success)' : 'var(--color-primary)'
                    }}>
                      {sub.substitute}
                    </span>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => onToggleSubstitution(sub.original, sub.substitute)}
                    className="btn"
                    style={{
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.8rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isApplied ? 'var(--color-success)' : 'rgba(255,255,255,0.04)',
                      borderColor: isApplied ? 'var(--color-success)' : 'var(--border-glass)',
                      color: isApplied ? '#000' : 'var(--text-primary)',
                      fontWeight: 700
                    }}
                  >
                    {isApplied ? (
                      <>
                        <Check size={12} strokeWidth={3} /> Swapped
                      </>
                    ) : (
                      'Apply Swap'
                    )}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <p>
                    <strong style={{ color: 'var(--text-primary)' }}>Why Swap: </strong>
                    {sub.reason}
                  </p>
                  {sub.notes && (
                    <p>
                      <strong style={{ color: 'var(--text-primary)' }}>Cooking Adjustments: </strong>
                      {sub.notes}
                    </p>
                  )}
                  {sub.impact && (
                    <div style={{ 
                      marginTop: '0.4rem', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.25rem',
                      color: isApplied ? 'var(--color-success)' : 'var(--color-secondary)',
                      fontWeight: 600,
                      fontSize: '0.8rem'
                    }}>
                      <Sparkles size={12} />
                      <span>Impact: {sub.impact}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
