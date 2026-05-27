const Database = require('better-sqlite3');
const fs = require('fs');
const express = require('express');

const db = new Database('links.db');
const schema = fs.readFileSync('schema.sql', 'utf8');
db.exec(schema);

const app = express();
app.use(express.json());
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.post('/links', (req, res) => {
  const { url, title, note, tags } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'url is required' });
  }

  const stmt = db.prepare('INSERT INTO links (url, title, note, tags) VALUES (?, ?, ?, ?)');
  const result = stmt.run(url, title ?? null, note ?? null, tags ?? null);
  res.status(201).json({ id: result.lastInsertRowid });
});
app.get('/links', (req, res) => {
    const conditions = [];
    const params = [];

    if (req.query.tag !== undefined) {
        conditions.push('tags LIKE ?');
        params.push(`%${req.query.tag}%`);
    }
    if (req.query.read !== undefined) {
        conditions.push('read = ?');
        params.push(req.query.read === 'true' ? 1 : 0);
    }
    
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const sql = `SELECT * FROM links ${where}`;

    const rows = db.prepare(sql).all(...params);
    res.json(rows);
})

app.get('/links/:id', (req, res) => {
    const id = req.params.id;
    const link = db.prepare('SELECT * FROM links WHERE id = ?').get(id);
    if (!link) {
        return res.status(404).json({error: 'Link not found'});
    }
    res.json(link);
})
app.delete('/links/:id', (req, res) => {
    const id = req.params.id;
    const result = db.prepare('DELETE FROM links WHERE id = ?').run(id);
    if (result.changes === 0) {
        return res.status(404).json({error: 'Link not found'});
    }
    res.status(204).end()
})
app.patch('/links/:id', (req, res) => {
    const id = req.params.id;
    const { read, note } = req.body;
    const updates = [];
    const params = [];

    if (read !== undefined) {
        updates.push('read = ?');
        params.push(Number(read));
    }
    if (note !== undefined) {
        updates.push('note = ?');
        params.push(note);
    }

    if (!updates.length) {
        return res.status(400).json({error: 'No fields to update'});
        
    }
    const result = db.prepare(`UPDATE links SET ${updates.join(', ')}
            WHERE id = ?`).run(...params, id);
    
    if (result.changes === 0) {
        return res.status(404).json({error: 'Link not found'});
    }
    const link = db.prepare('SELECT * FROM links WHERE id = ?').get(id);
    res.json(link);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});