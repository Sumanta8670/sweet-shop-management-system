# Deployment Guide - Sweet Shop Management System

## Production Deployment

This guide covers deploying the Sweet Shop Management System to production using Render (backend) and Netlify (frontend).

## Prerequisites

- GitHub account with the repository pushed
- Render account (render.com)
- Netlify account (netlify.com)
- PostgreSQL database (Render provides)

## Backend Deployment on Render

### Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://render.com)
2. Click "New +" → "PostgreSQL"
3. Fill in the following:
    - Name: `sweet-shop-db`
    - Database: `sweet_shop_db`
    - User: `postgres`
    - Region: Select closest to your users
    - Free tier is available
4. Click "Create Database"
5. Wait for database to initialize
6. Note down the Internal Database URL

### Step 2: Deploy Backend Service

1. In Render dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Fill in configuration:
    - **Name**: `sweet-shop-api`
    - **Runtime**: Java
    - **Build Command**: `cd backend && mvn clean install -q`
    - **Start Command**: `cd backend && mvn spring-boot:run`
    - **Region**: Same as database
    - **Plan**: Free tier available

4. Add Environment Variables:
```
   DATABASE_URL=<your-postgres-internal-url>
   JWT_SECRET=<generate-a-secure-random-string>
   JAVA_TOOL_OPTIONS=-Dspring.profiles.active=prod

Click "Create Web Service"
Wait for deployment (5-10 minutes)
Note down the service URL (e.g., https://sweet-shop-api.onrender.com)

Step 3: Verify Backend
bash# Test the API
curl https://sweet-shop-api.onrender.com/api/sweets

# Should return empty array: []
```

## Frontend Deployment on Netlify

### Step 1: Deploy to Netlify

1. Go to [Netlify Dashboard](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Select GitHub and authorize
4. Select your repository
5. Fill in configuration:
    - **Base directory**: `frontend`
    - **Build command**: `npm run build`
    - **Publish directory**: `frontend/dist`

6. Add Environment Variables:
```
   VITE_API_URL=<your-render-backend-url>/api

Click "Deploy site"
Wait for deployment (2-3 minutes)
Your site will be available at https://<random>.netlify.app

Step 2: Configure Custom Domain (Optional)

In Netlify site settings, go to "Domain management"
Add your custom domain
Follow DNS configuration instructions

Post-Deployment
1. Create Admin User
Since you can't access the database directly, create an admin user and update via database UI:
sql-- Connect to your PostgreSQL database
UPDATE users SET role = 'ADMIN' WHERE username = 'your_username';
2. Test Endpoints
bash# Register
curl -X POST https://sweet-shop-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "securepass123"
  }'

# Login
curl -X POST https://sweet-shop-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "securepass123"
  }'

# Get sweets
curl https://sweet-shop-api.onrender.com/api/sweets
```

### 3. Monitor Logs

**Render Backend Logs:**
- Go to service → "Logs" tab
- Real-time log streaming

**Netlify Frontend Logs:**
- Go to site → "Deploys"
- Click on a deploy for logs
- Check browser console for client errors

## Continuous Deployment

Both Render and Netlify support automatic deployments:

- **Render**: Automatically redeploys on push to main branch
- **Netlify**: Automatically redeploys on push to main branch

## Environment-Specific Configurations

### Development
```
Backend: http://localhost:8080/api
Frontend: http://localhost:5173
```

### Production
```
Backend: https://sweet-shop-api.onrender.com/api
Frontend: https://sweet-shop-frontend.netlify.app
```

## Troubleshooting

### Backend Won't Deploy
1. Check GitHub Actions logs
2. Verify Java version (must be 17+)
3. Check pom.xml dependencies
4. Ensure DATABASE_URL is correct

### Frontend Build Fails
1. Clear Netlify cache and redeploy
2. Check Node.js version (must be 18+)
3. Verify VITE_API_URL is set correctly
4. Check package.json dependencies

### API Calls Failing
1. Check CORS configuration in SecurityConfig
2. Verify JWT_SECRET is set
3. Check frontend VITE_API_URL matches backend
4. Look at browser console for CORS errors

### Database Connection Issues
1. Verify DATABASE_URL format
2. Check database credentials
3. Ensure database is running
4. Test connection string locally first

## Scaling Recommendations

### Horizontal Scaling
- Render: Upgrade plan to add replicas
- Netlify: Auto-scales based on load

### Vertical Scaling
- Database: Upgrade PostgreSQL plan for more RAM/storage
- Backend: Upgrade Java memory allocation

### Caching
- Add Redis for session caching
- Implement CDN for static frontend assets

## Security Checklist

- [ ] JWT_SECRET is long and random (32+ characters)
- [ ] Database password is strong
- [ ] No sensitive data in logs
- [ ] HTTPS enabled (automatic on both platforms)
- [ ] CORS properly configured
- [ ] Authentication required for protected endpoints
- [ ] Admin role properly restricted
- [ ] Input validation on all endpoints
- [ ] No debug mode in production

## Backup Strategy

### Database Backups
- Render provides daily automated backups (paid plans)
- Manual export: Use pgAdmin or pg_dump

### Code Backups
- GitHub serves as primary backup
- Tag releases for version history

## Performance Optimization

### Backend
- Enable query caching in JPA
- Use database indexes on frequently queried fields
- Monitor slow queries in logs

### Frontend
- Lazy load React components
- Optimize images and assets
- Use CDN for static files

## Cost Estimation

### Free Tier (Recommended for Learning)
- Render Web Service: Free tier
- Render PostgreSQL: Free tier (limited)
- Netlify: Free tier with generous limits
- **Total Monthly Cost**: $0 USD

### Production Tier
- Render Web Service: $12.50/month
- Render PostgreSQL: $15/month
- Netlify Pro: $19/month
- **Total Monthly Cost**: ~$46.50 USD

## Support & Resources

- Render Documentation: https://render.com/docs
- Netlify Documentation: https://docs.netlify.com
- Spring Boot: https://spring.io/projects/spring-boot
- React: https://react.dev
