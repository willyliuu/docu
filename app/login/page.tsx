'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { BookOpen } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Invalid email or password.');
      setIsLoading(false);
    } else {
      router.push('/');
      router.refresh();
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
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.03em' }}>Welcome back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', textAlign: 'center' }}>
            Enter your credentials to access your workspace.
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
        
        <form onSubmit={handleSubmit} className="flex-col gap-5">
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>Email address</label>
            <Input 
              type="email" value={email} onChange={e => setEmail(e.target.value)} 
              required placeholder="name@example.com" 
              style={{ backgroundColor: 'rgba(22, 22, 30, 0.6)', border: '1px solid rgba(255,255,255,0.06)', height: '48px' }} 
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>Password</label>
              <Link href="#" style={{ fontSize: '13px', color: 'var(--primary)', textDecoration: 'none' }}>Forgot password?</Link>
            </div>
            <Input 
              type="password" value={password} onChange={e => setPassword(e.target.value)} 
              required placeholder="••••••••" 
              style={{ backgroundColor: 'rgba(22, 22, 30, 0.6)', border: '1px solid rgba(255,255,255,0.06)', height: '48px' }} 
            />
          </div>
          <Button 
            type="submit" variant="primary" 
            style={{ width: '100%', marginTop: '12px', height: '48px', fontSize: '15px', fontWeight: 600, borderRadius: '12px' }} 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Don&apos;t have an account? <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}
