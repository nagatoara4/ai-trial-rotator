import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = '/api';

export default function App() {
  const [health, setHealth] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('grok');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ provider: 'grok', email: '', password: '', token: '', cookies: '', notes: '' });
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const [h, a, p] = await Promise.all([
        axios.get(`${API}/health`),
        axios.get(`${API}/accounts`),
        axios.get(`${API}/providers`)
      ]);
      setHealth(h.data.data);
      setAccounts(a.data.data || []);
      setProviders(p.data.data || []);
    } catch (e) {
      setMessage('Backend offline — start the server');
    }
  };

  useEffect(() => { load(); const t = setInterval(load, 8000); return () => clearInterval(t); }, []);

  const addAccount = async () => {
    try {
      await axios.post(`${API}/accounts`, form);
      setShowAdd(false);
      setForm({ provider: 'grok', email: '', password: '', token: '', cookies: '', notes: '' });
      setMessage('Account added');
      load();
    } catch (e) {
      setMessage(e.response?.data?.error || e.message);
    }
  };

  const removeAccount = async (id) => {
    await axios.delete(`${API}/accounts/${id}`);
    load();
  };

  const markExhausted = async (id) => {
    await axios.post(`${API}/rotate/exhaust/${id}`);
    load();
  };

  const nextAccount = async () => {
    try {
      const res = await axios.post(`${API}/rotate/next`, { provider: selectedProvider });
      setMessage(`Next account ready: ${res.data.data.email || res.data.data.id}`);
    } catch (e) {
      setMessage(e.response?.data?.error || e.message);
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>AI Trial Rotator</h1>
          <p style={{ color: '#888', marginTop: 4 }}>Keep premium models alive on free trials</p>
        </div>
        <div style={{ fontSize: 13, color: '#666' }}>ylivo4real 👾</div>
      </header>

      {message && (
        <div style={{ background: '#1a1a24', border: '1px solid #333', padding: '12px 16px', borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
          {message}
        </div>
      )}

      {/* Health */}
      {health && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 28 }}>
          <Card title="Total Accounts" value={health.totalAccounts} />
          <Card title="Providers" value={health.providers?.length || 0} />
          <Card title="Uptime" value={`${Math.floor(health.uptime / 60)}m`} />
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        <select value={selectedProvider} onChange={e => setSelectedProvider(e.target.value)} style={selectStyle}>
          {providers.map(p => <option key={p.name} value={p.name}>{p.displayName}</option>)}
        </select>
        <button onClick={nextAccount} style={btnPrimary}>Get Next Account</button>
        <button onClick={() => setShowAdd(true)} style={btn}>Add Account Manually</button>
        <button onClick={load} style={btn}>Refresh</button>
      </div>

      {/* Accounts table */}
      <div style={{ background: '#12121a', borderRadius: 12, overflow: 'hidden', border: '1px solid #222' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#1a1a24', textAlign: 'left' }}>
              <th style={th}>Provider</th>
              <th style={th}>Email</th>
              <th style={th}>Status</th>
              <th style={th}>Created</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#555' }}>No accounts yet. Add one to start.</td></tr>
            )}
            {accounts.map(a => (
              <tr key={a.id} style={{ borderTop: '1px solid #1e1e28' }}>
                <td style={td}>{a.provider}</td>
                <td style={td}>{a.email || '—'}</td>
                <td style={td}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 999, fontSize: 12,
                    background: a.status === 'healthy' ? '#0d2e1a' : '#2e0d0d',
                    color: a.status === 'healthy' ? '#4ade80' : '#f87171'
                  }}>{a.status}</span>
                </td>
                <td style={td}>{a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}</td>
                <td style={td}>
                  <button onClick={() => markExhausted(a.id)} style={btnSmall}>Exhaust</button>
                  <button onClick={() => removeAccount(a.id)} style={{ ...btnSmall, marginLeft: 6, color: '#f87171' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#16161f', padding: 28, borderRadius: 12, width: 420, maxWidth: '95%' }}>
            <h2 style={{ marginBottom: 20, fontSize: 20 }}>Add Account</h2>
            <label style={label}>Provider</label>
            <select value={form.provider} onChange={e => setForm({ ...form, provider: e.target.value })} style={{ ...input, marginBottom: 12 }}>
              {providers.map(p => <option key={p.name} value={p.name}>{p.displayName}</option>)}
            </select>
            <label style={label}>Email</label>
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={input} />
            <label style={label}>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={input} />
            <label style={label}>Token (optional)</label>
            <input value={form.token} onChange={e => setForm({ ...form, token: e.target.value })} style={input} />
            <label style={label}>Cookies (optional)</label>
            <textarea value={form.cookies} onChange={e => setForm({ ...form, cookies: e.target.value })} style={{ ...input, height: 70 }} />
            <label style={label}>Notes</label>
            <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={input} />
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={addAccount} style={btnPrimary}>Save</button>
              <button onClick={() => setShowAdd(false)} style={btn}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ marginTop: 48, textAlign: 'center', color: '#444', fontSize: 13 }}>
        MIT License · Built to keep the magic free
      </footer>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{ background: '#12121a', border: '1px solid #222', borderRadius: 10, padding: '16px 20px' }}>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

const th = { padding: '12px 16px', fontWeight: 600, color: '#999', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 };
const td = { padding: '12px 16px' };
const btn = { background: '#1e1e2a', border: '1px solid #333', color: '#ddd', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14 };
const btnPrimary = { ...btn, background: '#3b82f6', borderColor: '#3b82f6', color: '#fff', fontWeight: 600 };
const btnSmall = { background: 'transparent', border: '1px solid #333', color: '#aaa', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 };
const selectStyle = { ...btn, paddingRight: 28 };
const input = { width: '100%', background: '#0e0e14', border: '1px solid #2a2a38', color: '#eee', padding: '10px 12px', borderRadius: 8, marginBottom: 12, fontSize: 14 };
const label = { display: 'block', fontSize: 12, color: '#888', marginBottom: 4 };
