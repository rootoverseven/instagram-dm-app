# 🚀 Instagram DM Manager - Final Deployment Instructions

## Quick Start (Recommended)

### Option 1: One-Click Deployment
```bash
git clone <your-repository-url>
cd instagram-dm-app
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Docker Deployment
```bash
git clone <your-repository-url>
cd instagram-dm-app
docker-compose up -d
```

## Detailed Setup Guide

### Prerequisites
- Node.js 16+ and npm/pnpm
- PostgreSQL database
- Instagram Professional Account
- Facebook Developer App with Instagram Graph API access

### Step 1: Clone and Setup
```bash
git clone <your-repository-url>
cd instagram-dm-app
npm install
cd frontend && pnpm install && cd ..
```

### Step 2: Database Configuration
```bash
# Install PostgreSQL (if not already installed)
sudo apt update && sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql -c "CREATE DATABASE instagram_dm_app;"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"
```

### Step 3: Environment Configuration

#### Backend (.env)
```env
NODE_ENV=production
PORT=3001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=instagram_dm_app
DB_USER=postgres
DB_PASSWORD=password

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Instagram App Configuration
INSTAGRAM_APP_ID=your-instagram-app-id
INSTAGRAM_APP_SECRET=your-instagram-app-secret
INSTAGRAM_REDIRECT_URI=http://localhost:3001/auth/instagram/callback

# Webhook Configuration (Optional)
WEBHOOK_VERIFY_TOKEN=your-webhook-verify-token
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### Step 4: Instagram API Setup

#### Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app → Business → App name: "Instagram DM Manager"
3. Add Instagram Graph API product
4. Configure Instagram Basic Display

#### Get Required Permissions
- `instagram_basic`
- `instagram_manage_messages`
- `instagram_manage_comments`
- `pages_messaging`
- `pages_read_engagement`

#### Generate Access Tokens
1. Use Graph API Explorer
2. Select your app
3. Generate User Access Token with required permissions
4. Convert to long-lived token (60 days)

### Step 5: Build and Start

#### Development Mode
```bash
# Terminal 1: Start Backend
npm run dev

# Terminal 2: Start Frontend
cd frontend && npm run dev
```

#### Production Mode
```bash
# Build Frontend
cd frontend && npm run build && cd ..

# Start Backend
npm start
```

### Step 6: Access Application
- Frontend: http://localhost:5173 (dev) or http://localhost:3001 (prod)
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## Production Deployment Options

### Option 1: Heroku Deployment

#### Backend (Heroku)
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set INSTAGRAM_APP_ID=your-app-id
heroku config:set INSTAGRAM_APP_SECRET=your-app-secret

# Deploy
git push heroku main
```

#### Frontend (Netlify/Vercel)
```bash
# Build the frontend
cd frontend && npm run build

# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist

# Or deploy to Vercel
npm install -g vercel
vercel --prod
```

### Option 2: DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure build settings:
   - **Backend**: Node.js, build command: `npm install`, run command: `npm start`
   - **Frontend**: Static site, build command: `cd frontend && npm run build`, output dir: `frontend/dist`
3. Add PostgreSQL database component
4. Set environment variables
5. Deploy

### Option 3: AWS/Azure/GCP

#### Using Docker
```bash
# Build images
docker build -t instagram-dm-backend -f Dockerfile.backend .
docker build -t instagram-dm-frontend -f frontend/Dockerfile ./frontend

# Push to container registry
docker tag instagram-dm-backend your-registry/instagram-dm-backend
docker push your-registry/instagram-dm-backend

# Deploy using your cloud provider's container service
```

## Webhook Setup (Optional)

### For Real-time Comment Monitoring

1. **Configure Webhook URL**
   ```
   https://yourdomain.com/webhooks/instagram
   ```

2. **Subscribe to Events**
   - Field: `comments`
   - Verify Token: Set in your environment variables

3. **Test Webhook**
   ```bash
   curl -X GET "https://graph.facebook.com/v18.0/your-app-id/subscriptions" \
     -H "Authorization: Bearer your-app-access-token"
   ```

## Post-Deployment Checklist

### ✅ Verify Installation
- [ ] Backend server responding to health checks
- [ ] Frontend loading correctly
- [ ] Database tables created
- [ ] Environment variables set

### ✅ Test Core Features
- [ ] User registration and login
- [ ] Instagram account linking
- [ ] Chat interface loading
- [ ] Automation settings accessible

### ✅ Security Configuration
- [ ] Change default JWT secret
- [ ] Set strong database passwords
- [ ] Configure HTTPS (production)
- [ ] Set up monitoring

### ✅ Instagram Integration
- [ ] App permissions approved
- [ ] Access tokens generated
- [ ] Webhook endpoints configured
- [ ] Test API connections

## Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check database exists
sudo -u postgres psql -l | grep instagram_dm_app
```

#### Instagram API Errors
- Verify app is in live mode (not development)
- Check access token validity
- Ensure proper permissions granted
- Verify webhook URL is accessible

#### Frontend Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 16+
```

#### Backend Startup Issues
```bash
# Check logs
npm run dev

# Verify environment variables
cat .env

# Test database connection
npm run test-db  # If you add this script
```

### Performance Optimization

#### Database
- Add indexes for frequently queried fields
- Set up connection pooling
- Configure query optimization

#### Backend
- Implement Redis for session storage
- Add request caching
- Set up load balancing

#### Frontend
- Enable gzip compression
- Set up CDN for static assets
- Implement code splitting

## Monitoring and Maintenance

### Recommended Tools
- **Application Monitoring**: New Relic, DataDog
- **Error Tracking**: Sentry
- **Uptime Monitoring**: Pingdom, UptimeRobot
- **Log Management**: LogRocket, Papertrail

### Regular Maintenance
- Monitor Instagram API rate limits
- Rotate access tokens (60-day expiry)
- Update dependencies regularly
- Backup database regularly
- Monitor server resources

## Support and Documentation

### Resources
- **API Documentation**: Check `/api` endpoints
- **Database Schema**: See models in `/src/models`
- **Component Documentation**: Check `/frontend/src/components`
- **Deployment Configs**: See `docker-compose.yml` and deployment scripts

### Getting Help
1. Check the troubleshooting section
2. Review application logs
3. Test API endpoints individually
4. Verify Instagram API status

## Success Metrics

### Application Health
- Server uptime > 99%
- API response time < 500ms
- Database query time < 100ms
- Frontend load time < 3s

### Business Metrics
- User registration rate
- Instagram accounts linked
- Automation rules created
- Messages sent successfully

---

## 🎉 Congratulations!

Your Instagram DM Manager is now ready for production use. The application provides:

- **Complete Chat Management** for Instagram DMs
- **Automated DM Responses** based on comment triggers
- **Real-time Comment Monitoring** with webhooks
- **Professional Dashboard** with analytics
- **Scalable Architecture** ready for growth

Start by linking your Instagram Professional account and creating your first automation rule!

