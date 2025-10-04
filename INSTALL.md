# Installation & Setup Guide

## Prerequisites

### Required Software
- **Node.js**: Version 18.0 or higher
- **npm** or **yarn**: Package manager
- **Python**: Version 3.11 or higher
- **pip**: Python package manager
- **Git**: Version control

### Optional
- **NASA API Key**: Get free at https://api.nasa.gov/ (DEMO_KEY has rate limits)

## Step-by-Step Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/asteroid-impact-simulator.git
cd asteroid-impact-simulator
```

### 2. Quick Setup (Recommended)

#### On Windows:
```cmd
setup.bat
```

#### On Mac/Linux:
```bash
chmod +x setup.sh
./setup.sh
```

This script will:
- ✅ Check system requirements
- ✅ Install frontend dependencies
- ✅ Create Python virtual environment
- ✅ Install backend dependencies
- ✅ Create environment configuration

### 3. Manual Setup (Alternative)

#### Frontend Setup

```bash
# Install dependencies
npm install

# or using yarn
yarn install

# Create environment file
cp .env.example .env.local
```

Edit `.env.local`:
```bash
NEXT_PUBLIC_NASA_API_KEY=your_api_key_here
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Running the Application

### Development Mode

You need to run both frontend and backend servers simultaneously.

#### Terminal 1 - Frontend
```bash
npm run dev
```
Access at: http://localhost:3000

#### Terminal 2 - Backend
```bash
cd backend
python main.py
```
API available at: http://localhost:8000
API Docs at: http://localhost:8000/docs

### Production Build

#### Frontend
```bash
npm run build
npm start
```

#### Backend
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Verification

### Check Frontend
1. Open http://localhost:3000
2. You should see the Asteroid Impact Simulator dashboard
3. Check for asteroids in the left panel (they load from NASA API)

### Check Backend
1. Open http://localhost:8000/docs
2. You should see the FastAPI interactive documentation
3. Try the `/health` endpoint to verify it's running

### Test Integration
1. In the frontend, adjust impact parameters
2. Click "Run Simulation"
3. Results should appear showing impact effects

## Troubleshooting

### Frontend Issues

#### Problem: Dependencies won't install
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Problem: Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

#### Problem: Module not found errors
```bash
# Reinstall dependencies
rm -rf node_modules .next
npm install
```

### Backend Issues

#### Problem: Python dependencies won't install
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install dependencies one by one
pip install fastapi
pip install uvicorn
# ... etc
```

#### Problem: Port 8000 already in use
```python
# Edit backend/main.py
# Change port in:
uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
```

#### Problem: ModuleNotFoundError
```bash
# Ensure virtual environment is activated
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Then reinstall
pip install -r requirements.txt
```

### Common Issues

#### NASA API Rate Limiting
**Problem**: Getting 429 errors from NASA API
**Solution**: Get your own API key at https://api.nasa.gov/ and update `.env.local`

#### CORS Errors
**Problem**: API requests blocked by CORS
**Solution**: 
1. Check backend is running
2. Verify CORS settings in `backend/main.py`
3. Ensure frontend URL is in allowed origins

#### 3D Visualization Not Loading
**Problem**: Black screen or errors in 3D view
**Solution**:
1. Check browser console for WebGL errors
2. Update graphics drivers
3. Try different browser (Chrome/Firefox recommended)

#### Map Not Displaying
**Problem**: Impact map shows blank or errors
**Solution**:
1. Check browser console for Leaflet errors
2. Ensure internet connection for map tiles
3. Clear browser cache

## Browser Requirements

### Recommended Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Required Features
- WebGL 2.0 support (for 3D visualization)
- ES6+ JavaScript support
- LocalStorage enabled

## System Requirements

### Minimum
- **CPU**: Dual-core 2.0 GHz
- **RAM**: 4 GB
- **Storage**: 1 GB free space
- **Internet**: Required for NASA API and map tiles

### Recommended
- **CPU**: Quad-core 2.5 GHz or higher
- **RAM**: 8 GB or more
- **GPU**: Dedicated GPU for better 3D performance
- **Internet**: Broadband connection

## IDE Setup

### VS Code (Recommended)

Install recommended extensions:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-python.python",
    "ms-python.vscode-pylance",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[python]": {
    "editor.defaultFormatter": "ms-python.python"
  }
}
```

## Next Steps

1. ✅ **Explore the Dashboard**: Browse NASA asteroid data
2. ✅ **Run Simulations**: Test different impact scenarios
3. ✅ **Try Orbital View**: Visualize asteroid trajectories
4. ✅ **Play Defend Earth**: Test your planetary defense skills
5. ✅ **Read the Documentation**: Check README.md for features
6. ✅ **Customize**: Modify parameters and themes
7. ✅ **Contribute**: See CONTRIBUTING.md

## Getting Help

- 📖 **Documentation**: Check README.md
- 🐛 **Bug Reports**: Open an issue on GitHub
- 💬 **Questions**: Open a discussion on GitHub
- 📧 **Email**: Contact maintainers

## Updates

Keep your installation up to date:

```bash
# Pull latest changes
git pull origin main

# Update frontend dependencies
npm install

# Update backend dependencies
cd backend
pip install -r requirements.txt --upgrade
```

## Uninstallation

To remove the application:

```bash
# Remove project directory
rm -rf asteroid-impact-simulator

# Optional: Remove Node.js cache
npm cache clean --force
```

---

**Ready to start?** Run `npm run dev` and visit http://localhost:3000 🚀
