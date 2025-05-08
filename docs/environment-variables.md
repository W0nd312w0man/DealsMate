# Environment Variables Configuration

This document outlines the environment variables required for the DealsMate application.

## Required Variables

### AUTH_SECRET
A secure random string used for encrypting authentication tokens and securing user sessions.

Example: `8f9a12b3c4d5e6f7g8h9i0j1k2l3m4n5`

**How to generate:**
\`\`\`bash
# Using the built-in generator
npx tsx lib/generate-secret.ts

# Or using OpenSSL
openssl rand -base64 32
\`\`\`

### API_URL
The base URL for API requests. In production, this should be the full URL to your API.

Example: `https://api.dealsmate.com`

### DATABASE_URL
The connection string for the database.

Example: `postgresql://user:password@localhost:5432/dealsmate`

## Optional Variables

### NODE_ENV
The environment in which the application is running. Set to `production` for production environments.

Values: `development`, `test`, `production`

### LOG_LEVEL
Controls the verbosity of application logs.

Values: `error`, `warn`, `info`, `debug`

## Environment Files

The application uses the following environment files:

- `.env`: Default environment variables for all environments
- `.env.local`: Local overrides (not committed to version control)
- `.env.development`: Development environment variables
- `.env.production`: Production environment variables

## Checking Environment Configuration

You can check if your environment is properly configured by:

1. Running the application in development mode
2. Visiting the admin dashboard, which will display any configuration issues
3. Using the CLI tool: `npx tsx lib/startup-checks.ts`

## Troubleshooting

If you encounter environment variable errors:

1. Check that all required variables are set in your environment or .env files
2. Verify that the values match the expected format
3. Restart the application after making changes to environment variables
4. Check the application logs for specific error messages
\`\`\`

Let's create a simple script to check environment variables from the command line:
