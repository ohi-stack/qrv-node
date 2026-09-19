import { useEffect, useState } from 'react';
import QrvApp from './qrv-app.tsx';
import QrvSubpage from './subpage-app.tsx';
import './styles.css';

function readLocation() {
  return { pathname: window.location.pathname, search: window.location.search };
}

export default function App() {
  const [location, setLocation] = useState(readLocation);

  useEffect(() => {
    const update = () => setLocation(readLocation());
    window.addEventListener('popstate', update);
    return () => window.removeEventListener('popstate', update);
  }, []);

  const path = location.pathname.replace(/^\/+|\/+$/g, '');
  if (!path) return <QrvApp />;

  const queryId = new URLSearchParams(location.search).get('qrvid') || undefined;
  return <QrvSubpage path={path} queryId={queryId} />;
}
