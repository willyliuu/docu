'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
  chart: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'var(--font-inter), sans-serif',
    });

    let isMounted = true;

    const renderChart = async () => {
      if (!containerRef.current) return;
      
      try {
        setError(null);
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        
        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.error("Mermaid rendering error:", err);
          setError(err instanceof Error ? err.message : "Failed to render diagram");
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div style={{ color: 'var(--error)', padding: '16px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <strong>Mermaid Error:</strong>
        <pre style={{ fontSize: '12px', marginTop: '8px', whiteSpace: 'pre-wrap' }}>{error}</pre>
      </div>
    );
  }

  return <div ref={containerRef} className="mermaid-preview" style={{ padding: '16px 0', display: 'flex', justifyContent: 'center' }} />;
};
