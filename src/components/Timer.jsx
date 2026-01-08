import React from 'react';
import { Clock } from 'lucide-react';

export default function Timer({ seconds }) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  // Determine timer state based on remaining time
  let timerClass = 'timer normal';
  if (seconds <= 120) {
    timerClass = 'timer critical';
  } else if (seconds <= 300) {
    timerClass = 'timer warning';
  }
  
  return (
    <div className={timerClass}>
      <Clock 
        size={18} 
        style={{ 
          verticalAlign: 'middle', 
          marginRight: '8px',
          display: 'inline'
        }} 
      />
      {String(minutes).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  );
}
