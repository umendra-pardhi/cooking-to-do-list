import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Flame, Hourglass } from 'lucide-react';

export default function Timer() {
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 mins default
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      handleTimerComplete();
      setIsActive(false);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, secondsLeft]);

  const handleTimerComplete = () => {
    if (isMuted) return;
    try {
      // Play a professional notification chime using Web Audio API
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Node 1: High beep
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
      
      // Node 2: Secondary harmony beep slightly offset
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1046.50, audioCtx.currentTime); // C6 note
        gain2.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.6);
      }, 150);
    } catch (e) {
      console.warn("Web Audio API not supported or blocked by browser policy.");
    }
  };

  const toggleStart = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(300); // Reset to 5 mins
  };

  const setDuration = (mins) => {
    setIsActive(false);
    setSecondsLeft(mins * 60);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentComplete = ((300 - secondsLeft) / 300) * 100; // purely visual mock reference

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
          <Hourglass size={16} style={{ color: 'var(--color-primary)' }} />
          Kitchen Timer
        </h3>
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          title={isMuted ? "Unmute Timer Alert" : "Mute Timer Alert"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'monospace', color: isActive ? 'var(--color-primary)' : 'var(--text-primary)', margin: '0.5rem 0', letterSpacing: '0.05em' }}>
        {formatTime(secondsLeft)}
      </div>

      {/* Preset Chips */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[1, 3, 5, 10, 15].map((m) => (
          <button 
            key={m} 
            onClick={() => setDuration(m)}
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '12px',
              border: '1px solid var(--border-glass)',
              background: secondsLeft === m * 60 ? 'var(--color-primary-alpha)' : 'rgba(255,255,255,0.02)',
              color: secondsLeft === m * 60 ? 'var(--color-primary)' : 'var(--text-secondary)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {m}m
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <button 
          onClick={toggleStart} 
          className="btn btn-secondary" 
          style={{ 
            flex: 1, 
            padding: '0.5rem 0.75rem', 
            borderRadius: 'var(--radius-sm)', 
            background: isActive ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            color: isActive ? 'var(--color-danger)' : 'var(--text-primary)',
            borderColor: isActive ? 'rgba(244, 67, 54, 0.2)' : 'var(--border-glass)',
            fontSize: '0.85rem'
          }}
        >
          {isActive ? (
            <>
              <Pause size={14} /> Pause
            </>
          ) : (
            <>
              <Play size={14} /> Start
            </>
          )}
        </button>
        <button 
          onClick={resetTimer} 
          className="btn btn-secondary" 
          style={{ flex: 0.5, padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
          title="Reset to 5m"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {secondsLeft === 0 && (
        <div style={{ 
          marginTop: '0.75rem', 
          fontSize: '0.8rem', 
          color: 'var(--color-primary)', 
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.25rem',
          animation: 'pulse 1s infinite'
        }}>
          <Flame size={14} /> Timer complete!
        </div>
      )}
    </div>
  );
}
