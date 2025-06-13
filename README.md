# Instagram DM Manager

A full-stack web application for managing Instagram direct messages and automating DM responses based on comment triggers.

## Features

- **Instagram Account Management**: Connect and manage multiple Instagram Professional accounts
- **Chat Interface**: View and manage Instagram direct messages in a clean, intuitive interface
- **Automated DM Responses**: Set up keyword-based triggers to automatically send DMs when users comment on your posts/reels
- **Real-time Monitoring**: Monitor comments in real-time using webhooks or periodic polling
- **Analytics Dashboard**: Track automation performance and message statistics
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database with Sequelize ORM
- **Instagram Graph API** integration
- **JWT** authentication
- **Webhook** support for real-time events
- **Cron jobs** for periodic comment monitoring

### Frontend
- **React** with modern hooks
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **Axios** for API calls
- **Responsive design** with mobile support

## Prerequisites

Before running this application, you need:

1. **Instagram Professional Account** (Business or Creator)
2. **Facebook Developer Account** and App
3. **Instagram Graph API** access tokens
4. **PostgreSQL** database
5. **Node.js** (v16 or higher)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd instagram-dm-app
```

### 2. Backend Setup

```bash
# Install backend dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Edit frontend .env file
nano .env
```

### 4. Database Setup

Make sure PostgreSQL is running and create a database:

```sql
CREATE DATABASE instagram_dm_app;
```

### 5. Environment Configuration

#### Backend (.env)
```env
NODE_ENV=development
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=instagram_dm_app
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Instagram App Configuration
INSTAGRAM_APP_ID=your-instagram-app-id
INSTAGRAM_APP_SECRET=your-instagram-app-secret
INSTAGRAM_REDIRECT_URI=http://localhost:3000/auth/instagram/callback

# Webhook Configuration
WEBHOOK_VERIFY_TOKEN=your-webhook-verify-token
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Running the Application

### Development Mode

1. **Start the Backend**:
```bash
npm run dev
```

2. **Start the Frontend** (in a new terminal):
```bash
cd frontend
npm run dev
```

3. **Access the Application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Production Mode

1. **Build the Frontend**:
```bash
cd frontend
npm run build
```

2. **Start the Backend**:
```bash
npm start
```

## Instagram API Setup

### 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Instagram Graph API product
4. Configure Instagram Basic Display

### 2. Get Access Tokens

1. Use Facebook's Graph API Explorer
2. Generate User Access Token with required permissions:
   - `instagram_basic`
   - `instagram_manage_messages`
   - `instagram_manage_comments`
   - `pages_messaging`

### 3. Webhook Setup (Optional)

For real-time comment monitoring:

1. Configure webhook URL: `https://yourdomain.com/webhooks/instagram`
2. Subscribe to `comments` field
3. Set verify token in your environment variables

## Usage

### 1. Account Setup

1. Register/Login to the application
2. Link your Instagram Professional account using:
   - Instagram User ID
   - Access Token

### 2. Create Automation Rules

1. Go to Automation Settings
2. Create new rules with:
   - Trigger keywords (e.g., "interested", "info", "price")
   - Automated DM message
   - Active/inactive status

### 3. Monitor Performance

- View automation statistics on the dashboard
- Track messages sent and rule performance
- Manage active/inactive rules

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Instagram
- `POST /api/instagram/link` - Link Instagram account
- `GET /api/instagram/accounts` - Get linked accounts
- `DELETE /api/instagram/accounts/:id` - Unlink account

### Automation
- `GET /api/automation/rules` - Get automation rules
- `POST /api/automation/rules` - Create new rule
- `PUT /api/automation/rules/:id` - Update rule
- `DELETE /api/automation/rules/:id` - Delete rule
- `GET /api/automation/stats` - Get statistics

### Chats
- `GET /api/chats` - Get all chats
- `GET /api/chats/:id/messages` - Get chat messages
- `POST /api/chats/:id/messages` - Send message

### Webhooks
- `GET /webhooks/instagram` - Webhook verification
- `POST /webhooks/instagram` - Webhook events

## Deployment

### Using Docker (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment

1. **Deploy Backend**:
   - Use services like Heroku, DigitalOcean, or AWS
   - Set environment variables
   - Ensure PostgreSQL database is accessible

2. **Deploy Frontend**:
   - Build the React app: `npm run build`
   - Deploy to Netlify, Vercel, or serve statically

3. **Database Migration**:
   - Run database migrations in production
   - Ensure proper database permissions

## Security Considerations

- Keep Instagram App Secret secure
- Use strong JWT secrets
- Validate webhook signatures
- Implement rate limiting
- Use HTTPS in production
- Regularly rotate access tokens

## Troubleshooting

### Common Issues

1. **Instagram API Errors**:
   - Check access token validity
   - Verify app permissions
   - Ensure account is Professional

2. **Database Connection**:
   - Verify PostgreSQL is running
   - Check connection credentials
   - Ensure database exists

3. **Webhook Issues**:
   - Verify webhook URL is accessible
   - Check verify token matches
   - Ensure HTTPS in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review Instagram Graph API documentation

## Disclaimer

This application is for educational and business purposes. Ensure compliance with Instagram's Terms of Service and API usage policies. Always respect user privacy and obtain proper consent for automated messaging.

