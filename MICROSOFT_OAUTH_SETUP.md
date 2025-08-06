# Microsoft Graph OAuth2 Setup for Visio Integration

## Step 1: Azure App Registration

1. **Go to Azure Portal**: https://portal.azure.com/
2. **Navigate to**: Azure Active Directory → App registrations
3. **Click**: "New registration"

## Step 2: Configure Application

**Basic Information:**
- **Name**: `YourApp - Cloud Integration`
- **Supported account types**: `Accounts in any organizational directory and personal Microsoft accounts`
- **Redirect URI**: 
  - Type: `Web`
  - URL: `http://localhost:5173/oauth/callback/microsoft`

## Step 3: API Permissions

After creating the app, go to **API permissions**:

1. **Click**: "Add a permission"
2. **Select**: "Microsoft Graph"
3. **Choose**: "Delegated permissions"
4. **Add these scopes**:
   - `Files.ReadWrite` - Read and write user files
   - `Sites.ReadWrite.All` - Read and write items in all site collections
   - `User.Read` - Sign in and read user profile

5. **Click**: "Grant admin consent" (if you're an admin)

## Step 4: Get Client Credentials

1. **Go to**: "Overview" tab
2. **Copy**: "Application (client) ID"
3. **Add to your .env file**:
   ```env
   VITE_MICROSOFT_CLIENT_ID=your_copied_client_id_here
   ```

## Step 5: Authentication Configuration

1. **Go to**: "Authentication" tab
2. **Under "Web"**, add redirect URI:
   - `http://localhost:5173/oauth/callback/microsoft`
   - `https://your-production-domain.com/oauth/callback/microsoft`
3. **Under "Advanced settings"**:
   - ✅ Enable "Allow public client flows"
   - ✅ Enable "ID tokens"
   - ✅ Enable "Access tokens"

## Important Notes

- **No client secret needed** for public client (PKCE flow)
- **Redirect URI must match exactly** what's in your code
- **Test with localhost first**, then add production domain
- **Grant admin consent** to avoid permission prompts for users

## Testing

After setup, the Microsoft authentication should work without the "unauthorized_client" error.
