# Deployment Guide

## 🚀 Deploying to Production

### Frontend Deployment (Vercel - Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables:
     - `NEXT_PUBLIC_NASA_API_KEY`
     - `NEXT_PUBLIC_API_URL` (your backend URL)
   - Deploy!

3. **Custom Domain** (Optional)
   - Add custom domain in Vercel dashboard
   - Update DNS settings

### Backend Deployment Options

#### Option 1: Railway (Recommended for FastAPI)

1. Create `railway.json`:
   ```json
   {
     "build": {
       "builder": "nixpacks",
       "buildCommand": "pip install -r requirements.txt"
     },
     "deploy": {
       "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
       "healthcheckPath": "/health"
     }
   }
   ```

2. Deploy:
   - Visit [railway.app](https://railway.app)
   - Create new project from GitHub repo
   - Select `backend` directory as root
   - Deploy automatically

#### Option 2: Heroku

1. Create `Procfile` in backend directory:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

2. Deploy:
   ```bash
   heroku create your-app-name
   cd backend
   git subtree push --prefix backend heroku main
   ```

#### Option 3: DigitalOcean App Platform

1. Create app from GitHub repository
2. Configure build settings:
   - Build Command: `pip install -r requirements.txt`
   - Run Command: `uvicorn main:app --host 0.0.0.0 --port 8080`
3. Deploy

#### Option 4: Docker (Any Cloud Provider)

1. Create `Dockerfile` in backend directory:
   ```dockerfile
   FROM python:3.11-slim
   
   WORKDIR /app
   
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   
   COPY . .
   
   EXPOSE 8000
   
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. Build and push:
   ```bash
   docker build -t asteroid-api .
   docker push your-registry/asteroid-api
   ```

### Environment Variables

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_NASA_API_KEY=your_nasa_api_key
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

#### Backend
```bash
NASA_API_KEY=your_nasa_api_key
CORS_ORIGINS=https://your-frontend-url.com
DATABASE_URL=postgresql://... # If using database
```

### Performance Optimization

#### Frontend
1. **Image Optimization**
   - Use Next.js Image component
   - Serve images from CDN

2. **Code Splitting**
   - Already configured with dynamic imports
   - Lazy load 3D components

3. **Caching**
   - Enable ISR (Incremental Static Regeneration)
   - Cache NASA API responses

#### Backend
1. **Database Connection Pool**
   - Configure proper pool size
   - Use connection pooling

2. **Caching**
   - Redis for API response caching
   - Cache NASA API data

3. **Rate Limiting**
   - Implement rate limiting for API endpoints

### Monitoring

#### Frontend
- **Vercel Analytics**: Built-in
- **Sentry**: Error tracking
  ```bash
  npm install @sentry/nextjs
  ```

#### Backend
- **FastAPI Monitoring**: 
  ```python
  from prometheus_fastapi_instrumentator import Instrumentator
  Instrumentator().instrument(app).expose(app)
  ```

### Security Checklist

- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Use environment variables for secrets
- [ ] Implement rate limiting
- [ ] Add API authentication (if needed)
- [ ] Enable CSP headers
- [ ] Regular dependency updates

### Database Setup (Optional)

If you want to add PostgreSQL:

1. **Create Database**
   - Use managed service (Railway, Supabase, etc.)

2. **Add SQLAlchemy Models**
   ```python
   from sqlalchemy import create_engine
   from sqlalchemy.orm import sessionmaker
   
   DATABASE_URL = os.getenv("DATABASE_URL")
   engine = create_engine(DATABASE_URL)
   SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
   ```

3. **Run Migrations**
   ```bash
   alembic init alembic
   alembic revision --autogenerate -m "Initial"
   alembic upgrade head
   ```

### Scaling Considerations

#### Horizontal Scaling
- Deploy backend behind load balancer
- Use container orchestration (Kubernetes, Docker Swarm)
- Auto-scaling based on CPU/memory

#### Vertical Scaling
- Increase server resources
- Optimize code for better performance

### Backup Strategy

1. **Code**: Git repository
2. **Database**: Automated daily backups
3. **Environment Variables**: Secure vault storage

### CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: vercel/action@v2
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
      - run: pip install -r backend/requirements.txt
      - run: pytest backend/tests
      - name: Deploy to Railway
        run: railway up
```

### Troubleshooting

#### Common Issues

1. **CORS Errors**
   - Check CORS configuration in FastAPI
   - Verify allowed origins

2. **API Rate Limiting**
   - Use your own NASA API key
   - Implement caching

3. **Memory Issues**
   - Increase server memory
   - Optimize 3D models
   - Reduce API response sizes

4. **Build Failures**
   - Check Node.js version
   - Clear build cache
   - Verify dependencies

### Post-Deployment

- [ ] Test all features in production
- [ ] Monitor error rates
- [ ] Check API response times
- [ ] Verify NASA API connectivity
- [ ] Test on multiple devices/browsers

### Cost Estimation

#### Free Tier Options
- **Vercel**: Free for personal projects
- **Railway**: $5/month credit
- **Heroku**: Free tier available

#### Paid Recommendations
- **Frontend**: Vercel Pro ($20/month)
- **Backend**: Railway ($5-20/month)
- **Database**: Supabase ($25/month)

**Total**: ~$50-65/month for production-ready setup

---

For support, please open an issue on GitHub.
