import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const QRVID_PATTERN = /^QRV-[A-Z0-9][A-Z0-9-]{2,100}$/;

export default function QRVCodeGenerator({ qrvid, verificationState }) {
  const [png, setPng] = useState('');
  const [error, setError] = useState('');
  const id = String(qrvid || '').trim().toUpperCase();
  const eligible = QRVID_PATTERN.test(id) && verificationState === 'VERIFIED';
  useEffect(() => {
    let active = true;
    setPng('');
    setError('');
    if (!eligible) return () => { active = false; };
    QRCode.toDataURL(`https://qrv.network/verify/${encodeURIComponent(id)}`, {
      type: 'image/png', width: 512, margin: 4, errorCorrectionLevel: 'H',
      color: { dark: '#061523', light: '#FFFFFF' }
    }).then(value => { if (active) setPng(value); })
      .catch(() => { if (active) setError('Unable to generate QR-V seal.'); });
    return () => { active = false; };
  }, [id, eligible]);
  const download = () => {
    if (!png || !eligible) return;
    const anchor = document.createElement('a');
    anchor.href = png;
    anchor.download = `QRV-${id.replace(/[^A-Z0-9-]/g, '')}-seal.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };
  return (
    <div className="QRVCodeGenerator" aria-label="QR-V seal generator">
      {png && <img src={png} alt={`Scannable QR-V verification seal for ${id}`} width="224" height="224" />}
      <button type="button" onClick={download} disabled={!png || !eligible}>Download Seal</button>
      {error && <p role="alert">{error}</p>}
      <small>Scanning requires network access to retrieve the current authoritative verification status. A downloaded PNG is not an offline proof of VERIFIED status.</small>
    </div>
  );
}
