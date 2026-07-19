'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { signIn } from 'next-auth/react';
import { BookOpen } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setIsLoading(false);
        return;
      }
      
      // Auto login after signup
      const loginRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (loginRes?.error) {
        router.push('/login');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 74px)', padding: '24px' }}>
      <div 
        style={{ 
          width: '100%', 
          maxWidth: '440px',
          backgroundColor: 'rgba(22, 22, 30, 0.4)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.5), 0 0 20px rgba(187, 154, 247, 0.05)',
          borderRadius: '24px',
          padding: '48px 40px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '48px', height: '48px', borderRadius: '14px', 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            marginBottom: '20px', boxShadow: '0 8px 16px rgba(122, 162, 247, 0.25)'
          }}>
            <BookOpen size={24} color="#fff" />
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.03em' }}>Create an account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', textAlign: 'center' }}>
            Start building your personal knowledge base today.
          </p>
        </div>
        
        {error && (
          <div style={{ 
            backgroundColor: 'rgba(247, 118, 142, 0.1)', border: '1px solid rgba(247, 118, 142, 0.2)', 
            color: 'var(--error)', padding: '12px', borderRadius: '12px', marginBottom: '24px', 
            fontSize: '14px', textAlign: 'center', fontWeight: 500
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex-col gap-6">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>Full name</label>
            <Input 
              type="text" value={name} onChange={e => setName(e.target.value)} 
              required placeholder="Jane Doe" 
              style={{ backgroundColor: 'rgba(22, 22, 30, 0.6)', border: '1px solid rgba(255,255,255,0.06)', height: '48px' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>Email address</label>
            <Input 
              type="email" value={email} onChange={e => setEmail(e.target.value)} 
              required placeholder="name@example.com" 
              style={{ backgroundColor: 'rgba(22, 22, 30, 0.6)', border: '1px solid rgba(255,255,255,0.06)', height: '48px' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>Password</label>
            <Input 
              type="password" value={password} onChange={e => setPassword(e.target.value)} 
              required placeholder="••••••••" minLength={8}
              style={{ backgroundColor: 'rgba(22, 22, 30, 0.6)', border: '1px solid rgba(255,255,255,0.06)', height: '48px' }} 
            />
          </div>
          <Button 
            type="submit" variant="primary" 
            style={{ width: '100%', marginTop: '12px', height: '48px', fontSize: '15px', fontWeight: 600, borderRadius: '12px' }} 
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
