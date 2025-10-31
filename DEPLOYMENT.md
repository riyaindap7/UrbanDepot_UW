# Deployment Instructions for Render

## Recent Fixes

### CI/CD Pipeline Error - FIXED ✅
**Error:** `TypeError: Missing parameter name at 1: https://git.new/pathToRegexpError`

**Cause:** The catch-all route pattern `app.get('*')` was causing issues with the `path-to-regexp` library in Express.

**Solution:** Changed from `app.get('*')` to `app.get(/^(?!\/api).*/)` which uses a regex pattern that:
- Matches all routes that DON'T start with `/api`
- Is compatible with `path-to-regexp`
- Properly handles React Router routes

## Problem Fixed
The "404 Not Found" error when refreshing pages or navigating directly to routes in your React SPA has been fixed.

## Changes Made

### 1. Backend Server (`backend/index.js`)
- Added static file serving for React build in production mode
- Added catch-all route to handle React Router routes
- This ensures all non-API routes return `index.html` so React Router can handle routing

### 2. Build Process (`package.json`)
- Added postbuild script to copy `_redirects` file to build folder
- This ensures the redirects file is available in production

### 3. Configuration Files
- **`render.yaml`**: Configuration for Render deployment (if using Blueprint)
- **`netlify.toml`**: Configuration for Netlify (alternative)
- **`_redirects`**: Already present - handles SPA routing

## Deployment Steps for Render

### Option 1: Single Service (Backend serves Frontend)

1. **Build your React app:**
   ```bash
   npm run build
   ```

2. **Set environment variables in Render Dashboard:**
   - `NODE_ENV` = `production`
   - `FIREBASE_SERVICE_ACCOUNT_JSON` = (your Firebase service account JSON)
   - `FIREBASE_STORAGE_BUCKET` = `urbandepot-cbda0.appspot.com`
   - `RAZORPAY_KEY_ID` = (your Razorpay key)
   - `RAZORPAY_KEY_SECRET` = (your Razorpay secret)
   - `REACT_APP_API_URL` = (your backend URL, e.g., `https://your-app.onrender.com`)

3. **Build Command (in Render):**
   ```bash
   npm install && npm run build && cd backend && npm install
   ```

4. **Start Command (in Render):**
   ```bash
   cd backend && node index.js
   ```

### Option 2: Separate Services (Using render.yaml)

1. Push the `render.yaml` file to your repository
2. In Render Dashboard, create a new Blueprint and connect your repository
3. Render will automatically detect the `render.yaml` and create two services:
   - Frontend (Static Site)
   - Backend (Web Service)

## Testing Locally

To test the production setup locally:

```bash
# Build the React app
npm run build

# Set environment variable
$env:NODE_ENV = "production"

# Run backend (which now serves the React app)
cd backend
node index.js
```

Visit `http://localhost:8080` and test:
- Direct navigation to routes (e.g., `/profile`, `/map`)
- Page refresh on any route
- Browser back/forward buttons

## Important Notes

1. **All API routes start with `/api`** - This ensures they don't conflict with React routes
2. **The catch-all route** (`app.get('*')`) is placed AFTER all API routes
3. **In production**, the backend serves both API and React static files
4. **In development**, continue to run React dev server separately on port 3000

## Troubleshooting

If you still get 404 errors:

1. **Check Render logs** to ensure `NODE_ENV=production` is set
2. **Verify build folder exists** at `../build` relative to backend
3. **Check that all API calls** use `${process.env.REACT_APP_API_URL}/api/...`
4. **Ensure environment variables** are set correctly in Render dashboard

## Alternative: Using Netlify

If you prefer to deploy frontend on Netlify:

1. Deploy backend to Render (only backend service)
2. Deploy frontend to Netlify
3. The `netlify.toml` file is already configured
4. Set `REACT_APP_API_URL` to your Render backend URL

