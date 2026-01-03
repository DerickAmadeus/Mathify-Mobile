# Mathify Backend - Vercel Deployment

Backend API for Mathify application, ready for deployment on Vercel.

## 🚀 Deployment Instructions

### Prerequisites
1. Vercel account
2. Vercel CLI installed: `npm i -g vercel`

### Environment Variables
Set these environment variables in your Vercel dashboard:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT Secret
JWT_SECRET=your_jwt_secret

# Other configurations
NODE_ENV=production
```

### Deploy to Vercel

1. **From current directory (backend folder):**
   ```bash
   cd backend
   vercel
   ```

2. **Follow the prompts:**
   - Link to existing project? (if you have one)
   - Set project name
   - Confirm deployment

3. **Set environment variables:**
   ```bash
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_ANON_KEY
   vercel env add JWT_SECRET
   # Add other environment variables as needed
   ```

4. **Redeploy with environment variables:**
   ```bash
   vercel --prod
   ```

### API Endpoints

After deployment, your API will be available at:
- Base URL: `https://your-project-name.vercel.app`
- Health Check: `https://your-project-name.vercel.app/api/health`
- API Documentation: `https://your-project-name.vercel.app/api-docs`

Available endpoints:
- `/api/users` - User management
- `/api/calculator` - Calculator operations
- `/api/graph` - Graph operations
- `/api/modules` - Module management
- `/api/questions` - Question management

### Development

For local development:
```bash
npm install
npm run dev
```

### Notes
- The API is configured to work with CORS for cross-origin requests
- Rate limiting is enabled (100 requests per 15 minutes per IP)
- Swagger documentation is available at `/api-docs`
- All routes are prefixed with `/api`