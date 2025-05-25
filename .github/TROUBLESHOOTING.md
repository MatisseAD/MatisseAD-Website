# 🔧 Troubleshooting Guide

## Common Deployment Issues

### 1. Dependency Conflicts (ERESOLVE errors)

**Problem**: npm cannot resolve dependency conflicts between packages.

**Solution**: The workflow now includes:
- `--legacy-peer-deps` flag for npm install
- Automatic cleanup of conflicting dependencies
- Package overrides in package.json

**Manual Fix**:
\`\`\`bash
# Clear npm cache
npm cache clean --force

# Install with legacy peer deps
npm install --legacy-peer-deps

# Or use force flag
npm install --force
\`\`\`

### 2. Missing Lock Files

**Problem**: GitHub Actions cannot find package-lock.json or yarn.lock.

**Solution**: The workflow automatically detects available package managers and falls back appropriately.

**Manual Fix**:
\`\`\`bash
# Generate lock file
npm install
# or
yarn install
\`\`\`

### 3. Build Failures

**Problem**: Next.js build fails during GitHub Actions.

**Common Causes**:
- TypeScript errors
- Missing environment variables
- Dependency conflicts
- Memory issues

**Solutions**:
- Check build logs in GitHub Actions
- Verify environment variables are set
- Test build locally: `npm run build`

### 4. Environment Variables

**Problem**: Environment variables not available during build.

**Solution**:
1. Add secrets in GitHub repository settings
2. Reference them in the workflow file
3. Ensure they're prefixed with `NEXT_PUBLIC_` for client-side use

### 5. Static Export Issues

**Problem**: Features requiring server-side functionality don't work.

**Solution**:
- Use `output: 'export'` in next.config.js
- Disable image optimization
- Avoid server-side features in static export

## Debug Steps

1. **Check GitHub Actions Logs**:
   - Go to Actions tab in your repository
   - Click on the failed workflow run
   - Expand the failed step to see detailed logs

2. **Test Locally**:
   \`\`\`bash
   npm install
   npm run build
   npm run start
   \`\`\`

3. **Clear Caches**:
   \`\`\`bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   \`\`\`

4. **Check Dependencies**:
   \`\`\`bash
   npm ls
   npm audit
   \`\`\`

## Environment Setup

### Required Files
- `package.json` - Project dependencies
- `next.config.mjs` - Next.js configuration
- `.npmrc` - npm configuration for dependency resolution

### Optional Files
- `package-lock.json` - Dependency lock file
- `yarn.lock` - Yarn lock file
- `.env.local` - Local environment variables

## Performance Tips

1. **Enable Caching**: The workflow caches dependencies and build artifacts
2. **Optimize Dependencies**: Remove unused packages
3. **Use CDN**: For large assets, consider using a CDN
4. **Minimize Bundle**: Use dynamic imports for large components

## Getting Help

If you're still experiencing issues:

1. Check the [GitHub Actions documentation](https://docs.github.com/en/actions)
2. Review [Next.js deployment docs](https://nextjs.org/docs/deployment)
3. Search for similar issues in the repository
4. Create an issue with:
   - Error logs
   - Steps to reproduce
   - Environment details
