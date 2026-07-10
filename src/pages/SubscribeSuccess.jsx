import React, { useEffect, useState } from 'react';
import { apiGet } from '../lib/api';

export default function SubscribeSuccess() {
  const [status, setStatus] = useState('polling'); // 'polling' | 'success' | 'timeout'

  useEffect(() => {
    const sessionToken = sessionStorage.getItem('uniorbita_session_token');
    if (!sessionToken) {
      setStatus('timeout');
      return;
    }

    let cancelled = false;
    let attempt = 0;

    const poll = async () => {
      if (cancelled) return;
      if (attempt >= 10) {
        setStatus('timeout');
        return;
      }
      attempt += 1;
      try {
        const data = await apiGet('/subscriptions/status', sessionToken);
        if (data.isActive) {
          setStatus('success');
          return;
        }
      } catch {
        // ignore, retry
      }
      setTimeout(poll, 1000);
    };
    poll();

    return () => { cancelled = true; };
  }, []);

  if (status === 'success') {
    return (
      <div style={styles.center}>
        <div style={styles.check}>✓</div>
        <h1 style={styles.h1}>Profile activated</h1>
        <p style={styles.sub}>You can close this window and return to the app.</p>
      </div>
    );
  }

  if (status === 'timeout') {
    return (
      <div style={styles.center}>
        <h1 style={styles.h1}>Almost there</h1>
        <p style={styles.sub}>Payment received — activation is finishing up. Return to the app in a moment.</p>
      </div>
    );
  }

  return (
    <div style={styles.center}>
      <div style={styles.spinner} />
      <p style={styles.sub}>Confirming your activation…</p>
    </div>
  );
}

const styles = {
  center: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', textAlign: 'center', padding: 20,
  },
  h1: { fontSize: 20, margin: '0 0 8px', color: '#111827' },
  sub: { color: '#6B7280', fontSize: 14, maxWidth: 320 },
  spinner: {
    width: 32, height: 32, border: '3px solid #E5E7EB', borderTopColor: '#7C3AED',
    borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 16,
  },
  check: {
    width: 56, height: 56, borderRadius: '50%', background: '#ECFDF5', display: 'flex',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16, fontSize: 28, color: '#059669',
  },
};