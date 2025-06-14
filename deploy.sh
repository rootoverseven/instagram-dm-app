#!/bin/bash

# Instagram DM Manager Deployment Script

echo "🚀 Starting Instagram DM Manager deployment..."

# Check if required tools are installed
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }
command -v git >/dev/null 2>&1 || { echo "❌ git is required but not installed. Aborting." >&2; exit 1; }

# Set up environment variables
echo "📝 Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Please edit .env file with your configuration before continuing."
    echo "   Required: Database credentials, Instagram API keys, JWT secret"
    read -p "Press enter to continue after editing .env file..."
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Set up frontend
echo "🎨 Setting up frontend..."
cd frontend

if [ ! -f .env ]; then
    echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env
fi

# Install frontend dependencies
pnpm install

# Build frontend for production
echo "🏗️  Building frontend..."
pnpm run build

cd ..

# Database setup
echo "🗄️  Setting up database..."
echo "Make sure PostgreSQL is running and the database exists."
echo "The application will create tables automatically on first run."

# Start the application
echo "🎯 Starting the application..."
echo "Backend will start on http://localhost:3001"
echo "Frontend will start on http://localhost:5173"

# Option to start with PM2 for production
read -p "Start with PM2 for production? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Install PM2 if not installed
    if ! command -v pm2 >/dev/null 2>&1; then
        echo "Installing PM2..."
        npm install -g pm2
    fi
    
    # Start with PM2
    pm2 start server.js --name "instagram-dm-backend"
    pm2 startup
    pm2 save
    
    echo "✅ Backend started with PM2"
    echo "Use 'pm2 status' to check status"
    echo "Use 'pm2 logs instagram-dm-backend' to view logs"
else
    # Start in development mode
    echo "Starting in development mode..."
    npm run dev
fi

echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your Instagram App in Facebook Developer Console"
echo "2. Set up webhooks (optional) for real-time monitoring"
echo "3. Link your Instagram Professional accounts"
echo "4. Create automation rules"
echo ""
echo "📚 Documentation: README.md"
echo "🐛 Issues: Create an issue on GitHub"

