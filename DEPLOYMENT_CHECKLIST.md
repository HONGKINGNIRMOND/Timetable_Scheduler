# Deployment Checklist

Use this checklist to ensure your Academic Timetable Platform is properly deployed.

## Pre-Deployment Checklist

### 1. Code Preparation
- [x] All dependencies installed (`npm install` completed)
- [x] Project builds successfully (`npm run build` works)
- [x] .env file excluded from Git (in .gitignore)
- [x] .env.example created with placeholder values
- [x] README.md updated with setup instructions
- [x] All TypeScript errors resolved

### 2. Supabase Setup
- [ ] Supabase project created
- [ ] Database migrations run in correct order:
  - [ ] 20250927050120_yellow_pine.sql
  - [ ] 20250927050135_navy_moon.sql
  - [ ] 20250927050637_shrill_scene.sql
  - [ ] 20250927051324_misty_bonus.sql
  - [ ] 20250930121128_floating_brook.sql
  - [ ] 20250930122142_maroon_thunder.sql
- [ ] Row Level Security (RLS) policies verified
- [ ] Authentication settings configured
- [ ] API keys copied (URL and Anon Key)

### 3. GitHub Repository
- [ ] Repository created on GitHub
- [ ] Local repository initialized
- [ ] All files committed to Git
- [ ] Repository pushed to GitHub
- [ ] Repository description added
- [ ] Topics/tags added for discoverability
- [ ] .env file NOT in repository (verify!)

## Deployment Options

Choose one or more deployment platforms:

### Option A: Vercel (Recommended for React/Vite)

**Steps:**
1. [ ] Sign up/Login to [vercel.com](https://vercel.com)
2. [ ] Click "New Project"
3. [ ] Import GitHub repository
4. [ ] Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
5. [ ] Add environment variables:
   - [ ] `VITE_SUPABASE_URL`
   - [ ] `VITE_SUPABASE_ANON_KEY`
6. [ ] Click "Deploy"
7. [ ] Wait for deployment to complete
8. [ ] Test deployed application
9. [ ] Configure custom domain (optional)

**Vercel Benefits:**
- Automatic deployments on Git push
- Built-in CI/CD
- Free SSL certificates
- Global CDN
- Excellent React/Vite support

### Option B: Netlify

**Steps:**
1. [ ] Sign up/Login to [netlify.com](https://netlify.com)
2. [ ] Click "Add new site" → "Import an existing project"
3. [ ] Connect to GitHub
4. [ ] Select repository
5. [ ] Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. [ ] Add environment variables:
   - [ ] `VITE_SUPABASE_URL`
   - [ ] `VITE_SUPABASE_ANON_KEY`
7. [ ] Click "Deploy site"
8. [ ] Test deployed application
9. [ ] Configure custom domain (optional)

**Netlify Benefits:**
- Simple deployment process
- Form handling
- Serverless functions
- Analytics (paid)

### Option C: GitHub Pages (Static Hosting)

**Steps:**
1. [ ] Install gh-pages: `npm install --save-dev gh-pages`
2. [ ] Add deploy script to package.json:
   ```json
   "deploy": "gh-pages -d dist"
   ```
3. [ ] Build project: `npm run build`
4. [ ] Deploy: `npm run deploy`
5. [ ] Enable GitHub Pages in repository settings
6. [ ] Configure custom domain (optional)

**Note:** Environment variables need to be hardcoded for GitHub Pages (not recommended for production with sensitive data).

## Post-Deployment Checklist

### 1. Functional Testing
- [ ] Application loads without errors
- [ ] Login page displays correctly
- [ ] Admin login works (test credentials)
- [ ] Student signup works
- [ ] Timetable generator loads
- [ ] Custom time slots display correctly
- [ ] Lunch hour settings work (11:30-12:20)
- [ ] Date range selection works
- [ ] Timetable preview opens
- [ ] PDF export works without watermark
- [ ] PDF download contains correct information
- [ ] All navigation links work

### 2. Authentication Testing
- [ ] User can sign up
- [ ] User can log in
- [ ] User can log out
- [ ] Protected routes are secured
- [ ] Role-based access works (admin vs student)

### 3. Database Testing
- [ ] Departments load correctly
- [ ] Classrooms display properly
- [ ] Subjects are fetched
- [ ] Faculty data appears
- [ ] Batches load for selected department
- [ ] Time slots are configured correctly
- [ ] Timetable saves to database
- [ ] Data persists after refresh

### 4. Performance Testing
- [ ] Page load time is acceptable (<3 seconds)
- [ ] Images/assets load quickly
- [ ] No console errors in browser
- [ ] Mobile responsive design works
- [ ] Forms are responsive and quick

### 5. Security Verification
- [ ] Environment variables are secure
- [ ] .env file is NOT in repository
- [ ] API keys are not exposed in client code
- [ ] RLS policies are active in Supabase
- [ ] Authentication is required for protected routes
- [ ] CORS is properly configured

## Monitoring & Maintenance

### Set Up Monitoring
- [ ] Add error tracking (Sentry, LogRocket, etc.)
- [ ] Set up uptime monitoring
- [ ] Configure performance monitoring
- [ ] Set up database backups in Supabase

### Documentation
- [ ] Update README with deployment URL
- [ ] Document admin credentials (securely)
- [ ] Create user guide for end users
- [ ] Document API endpoints if any
- [ ] Add troubleshooting section

### Team Setup
- [ ] Add collaborators to GitHub repo
- [ ] Share deployment credentials (securely)
- [ ] Set up team communication channel
- [ ] Create issue templates
- [ ] Set up project board for tasks

## Troubleshooting Common Issues

### Build Fails
- Check Node.js version (should be 16+)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Restart development server after adding variables
- Check spelling of variable names
- Verify variables are added in deployment platform

### Supabase Connection Issues
- Verify Supabase URL is correct
- Check anon key is valid
- Ensure migrations were run
- Check RLS policies are not blocking access

### Authentication Problems
- Clear browser cache and cookies
- Check Supabase Auth settings
- Verify RLS policies allow user registration
- Check email confirmation settings

## Success Criteria

Your deployment is successful when:
- ✓ Application is accessible via public URL
- ✓ Users can register and log in
- ✓ Timetables can be generated
- ✓ PDF exports work correctly
- ✓ No critical errors in console
- ✓ Mobile view works properly
- ✓ Data persists in Supabase

## Next Steps After Deployment

1. [ ] Share application URL with stakeholders
2. [ ] Gather user feedback
3. [ ] Monitor application performance
4. [ ] Plan feature enhancements
5. [ ] Set up regular backups
6. [ ] Document known issues
7. [ ] Create roadmap for future development

---

**Need Help?**
- Check README.md for detailed setup instructions
- Review GITHUB_SETUP.md for repository management
- Visit Supabase documentation: https://supabase.com/docs
- Check Vercel documentation: https://vercel.com/docs
- Check Netlify documentation: https://docs.netlify.com

**Support:**
- Create an issue in the GitHub repository
- Check project documentation
- Review error logs in deployment platform
