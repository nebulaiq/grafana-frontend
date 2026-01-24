# NebulaIQ Grafana Frontend Fork

This is a customized Grafana frontend for NebulaIQ Telemetry Dashboard.

## Project Location

This is a **subproject** within the NebulaIQ Telemetry Dashboard:

```
nebulaiq-telemetry-dashboard/           (Parent project)
├── grafana-frontend/                   (This project - Grafana fork)
├── grafana-app/                        (Custom NebulaIQ app plugin)
├── querier-datasource/                 (Custom datasource)
├── vertamedia-clickhouse-datasource/   (ClickHouse datasource)
├── nebulaiq-graph-panel/               (Custom panel plugin)
└── PHASE_*.md                          (Implementation guides)
```

**Path**: `/Users/shailendra/WS/nebulaiq/nebulaiq-telemetry-dashboard/grafana-frontend/`

## Overview

This fork is based on Grafana v11.5.0 and includes NebulaIQ-specific customizations for branding, navigation, and feature visibility.

## Quick Start

### Prerequisites

- Node.js >= v20.0.0
- Yarn >= 1.22.0
- Go >= 1.21
- Git
- Make

### Installation

**Option 1: Part of Telemetry Dashboard** (Recommended)
```bash
# If you already have the telemetry dashboard project
cd /path/to/nebulaiq-telemetry-dashboard

# Clone grafana-frontend as a subproject
git clone https://github.com/nebulaiq/grafana-frontend.git
cd grafana-frontend

# Checkout the nebulaiq-main branch
git checkout nebulaiq-main

# Install dependencies
yarn install
go mod download
```

**Option 2: Standalone Development**
```bash
# Clone independently (if working only on Grafana frontend)
git clone https://github.com/nebulaiq/grafana-frontend.git
cd grafana-frontend

# Checkout the nebulaiq-main branch
git checkout nebulaiq-main

# Install dependencies
yarn install
go mod download
```

### Development

```bash
# Start development server (http://localhost:3000)
yarn start

# The dev server includes hot reload
# Backend API calls will need a running Grafana backend instance
```

### Production Build

```bash
# Build production bundle
yarn build

# Output will be in public/build/ (~160MB)
```

## Customizations

### Current Customizations (Phase 1 Complete)

- ✅ Fork and setup complete
- ✅ Development environment configured
- ✅ Build process verified
- ✅ Branch strategy established

### Planned Customizations

- 🔄 **Custom Navigation** (Phase 2) - Replace left sidebar with NebulaIQ-specific MegaMenu
- 🔄 **Hidden Features** (Phase 3) - Remove/hide Explore, Alerting, and unnecessary admin pages
- 🔄 **NebulaIQ Branding** (Phase 4) - Apply NebulaIQ logos, colors, and custom theme
- 🔄 **Modern UI Design** (Phase 4.5) - DataDog/Apple-inspired design system
- 🔄 **Deployment** (Phase 5) - Production-ready Docker image and CI/CD

## Branch Strategy

```
upstream/v11.5.0          (Grafana official tag)
    │
    └─→ nebulaiq-main     (Production branch)
            │
            └─→ nebulaiq-dev           (Development branch)
                    │
                    ├─→ feature/custom-navigation
                    ├─→ feature/hide-features
                    └─→ feature/branding
```

### Branch Usage

- **nebulaiq-main** - Stable, production-ready code
- **nebulaiq-dev** - Active development branch
- **feature/*** - Feature-specific branches for each phase

### Workflow

1. Create feature branches from `nebulaiq-dev`
2. Develop and test in feature branches
3. Merge to `nebulaiq-dev` for integration testing
4. Merge to `nebulaiq-main` for production
5. Tag releases: `nebulaiq-v1.0.0`, `nebulaiq-v1.1.0`, etc.

## Upstream Grafana

### Base Version

- **Grafana Version**: v11.5.0
- **Upstream Repository**: https://github.com/grafana/grafana

### Keeping Up-to-Date

```bash
# Fetch upstream changes
git fetch upstream

# View upstream tags
git tag -l "v11.5.*"

# Merge upstream changes (quarterly)
git checkout nebulaiq-main
git merge upstream/v11.5.x
# Resolve conflicts if any
# Test thoroughly
# Push to origin
```

## Build Details

### Build Performance Baseline

- **Build Time**: ~2-3 minutes (production build)
- **Bundle Size**: ~160MB (including source maps)
- **Memory Usage**: ~8GB peak during build

### Build Commands

```bash
# Development build
yarn start

# Production build
yarn build

# Type checking
yarn typecheck

# Linting
yarn lint

# Tests
yarn test
```

## Architecture

### Modified Files

Phase 1 establishes the foundation. Future phases will modify:

- `public/app/core/components/AppChrome/MegaMenu/` - Custom navigation
- `public/app/routes/routes.tsx` - Route configuration
- `public/img/` - NebulaIQ logos and icons
- `public/sass/` - Custom theme and branding
- `Dockerfile.nebulaiq` - Custom Docker build
- `.github/workflows/` - CI/CD pipelines

### Build Output

```
public/build/
  ├── app.[hash].js         (~5MB compressed)
  ├── app.[hash].css        (~500KB)
  ├── [chunk].[hash].js     (code-split chunks)
  ├── vendor.[hash].js      (third-party libraries)
  └── *.map                 (source maps)
```

## Development Environment

### System Requirements

- **OS**: macOS, Linux, or Windows with WSL2
- **RAM**: 16GB minimum (build is memory-intensive)
- **Disk**: 10GB free space
- **Internet**: Fast connection for dependencies

### Environment Variables

```bash
# Increase Node.js memory for builds
export NODE_OPTIONS="--max-old-space-size=8192"
```

### Troubleshooting

#### Build fails with "JavaScript heap out of memory"

```bash
export NODE_OPTIONS="--max-old-space-size=8192"
yarn build
```

#### Hot reload not working

```bash
pkill -f node
rm -rf node_modules/.cache
yarn start
```

#### TypeScript errors after fresh clone

```bash
yarn install
rm -rf public/dist
yarn build:tsc
```

## Testing

### Development Testing

1. Start development server: `yarn start`
2. Access: http://localhost:3000
3. Default credentials: admin/admin

### Production Testing

1. Build production bundle: `yarn build`
2. Run with Grafana backend or Docker
3. Test all NebulaIQ-specific features

## Documentation

**Implementation Guides** (in parent project):
- [PHASE_1_FORK_AND_SETUP.md](../PHASE_1_FORK_AND_SETUP.md) - Setup guide
- [PHASE_2_CUSTOM_NAVIGATION.md](../PHASE_2_CUSTOM_NAVIGATION.md) - Navigation customization
- [PHASE_3_HIDE_FEATURES.md](../PHASE_3_HIDE_FEATURES.md) - Feature hiding
- [PHASE_4_BRANDING_THEME.md](../PHASE_4_BRANDING_THEME.md) - Branding guide
- [PHASE_5_BUILD_DEPLOY.md](../PHASE_5_BUILD_DEPLOY.md) - Deployment guide
- [PHASE_6_MAINTENANCE.md](../PHASE_6_MAINTENANCE.md) - Maintenance procedures

**Project-Specific** (in this directory):
- [README.nebulaiq.md](README.nebulaiq.md) - This file
- [BUILD_BASELINE.md](BUILD_BASELINE.md) - Performance baseline
- [PHASE_1_VERIFICATION.md](PHASE_1_VERIFICATION.md) - Phase 1 completion checklist
- [.nebulaiq-versions](.nebulaiq-versions) - Build environment details

## Contributing

### Code Style

- Follow existing Grafana code conventions
- Use TypeScript for all new code
- Add comments for complex logic
- Run linting before committing

### Commit Messages

```bash
# Format: <type>(<scope>): <subject>

feat(navigation): Add NebulaIQ custom menu
fix(branding): Correct logo positioning
docs(readme): Update build instructions
```

### Pull Requests

1. Create feature branch from `nebulaiq-dev`
2. Make changes and test thoroughly
3. Create PR to `nebulaiq-dev`
4. Request review
5. Merge after approval

## Deployment

### Docker Build

```bash
# Build custom Docker image (Phase 5)
docker build -t nebulaiq-grafana-frontend:latest -f Dockerfile.nebulaiq .

# Run container
docker run -p 3000:3000 nebulaiq-grafana-frontend:latest
```

### CI/CD

GitHub Actions workflows will be configured in Phase 5 for:
- Automated testing
- Production builds
- Docker image creation
- Deployment to staging/production

## Maintenance

### Quarterly Upstream Sync

1. Review Grafana release notes
2. Test upstream changes in isolated branch
3. Merge and resolve conflicts
4. Test all NebulaIQ customizations
5. Update dependencies
6. Tag new release

### Monitoring

- Track bundle size changes
- Monitor build performance
- Review security updates
- Test browser compatibility

## Support

### Issues

Report issues at: https://github.com/nebulaiq/grafana-frontend/issues

### Questions

For questions about:
- **Setup**: See PHASE_1_FORK_AND_SETUP.md
- **Customization**: See respective phase documentation
- **Deployment**: See PHASE_5_BUILD_DEPLOY.md
- **Maintenance**: See PHASE_6_MAINTENANCE.md

## License

This is a fork of Grafana, which is licensed under AGPL-3.0.
See the original LICENSE file for details.

## Version History

- **v1.0.0** (Phase 1) - Initial fork and setup (2026-01-24)
  - Based on Grafana v11.5.0
  - Development environment established
  - Build process verified
  - Branch strategy implemented

---

**Status**: Phase 1 Complete ✅
**Next Phase**: Phase 2 - Custom Navigation
**Maintained By**: NebulaIQ Engineering Team
**Last Updated**: 2026-01-24
