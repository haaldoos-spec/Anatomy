# Google Login Integration Guide

## Overview
This guide explains the Google OAuth login integration implemented in the haaldoos-spec/anatomy project.

## Files Created

### Frontend (Frontend/Client-side)

#### 1. `src/lib/googleAuth.ts`
Configuration and utilities for Google OAuth on the frontend.
- `googleAuthConfig`: Google OAuth configuration with client ID
- `loadGoogleScript()`: Loads Google Sign-In SDK
- `initializeGoogleSignIn()`: Initializes Google Sign-In button
- `decodeJWT()`: Decodes Google ID tokens

#### 2. `src/components/GoogleSignInButton.tsx`
React component for Google Sign-In button.
- Renders Google Sign-In button
- Handles Google sign-in success/error
- Sends ID token to backend for verification
- Authenticates user and redirects to dashboard

#### 3. Updated `src/app/login/page.tsx`
Enhanced login page with Google Sign-In.
- Displays Google Sign-In button
- Shows email/password form
- Divider between OAuth and email authentication
- Integrated error handling

#### 4. Updated `src/app/signup/page.tsx`
Enhanced signup page with Google Sign-In.
- Allows quick signup via Google
- Falls back to email/password registration
- Integrated user creation

#### 5. Updated `.env.local`
Added Google OAuth configuration:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Backend (Node.js/Express)

#### 1. `backend/src/services/googleAuthService.ts`
Google authentication service with token verification.
- `verifyGoogleToken()`: Verifies Google ID token
- `extractGoogleUserInfo()`: Extracts user info from token
- Token validation and expiration checks

#### 2. `backend/src/middleware/auth.ts`
JWT authentication middleware.
- `authMiddleware`: Verifies JWT tokens from requests
- Adds userId to request object
- Returns 401 for invalid/missing tokens

#### 3. `backend/src/routes/authRoutes.ts`
Authentication routes definition.
- `POST /auth/register`: Email/password registration
- `POST /auth/login`: Email/password login
- `POST /auth/google`: Google OAuth authentication
- `GET /auth/me`: Get current user (protected)
- `POST /auth/logout`: Logout
- `POST /auth/refresh`: Refresh JWT token

#### 4. `backend/.env.example`
Environment variables template for backend:
```
NODE_ENV=development
GOOGLE_CLIENT_ID=your_google_client_id_here
JWT_SECRET=your_jwt_secret_key
```

## Implementation Steps

### 1. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
6. Copy Client ID and add to `.env.local`

### 2. Frontend Configuration
1. Update `.env.local` with Google Client ID
2. GoogleSignInButton is used in login/signup pages
3. Google SDK is automatically loaded when needed

### 3. Backend Configuration
1. Update `backend/.env` with:
   - `GOOGLE_CLIENT_ID`
   - `JWT_SECRET`
   - `CORS_ORIGIN`
2. Create database migrations for user tables
3. Install required dependencies (already in package.json)

### 4. Database Schema
Users table structure:
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT (nullable for OAuth users),
  googleId TEXT UNIQUE (nullable),
  picture TEXT (for Google profile picture),
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  subscription_status TEXT DEFAULT 'free',
  subscription_plan TEXT,
  created_at DATETIME,
  updated_at DATETIME
);
```

## Flow Diagram

### Google Login Flow
```
User clicks "Sign in with Google"
         ↓
Google Sign-In popup appears
         ↓
User authenticates with Google
         ↓
Google returns ID Token
         ↓
Frontend sends ID Token to /auth/google
         ↓
Backend verifies token with Google
         ↓
Backend checks if user exists
         ↓
If not exists: Create new user
If exists: Update user if needed
         ↓
Backend generates JWT token
         ↓
Frontend stores JWT and user info
         ↓
Frontend redirects to dashboard
```

## Security Considerations

1. **Token Verification**: Always verify Google tokens on the backend
2. **HTTPS Only**: Use HTTPS in production
3. **JWT Secret**: Use strong, unique JWT_SECRET in production
4. **CORS**: Configure CORS_ORIGIN to match your frontend domain
5. **Password Hashing**: Email/password users have bcrypt-hashed passwords
6. **Token Expiration**: JWTs expire in 24 hours, with refresh token support

## Usage Examples

### Frontend - Sign in with Google
```typescript
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function LoginPage() {
  return (
    <div>
      <GoogleSignInButton />
    </div>
  );
}
```

### Backend - Protected Route
```typescript
import { authMiddleware } from './middleware/auth';
import { getMe } from './controllers/authController';

router.get('/me', authMiddleware, getMe);
```

## Troubleshooting

### Google Sign-In button not appearing
- Check if `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in `.env.local`
- Verify Google SDK is loaded in browser console
- Check browser console for errors

### Token verification fails
- Verify `GOOGLE_CLIENT_ID` is correct in backend `.env`
- Ensure token hasn't expired
- Check that request includes correct `Authorization: Bearer <token>` header

### User not created
- Check database connection
- Verify email is not already registered
- Check if user table exists in database

## Next Steps

1. Implement email verification (optional)
2. Add password reset functionality
3. Set up refresh token rotation
4. Add user profile management
5. Implement social account linking
6. Add login history/audit logs

## Dependencies

### Frontend
- `axios`: HTTP client
- `react-hook-form`: Form handling
- `zod`: Schema validation
- `next`: React framework (already installed)

### Backend
- `express`: Web framework
- `jsonwebtoken`: JWT signing/verification
- `bcryptjs`: Password hashing
- `better-sqlite3`: SQLite database
- `cors`: Cross-origin support

All dependencies are already in package.json files.
