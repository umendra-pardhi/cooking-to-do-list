import React, { useState } from 'react';
import { ChefHat, Compass, DollarSign, Users, Sparkles, Server } from 'lucide-react';

const PRESETS = [
  { label: '🏃 Busy Workday', value: 'High energy breakfast, lunch on the go, quick 15-min dinner. Gym in the evening.' },
  { label: '🍕 Relaxed Sunday', value: 'Comfort food day. Slow breakfast, lazy lunch, hosting a friend for dinner.' },
  { label: '🥗 Healthy Prep', value: 'Whole foods focus, low calorie, meal prep friendly recipes for the day.' },
];

const EQUIPMENTS = ['Stove', 'Oven', 'Air Fryer', 'Microwave', 'Blender'];

export default function InputForm({ onGenerate, isLoading }) {
  const [schedule, setSchedule] = useState('');
  const [dietary, setDietary] = useState('None');
  const [budget, setBudget] = useState('20');
  const [servings, setServings] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState(['Stove', 'Oven', 'Microwave']);

  const handleEquipmentToggle = (item) => {
    setSelectedEquipment(prev => 
      prev.includes(item) 
        ? prev.filter(e => e !== item) 
        : [...prev, item]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!schedule.trim()) return;
    onGenerate({
      schedule: schedule.trim(),
      dietary,
      budget: budget ? parseFloat(budget) : null,
      servings: parseInt(servings) || 1,
      equipment: selectedEquipment
    });
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-glass)' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ChefHat className="color-primary" style={{ color: 'var(--color-primary)' }} />
        Configure Your Day
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Schedule Textarea */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>What's your schedule like?</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>*Required</span>
          </label>
          <textarea
            placeholder="e.g. Busy morning meetings, 20 mins for lunch, need a hearty dinner after running..."
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="form-textarea"
            rows={3}
            required
            disabled={isLoading}
          />
          <div className="preset-chip-container">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSchedule(p.value)}
                className="preset-chip"
                disabled={isLoading}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Preferences */}
        <div className="form-group">
          <label className="form-label">Dietary Preferences</label>
          <select
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            className="form-select"
            disabled={isLoading}
          >
            <option value="None">No Restrictions</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Gluten-Free">Gluten-Free</option>
            <option value="Keto">Keto</option>
            <option value="Low-Carb">Low-Carb</option>
          </select>
        </div>

        {/* Budget & Servings row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Daily Budget ($)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <DollarSign size={14} />
              </span>
              <input
                type="number"
                min="5"
                max="200"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '1.75rem' }}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Servings</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Users size={14} />
              </span>
              <input
                type="number"
                min="1"
                max="10"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '1.75rem' }}
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Equipment Checklist */}
        <div className="form-group">
          <label className="form-label">Kitchen Equipment Available</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.25rem' }}>
            {EQUIPMENTS.map((eq) => (
              <label 
                key={eq} 
                className="custom-checkbox" 
                style={{ fontSize: '0.85rem' }}
              >
                <input
                  type="checkbox"
                  checked={selectedEquipment.includes(eq)}
                  onChange={() => handleEquipmentToggle(eq)}
                  disabled={isLoading}
                />
                <span className="checkmark">
                  {selectedEquipment.includes(eq) && '✓'}
                </span>
                <span className="checkbox-text">{eq}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.5rem' }}
          disabled={isLoading || !schedule.trim()}
        >
          {isLoading ? (
            <>
              <div className="spinner" style={{ width: '16px', height: '16px' }} />
              <span>Generating Plan...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Generate Cook Plan</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
