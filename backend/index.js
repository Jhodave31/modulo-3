const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Serve frontend static files from ../frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Helper to run SQL with promise
function run(sql, params=[]) {
  return new Promise((res, rej) => {
    db.run(sql, params, function(err) {
      if (err) return rej(err);
      res({id: this.lastID, changes: this.changes});
    });
  });
}

function all(sql, params=[]) {
  return new Promise((res, rej) => {
    db.all(sql, params, (err, rows) => {
      if (err) return rej(err);
      res(rows);
    });
  });
}

function get(sql, params=[]) {
  return new Promise((res, rej) => {
    db.get(sql, params, (err, row) => {
      if (err) return rej(err);
      res(row);
    });
  });
}

// Campaigns CRUD
app.post('/api/campaigns', async (req, res) => {
  try {
    const c = req.body;
    const sql = `INSERT INTO campaigns (nombre, descripcion, ambientacion, estado, narrador_id, max_jugadores, sistema_reglas) VALUES (?,?,?,?,?,?,?)`;
    const result = await run(sql, [c.nombre, c.descripcion, c.ambientacion, c.estado || 'activa', c.narrador_id, c.max_jugadores, c.sistema_reglas]);
    const created = await get('SELECT * FROM campaigns WHERE id = ?', [result.id]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.get('/api/campaigns', async (req, res) => {
  try {
    const {estado, narrador_id} = req.query;
    let sql = 'SELECT * FROM campaigns';
    const params = [];
    const filters = [];
    if (estado) { filters.push('estado = ?'); params.push(estado); }
    if (narrador_id) { filters.push('narrador_id = ?'); params.push(narrador_id); }
    if (filters.length) sql += ' WHERE ' + filters.join(' AND ');
    const rows = await all(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.get('/api/campaigns/:id', async (req, res) => {
  try {
    const row = await get('SELECT * FROM campaigns WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({error: 'Not found'});
    res.json(row);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.put('/api/campaigns/:id', async (req, res) => {
  try {
    const c = req.body;
    const sql = `UPDATE campaigns SET nombre=?, descripcion=?, ambientacion=?, estado=?, narrador_id=?, max_jugadores=?, sistema_reglas=?, updated_at=datetime('now') WHERE id=?`;
    await run(sql, [c.nombre, c.descripcion, c.ambientacion, c.estado, c.narrador_id, c.max_jugadores, c.sistema_reglas, req.params.id]);
    const updated = await get('SELECT * FROM campaigns WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.delete('/api/campaigns/:id', async (req, res) => {
  try {
    await run('DELETE FROM campaigns WHERE id = ?', [req.params.id]);
    res.json({deleted: true});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

// Missions CRUD
app.post('/api/campaigns/:campaignId/missions', async (req, res) => {
  try {
    const m = req.body;
    const sql = `INSERT INTO missions (campaign_id, titulo, descripcion, orden, capitulo, estado) VALUES (?,?,?,?,?,?)`;
    const result = await run(sql, [req.params.campaignId, m.titulo, m.descripcion, m.orden || 0, m.capitulo, m.estado || 'pendiente']);
    const created = await get('SELECT * FROM missions WHERE id = ?', [result.id]);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.get('/api/campaigns/:campaignId/missions', async (req, res) => {
  try {
    const rows = await all('SELECT * FROM missions WHERE campaign_id = ? ORDER BY orden ASC', [req.params.campaignId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.get('/api/missions/:id', async (req, res) => {
  try {
    const row = await get('SELECT * FROM missions WHERE id = ?', [req.params.id]);
    if (!row) return res.status(404).json({error: 'Not found'});
    res.json(row);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.put('/api/missions/:id', async (req, res) => {
  try {
    const m = req.body;
    const sql = `UPDATE missions SET titulo=?, descripcion=?, orden=?, capitulo=?, estado=?, updated_at=datetime('now') WHERE id=?`;
    await run(sql, [m.titulo, m.descripcion, m.orden || 0, m.capitulo, m.estado, req.params.id]);
    const updated = await get('SELECT * FROM missions WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

app.delete('/api/missions/:id', async (req, res) => {
  try {
    await run('DELETE FROM missions WHERE id = ?', [req.params.id]);
    res.json({deleted: true});
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
