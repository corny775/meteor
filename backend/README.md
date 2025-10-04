# Python Backend Setup

## Prerequisites
- Python 3.8 or higher
- pip package manager

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Backend

Start the FastAPI server:
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: http://localhost:8000

## API Documentation

Interactive API documentation (Swagger UI): http://localhost:8000/docs

## Connecting Frontend to Backend

1. Create a `.env.local` file in the project root (copy from `.env.local.example`)
2. Set the following environment variables:
```
NEXT_PUBLIC_USE_BACKEND=true
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

3. Restart your Next.js development server

The frontend will now use the Python backend for simulations instead of the TypeScript implementation.

## Endpoints

### Simulation
- `POST /api/simulation/simulate` - Run complete asteroid impact simulation
- `GET /api/simulation/energy-estimate` - Quick energy calculation

### Asteroids
- `GET /api/asteroids/near-earth` - Get NASA NEO data

### Deflection
- `POST /api/deflection/strategy` - Calculate deflection requirements

## Health Check

```bash
curl http://localhost:8000/health
```

## CORS Configuration

The backend is configured to allow requests from:
- http://localhost:3000 (Next.js default)
- http://localhost:3001 (alternative port)

Add more origins in `main.py` if needed.
