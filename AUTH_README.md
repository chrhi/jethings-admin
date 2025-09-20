# Authentication System

This project implements a complete authentication system with sign-in, forgot password functionality, and protected routes using the Jethings Backend API.

## Features

- ✅ **Sign In**: Email and password authentication
- ✅ **Forgot Password**: Two-step password reset with OTP verification
- ✅ **Protected Routes**: Middleware-based route protection
- ✅ **Token Management**: Automatic token refresh and secure storage
- ✅ **Logout**: Secure logout with token revocation
- ✅ **Error Handling**: Comprehensive error handling and user feedback

## API Integration

The authentication system integrates with the Jethings Backend API at `https://jethings-backend.fly.dev`:

### Endpoints Used

- `POST /auth/signin` - User authentication
- `POST /auth/request-password-reset` - Request password reset OTP
- `POST /auth/verify-password-reset` - Verify OTP and reset password
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/logout` - Logout and revoke tokens

## File Structure

```
src/
├── lib/
│   └── auth.ts                    # Auth service with API calls
├── contexts/
│   └── auth-context.tsx           # React context for auth state
├── components/
│   ├── auth/
│   │   ├── logout-button.tsx      # Logout component
│   │   └── protected-route.tsx    # Route protection wrapper
│   └── providers.tsx              # App providers with AuthProvider
├── features/auth/components/
│   ├── signin-form.tsx            # Sign in form
│   ├── forgot-password-step1-form.tsx  # Request password reset
│   └── forgot-password-step2-form.tsx  # Verify OTP and reset
├── middleware.ts                  # Next.js middleware for route protection
└── app/
    ├── (auth)/                    # Public auth routes
    │   └── signin/
    │       ├── page.tsx
    │       └── forget-password/
    │           ├── page.tsx
    │           └── step2/page.tsx
    └── (dashboard)/               # Protected dashboard routes
        └── layout.tsx             # Protected layout with logout
```

## Usage

### 1. Environment Configuration

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://jethings-backend.fly.dev
```

### 2. Using the Auth Context

```tsx
import { useAuth } from '@/contexts/auth-context';

function MyComponent() {
  const { user, isAuthenticated, signIn, logout } = useAuth();
  
  const handleSignIn = async () => {
    try {
      await signIn({ email: 'user@example.com', password: 'password' });
      // User is now signed in
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.firstName}!</p>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
    </div>
  );
}
```

### 3. Protecting Routes

The dashboard layout is automatically protected. For other routes, wrap them with `ProtectedRoute`:

```tsx
import { ProtectedRoute } from '@/components/auth/protected-route';

function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

### 4. Logout Button

```tsx
import { LogoutButton } from '@/components/auth/logout-button';

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <LogoutButton variant="outline" />
    </header>
  );
}
```

## Security Features

### Token Storage
- Access tokens stored in secure HTTP-only cookies
- Refresh tokens stored in secure HTTP-only cookies with 7-day expiry
- Automatic token cleanup on logout

### Route Protection
- Middleware-based protection for all dashboard routes
- Automatic redirect to sign-in for unauthenticated users
- Redirect to dashboard for authenticated users accessing auth routes

### Error Handling
- Comprehensive error messages for all auth operations
- Graceful fallbacks for network errors
- User-friendly error display in forms

## API Response Handling

The auth service handles all API responses and errors:

```typescript
// Success response from signin
{
  message: "Signed in successfully",
  user: {
    id: "ck_123...",
    email: "jane@example.com",
    firstName: "Jane",
    lastName: "Doe",
    roles: ["user"]
  },
  accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
  expiresIn: 900
}
```

## Error Messages

The system provides localized error messages in French:

- "L'email est requis" - Email is required
- "Le mot de passe est requis" - Password is required
- "Invalid credentials" - Invalid login credentials
- "Email not verified" - Email not verified
- "Invalid or expired OTP" - Invalid verification code
- "Too many attempts" - Too many OTP attempts

## Development

### Running the Application

```bash
npm run dev
# or
pnpm dev
```

### Testing Authentication

1. Navigate to `/signin`
2. Use valid credentials to sign in
3. Access protected routes at `/dashboard`
4. Test forgot password flow at `/signin/forget-password`

### Token Management

The system automatically:
- Refreshes access tokens when they expire
- Handles token refresh failures gracefully
- Clears tokens on logout
- Redirects to sign-in when tokens are invalid

## Troubleshooting

### Common Issues

1. **"No access token available"**
   - User needs to sign in
   - Check if tokens are properly stored in cookies

2. **"Invalid or expired refresh token"**
   - User needs to sign in again
   - Refresh token has expired (7 days)

3. **API Connection Issues**
   - Check `NEXT_PUBLIC_API_URL` environment variable
   - Verify backend API is running and accessible

4. **Middleware Issues**
   - Ensure middleware.ts is in the root of the src directory
   - Check that protected routes are properly configured

### Debug Mode

Enable debug logging by adding to your component:

```tsx
useEffect(() => {
  console.log('Auth state:', { isAuthenticated, user, isLoading });
}, [isAuthenticated, user, isLoading]);
```

## Production Considerations

1. **Environment Variables**: Set `NEXT_PUBLIC_API_URL` in production
2. **HTTPS**: Ensure all cookies are served over HTTPS
3. **Token Security**: Consider implementing token rotation
4. **Rate Limiting**: Implement rate limiting for auth endpoints
5. **Monitoring**: Add logging and monitoring for auth events

## Support

For issues or questions about the authentication system, please check:

1. Browser console for error messages
2. Network tab for API request/response details
3. Application cookies for token storage
4. Backend API documentation for endpoint requirements
