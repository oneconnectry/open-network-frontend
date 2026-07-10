import React, { useEffect, useRef, useState } from 'react';
import { apiPost } from '../lib/api';

const PURPLE = '#7C3AED';

export default function Subscribe() {
  const [view, setView] = useState('loading'); // 'loading' | 'picker' | 'error'
  const [error, setError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [continuing, setContinuing] = useState(false);
  const sessionTokenRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loginToken = params.get('token');

    if (!loginToken) {
      setError('This link is missing a login token. Please open Activate again from the Uniorbita app.');
      setView('error');
      return;
    }

    (async () => {
      try {
        const { sessionToken, intent } = await apiPost('/auth/web-login', { token: loginToken });
        sessionTokenRef.current = sessionToken;

        if (intent?.type === 'profile_activation_checkout' && intent.planId) {
          setView('loading');
          const checkoutData = await createCheckout(sessionToken, intent.planId);
          openRazorpayCheckout(checkoutData, sessionToken);
        } else {
          setView('picker');
        }
      } catch (err) {
        setError(err.message.includes('expired') || err.message.includes('Invalid')
          ? 'This link has expired. Please open Activate again from the Uniorbita app.'
          : err.message);
        setView('error');
      }
    })();
  }, []);

  const createCheckout = async (sessionToken, planId) =>
    apiPost('/subscriptions/web/checkout', { planId }, sessionToken);

  const openRazorpayCheckout = (checkoutData, sessionToken) => {
    if (checkoutData.provider === 'stripe') {
      // Stripe uses a hosted checkout redirect, not an embedded widget.
      window.location.href = checkoutData.checkoutUrl;
      return;
    }

    const options = {
      key: checkoutData.keyId,
      subscription_id: checkoutData.subscriptionId,
      name: 'Uniorbita',
      description: 'Profile Activation',
      theme: { color: PURPLE },
      handler: () => {
        sessionStorage.setItem('uniorbita_session_token', sessionToken);
        window.location.href = '/subscribe/success';
      },
      modal: {
        ondismiss: () => setView('picker'),
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleContinue = async () => {
    setContinuing(true);
    try {
      const checkoutData = await createCheckout(sessionTokenRef.current, selectedPlan);
      openRazorpayCheckout(checkoutData, sessionTokenRef.current);
    } catch (err) {
      setError(err.message);
      setView('error');
    } finally {
      setContinuing(false);
    }
  };

  if (view === 'loading') {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
        <p style={styles.sub}>Loading…</p>
      </div>
    );
  }

  if (view === 'error') {
    return (
      <div style={styles.center}>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.center}>
      <h1 style={styles.h1}>Activate your profile</h1>
      <p style={styles.sub}>Get discovered — public profile, search visibility, QR &amp; NFC linking.</p>

      <div style={styles.plans}>
        <PlanCard label="Monthly" price="₹299" selected={selectedPlan === 'monthly'} onClick={() => setSelectedPlan('monthly')} />
        <PlanCard label="Yearly" price="₹2999" badge="Save 33%" selected={selectedPlan === 'yearly'} onClick={() => setSelectedPlan('yearly')} />
      </div>

      <button style={{ ...styles.btn, opacity: continuing ? 0.6 : 1 }} disabled={continuing} onClick={handleContinue}>
        {continuing ? 'Starting checkout…' : 'Continue'}
      </button>
    </div>
  );
}

function PlanCard({ label, price, badge, selected, onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
      style={{ ...styles.plan, ...(selected ? styles.planSelected : {}) }}
    >
      <div style={styles.planLabel}>{label}</div>
      <div style={styles.planPrice}>{price}</div>
      {badge && <div style={styles.planBadge}>{badge}</div>}
    </div>
  );
}

const styles = {
  center: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: '80vh', textAlign: 'center', padding: '24px 20px',
  },
  h1: { fontSize: 22, marginBottom: 8, color: '#111827' },
  sub: { color: '#6B7280', fontSize: 14, marginBottom: 32, maxWidth: 320 },
  error: { color: '#DC2626', fontSize: 14, maxWidth: 320 },
  spinner: {
    width: 32, height: 32, border: '3px solid #E5E7EB', borderTopColor: PURPLE,
    borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 16,
  },
  plans: { display: 'flex', gap: 12, width: '100%', maxWidth: 360, marginBottom: 24 },
  plan: {
    flex: 1, border: '2px solid #E5E7EB', borderRadius: 16, padding: '16px 12px',
    cursor: 'pointer', textAlign: 'center', transition: 'border-color 0.15s',
  },
  planSelected: { borderColor: PURPLE, background: '#F5F3FF' },
  planLabel: { fontSize: 13, color: '#6B7280', marginBottom: 4 },
  planPrice: { fontSize: 20, fontWeight: 700, color: '#111827' },
  planBadge: { fontSize: 11, color: PURPLE, fontWeight: 600, marginTop: 4 },
  btn: {
    width: '100%', maxWidth: 360, height: 52, borderRadius: 14, border: 'none',
    background: PURPLE, color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer',
  },
};