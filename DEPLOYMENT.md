# Deployment Guide

## Quick Start

### Option 1: One-Click Deployment Script

```bash
git clone <your-repository-url>
cd instagram-dm-app
./deploy.sh
```

### Option 2: Manual Deployment

#### Prerequisites
- Node.js 16+
- PostgreSQL
- Instagram Professional Account
- Facebook Developer App

#### Steps

1. **Clone and Setup**
```bash
git clone <your-repository-url>
cd instagram-dm-app
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Frontend Setup**
```bash
cd frontend
pnpm install
pnpm run build
```

4. **Database Setup**
```bash
# Create PostgreSQL database
createdb instagram_dm_app
```

5. **Start Application**
```bash
npm start
```

## Production Deployment

### Using Docker

```bash
docker-compose up -d
```

### Using PM2

```bash
npm install -g pm2
pm2 start server.js --name instagram-dm-app
pm2 startup
pm2 save
```

### Cloud Deployment

#### Heroku
1. Create Heroku app
2. Add PostgreSQL addon
3. Set environment variables
4. Deploy via Git

#### DigitalOcean App Platform
1. Connect GitHub repository
2. Configure build settings
3. Add database component
4. Set environment variables

#### AWS/Azure
1. Set up EC2/VM instance
2. Install dependencies
3. Configure database
4. Set up reverse proxy (nginx)
5. Configure SSL certificate

## Environment Variables

### Required Backend Variables
```env
NODE_ENV=production
PORT=3000
DB_HOST=your-db-host
DB_NAME=instagram_dm_app
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-jwt-secret
INSTAGRAM_APP_ID=your-app-id
INSTAGRAM_APP_SECRET=your-app-secret
WEBHOOK_VERIFY_TOKEN=your-webhook-token
```

### Required Frontend Variables
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## Post-Deployment Checklist

- [ ] Database tables created successfully
- [ ] Instagram API credentials configured
- [ ] Webhook endpoints accessible (if using)
- [ ] SSL certificate installed (production)
- [ ] Environment variables set correctly
- [ ] Application health check passing
- [ ] Monitoring and logging configured

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check PostgreSQL is running
   - Verify connection credentials
   - Ensure database exists

2. **Instagram API Errors**
   - Verify app credentials
   - Check access token validity
   - Ensure proper permissions

3. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

### Health Checks

- Backend: `GET /health`
- Database: Check connection in logs
- Frontend: Verify build artifacts exist

## Monitoring

### Recommended Tools
- **PM2** for process management
- **New Relic** or **DataDog** for APM
- **Sentry** for error tracking
- **LogRocket** for frontend monitoring

### Key Metrics to Monitor
- API response times
- Database query performance
- Instagram API rate limits
- Automation rule success rates
- User engagement metrics

