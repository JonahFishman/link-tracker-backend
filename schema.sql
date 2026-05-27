CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT,
    note TEXT,
    tags TEXT,
    read INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);