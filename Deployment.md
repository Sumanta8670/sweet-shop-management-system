# Deployment Guide – Sweet Shop Management System

## Production Deployment

This guide describes how to deploy the Sweet Shop Management System to production using **Render** for the backend and **Netlify** for the frontend.

---

## Prerequisites

* GitHub account with the repository pushed
* Render account (render.com)
* Netlify account (netlify.com)
* PostgreSQL database (provided by Render)

---

## Backend Deployment on Render

### Step 1: Create a PostgreSQL Database

1. Open the **Render Dashboard**
2. Click **New + → PostgreSQL**
3. Configure the database:

   * **Name**: `sweet-shop-db`
   * **Database**: `sweet_shop_db`
   * **User**: `postgres`
   * **Region**: Closest to your users
   * **Plan**: Free tier
4. Click **Create Database**
5. Wait for initialization to complete
6. Copy and save the **Internal Database URL**

---

### Step 2: Deploy the Backend Service

1. In the Render dashboard, click **New + → Web Service**

2. Connect your GitHub repository

3. Configure the service:

   * **Name**: `sweet-shop-api`
   * **Runtime**: Java
   * **Build Command**: `cd backend && mvn clean install -q`
   * **Start Command**: `cd backend && mvn spring-boot:run`
   * **Region**: Same as database
   * **Plan**: Free tier

4. Add the following **Environment Variables**:

```
DATABASE_URL=<your-postgres-internal-url>
JWT_SECRET=<secure-random-string>
JAVA_TOOL_OPTIONS=-Dspring.profiles.active=prod
```

5. Click **Create Web Service**
6. Wait for deployment (5–10 minutes)
7. Note the backend service URL (example: [https://sweet-shop-api.onrender.com](https://sweet-shop-api.onrender.com))

---

### Step 3: Verify Backend Deployment

Test the backend API:

```bash
curl https://sweet-shop-api.onrender.com/api/sweets
```

Expected response:

```
[]
```

---

## Frontend Deployment on Netlify

### Step 1: Deploy the Frontend

1. Open the **Netlify Dashboard**

2. Click **Add new site → Import an existing project**

3. Select **GitHub** and authorize access

4. Choose your repository

5. Configure build settings:

   * **Base directory**: `frontend`
   * **Build command**: `npm run build`
   * **Publish directory**: `frontend/dist`

6. Add the following **Environment Variable**:

```
VITE_API_URL=<your-render-backend-url>/api
```

7. Click **Deploy site**
8. Wait for deployment (2–3 minutes)
9. Access the site at: `https://<random>.netlify.app`

---

### Step 2: Configure a Custom Domain (Optional)

1. Open **Site settings → Domain management**
2. Add your custom domain
3. Follow the DNS configuration instructions provided by Netlify

---

## Post-Deployment Tasks

### Step 1: Create an Admin User

If direct DB access is required, update the user role via SQL:

```sql
UPDATE users SET role = 'ADMIN' WHERE username = 'your_username';
```

---

### Step 2: Test API Endpoints

**Register User**

```bash
curl -X POST https://sweet-shop-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "securepass123"
  }'
```

**Login User**

```bash
curl -X POST https://sweet-shop-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "securepass123"
  }'
```

**Fetch Sweets**

```bash
curl https://sweet-shop-api.onrender.com/api/sweets
```

---

## Monitoring and Logs

### Backend Logs (Render)

* Open the service dashboard
* Navigate to the **Logs** tab
* View real-time log output

### Frontend Logs (Netlify)

* Open **Deploys** section
* Select a deployment to view logs
* Check browser console for client-side errors

---

## Continuous Deployment

Both platforms support automatic deployments:

* **Render**: Redeploys automatically on push to the `main` branch
* **Netlify**: Redeploys automatically on push to the `main` branch

---

## Environment Configuration

### Development Environment

```
Backend:  http://localhost:8080/api
Frontend: http://localhost:5173
```

### Production Environment

```
Backend:  https://sweet-shop-api.onrender.com/api
Frontend: https://sweet-shop-frontend.netlify.app
```

---

## Troubleshooting

### Backend Deployment Issues

1. Check Render logs
2. Verify Java version (17+ required)
3. Validate `pom.xml` dependencies
4. Confirm `DATABASE_URL` configuration

### Frontend Build Failures

1. Clear Netlify cache and redeploy
2. Verify Node.js version (18+ required)
3. Confirm `VITE_API_URL` value
4. Check `package.json` dependencies

### API Communication Errors

1. Validate CORS configuration
2. Ensure `JWT_SECRET` is set
3. Match frontend API URL with backend
4. Inspect browser console errors

### Database Connection Problems

1. Verify database URL format
2. Check credentials
3. Confirm database service is running
4. Test the connection locally

---

## Scaling Recommendations

### Horizontal Scaling

* Render: Increase replicas via paid plans
* Netlify: Automatic scaling by default

### Vertical Scaling

* Upgrade PostgreSQL resources
* Increase backend memory allocation

### Caching

* Introduce Redis for caching
* Use CDN for static frontend assets

---

## Security Checklist

* [ ] Strong JWT secret (32+ characters)
* [ ] Secure database credentials
* [ ] No sensitive data in logs
* [ ] HTTPS enabled
* [ ] Proper CORS configuration
* [ ] Authentication for protected routes
* [ ] Restricted admin access
* [ ] Input validation enabled
* [ ] Debug mode disabled in production

---

## Backup Strategy

### Database Backups

* Automated backups via Render (paid plans)
* Manual backups using `pg_dump` or pgAdmin

### Code Backups

* GitHub as primary repository
* Release tagging for version history

---

## Performance Optimization

### Backend

* Enable JPA query caching
* Add database indexes
* Monitor slow queries

### Frontend

* Lazy load components
* Optimize images and assets
* Serve static files via CDN

---

## Cost Estimation

### Free Tier (Learning Setup)

* Render Web Service: Free
* Render PostgreSQL: Free (limited)
* Netlify: Free tier
* **Total Cost**: $0/month

### Production Tier

* Render Web Service: $12.50/month
* Render PostgreSQL: $15/month
* Netlify Pro: $19/month
* **Total Cost**: ~$46.50/month

---

## Support and Resources

* Render Docs: [https://render.com/docs](https://render.com/docs)
* Netlify Docs: [https://docs.netlify.com](https://docs.netlify.com)
* Spring Boot: [https://spring.io/projects/spring-boot](https://spring.io/projects/spring-boot)
* React: [https://react.dev](https://react.dev)
