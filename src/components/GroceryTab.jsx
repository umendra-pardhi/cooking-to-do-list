import React, { useState } from 'react';
import { CheckSquare, ShoppingCart, Tag, AlertCircle } from 'lucide-react';

export default function GroceryTab({ groceryList, activeSubstitutions = {}, originalSubstitutes = [] }) {
  const [checkedItems, setCheckedItems] = useState({}); // { [itemName]: boolean }

  const handleToggleCheck = (name) => {
    setCheckedItems(prev => ({ ...prev, [name]: !prev[name] }));
  };

  // Group items by category
  const categories = {};
  
  // Calculate running total of costs
  let totalCost = 0;
  let remainingCost = 0;

  groceryList.forEach(item => {
    // Check if item has been substituted
    const originalNameLower = item.name.toLowerCase();
    const substitution = originalSubstitutes.find(s => s.original.toLowerCase() === originalNameLower);
    const isSubstituted = !!activeSubstitutions[originalNameLower];
    
    let displayName = item.name;
    let displayCost = item.estimatedCost;
    let note = '';

    if (isSubstituted && substitution) {
      displayName = substitution.substitute;
      note = `Substituted for ${item.name}`;
      
      // Attempt to calculate impact if it says "saves X" or similar, or just keep same price/estimate
      // For simplicity, we can parse the impact or keep it
      // Let's assume the substitute might be cheaper - if the prompt says saves $1.20, we could adjust.
      // But keeping displayCost is safe, or we can reduce it slightly if saves is found.
      const match = substitution.impact?.match(/\$?([0-9.]+)/);
      if (match && displayCost) {
        const savings = parseFloat(match[1]);
        if (!isNaN(savings)) {
          displayCost = Math.max(0.1, displayCost - savings);
        }
      }
    }

    const category = item.category || 'Other';
    if (!categories[category]) {
      categories[category] = [];
    }

    const cost = parseFloat(displayCost) || 0;
    totalCost += cost;
    if (!checkedItems[displayName]) {
      remainingCost += cost;
    }

    categories[category].push({
      ...item,
      displayName,
      displayCost: cost,
      note,
      isSubstituted
    });
  });

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = groceryList.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShoppingCart size={18} style={{ color: 'var(--color-primary)' }} />
            Grocery Shopping Checklist
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {checkedCount} of {totalCount} items purchased
          </p>
        </div>

        {/* Cost Summary Cards */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '110px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Remaining Cost</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-secondary)' }}>
              ${remainingCost.toFixed(2)}
            </span>
          </div>
          <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '110px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Plan Cost</span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              ${totalCost.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {groceryList.length === 0 ? (
        <div className="glass-panel empty-state">
          <div className="empty-state-icon">🛒</div>
          <div className="empty-state-title">No Groceries Needed</div>
          <div className="empty-state-desc">Your meal plan is empty or requires zero ingredients.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="glass-panel animate-slide-up" style={{ padding: '1.25rem' }}>
              <h4 style={{ 
                fontSize: '0.95rem', 
                color: 'var(--color-primary)', 
                borderBottom: '1px solid var(--border-glass)', 
                paddingBottom: '0.5rem', 
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {category}
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {items.map((item, index) => {
                  const isChecked = checkedItems[item.displayName] || false;
                  return (
                    <div 
                      key={index} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid rgba(255,255,255,0.02)'
                      }}
                    >
                      <label className="custom-checkbox">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleCheck(item.displayName)}
                        />
                        <span className="checkmark">
                          {isChecked && '✓'}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className="checkbox-text" style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                            {item.displayName}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Qty: {item.amount}
                            {item.note && (
                              <span style={{ marginLeft: '6px', color: 'var(--color-secondary)', fontStyle: 'italic' }}>
                                ({item.note})
                              </span>
                            )}
                          </span>
                        </div>
                      </label>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {item.isSubstituted && (
                          <span 
                            style={{ 
                              fontSize: '0.65rem', 
                              color: 'var(--color-success)', 
                              background: 'var(--color-success-alpha)', 
                              padding: '0.1rem 0.4rem', 
                              borderRadius: '4px',
                              fontWeight: 600
                            }}
                          >
                            SWAPPED
                          </span>
                        )}
                        <span style={{ 
                          fontSize: '0.9rem', 
                          fontWeight: 700, 
                          color: isChecked ? 'var(--text-muted)' : 'var(--text-primary)',
                          textDecoration: isChecked ? 'line-through' : 'none'
                        }}>
                          ${item.displayCost.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
