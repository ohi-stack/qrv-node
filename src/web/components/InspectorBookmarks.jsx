import { useState, useEffect } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Trash2,
  LogIn,
  LogOut,
  ShieldCheck,
  FileText,
  Clock,
  ExternalLink,
  Plus
} from 'lucide-react';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  saveVerificationBookmark,
  deleteVerificationBookmark,
  subscribeUserBookmarks
} from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import AuthModal from './AuthModal.jsx';

export default function InspectorBookmarks({ currentQrvid = 'QRV-1001-DEMO', currentStatus = 'VALID' }) {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setErrorMsg(null);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      return;
    }

    const unsubscribeBookmarks = subscribeUserBookmarks(
      user.uid,
      (items) => {
        setBookmarks(items || []);
      },
      (err) => {
        console.error('Failed to sync bookmarks:', err);
      }
    );

    return () => unsubscribeBookmarks();
  }, [user]);

  const handleSignIn = async () => {
    setErrorMsg(null);
    try {
      await loginWithGoogle();
    } catch (err) {
      setErrorMsg(err.message || 'Sign in failed');
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const isCurrentBookmarked = bookmarks.some((b) => b.qrvid === currentQrvid);

  const handleBookmarkCurrent = async () => {
    if (!user) {
      await handleSignIn();
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    try {
      await saveVerificationBookmark(user.uid, {
        qrvid: currentQrvid,
        status: currentStatus,
        notes: notes.trim(),
        pinned: true
      });
      setNotes('');
      setShowAddForm(false);
    } catch (err) {
      setErrorMsg('Failed to save to Firestore.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (bookmarkId) => {
    if (!user) return;
    try {
      await deleteVerificationBookmark(user.uid, bookmarkId);
    } catch (err) {
      console.error('Failed to delete bookmark:', err);
    }
  };

  return (
    <div
      id="inspector-bookmarks-card"
      style={{
        marginTop: '20px',
        padding: '22px 24px',
        borderRadius: '16px',
        border: '1px solid #1a5870',
        background: 'linear-gradient(180deg, #071f30 0%, #051624 100%)',
        boxShadow: '0 16px 40px rgba(0, 15, 30, 0.3)',
        color: '#f7f9fb'
      }}
    >
      {/* Top row: Identity & Firebase Status */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(45, 215, 234, 0.12)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(45, 215, 234, 0.12)',
              color: '#2dd7ea'
            }}
          >
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, letterSpacing: '-0.01em' }}>
              Cloud Inspector Workspace
            </h4>
            <span style={{ fontSize: '11px', color: '#82a2b7' }}>
              Persistent Firestore & Auth sync for audited QR-V records
            </span>
          </div>
        </div>

        <div>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#f7f9fb' }}>
                  {user.displayName || user.email}
                </div>
                <div style={{ fontSize: '10px', color: '#43eca7', fontFamily: 'monospace' }}>
                  Authenticated Inspector
                </div>
              </div>
              <button
                type="button"
                id="firebase-signout-btn"
                onClick={handleSignOut}
                title="Sign out of Firebase"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #1c5269',
                  background: '#0a2435',
                  color: '#9ab0c3',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <LogOut size={12} />
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                id="firebase-signin-btn"
                onClick={handleSignIn}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #2dd7ea',
                  background: 'rgba(45, 215, 234, 0.1)',
                  color: '#2dd7ea',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <LogIn size={14} />
                Sign in with Google
              </button>
              <button
                type="button"
                id="firebase-email-modal-btn"
                onClick={() => setAuthModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #1c5269',
                  background: '#0a2638',
                  color: '#8deaf3',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Email Options
              </button>
            </div>
          )}
        </div>
      </div>

      {errorMsg && (
        <div
          style={{
            margin: '12px 0',
            padding: '8px 12px',
            borderRadius: '8px',
            background: 'rgba(240, 82, 82, 0.15)',
            border: '1px solid rgba(240, 82, 82, 0.4)',
            color: '#ff8585',
            fontSize: '12px'
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Action to bookmark current active QRVID */}
      <div
        style={{
          marginTop: '16px',
          padding: '14px 16px',
          borderRadius: '10px',
          background: 'rgba(7, 28, 43, 0.6)',
          border: '1px solid rgba(45, 215, 234, 0.1)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <div>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7c9bb0', fontWeight: 800 }}>
            Target Identifier
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '15px', color: '#f7f9fb' }}>
              {currentQrvid}
            </span>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 800,
                background: currentStatus === 'VALID' ? 'rgba(67, 236, 167, 0.15)' : 'rgba(246, 198, 91, 0.15)',
                color: currentStatus === 'VALID' ? '#43eca7' : '#f6c65b'
              }}
            >
              {currentStatus}
            </span>
          </div>
        </div>

        {user ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {isCurrentBookmarked ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: '#43eca7',
                  fontSize: '12px',
                  fontWeight: 700
                }}
              >
                <BookmarkCheck size={16} /> Saved to Cloud
              </span>
            ) : showAddForm ? (
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Optional audit notes…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={500}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #1c5269',
                    background: '#04131f',
                    color: '#f7f9fb',
                    fontSize: '12px',
                    width: '180px'
                  }}
                />
                <button
                  type="button"
                  id="confirm-bookmark-btn"
                  onClick={handleBookmarkCurrent}
                  disabled={saving}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: '#2dd7ea',
                    color: '#031422',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                id="open-bookmark-form-btn"
                onClick={() => setShowAddForm(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: '6px',
                  background: '#0f3a52',
                  border: '1px solid #1e617d',
                  color: '#8deaf3',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                <Plus size={13} />
                Bookmark Record
              </button>
            )}
          </div>
        ) : (
          <span style={{ fontSize: '11px', color: '#7c9bb0' }}>
            Sign in to save this record to your Firestore audit notebook
          </span>
        )}
      </div>

      {/* Saved Records List */}
      {user && (
        <div style={{ marginTop: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px'
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#9ab0c3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your Saved Audits ({bookmarks.length})
            </span>
          </div>

          {bookmarks.length === 0 ? (
            <div
              style={{
                padding: '16px',
                textAlign: 'center',
                borderRadius: '8px',
                background: 'rgba(5, 22, 36, 0.4)',
                border: '1px dashed #16465c',
                color: '#6b8da2',
                fontSize: '12px'
              }}
            >
              No bookmarked verifications yet. Click &ldquo;Bookmark Record&rdquo; above to store verified references in your Firestore database.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '8px' }}>
              {bookmarks.map((bm) => (
                <div
                  key={bm.bookmarkId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(7, 28, 43, 0.7)',
                    border: '1px solid rgba(45, 215, 234, 0.08)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '13px', color: '#2dd7ea' }}>
                        {bm.qrvid}
                      </span>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: bm.status === 'VALID' ? 'rgba(67,236,167,0.12)' : 'rgba(246,198,91,0.12)',
                          color: bm.status === 'VALID' ? '#43eca7' : '#f6c65b'
                        }}
                      >
                        {bm.status}
                      </span>
                      {bm.verifiedAt && (
                        <span style={{ fontSize: '10px', color: '#68869b', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={10} />
                          {new Date(bm.verifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    {bm.notes && (
                      <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#9ab0c3', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FileText size={11} style={{ color: '#68869b' }} />
                        {bm.notes}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <a
                      href={`/verify/${encodeURIComponent(bm.qrvid)}`}
                      title="Inspect record"
                      style={{
                        color: '#71b7c8',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(bm.bookmarkId)}
                      title="Delete bookmark"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#8b5e67',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
