# NebulaIQ Grafana Frontend - Build Performance Baseline

**Generated**: 2026-01-24
**Grafana Version**: v11.5.0
**System**: macOS (Apple Silicon M1/M2)

---

## Purpose

This document establishes performance baselines for the NebulaIQ Grafana frontend fork. These metrics help monitor and prevent performance degradation during customization phases.

---

## Build Performance

### Initial Build (Clean Install)

#### Dependency Installation
- **yarn install**: ~77 seconds
- **Node modules size**: ~273.72 MB
- **Total packages**: 2,798 packages
- **Go dependencies**: < 5 seconds

#### Production Build
- **Command**: `yarn build`
- **Total build time**: ~2-3 minutes
- **Main webpack compilation**: ~55 seconds
- **Dependent tasks**: 12 projects built in parallel

### Build Output

```
Total bundle size: ~160 MB (including source maps)

Key bundles:
├── app.[hash].js           ~5-6 MB
├── app.[hash].css          ~500 KB
├── runtime.[hash].js       ~50 KB
├── [chunks].[hash].js      Various sizes
└── *.map files             Source maps
```

### Memory Usage

- **Peak memory**: ~8 GB (with NODE_OPTIONS="--max-old-space-size=8192")
- **Recommended RAM**: 16 GB minimum
- **Disk space used**: ~10 GB (including node_modules and build output)

---

## Build Warnings

### Expected Warnings

#### Asset Size Warnings
Some plugins exceed the recommended 244 KiB limit:
- mysql plugin: 649 KiB (630.js)
- azure-monitor: 306 KiB (module.js)
- tempo: 3.14 MiB (2444.js)
- postgresql: 649 KiB (630.js)
- mssql: 538 KiB (module.js)

**Status**: These are expected for data source plugins with complex functionality.

#### Browserslist Warning
```
Browserslist: browsers data (caniuse-lite) is 13 months old
```

**Status**: Not critical for Phase 1. Will update in future phases if needed.

---

## Performance Monitoring

### Metrics to Track

1. **Build Time**
   - Target: < 3 minutes
   - Alert if: > 5 minutes

2. **Bundle Size**
   - Target: < 200 MB (with maps)
   - Alert if: > 250 MB

3. **Memory Usage**
   - Target: < 8 GB peak
   - Alert if: > 10 GB peak

4. **Dependency Count**
   - Target: < 3,000 packages
   - Alert if: > 3,500 packages

---

## Build Optimization Notes

### Current Optimizations

1. **NODE_OPTIONS** set to `--max-old-space-size=8192`
2. **Webpack** using esbuild-loader for faster compilation
3. **Nx** for efficient monorepo builds with caching
4. **Code splitting** enabled for better lazy loading

### Potential Future Optimizations

1. **Reduce plugin bundle sizes** (if possible)
2. **Update browserslist data** for better browser targeting
3. **Enable Webpack 5 persistent caching** for faster rebuilds
4. **Consider vite/rspack** migration (long-term)

---

## Development Build Performance

### Dev Server Startup

**Note**: Not tested in Phase 1. Will be documented in Phase 2.

Expected metrics:
- Startup time: ~30-60 seconds
- Hot reload: < 5 seconds
- Memory usage: ~6-8 GB

---

## Baseline Test Results

### ✅ Phase 1 Verification

| Test | Status | Notes |
|------|--------|-------|
| Fork created | ✅ PASS | nebulaiq/grafana-frontend |
| Clone successful | ✅ PASS | All files present |
| Dependencies installed | ✅ PASS | yarn + go deps |
| Production build | ✅ PASS | Completed in ~2-3 min |
| Build output verified | ✅ PASS | 160 MB in public/build/ |
| No critical errors | ✅ PASS | Only expected warnings |
| Branches created | ✅ PASS | nebulaiq-main, nebulaiq-dev, features |
| Documentation | ✅ PASS | README, versions, baseline |

---

## Comparison with Upstream

### Grafana v11.5.0 (Upstream)

| Metric | Upstream | NebulaIQ Fork | Delta |
|--------|----------|---------------|-------|
| Build time | ~2-3 min | ~2-3 min | 0% |
| Bundle size | ~160 MB | ~160 MB | 0% |
| Dependencies | 2,798 | 2,798 | 0 |
| Memory usage | ~8 GB | ~8 GB | 0% |

**Status**: Identical to upstream as expected for Phase 1 (no customizations yet).

---

## Expected Changes by Phase

### Phase 2: Custom Navigation
- Bundle size: +5-10 MB (new components)
- Build time: +10-20 seconds
- Memory: No change expected

### Phase 3: Hide Features
- Bundle size: -20-50 MB (removed features)
- Build time: -20-30 seconds
- Memory: -1-2 GB

### Phase 4: Branding & Theme
- Bundle size: +5-10 MB (assets, custom styles)
- Build time: +10-15 seconds
- Memory: No change expected

### Phase 4.5: Modern UI Design
- Bundle size: +10-20 MB (design system components)
- Build time: +20-30 seconds
- Memory: No change expected

---

## Troubleshooting Performance Issues

### Build Too Slow (> 5 minutes)

1. **Check available RAM**: `top` or Activity Monitor
   - Need 16 GB with 8 GB available

2. **Increase Node memory**:
   ```bash
   export NODE_OPTIONS="--max-old-space-size=8192"
   ```

3. **Clear caches**:
   ```bash
   rm -rf node_modules/.cache
   rm -rf .nx/cache
   ```

4. **Check disk space**:
   ```bash
   df -h
   # Need at least 10 GB free
   ```

### Bundle Too Large (> 250 MB)

1. **Analyze bundle**:
   ```bash
   yarn build --stats
   npx webpack-bundle-analyzer public/build/stats.json
   ```

2. **Check for duplicate dependencies**:
   ```bash
   yarn list --pattern [dependency-name]
   ```

3. **Review custom code**:
   - Remove unused imports
   - Use dynamic imports for large modules
   - Check for accidental vendor bundle inclusion

---

## CI/CD Considerations (Phase 5)

### Build Environment Requirements

- **CPU**: 4+ cores recommended
- **RAM**: 16 GB minimum
- **Disk**: 20 GB minimum (for build + cache)
- **Network**: Fast (for npm registry)

### Expected CI Build Times

- **With warm cache**: ~2-3 minutes
- **Without cache**: ~4-5 minutes
- **Full clean build**: ~5-7 minutes

---

## Monitoring & Alerts

### Build Health Checks

```bash
# Check bundle size
du -sh public/build/

# Verify no errors in build log
grep -i "error" build.log

# Check memory usage during build
# (requires running build with monitoring)
```

### Automated Checks (Future)

- [ ] Bundle size regression test
- [ ] Build time performance test
- [ ] Memory usage monitoring
- [ ] Lighthouse performance scores
- [ ] Bundle analyzer in CI

---

## Conclusion

Phase 1 baseline established successfully. All metrics match upstream Grafana v11.5.0 as expected. This provides a solid foundation for tracking performance impact of upcoming customizations.

### Key Metrics Summary

- ✅ Build time: **2-3 minutes**
- ✅ Bundle size: **160 MB**
- ✅ Memory usage: **8 GB peak**
- ✅ Dependencies: **2,798 packages**
- ✅ No critical issues

### Next Steps

1. Proceed to Phase 2: Custom Navigation
2. Monitor bundle size changes
3. Update this baseline after each phase
4. Set up automated performance tracking in Phase 5

---

**Baseline Established**: 2026-01-24
**Status**: ✅ Complete
**Maintained By**: NebulaIQ Engineering Team
