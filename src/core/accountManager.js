const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '../../data/accounts.db');
const fs = require('fs');
if (!fs.existsSync(path.dirname(dbPath))) fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    provider TEXT NOT NULL,
    email TEXT,
    password_enc TEXT,
    token_enc TEXT,
    cookies_enc TEXT,
    notes TEXT,
    status TEXT DEFAULT 'healthy',
    created_at INTEGER,
    last_used INTEGER,
    expires_at INTEGER
  )
`);

const MASTER_KEY = process.env.MASTER_KEY || 'default-dev-key-change-me';

function encrypt(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(MASTER_KEY, 'salt', 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
  if (!text) return null;
  const [ivHex, encrypted] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const key = crypto.scryptSync(MASTER_KEY, 'salt', 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = {
  list() {
    const rows = db.prepare('SELECT id, provider, email, status, created_at, last_used, expires_at, notes FROM accounts').all();
    return rows;
  },

  get(id) {
    const row = db.prepare('SELECT * FROM accounts WHERE id = ?').get(id);
    if (!row) return null;
    return {
      id: row.id,
      provider: row.provider,
      email: row.email,
      password: decrypt(row.password_enc),
      token: decrypt(row.token_enc),
      cookies: decrypt(row.cookies_enc),
      notes: row.notes,
      status: row.status,
      created_at: row.created_at,
      last_used: row.last_used,
      expires_at: row.expires_at
    };
  },

  async add({ provider, email, password, token, cookies, notes, expires_at }) {
    const id = uuidv4();
    const now = Date.now();
    db.prepare(`
      INSERT INTO accounts (id, provider, email, password_enc, token_enc, cookies_enc, notes, status, created_at, last_used, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'healthy', ?, ?, ?)
    `).run(
      id, provider, email || null,
      encrypt(password), encrypt(token), encrypt(cookies),
      notes || null, now, now, expires_at || null
    );
    return this.get(id);
  },

  remove(id) {
    db.prepare('DELETE FROM accounts WHERE id = ?').run(id);
  },

  markExhausted(id) {
    db.prepare('UPDATE accounts SET status = ? WHERE id = ?').run('exhausted', id);
  },

  touch(id) {
    db.prepare('UPDATE accounts SET last_used = ? WHERE id = ?').run(Date.now(), id);
  },

  getHealthy(provider) {
    const rows = db.prepare(`
      SELECT id FROM accounts
      WHERE provider = ? AND status = 'healthy'
      AND (expires_at IS NULL OR expires_at > ?)
      ORDER BY last_used ASC
    `).all(provider, Date.now());
    return rows.map(r => this.get(r.id));
  }
};
