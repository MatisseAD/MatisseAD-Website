# 🚀 Deployment Guide

This repository is automatically deployed to GitHub Pages using GitHub Actions.

## 📋 Prerequisites

1. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Set Source to "GitHub Actions"

2. **Set up environment variables** (if needed):
   - Go to Settings → Secrets and variables → Actions
   - Add any required secrets for your application

## 🔧 Configuration

### Environment Variables

The following environment variables can be configured:

- `CUSTOM_KEY`: Your custom application key (required)
- `NEXT_PUBLIC_API_URL`: Public API URL for client-side requests
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- Add your custom variables in the workflow file

**To add environment variables:**

1. Go to Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add the following secrets:
   - `CUSTOM_KEY`: Your custom key value
   - Any other required secrets for your application

### Base Path Configuration

If your repository name is not your GitHub username, uncomment and modify the `basePath` in `next.config.mjs`:

\`\`\`javascript
basePath: '/your-repo-name',
\`\`\`

## 🚀 Deployment Process

The deployment happens automatically when:

1. Code is pushed to the `main` branch
2. A pull request is merged to `main`
3. Manual trigger via GitHub Actions tab

### Workflow Steps

1. **Build Phase**:
   - Checkout code
   - Setup Node.js and cache dependencies
   - Install dependencies
   - Run linting and tests
   - Build Next.js application
   - Generate static assets

2. **Deploy Phase**:
   - Deploy to GitHub Pages
   - Update deployment status

## 📊 Monitoring

- Check the **Actions** tab for deployment status
- View build logs for debugging
- Monitor deployment summaries in the workflow runs

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are properly installed
   - Review build logs for specific errors

2. **Deployment Failures**:
   - Ensure GitHub Pages is enabled
   - Check repository permissions
   - Verify workflow permissions

3. **Runtime Errors**:
   - Check browser console for client-side errors
   - Verify API endpoints are accessible
   - Check environment variable configuration

### Debug Steps

1. Check the Actions tab for detailed logs
2. Review the build summary in the workflow run
3. Test the build locally with `npm run build`
4. Verify environment variables are properly set

## 🔄 Manual Deployment

To trigger a manual deployment:

1. Go to the Actions tab
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

## 📈 Performance Optimization

The workflow includes several optimizations:

- **Dependency Caching**: Speeds up builds by caching node_modules
- **Build Caching**: Caches Next.js build artifacts
- **Compression**: Enables gzip compression
- **Image Optimization**: Disabled for static export compatibility
- **Bundle Analysis**: Optimized webpack configuration

## 🔒 Security

Security headers are configured in `next.config.mjs`:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## 📝 Customization

To customize the deployment:

1. Modify `.github/workflows/deploy.yml`
2. Update `next.config.mjs` for Next.js configuration
3. Add environment variables in GitHub repository settings
4. Configure custom domains in GitHub Pages settings
