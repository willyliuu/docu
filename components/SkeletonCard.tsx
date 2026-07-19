import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="card flex-col gap-2 skeleton-wrapper" style={{ display: 'flex', height: '200px' }}>
      <div className="flex justify-between" style={{ alignItems: 'flex-start', gap: '16px', marginBottom: '8px' }}>
        <div className="skeleton-line" style={{ width: '70%', height: '24px', borderRadius: '4px' }} />
        <div className="skeleton-line" style={{ width: '60px', height: '20px', borderRadius: '9999px', flexShrink: 0 }} />
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
        <div className="skeleton-line" style={{ width: '100%', height: '14px', borderRadius: '4px' }} />
        <div className="skeleton-line" style={{ width: '90%', height: '14px', borderRadius: '4px' }} />
        <div className="skeleton-line" style={{ width: '95%', height: '14px', borderRadius: '4px' }} />
        <div className="skeleton-line" style={{ width: '60%', height: '14px', borderRadius: '4px' }} />
      </div>
      
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="skeleton-line" style={{ width: '12px', height: '12px', borderRadius: '50%' }} />
        <div className="skeleton-line" style={{ width: '100px', height: '12px', borderRadius: '4px' }} />
      </div>
    </div>
  );
};
