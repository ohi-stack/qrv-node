import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, logoutUser } from '../firebase.js';
import AuthModal from '../components/AuthModal.jsx';
import { Header, Footer } from './qrv-app';
export default function Account() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  async function logout() {
    try { await logoutUser(); } catch { setError('Sign-out failed. Please retry.'); }
  }
  return <div className="site-shell"><Header /><main className="subpage-content signin-content">
    <p className="eyebrow">QR-V network</p><h1>Node account</h1>
    <p>Email and Google use the existing Node account provider. Account identity does not grant issuer or administrator authority.</p>
    {user ? <><p>Signed in as {user.email}</p><button className="button" onClick={logout}>Sign out</button></> : <button className="button" onClick={() => setOpen(true)}>Use email or Google</button>}
    {error && <p role="alert">{error}</p>}
    <p><a href="/issuer">Open authorized issuer portal</a> · <a href="/dashboard">Open Sites workspace</a></p>
    <AuthModal isOpen={open} onClose={() => setOpen(false)} />
  </main><Footer /></div>;
}
