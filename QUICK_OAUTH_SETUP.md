# 🚀 Quick OAuth2 Setup Guide

## ⚡ Immediate Next Steps

The errors you're seeing are **expected** because OAuth2 applications haven't been registered yet. Here's how to fix them:

### 🎯 **Priority Setup (Start Here)**

1. **Create your environment file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Choose ONE platform to start with** (I recommend Google for easiest setup):

### 🔧 **Google Drive/Draw.io Setup (Easiest - Start Here)**

1. **Go to**: https://console.cloud.google.com/
2. **Create new project**: "MyApp-CloudIntegration"
3. **Enable Google Drive API**:
   - APIs & Services → Library → Search "Google Drive API" → Enable
4. **Create OAuth2 credentials**:
   - APIs & Services → Credentials → Create Credentials → OAuth client ID
   - **First time**: Configure consent screen (External, minimal info needed)
   - **Application type**: Web application
   - **Authorized redirect URIs**: `http://localhost:5173/oauth/callback/drawio`
5. **Copy Client ID** and add to `.env.local`:
   ```env
   VITE_DRAWIO_CLIENT_ID=your_actual_google_client_id_here
   ```

### 🔄 **Test the Integration**

1. **Restart your dev server**: `npm run dev`
2. **Go to**: http://localhost:5173
3. **Click**: Integration button (⚡) in sidebar
4. **Try connecting**: Click "Connect to Draw.io"
5. **Should now work** without errors!

### 📋 **For Production Setup**

After testing with Google/Draw.io, follow the detailed guides:
- `MICROSOFT_OAUTH_SETUP.md` - For Visio integration
- `LUCIDCHART_OAUTH_SETUP.md` - For Lucidchart integration

### 🛠 **Common Issues**

**"invalid_client" errors**: 
- ✅ Check client ID is correct in `.env.local`
- ✅ Verify redirect URI matches exactly
- ✅ Ensure API is enabled (for Google Drive)

**"unauthorized_client" errors**:
- ✅ Check app registration exists
- ✅ Verify redirect URI is added to app registration
- ✅ Ensure proper scopes are configured

### 🎉 **Success Indicators**

When properly configured, you should see:
- ✅ OAuth2 login popup opens
- ✅ Successful authentication redirect
- ✅ "Connected as [username]" status
- ✅ Document list appears

---

**Start with Google Drive setup above** - it's the quickest to get working!
