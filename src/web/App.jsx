import { lazy, Suspense } from 'react';
import QrvApp, { Header, Footer } from './site/qrv-app';
import QrvSubpage from './site/subpage-app';
import './styles.css';
const Account = lazy(() => import('./site/Account.jsx'));
const sitesOrigin = 'https://qrv-global-verification.onegodian.chatgpt.site';
function WorkspaceHandoff({ path }) {
  const signin = path === 'signin';
  return <div className="site-shell"><Header /><main className="subpage-content signin-content">
    <p className="eyebrow">QR-V network</p><h1>{signin ? 'Sign in to QR-V' : 'QR-V workspace'}</h1>
    <p>This service area is part of the QR‑V Global Verification Network.</p>
    <section className="signin-panel"><h2>{signin ? 'Choose your workspace' : 'Open the authenticated workspace'}</h2>
    <p>The Sites workspace uses ChatGPT identity. Node account sign-in and issuer authorization remain separate.</p>
    <a className="button" href={`${sitesOrigin}/${signin ? 'signin' : path}`} target="_top">{signin ? 'Use email or Google through ChatGPT' : 'Open secure Sites workspace'}</a>
    <p><a href="/account">Node account: email or Google</a> · <a href="/issuer">Authorized issuer portal</a></p>
    </section></main><Footer /></div>;
}
export default function App() {
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  if (path === 'account') return <Suspense fallback={<p>Loading account tools…</p>}><Account /></Suspense>;
  if (['signin', 'dashboard', 'admin'].some(prefix => path === prefix || path.startsWith(prefix + '/'))) return <WorkspaceHandoff path={path} />;
  return path ? <QrvSubpage path={path} queryId={new URLSearchParams(window.location.search).get('qrvid') || undefined} /> : <QrvApp />;
}
