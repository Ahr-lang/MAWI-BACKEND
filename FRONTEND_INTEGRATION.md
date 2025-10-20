# MAWI Backend - Frontend Integration Guide

## 🚀 Quick Start
```bash
# Clone and run the backend
git clone https://github.com/Ahr-lang/MAWI-BACKEND.git
cd MAWI-BACKEND
.\scripts\dev-up.ps1
```

## 📖 API Documentation
- **Swagger UI**: http://localhost:3000/api-docs
- **Base URL**: http://localhost:3000/api

## 🔑 Authentication
All endpoints require:
1. **API Key Header**: `apikey: {tenant-key}`
2. **JWT Token Header**: `Authorization: Bearer {token}`

### API Keys by Tenant:
- **agromo**: `agromo-key-123`
- **biomo**: `biomo-key-456`
- **robo**: `robo-key-789`
- **back**: `back-key-000`

## 📋 Available Endpoints

### Authentication
- `POST /api/{tenant}/users/register` - Register new user
- `POST /api/{tenant}/users/login` - Get JWT token
- `GET /api/{tenant}/users/me` - Get current user info
- `POST /api/{tenant}/users/logout` - Logout

### Users Management
- `GET /api/{tenant}/users` - **NEW!** Get all users (usernames only)

## 🎯 Example Usage

### 1. Register a user:
```bash
POST /api/agromo/users/register
Headers: { "apikey": "agromo-key-123" }
Body: {
  "username": "john",
  "password": "password123",
  "user_email": "john@example.com"
}
```

### 2. Login:
```bash
POST /api/agromo/users/login
Headers: { "apikey": "agromo-key-123" }
Body: {
  "user_email": "john@example.com",
  "password": "password123"
}
Response: { "token": "eyJhbGci..." }
```

### 3. Get Users List:
```bash
GET /api/agromo/users
Headers: {
  "apikey": "agromo-key-123",
  "Authorization": "Bearer eyJhbGci..."
}
Response: {
  "users": [{"username": "john"}, {"username": "jane"}],
  "tenant": "agromo",
  "count": 2
}
```

## 🏗️ Multi-Tenant Structure
The API supports 4 tenants, each with separate databases:
- **agromo** - Agriculture data
- **biomo** - Biology data  
- **robo** - Robotics data
- **back** - Backend/Admin data

## 🔧 Development Notes
- Backend runs on port **3000**
- Hot reload enabled in development
- All endpoints documented in Swagger
- CORS enabled for frontend development
- Rate limiting: 100 requests per 15 minutes per tenant+IP

## 🐛 Troubleshooting
- Ensure Docker is running
- Check API key matches tenant in URL
- JWT tokens expire in 7 days
- Use Swagger UI for testing endpoints

---
**Ready for frontend integration!** 🎨