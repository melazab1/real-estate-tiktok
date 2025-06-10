# Test User Credentials

## Test Account Details
- **Email**: test@videogen.com
- **Password**: TestPass123!

## How to Use
1. Go to `/auth-new` page
2. Click "Password Login"
3. Choose "Create your account" if this is the first time
4. Enter the email and password above
5. Or choose "Sign in to your account" if the account already exists

## Alternative: OTP Authentication
You can also test the OTP (magic link) authentication:
1. Go to `/auth-new` page
2. Click "Quick Login (Verification Code)"
3. Enter any valid email address
4. Check the email for the 6-digit verification code

## Admin Access
To test admin features (webhook settings):
1. After creating the test account, you'll need to manually add admin role in the database
2. Or use the existing authentication with your own email

## Notes
- The password meets the minimum requirements (6+ characters)
- The email format is valid
- You can create multiple test accounts with different emails if needed
- All test data will be stored in your Supabase database