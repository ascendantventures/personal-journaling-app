import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthError } from './AuthError';
import { AuthPage } from './AuthPage';
import { signUp } from '../../lib/auth';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await signUp(email, password);
      if (authError) {
        if (authError.message.toLowerCase().includes('already') || authError.message.toLowerCase().includes('duplicate')) {
          setError('Email already in use');
        } else if (authError.message.toLowerCase().includes('password')) {
          setError('Password must be at least 6 characters');
        } else {
          setError(authError.message);
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '48px',
    background: '#F5F3F0',
    border: '1px solid #E7E5E4',
    borderRadius: '8px',
    padding: '0 14px',
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: '16px',
    fontWeight: 400,
    color: '#1C1917',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 150ms ease',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: '14px',
    fontWeight: 500,
    color: '#44403C',
    marginBottom: '6px',
  };

  return (
    <AuthPage>
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E7E5E4',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)',
          width: '100%',
          maxWidth: '420px',
        }}
      >
        {/* Card header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '24px',
              fontWeight: 700,
              color: '#1C1917',
              margin: '0 0 8px',
            }}
          >
            Create your journal
          </h2>
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '14px',
              color: '#78716C',
              margin: 0,
            }}
          >
            Start capturing your thoughts today
          </p>
        </div>

        {error && <AuthError message={error} />}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="signup-email" style={labelStyle}>
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#C2410C';
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(194,65,12,0.12)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E7E5E4';
                e.currentTarget.style.background = '#F5F3F0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="signup-password" style={labelStyle}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="signup-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: '48px' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#C2410C';
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(194,65,12,0.12)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E7E5E4';
                  e.currentTarget.style.background = '#F5F3F0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#78716C',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '12px',
                color: '#78716C',
                marginTop: '6px',
                marginBottom: 0,
              }}
            >
              Must be at least 6 characters
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'rgba(194,65,12,0.4)' : '#C2410C',
              color: '#FFFFFF',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              padding: '12px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 150ms ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#9A3412';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(194,65,12,0.25)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#C2410C';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? (
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer link */}
        <p
          style={{
            marginTop: '24px',
            textAlign: 'center',
            fontFamily: "'Inter', system-ui, sans-serif",
            fontSize: '14px',
            color: '#78716C',
          }}
        >
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#C2410C',
              fontWeight: 500,
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '14px',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
              padding: 0,
            }}
          >
            Sign in
          </button>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AuthPage>
  );
}
