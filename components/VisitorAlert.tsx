'use client';

import { useEffect } from 'react';

const BLOCKED_AGENT = /bot|crawl|spider|headless|preview|slurp|facebookexternalhit|whatsapp|uptime|monitor/i;

function createSession(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode.apply(null, Array.from(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export default function VisitorAlert() {
  useEffect(() => {
    if (BLOCKED_AGENT.test(navigator.userAgent)) return;
    const deliveredKey = 'theselftape-visitor-alert-delivered';
    if (sessionStorage.getItem(deliveredKey)) return;
    const sessionKey = 'theselftape-visitor-session';
    let session = sessionStorage.getItem(sessionKey);
    if (!session) {
      session = createSession();
      sessionStorage.setItem(sessionKey, session);
    }
    void fetch('/api/visitor-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session, path: location.pathname }),
      keepalive: true,
    }).then((response) => {
      const result = response.headers.get('x-visitor-alert');
      if (result === 'sent' || result === 'duplicate') sessionStorage.setItem(deliveredKey, '1');
    }).catch(() => undefined);
  }, []);
  return null;
}
