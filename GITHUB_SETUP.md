# GitHub Setup Guide

This guide will help you upload the Academic Timetable Platform to GitHub.

## Prerequisites

- GitHub account ([create one here](https://github.com/signup))
- Git installed on your computer
- Access to the project directory

## Step 1: Create a New Repository on GitHub

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `academic-timetable-platform` (or your preferred name)
   - **Description**: "Intelligent Academic Timetable Optimization Platform with React, TypeScript, and Supabase"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## Step 2: Link Your Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your project directory:

```bash
# Add the remote repository
git remote add origin https://github.com/yourusername/academic-timetable-platform.git

# Push your code to GitHub
git push -u origin main
```

Replace `yourusername` with your actual GitHub username.

## Step 3: Verify Upload

1. Refresh your GitHub repository page
2. You should see all your project files
3. The README.md will be displayed on the repository homepage

## Step 4: Set Up GitHub Repository Settings (Optional)

### Add Topics
Add topics to make your repository discoverable:
- Go to your repository
- Click the gear icon next to "About"
- Add topics: `react`, `typescript`, `supabase`, `timetable`, `scheduling`, `optimization`, `education`

### Add Repository Description
In the same "About" section, add:
- Description: "Intelligent Academic Timetable Optimization Platform"
- Website: Your deployment URL (if you deploy it)

### Enable GitHub Pages (Optional)
If you want to host a demo:
1. Go to Settings > Pages
2. Select branch `main` and folder `/dist` (after building)
3. Click Save

## Step 5: Protect Your Environment Variables

**IMPORTANT**: Never commit your `.env` file with real credentials!

The `.gitignore` file already excludes `.env`, but double-check:
```bash
# Verify .env is not tracked
git status
```

If you see `.env` in the list, remove it:
```bash
git rm --cached .env
git commit -m "Remove .env from tracking"
git push
```

## Step 6: Add Collaborators (Optional)

To add team members:
1. Go to Settings > Collaborators
2. Click "Add people"
3. Enter their GitHub username or email
4. Choose their permission level

## Common Git Commands for Future Updates

```bash
# Check status of your files
git status

# Add all changed files
git add .

# Commit changes
git commit -m "Your commit message describing the changes"

# Push to GitHub
git push origin main

# Pull latest changes from GitHub
git pull origin main

# Create a new branch
git checkout -b feature-branch-name

# Switch between branches
git checkout main
git checkout feature-branch-name

# Merge a branch into main
git checkout main
git merge feature-branch-name
```

## Deployment Options

After uploading to GitHub, you can deploy your application:

### Option 1: Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
6. Deploy

### Option 2: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click "Add new site" > "Import an existing project"
4. Choose your repository
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Add environment variables
8. Deploy

### Option 3: GitHub Pages
1. Build your project: `npm run build`
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add to package.json scripts:
   ```json
   "deploy": "gh-pages -d dist"
   ```
4. Run: `npm run deploy`

## Troubleshooting

### Authentication Error
If you get an authentication error when pushing:
1. Use Personal Access Token instead of password
2. Go to GitHub Settings > Developer settings > Personal access tokens
3. Generate new token with `repo` scope
4. Use token as password when pushing

### Large File Error
If files are too large:
1. Check what's being committed: `git status`
2. Ensure `node_modules` and `dist` are in `.gitignore`
3. Remove them if tracked: `git rm -r --cached node_modules dist`

### Remote Already Exists
If you get "remote origin already exists":
```bash
git remote remove origin
git remote add origin https://github.com/yourusername/academic-timetable-platform.git
```

## Support

If you encounter issues:
- Check [GitHub Docs](https://docs.github.com)
- Review the project README.md
- Check Supabase setup in the project documentation

## Next Steps

After uploading to GitHub:
1. Set up CI/CD (GitHub Actions)
2. Add a CONTRIBUTING.md file
3. Set up issue templates
4. Add a LICENSE file
5. Create a project wiki
6. Set up GitHub Discussions for community support

---

**Note**: Remember to keep your Supabase credentials secure and never commit them to the repository!
