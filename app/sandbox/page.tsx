'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/Button';
import { Play, RotateCcw, Terminal } from 'lucide-react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

interface LogMessage {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  content: string;
}

const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <script>
    window.addEventListener('message', (e) => {
      const code = e.data.code;
      if (!code) return;

      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
      };

      const sendLog = (type, args) => {
        const message = args.map(a => {
          if (typeof a === 'object') {
            try {
              return JSON.stringify(a, null, 2);
            } catch (err) {
              return String(a);
            }
          }
          return String(a);
        }).join(' ');
        
        window.parent.postMessage({ type: 'sandbox-log', logType: type, message }, '*');
      };

      console.log = (...args) => { sendLog('log', args); originalConsole.log(...args); };
      console.error = (...args) => { sendLog('error', args); originalConsole.error(...args); };
      console.warn = (...args) => { sendLog('warn', args); originalConsole.warn(...args); };
      console.info = (...args) => { sendLog('info', args); originalConsole.info(...args); };

      try {
        const result = new Function(code)();
        // If there is a return value from the eval, print it.
        if (result !== undefined) {
          sendLog('log', ['<--', result]);
        }
      } catch (err) {
        sendLog('error', [err.toString()]);
      } finally {
        // Restore console so we don't duplicate logs on next run
        console.log = originalConsole.log;
        console.error = originalConsole.error;
        console.warn = originalConsole.warn;
        console.info = originalConsole.info;
      }
    });
  </script>
</head>
<body></body>
</html>
`;

export default function SandboxPage() {
  const [code, setCode] = useState('// Write some JavaScript here...\n\nconst greet = (name) => {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));\n');
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      // Security: verify the message is from our sandbox format
      if (e.data && e.data.type === 'sandbox-log') {
        setLogs(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          type: e.data.logType,
          content: e.data.message
        }]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const runCode = () => {
    // Clear previous logs
    setLogs([]);
    
    // Send code to the iframe sandbox
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ code }, '*');
    }
  };

  const clearConsole = () => {
    setLogs([]);
  };

  const restartSandbox = () => {
    // Changing the key forces the iframe to re-render, giving us a completely fresh JS environment
    setIframeKey(prev => prev + 1);
    setLogs([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 'calc(100vh - 74px)' }}>
      {/* Hidden Sandbox iframe */}
      <iframe
        key={iframeKey}
        ref={iframeRef}
        srcDoc={htmlTemplate}
        sandbox="allow-scripts"
        style={{ display: 'none' }}
      />

      <div style={{ padding: '24px', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={24} color="var(--primary)" />
            JavaScript Sandbox
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Write and execute client-side JavaScript in a secure environment.</p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="ghost" onClick={restartSandbox} title="Restart Sandbox Environment">
            <RotateCcw size={16} style={{ marginRight: '8px' }} />
            Restart Env
          </Button>
          <Button variant="primary" onClick={runCode}>
            <Play size={16} style={{ marginRight: '8px' }} />
            Run Code
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, gap: '16px', padding: '0 24px 24px 24px', minHeight: 0 }}>
        {/* Editor Pane */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.2)', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            editor.js
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => Prism.highlight(code, Prism.languages.javascript, 'javascript')}
              padding={16}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  runCode();
                }
              }}
              style={{
                fontFamily: 'var(--font-jb-mono)',
                fontSize: '16px',
                minHeight: '100%',
                backgroundColor: 'transparent',
              }}
              textareaClassName="editor-textarea"
            />
          </div>
        </div>

        {/* Console Pane */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Console Output</span>
            <Button variant="ghost" onClick={clearConsole} style={{ padding: '4px 8px', height: 'auto', fontSize: '12px' }}>Clear</Button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', fontFamily: 'var(--font-jb-mono)', fontSize: '15px', backgroundColor: '#0d0d12' }}>
            {logs.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', opacity: 0.5 }}>
                Awaiting execution...
              </div>
            ) : (
              logs.map((log) => (
                <div 
                  key={log.id} 
                  style={{ 
                    padding: '6px 0', 
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    color: log.type === 'error' ? 'var(--error)' : 
                           log.type === 'warn' ? '#e0af68' : 'var(--text)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all'
                  }}
                >
                  {log.content}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
