import React, { useState } from 'react';
import { Clock, CheckSquare, Coffee, Sun, Sunset, Award, Play, ChevronRight, X, ChevronLeft, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MealPlanTab({ meals, activeSubstitutions = {} }) {
  const [activeMealKey, setActiveMealKey] = useState(null); // 'breakfast', 'lunch', 'dinner'
  const [completedSteps, setCompletedSteps] = useState({}); // { [mealKey_stepIndex]: boolean }
  const [completedMeals, setCompletedMeals] = useState({}); // { [mealKey]: boolean }

  const handleOpenCookMode = (mealKey) => {
    setActiveMealKey(mealKey);
  };

  const handleCloseCookMode = () => {
    setActiveMealKey(null);
  };

  const handleStepToggle = (mealKey, stepIndex, totalSteps) => {
    const key = `${mealKey}_${stepIndex}`;
    const newCompleted = { ...completedSteps, [key]: !completedSteps[key] };
    setCompletedSteps(newCompleted);

    // Check if all steps of this meal are now completed
    const allDone = meals[mealKey].instructions.every((_, idx) => {
      const stepKey = `${mealKey}_${idx}`;
      return stepKey === key ? !completedSteps[key] : completedSteps[stepKey];
    });

    if (allDone && !completedMeals[mealKey]) {
      setCompletedMeals(prev => ({ ...prev, [mealKey]: true }));
      triggerConfetti();
    } else if (!allDone && completedMeals[mealKey]) {
      setCompletedMeals(prev => ({ ...prev, [mealKey]: false }));
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff6f3c', '#ffb03a', '#00e676', '#ff3c60']
    });
  };

  // Helper to get adjusted ingredient name if substituted
  const getIngredientName = (name) => {
    if (activeSubstitutions[name.toLowerCase()]) {
      return (
        <span>
          <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', marginRight: '4px' }}>
            {name}
          </span>
          <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            {activeSubstitutions[name.toLowerCase()]}
          </span>
        </span>
      );
    }
    return name;
  };

  const mealMeta = {
    breakfast: { title: 'Breakfast', icon: <Coffee size={20} style={{ color: 'var(--color-secondary)' }} /> },
    lunch: { title: 'Lunch', icon: <Sun size={20} style={{ color: 'var(--color-primary)' }} /> },
    dinner: { title: 'Dinner', icon: <Sunset size={20} style={{ color: 'var(--color-accent)' }} /> },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.25rem' }}>Your Structured Cooking Plan</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {Object.keys(completedMeals).filter(k => completedMeals[k]).map(k => (
            <div 
              key={k} 
              style={{
                background: 'var(--color-success-alpha)',
                color: 'var(--color-success)',
                border: '1px solid var(--color-success)',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.2rem 0.5rem',
                borderRadius: '10px',
                textTransform: 'capitalize'
              }}
            >
              ✓ {k} Cooked
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {Object.entries(meals).map(([key, meal]) => {
          const isDone = completedMeals[key];
          return (
            <div 
              key={key} 
              className={`glass-panel ${isDone ? 'cooked-border' : ''}`}
              style={{ 
                padding: '1.5rem', 
                position: 'relative',
                border: isDone ? '1px solid var(--color-success)' : '1px solid var(--border-glass)',
                background: isDone ? 'rgba(0, 230, 118, 0.02)' : 'var(--bg-glass)'
              }}
            >
              {isDone && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  color: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  <Award size={16} /> Cooked & Enjoyed!
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                {mealMeta[key].icon}
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 700 }}>
                  {mealMeta[key].title}
                </span>
              </div>

              <h4 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>{meal.name}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{meal.description}</p>

              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} />
                  <span>Prep: {meal.prepTime}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} style={{ color: 'var(--color-primary)' }} />
                  <span>Cook: {meal.cookTime}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                  {meal.equipment.map((eq, i) => (
                    <span key={i} className="info-badge">{eq}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
                <div>
                  <h5 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Ingredients Needed:</h5>
                  <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.4rem' }}>
                    {meal.ingredients.map((ing, i) => (
                      <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--color-primary)' }}>•</span>
                        <span>
                          {getIngredientName(ing.name)} ({ing.amount})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <button 
                    onClick={() => handleOpenCookMode(key)} 
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                  >
                    <Play size={14} fill="currentColor" />
                    <span>Start Cook Mode</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cook Mode Fullscreen Modal */}
      {activeMealKey && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-scale-in" style={{ maxWidth: '600px', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {mealMeta[activeMealKey].icon}
                <h2 style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>
                  {activeMealKey} Cook Mode
                </h2>
              </div>
              <button 
                onClick={handleCloseCookMode} 
                className="btn-icon-only"
                style={{ width: '32px', height: '32px', border: 'none', background: 'transparent' }}
              >
                <X size={18} />
              </button>
            </div>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {meals[activeMealKey].name}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Check off steps as you complete them to finish cooking!
            </p>

            {/* Instruction list with custom checkboxes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1.5rem' }}>
              {meals[activeMealKey].instructions.map((step, index) => {
                const stepKey = `${activeMealKey}_${index}`;
                const isChecked = completedSteps[stepKey] || false;
                return (
                  <label 
                    key={index} 
                    className="custom-checkbox" 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      background: isChecked ? 'rgba(0, 230, 118, 0.03)' : 'rgba(255,255,255,0.01)',
                      border: isChecked ? '1px solid rgba(0, 230, 118, 0.2)' : '1px solid var(--border-glass)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleStepToggle(activeMealKey, index, meals[activeMealKey].instructions.length)}
                    />
                    <span className="checkmark" style={{ marginTop: '2px' }}>
                      {isChecked && '✓'}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                        STEP {index + 1}
                      </span>
                      <span className="checkbox-text" style={{ fontSize: '0.9rem', lineHeight: '1.4', textDecoration: isChecked ? 'line-through' : 'none' }}>
                        {step}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>

            {completedMeals[activeMealKey] ? (
              <div 
                style={{ 
                  textAlign: 'center', 
                  color: 'var(--color-success)', 
                  background: 'var(--color-success-alpha)', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  animation: 'pulse 1.5s infinite'
                }}
              >
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>🎉 Cooking Complete!</div>
                <div style={{ fontSize: '0.85rem' }}>Bon appétit! Enjoy your delicious meal.</div>
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1rem' }}>
                {meals[activeMealKey].instructions.filter((_, i) => completedSteps[`${activeMealKey}_${i}`]).length} of {meals[activeMealKey].instructions.length} steps completed
              </div>
            )}

            <button 
              onClick={handleCloseCookMode} 
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {completedMeals[activeMealKey] ? 'Yum, Let\'s Eat!' : 'Close Cook Mode'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
