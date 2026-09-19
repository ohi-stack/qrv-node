import { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  KeyRound,
  ShieldCheck,
  LogOut,
  Calendar,
  BookmarkCheck
} from 'lucide-react';
import { logoutUser, db } from '../firebase.js';
import { doc, getDoc } from 'firebase/firestore';

export default function UserProfileModal({ isOpen, onClose, user }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !user?.uid) return;

    let isMounted = true;
    const fetchDoc = async () => {
      try {
        const snap = await getDoc(doc(db, `users/${user.uid}`));
        if (snap.exists() && isMounted) {
          setProfileData(snap.data());
        }
      } catch (e) {
        console.warn('Could not fetch user profile details:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchDoc();

    return () => {
      isMounted = false;
    };
  }, [isOpen, user]);

  if (!isOpen || !user) return null;

  const isGoogleUser = user.providerData?.some((p) => p.providerId === 'google.com');

  const handleSignOut = async () => {
    try {
      await logoutUser();
      onClose();
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  return (
    <div
      id="user-profile-modal-backdrop"
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
        id="user-profile-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'linear-gradient(180deg, #072236 0%, #041624 100%)',
          borderRadius: '16px',
          border: '1px solid #1f5f7a',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
          padding: '26px',
          color: '#f7f9fb',
          position: 'relative'
        }}
      >
        <button
          type="button"
          id="close-profile-modal-btn"
          onClick={onClose}
          aria-label="Close user profile"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: '#82a2b7',
            cursor: 'pointer',
            padding: '6px'
          }}
        >
          <X size={18} />
        </button>

        {/* User Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User avatar'}
              referrerPolicy="no-referrer"
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                border: '2px solid #2dd7ea',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(45, 215, 234, 0.15)',
                border: '2px solid #2dd7ea',
                color: '#2dd7ea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '20px'
              }}
            >
              {(user.displayName || user.email || 'U')[0].toUpperCase()}
            </div>
          )}

          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#f7f9fb' }}>
              {user.displayName || user.email?.split('@')[0]}
            </h3>
            <span style={{ fontSize: '12px', color: '#7ea4ba' }}>{user.email}</span>
            <div style={{ marginTop: '4px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(67, 236, 167, 0.12)',
                  color: '#43eca7',
                  fontSize: '10px',
                  fontWeight: 800,
                  border: '1px solid rgba(67, 236, 167, 0.25)'
                }}
              >
                <ShieldCheck size={11} /> Verified Account
              </span>
            </div>
          </div>
        </div>

        {/* User Details List */}
        <div
          style={{
            background: 'rgba(3, 16, 26, 0.65)',
            borderRadius: '12px',
            border: '1px solid #144053',
            padding: '14px',
            display: 'grid',
            gap: '10px',
            fontSize: '12px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#7698ac', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <KeyRound size={13} /> Provider
            </span>
            <span style={{ fontWeight: 700, color: '#f7f9fb' }}>
              {isGoogleUser ? 'Google OAuth' : 'Email & Password'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#7698ac', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={13} /> User UID
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#2dd7ea' }}>
              {user.uid.slice(0, 10)}…{user.uid.slice(-4)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#7698ac', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookmarkCheck size={13} /> Firestore Sync
            </span>
            <span style={{ color: '#43eca7', fontWeight: 700 }}>
              Connected
            </span>
          </div>

          {user.metadata?.creationTime && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#7698ac', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={13} /> Member Since
              </span>
              <span style={{ color: '#9fb5c6' }}>
                {new Date(user.metadata.creationTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button
            type="button"
            id="profile-signout-btn"
            onClick={handleSignOut}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              borderRadius: '8px',
              background: 'rgba(240, 82, 82, 0.12)',
              border: '1px solid rgba(240, 82, 82, 0.3)',
              color: '#ff8585',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            <LogOut size={15} /> Sign Out
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              background: '#0a293b',
              border: '1px solid #1d576f',
              color: '#95b7cb',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
