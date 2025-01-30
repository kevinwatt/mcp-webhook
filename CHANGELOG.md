# Changelog

## [0.1.0] - 2025-01-26

### Added
- Initial release
- Basic Discord webhook functionality
- Support for sending messages with custom username and avatar
- Multilingual documentation (English and Japanese)
- Automated publishing workflow with GitHub Actions

### CI/CD Setup Instructions

1. Generate an NPM access token:
   - Go to npmjs.com
   - Visit Account Settings > Access Tokens
   - Generate a new automation token

2. Add the NPM token to GitHub repository secrets:
   - Go to your GitHub repository settings
   - Navigate to Settings > Secrets and variables > Actions
   - Select "Repository secrets" (not Environment secrets)
   - Create a new secret named `NPM_TOKEN` with your NPM access token
   
   Note: Use Repository secrets instead of Environment secrets because:
   - NPM publishing needs to work across all environments
   - The token is used for package publishing, not environment-specific deployments
   - We want the automation to work for all branches and tags

3. Configure GitHub Actions:
   - Create `.github/workflows/publish.yml`
   - Set up Node.js environment
   - Configure NPM authentication using the repository secret
   - Add build and publish steps
   - Configure release creation
   - Set up tag-based triggers

4. Publishing workflow:
   - Update version in package.json
   - Create and push a new tag: `git tag v0.1.0 && git push origin v0.1.0`
   - GitHub Actions will automatically:
     - Build the package
     - Run tests
     - Publish to NPM
     - Create a GitHub release