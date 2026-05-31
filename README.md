# Link Tracker

A backend API for saving and organizing links to read later.

A React frontend for this API is available at [link-tracker-frontend](https://github.com/JonahFishman/link-tracker-frontend).

## Features

- Save a link with an optional title, note, and tags
- List all links, with optional filtering by tag and read status
- Get, update, or delete a single link by ID

## Stack

Node, Express, SQLite (via better-sqlite3).

## Setup
```
git clone <repo-url>
cd link-tracker-backend
npm install
node server.js
```


The server runs on port 3000.

## Endpoints

### `POST /links`

Create a new link. Body: `url` (required), `title`, `note`, `tags` (all optional). Returns the created link, including its generated `id` and `created_at`.
```
curl -X POST http://localhost:3000/links \
-H "Content-Type: application/json" \
-d '{"url": "https://example.com", "title": "Example", "tags": "test,demo"}'
```

### `GET /links`

List all links. Optional query parameters: `tag`, `read`.
```
curl http://localhost:3000/links
curl "http://localhost:3000/links?tag=ai"
curl "http://localhost:3000/links?read=false"
curl "http://localhost:3000/links?tag=ai&read=false"
```

### `GET /links/:id`

Get a single link by ID. Returns 404 if not found.
```
curl http://localhost:3000/links/1
```

### `PATCH /links/:id`

Update a link's `read` status and/or `note`. Both fields are optional; only the fields included in the request are updated.
```
curl -X PATCH http://localhost:3000/links/1 \
-H "Content-Type: application/json" \
-d '{"read": true, "note": "finished reading"}'
```

### `DELETE /links/:id`

Delete a link by ID.
```
curl -X DELETE http://localhost:3000/links/1
```

## Known limitations

- Tag filtering uses a SQL `LIKE` substring match, so `?tag=ai` will also match tags like `email`.
- No authentication; all links are stored in a single shared database.