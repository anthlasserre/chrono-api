# Chrono API

A TypeScript Express.js API for managing chronos (timers) with SQLite database integration using TypeORM.

## Features

- Create, start, pause, and stop chronos
- Automatic start on creation
- Real-time duration tracking
- SQLite database with TypeORM
- TypeScript support
- RESTful API endpoints
- API key authentication with environment variables

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

3. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` and set your API keys.

4. Build the project:
```bash
npm run build
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Keys
API_KEY_TEST=your-test-api-key-here
API_KEY_PROD=your-prod-api-key-here

# Server Configuration
PORT=3000
```

## Development

To start the development server with hot-reload:
```bash
npm run dev
```

## API Authentication

All API endpoints require an API key to be included in the request headers:

```http
X-API-Key: your-api-key-here
```

The API key must match one of the keys defined in your `.env` file.

## API Endpoints

### Create a new chrono (automatically starts)
```http
POST /chronos
Content-Type: application/json
X-API-Key: your-api-key-here

{
  "origin": "work"
}
```

### Get all chronos
```http
GET /chronos
X-API-Key: your-api-key-here
```

### Get a specific chrono
```http
GET /chronos/:id
X-API-Key: your-api-key-here
```

### Start a chrono
```http
POST /chronos/:id/start
X-API-Key: your-api-key-here
```

### Pause a chrono
```http
POST /chronos/:id/pause
X-API-Key: your-api-key-here
```

### Stop a chrono
```http
POST /chronos/:id/stop
X-API-Key: your-api-key-here
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

- `RUNNING`: Chrono is currently running (default state on creation)
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
- `401`: Unauthorized (missing API key)
- `403`: Forbidden (invalid API key)
- `404`: Not Found (e.g., chrono not found)
- `500`: Internal Server Error

## License

ISC 