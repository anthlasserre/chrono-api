# Chrono API

A TypeScript Express.js API for managing chronos (timers) with SQLite database integration using TypeORM.

## Features

- Create, start, pause, and stop chronos
- Real-time duration tracking
- SQLite database with TypeORM
- TypeScript support
- RESTful API endpoints

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chrono-api
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Development

To start the development server with hot-reload:
```bash
npm run dev
```

## API Endpoints

### Create a new chrono
```http
POST /chronos
Content-Type: application/json

{
  "origin": "work"
}
```

### Get all chronos
```http
GET /chronos
```

### Get a specific chrono
```http
GET /chronos/:id
```

### Start a chrono
```http
POST /chronos/:id/start
```

### Pause a chrono
```http
POST /chronos/:id/pause
```

### Stop a chrono
```http
POST /chronos/:id/stop
```

## Response Format

Example response for a chrono:
```json
{
  "id": "uuid",
  "origin": "work",
  "status": "RUNNING",
  "duration": 0,
  "startTime": "2024-02-19T20:00:00.000Z",
  "createdAt": "2024-02-19T20:00:00.000Z",
  "updatedAt": "2024-02-19T20:00:00.000Z",
  "currentDurationMs": 5000,
  "currentDurationFormatted": "00:00:05"
}
```

## Status Types

- `CREATED`: Initial state when chrono is created
- `RUNNING`: Chrono is currently running
- `PAUSED`: Chrono is paused
- `STOPPED`: Chrono is stopped

## Database

The application uses SQLite with TypeORM for data persistence. The database file (`chronos.db`) is created automatically when the application starts.

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build the project
- `npm start`: Start production server
- `npm run watch`: Watch for changes and rebuild

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400`: Bad Request (e.g., invalid input)
- `404`: Not Found (e.g., chrono not found)
- `500`: Internal Server Error

## License

ISC 