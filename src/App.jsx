import React, { useState, useEffect } from 'react';
import { ChefHat, Settings, ShoppingBag, Coffee, ArrowLeftRight, DollarSign, Calendar, Sparkles, RefreshCw, HelpCircle, ShieldAlert } from 'lucide-react';
import { getApiKey, generateCookingPlan } from './gemini';

// Import subcomponents
import InputForm from './components/InputForm';
import Timer from './components/Timer';
import MealPlanTab from './components/MealPlanTab';
import GroceryTab from './components/GroceryTab';
import SubstitutionsTab from './components/SubstitutionsTab';
import BudgetTab from './components/BudgetTab';

export default function App() {
  const [isKeyConfigured, setIsKeyConfigured] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Application Data States
  const [plan, setPlan] = useState(null);
  const [targetBudget, setTargetBudget] = useState(20);
  const [activeTab, setActiveTab] = useState('meals'); // meals | grocery | substitutions | budget
  const [appliedSubstitutions, setAppliedSubstitutions] = useState({}); // { original_lower: substitute }

  useEffect(() => {
    const hasKey = !!getApiKey();
    setIsKeyConfigured(hasKey);
    if (!hasKey) {
      setError('GEMINI_API_KEY is not defined in your .env file. Please add GEMINI_API_KEY=your_key to e:/Promptwars/warmup/.env and restart the Vite server.');
    }
  }, []);

  const handleGenerate = async (params) => {
    setIsLoading(true);
    setError('');
    setAppliedSubstitutions({});
    setTargetBudget(params.budget || 20);

    try {
      const generatedPlan = await generateCookingPlan(params);
      
      // Basic schema verification
      if (!generatedPlan || !generatedPlan.meals) {
        throw new Error('API returned an incomplete structure. Please try generating again.');
      }
      
      setPlan(generatedPlan);
      setActiveTab('meals');
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred while generating your cooking plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSubstitution = (original, substitute) => {
    const key = original.toLowerCase();
    setAppliedSubstitutions(prev => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = substitute;
      }
      return next;
    });
  };

  const handleReset = () => {
    setPlan(null);
    setAppliedSubstitutions({});
    setError('');
  };

  return (
    <>
      {/* App Header */}
      <header className="app-header">
        <div className="logo-container">
          <div className="logo-icon">
            <ChefHat size={22} strokeWidth={2.5} />
          </div>
          <span className="logo-text">GourmetAI</span>
        </div>
        
        <div className="header-actions">
          {plan && (
            <button 
              onClick={handleReset} 
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
              disabled={isLoading}
            >
              <RefreshCw size={14} /> New Plan
            </button>
          )}
        </div>
      </header>

      {/* Main Body Grid */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Error message */}
        {error && (
          <div className="glass-panel" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            color: 'var(--color-danger)', 
            background: 'rgba(244, 67, 54, 0.08)',
            border: '1px solid rgba(244, 67, 54, 0.2)',
            padding: '1rem',
            margin: '1rem 0',
            borderRadius: 'var(--radius-md)',
            animation: 'fadeIn 0.2s ease'
          }}>
            <ShieldAlert size={20} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Generation Failed</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>{error}</div>
            </div>
          </div>
        )}

        {!plan ? (
          /* Landing Screen */
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', margin: '1rem 0 3rem' }}>
            
            {/* Hero / Vibe */}
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '3rem', lineHeight: '1.1' }}>
                Cook smarter, <br />
                aligned with <span style={{ color: 'var(--color-primary)' }}>your day</span>.
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.5' }}>
                GourmetAI generates a custom daily meal plan, grocery shopping list, budget analysis, and ingredient swaps tailored exactly to your schedule and diet.
              </p>
            </div>

            {/* Input Form Card */}
            <div style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
              <InputForm onGenerate={handleGenerate} isLoading={isLoading} />
            </div>

            {!isKeyConfigured && (
              <div 
                className="glass-panel" 
                style={{ 
                  maxWidth: '500px', 
                  margin: '0 auto', 
                  padding: '1.25rem', 
                  textAlign: 'center', 
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                  background: 'rgba(244, 67, 54, 0.03)',
                  color: 'var(--color-danger)',
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>⚠️ API Key Required</div>
                <span>Please add <strong>GEMINI_API_KEY=your_key</strong> to your <code>.env</code> file and restart the development server.</span>
              </div>
            )}

          </div>
        ) : (
          /* Dashboard Layout */
          <div className="dashboard-grid animate-fade-in">
            {/* Sidebar Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <InputForm onGenerate={handleGenerate} isLoading={isLoading} />
              <Timer />
            </div>

            {/* Dashboard Content Tabs Column */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              
              {/* Tabs list */}
              <div className="tab-bar">
                <button 
                  onClick={() => setActiveTab('meals')} 
                  className={`tab-btn ${activeTab === 'meals' ? 'active' : ''}`}
                >
                  <Coffee size={16} /> Meals
                </button>
                <button 
                  onClick={() => setActiveTab('grocery')} 
                  className={`tab-btn ${activeTab === 'grocery' ? 'active' : ''}`}
                >
                  <ShoppingBag size={16} /> Shopping
                </button>
                <button 
                  onClick={() => setActiveTab('substitutions')} 
                  className={`tab-btn ${activeTab === 'substitutions' ? 'active' : ''}`}
                >
                  <ArrowLeftRight size={16} /> Swaps
                </button>
                <button 
                  onClick={() => setActiveTab('budget')} 
                  className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
                >
                  <DollarSign size={16} /> Budget
                </button>
              </div>

              {/* Tab Display Screen */}
              <div style={{ flex: 1 }}>
                {activeTab === 'meals' && (
                  <MealPlanTab 
                    meals={plan.meals} 
                    activeSubstitutions={appliedSubstitutions} 
                  />
                )}
                {activeTab === 'grocery' && (
                  <GroceryTab 
                    groceryList={plan.groceryList} 
                    activeSubstitutions={appliedSubstitutions}
                    originalSubstitutes={plan.substitutions}
                  />
                )}
                {activeTab === 'substitutions' && (
                  <SubstitutionsTab 
                    substitutions={plan.substitutions} 
                    appliedSubstitutions={appliedSubstitutions}
                    onToggleSubstitution={handleToggleSubstitution}
                  />
                )}
                {activeTab === 'budget' && (
                  <BudgetTab 
                    budgetFeasibility={plan.budgetFeasibility} 
                    targetBudget={targetBudget}
                    groceryList={plan.groceryList}
                    activeSubstitutions={appliedSubstitutions}
                    originalSubstitutes={plan.substitutions}
                  />
                )}
              </div>

            </div>
          </div>
        )}
      </main>
    </>
  );
}
