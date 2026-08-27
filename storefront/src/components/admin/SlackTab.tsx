'use client';

import React, { useState } from 'react';
import {
  Slack,
  Link2,
  Unlink,
  Check,
  Loader2,
  ShieldCheck,
  Bell,
  Hash,
  User,
  Activity,
} from 'lucide-react';

/**
 * Slack Connect (per-user) — UI TEMPLATE
 * ------------------------------------------------------------------
 * This is a UI-only scaffold styled to match the rest of the admin.
 * It fakes the connection lifecycle with local state so you can see
 * every screen. Wire it up to Vercel Connect later by replacing the
 * `handleConnect` / `handleDisconnect` handlers with calls to your
 * server routes that use `@vercel/connect` (startAuthorization / getToken).
 *
 * Suggested backend routes to add when going live:
 *   POST /api/integrations/slack/authorize  -> startAuthorization(subject)
 *   GET  /api/integrations/slack/callback    -> exchange + store subject link
 *   GET  /api/integrations/slack/status      -> whether current user is linked
 *   POST /api/integrations/slack/disconnect  -> revoke link for current user
 * The Connect subject must be derived from the server session (per-user).
 */

type ConnectionState = 'disconnected' | 'connecting' | 'connected';

interface SlackWorkspace {
  teamName: string;
  userName: string;
  defaultChannel: string;
}

interface NotificationPrefs {
  newOrders: boolean;
  lowStock: boolean;
  dailySummary: boolean;
}

export const SlackTab: React.FC = () => {
  const [state, setState] = useState<ConnectionState>('disconnected');
  const [workspace, setWorkspace] = useState<SlackWorkspace | null>(null);
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    newOrders: true,
    lowStock: true,
    dailySummary: false,
  });
  const [savedPrefs, setSavedPrefs] = useState(false);

  // TEMPLATE ONLY: simulate the per-user OAuth handshake.
  const handleConnect = () => {
    setState('connecting');
    // In production: open startAuthorization() URL. Inside an iframe use
    // window.open(url, '_blank', 'noopener,noreferrer'); otherwise
    // window.location.href = url.
    setTimeout(() => {
      setWorkspace({
        teamName: 'Acme Retail HQ',
        userName: 'you@acme.com',
        defaultChannel: '#store-alerts',
      });
      setState('connected');
    }, 1400);
  };

  const handleDisconnect = () => {
    setWorkspace(null);
    setState('disconnected');
  };

  const togglePref = (key: keyof NotificationPrefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    setSavedPrefs(false);
  };

  const handleSavePrefs = () => {
    setSavedPrefs(true);
    setTimeout(() => setSavedPrefs(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          background: '#0b0f19',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.15rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Slack size={20} color="var(--accent-cyan)" />
            <span>Slack Connect &mdash; Per-User Notifications</span>
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Each admin links their own Slack account. Store events are delivered to your chosen channel using short-lived,
            per-user tokens managed by Vercel Connect.
          </p>
        </div>

        <span
          className="gold-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '999px',
            fontSize: '0.72rem',
            fontWeight: 700,
          }}
        >
          <ShieldCheck size={13} />
          {state === 'connected' ? 'Linked' : 'Not linked'}
        </span>
      </div>

      {/* Connection Card */}
      <div style={{ background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1.5rem' }}>
        {state !== 'connected' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem', padding: '1.5rem 1rem' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '18px',
                background: 'rgba(14,165,233,0.12)',
                border: '1px solid var(--border-active)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Slack size={30} color="var(--accent-cyan)" />
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.35rem' }}>Connect your Slack account</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: 420 }}>
                Authorize with your own Slack workspace to receive store alerts. Your token stays server-side and is scoped
                only to posting messages.
              </p>
            </div>
            <button
              type="button"
              onClick={handleConnect}
              disabled={state === 'connecting'}
              className="btn-primary"
              style={{ minWidth: 200 }}
            >
              {state === 'connecting' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Opening Slack&hellip;</span>
                </>
              ) : (
                <>
                  <Link2 size={18} />
                  <span>Connect Slack</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: 'rgba(16,185,129,0.12)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={22} color="var(--accent-emerald)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 700 }}>Connected</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Your Slack account is linked</div>
                </div>
              </div>
              <button type="button" onClick={handleDisconnect} className="btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.82rem' }}>
                <Unlink size={15} />
                <span>Disconnect</span>
              </button>
            </div>

            {/* Linked account details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <DetailCell icon={<Hash size={15} color="var(--accent-cyan)" />} label="Workspace" value={workspace?.teamName ?? '—'} />
              <DetailCell icon={<User size={15} color="var(--accent-cyan)" />} label="Linked as" value={workspace?.userName ?? '—'} />
              <DetailCell icon={<Bell size={15} color="var(--accent-cyan)" />} label="Default channel" value={workspace?.defaultChannel ?? '—'} />
            </div>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      {state === 'connected' && (
        <div style={{ background: '#111827', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={16} color="var(--accent-cyan)" />
              <span>What should we send you?</span>
            </h4>
            <button type="button" onClick={handleSavePrefs} className="btn-primary" style={{ padding: '0.55rem 1.15rem', fontSize: '0.82rem' }}>
              {savedPrefs ? (
                <>
                  <Check size={16} />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save preferences</span>
              )}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <ToggleRow
              label="New orders"
              description="Ping me when a customer places an order."
              checked={prefs.newOrders}
              onChange={() => togglePref('newOrders')}
            />
            <ToggleRow
              label="Low stock alerts"
              description="Notify me when a SKU drops below its threshold."
              checked={prefs.lowStock}
              onChange={() => togglePref('lowStock')}
            />
            <ToggleRow
              label="Daily sales summary"
              description="A digest of revenue and orders each morning."
              checked={prefs.dailySummary}
              onChange={() => togglePref('dailySummary')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const DetailCell: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div style={{ background: '#0b0f19', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
      {icon}
      <span>{label}</span>
    </div>
    <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>{value}</div>
  </div>
);

const ToggleRow: React.FC<{
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, description, checked, onChange }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1rem',
      background: '#0b0f19',
      border: '1px solid var(--border-subtle)',
      borderRadius: '10px',
      padding: '0.85rem 1.1rem',
    }}
  >
    <div>
      <div style={{ fontSize: '0.88rem', color: '#fff', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{description}</div>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      style={{
        position: 'relative',
        width: 44,
        height: 26,
        minWidth: 44,
        borderRadius: '999px',
        border: 'none',
        cursor: 'pointer',
        background: checked ? 'var(--accent-cyan)' : '#374151',
        transition: 'var(--transition-fast)',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: checked ? 21 : 3,
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          transition: 'var(--transition-fast)',
        }}
      />
    </button>
  </div>
);
