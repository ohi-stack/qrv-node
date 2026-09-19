import { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  AlertCircle,
  Loader2,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail
} from '../firebase.js';

export default function AuthModal({ isOpen, onClose, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode); // 'signin' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      if (user) {
        setSuccess('Successfully signed in with Google!');
        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign in popup was closed before completing.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Please allow popups for this site.');
      } else {
        setError(err.message || 'Failed to sign in with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        const user = await loginWithEmail(email, password);
        if (user) {
          setSuccess('Signed in successfully!');
          setTimeout(() => {
            onClose();
          }, 600);
        }
      } else {
        const user = await registerWithEmail(email, password, displayName);
        if (user) {
          setSuccess('Account created and registered successfully!');
          setTimeout(() => {
            onClose();
          }, 700);
        }
      }
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please verify your credentials.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(2, 10, 18, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        id="auth-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'linear-gradient(180deg, #072236 0%, #041624 100%)',
          borderRadius: '16px',
          border: '1px solid #1f5f7a',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(45, 215, 234, 0.1)',
          padding: '28px',
          color: '#f7f9fb',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          id="auth-modal-close-btn"
          onClick={onClose}
          aria-label="Close dialog"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: '#82a2b7',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '6px'
          }}
        >
          <X size={18} />
        </button>

        {/* Title & Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(45, 215, 234, 0.12)',
              color: '#2dd7ea',
              marginBottom: '10px'
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <h2
            id="auth-modal-title"
            style={{
              margin: '0 0 4px',
              fontSize: '22px',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#f7f9fb'
            }}
          >
            {mode === 'signin' ? 'Sign in to QR-V' : 'Create an Account'}
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#88a8bd' }}>
            Access verification audits, persistent bookmarks, and inspector tools
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'rgba(3, 16, 26, 0.7)',
            borderRadius: '10px',
            padding: '4px',
            marginBottom: '20px',
            border: '1px solid #144053'
          }}
        >
          <button
            type="button"
            id="tab-signin-btn"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              background: mode === 'signin' ? '#0f3f56' : 'transparent',
              color: mode === 'signin' ? '#2dd7ea' : '#7d9cb0',
              transition: 'all 0.15s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            id="tab-register-btn"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            style={{
              padding: '8px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              background: mode === 'register' ? '#0f3f56' : 'transparent',
              color: mode === 'register' ? '#2dd7ea' : '#7d9cb0',
              transition: 'all 0.15s ease'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          id="google-signin-action-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '10px',
            background: '#ffffff',
            color: '#1f2937',
            border: '1px solid #d1d5db',
            fontWeight: 700,
            fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s ease',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          {/* Official Google G Logo SVG */}
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
            gap: '12px'
          }}
        >
          <div style={{ flex: 1, height: '1px', background: '#19495e' }} />
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#688d9f', fontWeight: 800 }}>
            or with email
          </span>
          <div style={{ flex: 1, height: '1px', background: '#19495e' }} />
        </div>

        {/* Alert Messages */}
        {error && (
          <div
            id="auth-error-box"
            style={{
              marginBottom: '16px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(240, 82, 82, 0.15)',
              border: '1px solid rgba(240, 82, 82, 0.35)',
              color: '#ff8585',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}
          >
            <AlertCircle size={15} style={{ marginTop: '2px', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            id="auth-success-box"
            style={{
              marginBottom: '16px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(67, 236, 167, 0.15)',
              border: '1px solid rgba(67, 236, 167, 0.35)',
              color: '#43eca7',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle size={15} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailSubmit} style={{ display: 'grid', gap: '14px' }}>
          {mode === 'register' && (
            <div>
              <label
                htmlFor="auth-display-name"
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#9ab0c3',
                  marginBottom: '6px'
                }}
              >
                Full Name / Inspector Name
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#65889e'
                  }}
                />
                <input
                  id="auth-display-name"
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '8px',
                    border: '1px solid #1b4f65',
                    background: '#041523',
                    color: '#f7f9fb',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email-input"
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 700,
                color: '#9ab0c3',
                marginBottom: '6px'
              }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={15}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#65889e'
                }}
              />
              <input
                id="auth-email-input"
                type="email"
                required
                placeholder="name@organization.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '8px',
                  border: '1px solid #1b4f65',
                  background: '#041523',
                  color: '#f7f9fb',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="auth-password-input"
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 700,
                color: '#9ab0c3',
                marginBottom: '6px'
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={15}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#65889e'
                }}
              />
              <input
                id="auth-password-input"
                type="password"
                required
                placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '8px',
                  border: '1px solid #1b4f65',
                  background: '#041523',
                  color: '#f7f9fb',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={loading}
            style={{
              marginTop: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              borderRadius: '8px',
              background: '#2dd7ea',
              color: '#021828',
              border: 'none',
              fontWeight: 800,
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.15s ease'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Processing…</span>
              </>
            ) : mode === 'signin' ? (
              'Sign In to Workspace'
            ) : (
              'Create Workspace Account'
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div
          style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#7192a6'
          }}
        >
          {mode === 'signin' ? (
            <span>
              Don&apos;t have an account yet?{' '}
              <button
                type="button"
                id="switch-to-register-btn"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2dd7ea',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Create one now
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                id="switch-to-signin-btn"
                onClick={() => {
                  setMode('signin');
                  setError(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2dd7ea',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Sign in here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
