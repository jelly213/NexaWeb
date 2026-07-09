import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { setGaConsent } from '../lib/analytics';
import { isGaConfigured, loadGtag } from '../lib/ga';

/**
 * Law 25 consent state machine.
 *
 *   unknown  → Layer A (cookieless) fires. GA4 is NOT injected. Banner visible.
 *   granted  → Layer A fires. gtag.js injected once, events mirrored. Banner hidden.
 *   denied   → Layer A fires. GA4 never injected. Banner hidden.
 *
 * Only the choice itself is persisted. No analytics identifier is ever stored.
 */
export type ConsentStatus = 'unknown' | 'granted' | 'denied';

const STORAGE_KEY = 'nx_consent';

interface ConsentContextType {
  status: ConsentStatus;
  /** True while the banner should be on screen (unknown, or reopened to change a choice). */
  showBanner: boolean;
  accept: () => void;
  refuse: () => void;
  reopen: () => void;
}

const ConsentContext = createContext<ConsentContextType | null>(null);

function readStored(): ConsentStatus {
  if (typeof window === 'undefined') return 'unknown';
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === 'granted' || v === 'denied' ? v : 'unknown';
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<ConsentStatus>(readStored);
  const [reopened, setReopened] = useState(false);

  // A returning visitor who already accepted gets GA4 back on this load.
  useEffect(() => {
    if (status === 'granted') {
      loadGtag();
      setGaConsent(true);
    } else {
      setGaConsent(false);
    }
  }, [status]);

  const choose = useCallback((next: 'granted' | 'denied') => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setStatus(next);
    setReopened(false);
  }, []);

  const accept = useCallback(() => choose('granted'), [choose]);
  const refuse = useCallback(() => choose('denied'), [choose]);
  const reopen = useCallback(() => setReopened(true), []);

  // Nothing to consent to if GA4 was never configured — showing the banner would be a lie.
  const showBanner = isGaConfigured() && (status === 'unknown' || reopened);

  return (
    <ConsentContext.Provider value={{ status, showBanner, accept, refuse, reopen }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error('useConsent must be used within ConsentProvider');
  return ctx;
}
