# Changelog

## [0.2.2] - 2025-04-11

### Added
- Added `send_json` tool to support richer webhook data transmission
- Automatically retrieve name and version information from package.json
- Added unit tests for validator functions

### Fixed
- Resolved merge conflicts

## [0.1.11] - 2025-02-13

### Added
- Added Dive Desktop configuration support
- Added MIT license

### Changed
- Version bumped to 0.1.11

## [0.1.10] - 2025-02-06

### Added
- Added Dive Desktop configuration

## [0.1.9] - 2025-01-30

### Added
- Added MCP server badge
- Updated README file
- Added Smithery configuration
- Added Dockerfile support

### Fixed
- Removed console.log debug messages

## [0.1.8] - 2025-01-29

### Added
- Updated keywords list

## [0.1.7] - 2025-01-29

### Changed
- Adjusted version number to 0.1.7

## [0.1.6] - 2025-01-28

### Added
- Optimized webhook request handling

## [0.1.5] - 2025-01-28

### Changed
- Version bumped to 0.1.5

## [0.1.4] - 2025-01-27

### Changed
- Version bumped to 0.1.4

## [0.1.3] - 2025-01-27

### Added
- Improved error handling mechanism

### Changed
- Version bumped to 0.1.3

## [0.1.2] - 2025-01-27

### Fixed
- Updated bin name in package-lock.json

## [0.1.1] - 2025-01-27

### Fixed
- Updated package bin name

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