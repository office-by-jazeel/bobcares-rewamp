# Environment Variables Documentation

This document describes all environment variables used in the Bobcares Next.js application. These variables should be configured in a `.env.local` file in the root directory for local development.

## Quick Reference

| Variable | Required | Type | Default | Description |
|----------|----------|------|---------|-------------|
| `DATABASE_URL` | Yes* | String | - | MySQL database connection string |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Yes* | String | - | Google reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | Yes* | String | - | Google reCAPTCHA v3 secret key |
| `RECAPTCHA_SCORE_THRESHOLD` | No | Number | `0.5` | reCAPTCHA score threshold (0.0-1.0) |
| `NEXT_PUBLIC_GA_ID` | No | String | - | Google Analytics tracking ID |
| `NEXT_PUBLIC_ENABLE_COOKIE_CONSENT` | No | String | `false` | Enable cookie consent feature |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | No | String | - | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | String | - | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | String | - | Cloudinary API secret |
| `NEXT_PUBLIC_SUPPORT_BOARD_URL` | No | String | - | Support Board widget URL |
| `NODE_ENV` | Auto | String | - | Node environment (set by Next.js) |

\* Required for newsletter functionality

## Detailed Documentation

### Database

#### `DATABASE_URL`

- **Required**: Yes (for newsletter functionality)
- **Type**: String
- **Description**: MySQL database connection string used by Prisma ORM for database operations. Required for the newsletter subscription feature.
- **Format**: `mysql://[username]:[password]@[host]:[port]/[database]`
- **Example**: `mysql://user:password@localhost:3306/bobcares`
- **Used in**: `prisma/schema.prisma`, `lib/prisma.ts`, `app/api/newsletter/route.ts`
- **Setup**: 
  1. Create a MySQL database
  2. Configure connection string with your database credentials
  3. Run `npx prisma migrate dev` to set up the database schema

---

### Google reCAPTCHA

#### `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`

- **Required**: Yes (for newsletter functionality)
- **Type**: String
- **Description**: Public site key for Google reCAPTCHA v3. This key is exposed to the client-side and used to generate reCAPTCHA tokens.
- **Example**: `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`
- **Used in**: `app/layout.tsx`, `lib/recaptcha.ts`
- **Setup**: 
  1. Visit [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
  2. Register your site and select **reCAPTCHA v3**
  3. Add your domain(s) (e.g., `localhost` for development, your production domain)
  4. Copy the **Site Key** to your `.env.local` file

#### `RECAPTCHA_SECRET_KEY`

- **Required**: Yes (for newsletter functionality)
- **Type**: String
- **Description**: Secret key for server-side reCAPTCHA verification. This key must be kept secure and never exposed to the client-side.
- **Example**: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`
- **Used in**: `app/api/newsletter/route.ts`
- **Setup**: 
  1. After creating your reCAPTCHA site, copy the **Secret Key** from the Google reCAPTCHA Admin Console
  2. Add it to your `.env.local` file (server-side only, never commit to version control)

#### `RECAPTCHA_SCORE_THRESHOLD`

- **Required**: No
- **Type**: Number (Float)
- **Default**: `0.5`
- **Description**: Score threshold for reCAPTCHA v3 verification. reCAPTCHA v3 returns a score from 0.0 (likely a bot) to 1.0 (likely a human). Requests with scores below this threshold will be rejected.
- **Range**: `0.0` to `1.0`
- **Example**: `0.5` (default), `0.7` (more strict), `0.3` (more lenient)
- **Used in**: `app/api/newsletter/route.ts`
- **Note**: Lower values are more lenient but may allow more bots. Higher values are stricter but may block legitimate users.

---

### Google Analytics

#### `NEXT_PUBLIC_GA_ID`

- **Required**: No
- **Type**: String
- **Description**: Google Analytics tracking ID (Measurement ID). When set, Google Analytics scripts will be loaded and tracking will be enabled.
- **Format**: `G-XXXXXXXXXX` or `UA-XXXXXXXXX-X`
- **Example**: `G-ABC123XYZ`, `UA-123456789-1`
- **Used in**: `app/layout.tsx`
- **Setup**: 
  1. Create a Google Analytics property at [Google Analytics](https://analytics.google.com/)
  2. Get your Measurement ID (format: `G-XXXXXXXXXX`)
  3. Add it to your `.env.local` file
- **Note**: If not set, Google Analytics will not be loaded.

---

### Cookie Consent

#### `NEXT_PUBLIC_ENABLE_COOKIE_CONSENT`

- **Required**: No
- **Type**: String (Boolean)
- **Default**: `false` (disabled)
- **Description**: Enable or disable the cookie consent banner. Must be set to exactly `"true"` (string) to enable the feature.
- **Valid Values**: `"true"` (enabled), any other value or unset (disabled)
- **Example**: `true`
- **Used in**: `app/components/CookieConsent.tsx`
- **Note**: The component checks for strict equality with `"true"`, so the value must be the string `"true"`, not a boolean.

---

### Cloudinary

#### `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

- **Required**: No
- **Type**: String
- **Description**: Cloudinary cloud name for image and video asset management. When set, the application will use Cloudinary for optimized asset delivery with automatic fallback to local assets.
- **Example**: `my-cloud-name`
- **Used in**: `lib/cloudinary.ts`
- **Setup**: 
  1. Sign up at [Cloudinary](https://cloudinary.com/)
  2. Get your cloud name from the dashboard
  3. Add it to your `.env.local` file

#### `CLOUDINARY_API_KEY`

- **Required**: No (but required if Cloudinary is used)
- **Type**: String
- **Description**: Cloudinary API key for server-side operations. Required if you need to perform server-side image transformations or uploads.
- **Example**: `123456789012345`
- **Used in**: `lib/cloudinary.ts`
- **Setup**: Get your API key from the Cloudinary dashboard

#### `CLOUDINARY_API_SECRET`

- **Required**: No (but required if Cloudinary is used)
- **Type**: String
- **Description**: Cloudinary API secret for server-side operations. Must be kept secure and never exposed to the client-side.
- **Example**: `abcdefghijklmnopqrstuvwxyz123456`
- **Used in**: `lib/cloudinary.ts`
- **Setup**: Get your API secret from the Cloudinary dashboard
- **Security**: Never commit this value to version control

---

### Support Board

#### `NEXT_PUBLIC_SUPPORT_BOARD_URL`

- **Required**: No
- **Type**: String
- **Description**: URL for the Support Board widget. When set, the Support Board widget will be loaded and displayed on the site. If not set, the widget will not be rendered.
- **Format**: Full URL (with or without trailing slash)
- **Example**: `https://support.yourdomain.com`, `https://support.yourdomain.com/`
- **Used in**: `app/components/SupportBoard.tsx`, `lib/support-board.ts`
- **Note**: The URL will be automatically cleaned (trailing slashes removed) before use.

---

### Node Environment

#### `NODE_ENV`

- **Required**: No (automatically set)
- **Type**: String
- **Description**: Node.js environment mode. Automatically set by Next.js based on the command used (`development` for `npm run dev`, `production` for `npm run build`).
- **Valid Values**: `development`, `production`, `test`
- **Used in**: Multiple files for conditional logic (debugging, logging, etc.)
- **Note**: You typically don't need to set this manually. Next.js handles it automatically.

---

## Example `.env.local` File

Create a `.env.local` file in the root directory with the following template:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/bobcares

# Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
RECAPTCHA_SCORE_THRESHOLD=0.5

# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Cookie Consent (optional)
NEXT_PUBLIC_ENABLE_COOKIE_CONSENT=true

# Cloudinary (optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Support Board (optional)
NEXT_PUBLIC_SUPPORT_BOARD_URL=https://support.yourdomain.com
```

## Security Notes

1. **Never commit `.env.local` or `.env` files** to version control. They are already in `.gitignore`.
2. **Server-side secrets** (`RECAPTCHA_SECRET_KEY`, `CLOUDINARY_API_SECRET`) must never be exposed to the client-side.
3. **Public variables** (prefixed with `NEXT_PUBLIC_`) are exposed to the browser and will be included in the client bundle.
4. For production deployments, set environment variables in your hosting platform's environment variable settings (e.g., Vercel, Netlify, etc.).

## Next.js Environment Variable Rules

- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Variables without `NEXT_PUBLIC_` prefix are server-side only
- `.env.local` is loaded for all environments (development, production, etc.)
- `.env.development` and `.env.production` can be used for environment-specific variables
- Variables are loaded at build time, so changes require a restart

## Troubleshooting

### Newsletter subscription not working
- Ensure `DATABASE_URL` is correctly configured
- Verify `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` are set
- Check that the database schema is migrated (`npx prisma migrate dev`)

### Cloudinary images not loading
- Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set
- Check that the Cloudinary public ID matches your asset structure
- The application will automatically fallback to local assets if Cloudinary is not configured

### Support Board not appearing
- Ensure `NEXT_PUBLIC_SUPPORT_BOARD_URL` is set correctly
- Check browser console for any loading errors
- Verify the URL is accessible and the widget script is available

### Cookie consent not showing
- Ensure `NEXT_PUBLIC_ENABLE_COOKIE_CONSENT` is set to exactly `"true"` (string)
- Check browser console for any errors
- Verify the component is imported and rendered in `app/layout.tsx`

