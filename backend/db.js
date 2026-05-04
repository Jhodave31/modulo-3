const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'data.sqlite');
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      ambientacion TEXT,
      estado TEXT DEFAULT 'activa',
      narrador_id INTEGER,
      max_jugadores INTEGER,
      sistema_reglas TEXT,
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS missions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER NOT NULL,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      orden INTEGER DEFAULT 0,
      capitulo TEXT,
      estado TEXT DEFAULT 'pendiente',
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now')),
      FOREIGN KEY(campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    )
  `);
});

module.exports = db;
