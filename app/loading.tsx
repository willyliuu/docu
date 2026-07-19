import React from 'react';

export default function Loading() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100%', 
      minHeight: '50vh',
      width: '100%',
      gap: '16px',
      color: 'var(--text-secondary)'
    }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      `}</style>
      <div className="spinner" />
      <p style={{ fontFamily: 'var(--font-jb-mono), monospace', fontSize: '14px' }}>Loading data...</p>
    </div>
  );
}
