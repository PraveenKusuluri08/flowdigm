# Lucidchart OAuth2 Setup

## Step 1: Lucidchart Developer Account

1. **Go to**: https://developer.lucidchart.com/
2. **Sign up** for developer account
3. **Create new application**

## Step 2: Application Configuration

**Application Details:**
- **Name**: `YourApp Cloud Integration`
- **Description**: `Bidirectional diagram integration`
- **Website**: `https://your-domain.com`

**OAuth2 Settings:**
- **Redirect URI**: 
  - `http://localhost:5173/oauth/callback/lucidchart`
  - `https://your-production-domain.com/oauth/callback/lucidchart`

## Step 3: Required Scopes

- `lucidchart.documents.read` - Read user documents
- `lucidchart.documents.write` - Create and edit documents
- `lucidchart.user.read` - Read user profile information

## Step 4: Get Credentials

1. **Copy Client ID** from application dashboard
2. **Copy Client Secret** (if required)
3. **Add to your .env file**:
   ```env
   VITE_LUCIDCHART_CLIENT_ID=your_lucidchart_client_id
   VITE_LUCIDCHART_CLIENT_SECRET=your_lucidchart_client_secret
   ```

## Testing

After setup, Lucidchart authentication should work properly.
