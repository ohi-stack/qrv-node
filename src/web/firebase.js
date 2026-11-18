import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  limit
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase SDK
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write'
};

/**
 * Standardized Firestore error handler conforming to skill requirements.
 * @param {unknown} error
 * @param {string} operationType
 * @param {string | null} path
 */
export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || false,
      isAnonymous: auth.currentUser?.isAnonymous || false,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Mandatory test connection check
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or database initializing.');
    }
  }
}
testConnection();

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Synchronize authenticated user profile to Firestore document /users/{userId}
 */
export async function syncUserProfile(user, customDisplayName = null) {
  if (!user?.uid) return null;
  const userPath = `users/${user.uid}`;
  const now = new Date().toISOString();
  const displayName = customDisplayName || user.displayName || user.email?.split('@')[0] || 'User';
  
  const payload = {
    userId: user.uid,
    email: user.email || '',
    displayName,
    photoURL: user.photoURL || '',
    updatedAt: now
  };

  try {
    const userDocRef = doc(db, userPath);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      payload.createdAt = now;
    }
    await setDoc(userDocRef, payload, { merge: true });
    return payload;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, userPath);
  }
}

/**
 * Sign in using Google OAuth Popup
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      await syncUserProfile(user);
    }
    return user;
  } catch (err) {
    console.error('Google Sign In error:', err);
    throw err;
  }
}

/**
 * Sign in with email and password
 */
export async function loginWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email.trim(), password);
    const user = result.user;
    if (user) {
      await syncUserProfile(user);
    }
    return user;
  } catch (err) {
    console.error('Email Sign In error:', err);
    throw err;
  }
}

/**
 * Register a new user with email, password, and display name
 */
export async function registerWithEmail(email, password, displayName = '') {
  try {
    const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = result.user;
    if (user) {
      if (displayName.trim()) {
        await updateProfile(user, { displayName: displayName.trim() });
      }
      await syncUserProfile(user, displayName.trim());
    }
    return user;
  } catch (err) {
    console.error('Email Registration error:', err);
    throw err;
  }
}

export async function logoutUser() {
  return signOut(auth);
}

/**
 * Save / bookmark a verification audit record to user's private collection
 */
export async function saveVerificationBookmark(userId, bookmarkData) {
  if (!userId) throw new Error('Authentication required to bookmark verification');
  const bookmarkId = bookmarkData.bookmarkId || `bm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const path = `users/${userId}/bookmarks/${bookmarkId}`;

  const payload = {
    bookmarkId,
    userId,
    qrvid: bookmarkData.qrvid,
    status: bookmarkData.status || 'VALID',
    notes: bookmarkData.notes || '',
    pinned: Boolean(bookmarkData.pinned),
    verifiedAt: bookmarkData.verifiedAt || new Date().toISOString(),
    createdAt: bookmarkData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, path), payload);
    return payload;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Remove a verification bookmark
 */
export async function deleteVerificationBookmark(userId, bookmarkId) {
  if (!userId || !bookmarkId) return;
  const path = `users/${userId}/bookmarks/${bookmarkId}`;
  try {
    await deleteDoc(doc(db, path));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

/**
 * Subscribe to user's saved verification bookmarks
 */
export function subscribeUserBookmarks(userId, onUpdate, onError) {
  if (!userId) return () => {};
  const path = `users/${userId}/bookmarks`;
  const q = collection(db, path);

  return onSnapshot(
    q,
    (snapshot) => {
      const items = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data());
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      if (onError) onError(error);
    }
  );
}

const INITIAL_VERIFICATION_SEEDS = [
  { recordId: 'vr-101', qrvid: 'QRV-1001-DEMO', status: 'VALID', issuer: 'ONEGODIAN, LLC', latencyMs: 22, resolvedBy: 'qrv-node-us-east1', minutesAgo: 2 },
  { recordId: 'vr-102', qrvid: 'QRV-9942-CRED', status: 'VALID', issuer: 'Apex Credentials Ltd', latencyMs: 19, resolvedBy: 'qrv-node-us-east1', minutesAgo: 5 },
  { recordId: 'vr-103', qrvid: 'QRV-8821-CERT', status: 'VALID', issuer: 'Global Cert Authority', latencyMs: 27, resolvedBy: 'qrv-node-us-east1', minutesAgo: 8 },
  { recordId: 'vr-104', qrvid: 'QRV-7733-REVOKED', status: 'REVOKED', issuer: 'FinTech Compliance Vault', latencyMs: 31, resolvedBy: 'qrv-node-us-east1', minutesAgo: 12 },
  { recordId: 'vr-105', qrvid: 'QRV-5512-ACAD', status: 'VALID', issuer: 'Polytechnic Institute', latencyMs: 18, resolvedBy: 'qrv-node-us-east1', minutesAgo: 16 },
  { recordId: 'vr-106', qrvid: 'QRV-4420-ASSET', status: 'VALID', issuer: 'Maritime Registry Intl', latencyMs: 25, resolvedBy: 'qrv-node-us-east1', minutesAgo: 21 },
  { recordId: 'vr-107', qrvid: 'QRV-3319-DOCU', status: 'VALID', issuer: 'Secure Doc Exchange', latencyMs: 20, resolvedBy: 'qrv-node-us-east1', minutesAgo: 26 },
  { recordId: 'vr-108', qrvid: 'QRV-2204-BAD', status: 'NOT_FOUND', issuer: 'Unknown Gateway', latencyMs: 35, resolvedBy: 'qrv-node-us-east1', minutesAgo: 32 },
  { recordId: 'vr-109', qrvid: 'QRV-1199-IDEN', status: 'VALID', issuer: 'Civic Trust Network', latencyMs: 23, resolvedBy: 'qrv-node-us-east1', minutesAgo: 38 },
  { recordId: 'vr-110', qrvid: 'QRV-0082-EXP', status: 'EXPIRED', issuer: 'Industrial Standard Corp', latencyMs: 28, resolvedBy: 'qrv-node-us-east1', minutesAgo: 45 }
];

/**
 * Seed verification records if collection is empty
 */
export async function seedInitialVerificationsIfEmpty() {
  const collectionPath = 'verification_history';
  try {
    const existing = await getDocs(query(collection(db, collectionPath), limit(1)));
    if (!existing.empty) return;

    const now = Date.now();
    for (const seed of INITIAL_VERIFICATION_SEEDS) {
      const timestamp = new Date(now - seed.minutesAgo * 60 * 1000).toISOString();
      const docPath = `${collectionPath}/${seed.recordId}`;
      await setDoc(doc(db, docPath), {
        recordId: seed.recordId,
        qrvid: seed.qrvid,
        status: seed.status,
        issuer: seed.issuer,
        latencyMs: seed.latencyMs,
        resolvedBy: seed.resolvedBy,
        timestamp
      });
    }
  } catch (err) {
    console.warn('Initial verification seed skipped or permission restricted:', err?.message || err);
  }
}

/**
 * Record a new verification resolution in Firestore
 */
export async function recordVerificationEvent({ qrvid, status, issuer, latencyMs = 24 }) {
  const recordId = `vr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const path = `verification_history/${recordId}`;
  const payload = {
    recordId,
    qrvid,
    status: ['VALID', 'REVOKED', 'NOT_FOUND', 'EXPIRED', 'PENDING'].includes(status) ? status : 'VALID',
    issuer: issuer || 'ONEGODIAN, LLC',
    timestamp: new Date().toISOString(),
    latencyMs: Number(latencyMs) || 20,
    resolvedBy: 'qrv-node-us-east1'
  };

  try {
    await setDoc(doc(db, path), payload);
    return payload;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

/**
 * Fetch the last 10 verification records from Firestore
 * @param {number} limitCount
 * @returns {Promise<Array<Object>>}
 */
export async function getRecentVerifications(limitCount = 10) {
  const path = 'verification_history';
  try {
    // Attempt auto-seed if first query
    await seedInitialVerificationsIfEmpty();

    const q = query(
      collection(db, path),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    const records = [];
    snapshot.forEach((docSnap) => {
      records.push(docSnap.data());
    });
    return records;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

/**
 * Subscribe in real time to the last 10 verification records from Firestore
 */
export function subscribeRecentVerifications(onUpdate, onError, limitCount = 10) {
  const path = 'verification_history';
  // Trigger seeding non-blocking
  seedInitialVerificationsIfEmpty().catch(() => {});

  const q = query(
    collection(db, path),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const records = [];
      snapshot.forEach((docSnap) => {
        records.push(docSnap.data());
      });
      onUpdate(records);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
      if (onError) onError(error);
    }
  );
}

