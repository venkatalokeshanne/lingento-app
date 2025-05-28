# Security Configuration

This document explains how to securely configure the Lingento application with environment variables.

## Environment Variables Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your actual values in `.env.local`:**
   - Replace all placeholder values with your real credentials
   - Never commit `.env.local` to version control

## Required Environment Variables

### Firebase Configuration
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase project API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase app ID
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Google Analytics measurement ID

### AWS Configuration
- `NEXT_PUBLIC_AWS_REGION`: AWS region (e.g., eu-west-3)
- `NEXT_PUBLIC_AWS_ACCESS_KEY_ID`: Your AWS access key ID
- `NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY`: Your AWS secret access key

## Security Best Practices

1. **Never commit secrets to Git:**
   - The `.gitignore` file excludes all `.env*` files
   - Always use `.env.local` for local development
   - Use your hosting platform's environment variable settings for production

2. **Rotate credentials regularly:**
   - Change AWS access keys periodically
   - Monitor Firebase usage for any suspicious activity

3. **Use least privilege principle:**
   - AWS IAM users should only have permissions for Polly service
   - Firebase security rules should be properly configured

4. **Environment-specific configurations:**
   - Use different credentials for development and production
   - Consider using AWS IAM roles in production instead of access keys

## Production Deployment

For production deployment (Vercel, Netlify, etc.):

1. Set environment variables in your hosting platform's dashboard
2. Never include `.env.local` in your deployment
3. Verify all environment variables are properly set in production

## Troubleshooting

If you encounter authentication errors:

1. Verify all environment variables are set correctly
2. Check that your AWS credentials have the necessary permissions
3. Ensure Firebase project settings match your environment variables
4. Restart your development server after changing environment variables

## Git Security

The following files are automatically ignored by Git:
- `.env.local` (your actual secrets)
- `.env.production.local`
- `.env.development.local`
- Any file matching `.env*`

Only `.env.example` (with placeholder values) should be committed to the repository.
