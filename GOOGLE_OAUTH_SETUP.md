# Google Drive OAuth2 Setup for Draw.io Integration

## Step 1: Google Cloud Console Setup

1. **Go to**: https://console.cloud.google.com/
2. **Create new project** or select existing one
3. **Project name**: `YourApp Cloud Integration`

## Step 2: Enable APIs

1. **Go to**: "APIs & Services" → "Library"
2. **Search and enable**:
   - `Google Drive API`
   - `Google Picker API` (optional, for file picker)

## Step 3: Create OAuth2 Credentials

1. **Go to**: "APIs & Services" → "Credentials"
2. **Click**: "Create Credentials" → "OAuth client ID"

**First time setup:**
- **Configure OAuth consent screen**:
  - User Type: `External`
  - App name: `YourApp Cloud Integration`
  - User support email: `your-email@example.com`
  - Developer contact: `your-email@example.com`

## Step 4: OAuth Client Configuration

**Application type**: `Web application`
**Name**: `YourApp - Web Client`

**Authorized JavaScript origins**:
- `http://localhost:5173`
- `https://your-production-domain.com`

**Authorized redirect URIs**:
- `http://localhost:5173/oauth/callback/drawio`
- `https://your-production-domain.com/oauth/callback/drawio`

## Step 5: Configure Scopes

1. **Go to**: "OAuth consent screen"
2. **Click**: "Edit App"
3. **In "Scopes" section**, add:
   - `../auth/drive.file` - View and manage Google Drive files created by this app
   - `../auth/drive.readonly` - View Google Drive files

## Step 6: Get Client Credentials

1. **Copy the Client ID** from credentials page
2. **Add to your .env file**:
   ```env
   VITE_DRAWIO_CLIENT_ID=your_google_client_id_here
   ```

## Step 7: Testing Setup

1. **Add test users** (during development):
   - Go to "OAuth consent screen" → "Test users"
   - Add your email address

## Important Notes

- **No client secret needed** for public client (PKCE flow)
- **Redirect URI must match exactly** what's in your code
- **App verification** may be required for production use
- **Test users** can use the app during development phase

## Common Issues

- **Error 401: invalid_client** - Check client ID and redirect URI
- **Access blocked** - Add your email to test users
- **Scope issues** - Ensure Drive API is enabled and scopes are correct

## Testing

After setup, the Google Drive authentication should work without the "invalid_client" error.
