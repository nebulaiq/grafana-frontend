# Customer Organization Logos - NebulaIQ Co-Branding

This directory contains custom logos for multi-tenant organizations in NebulaIQ Telemetry.

## Co-Branding Display

NebulaIQ supports elegant co-branding that showcases your customer's identity while maintaining NebulaIQ attribution.

### Display Formats

The co-branding automatically appears in the top navigation bar with:

1. **Customer Logo** - Your customer's brand logo (24-32px)
2. **Customer Name** - Formatted as "{CustomerName} Observability"
3. **Attribution** - "Powered by NebulaIQ" (in smaller text)

**Examples:**
- **Swiggy Observability** - *Powered by NebulaIQ*
- **Acme Corp Observability** - *Powered by NebulaIQ*
- **Initech Observability** - *Powered by NebulaIQ*

### Visual Layout

```
┌─────────────────────────────────────────┐
│  [Logo]  CustomerName Observability     │
│          Powered by NebulaIQ            │
└─────────────────────────────────────────┘
```

## Logo Requirements

### File Specifications

- **Format**: SVG (preferred) or PNG
- **Dimensions**: 32x32px to 48x48px recommended
- **Aspect Ratio**: Square or close to square works best
- **Background**: Transparent (preferred) or solid color
- **File Size**: Keep under 50KB for optimal performance
- **Color Mode**: Full color or monochrome (both supported)

### File Naming Convention

Use the organization name as a slug (lowercase, hyphenated):

```
customer-logos/
├── swiggy.svg              # Swiggy Food Delivery
├── acme-corp.svg           # ACME Corporation
├── initech.svg             # Initech
├── hooli.svg               # Hooli Inc
├── globex-international.svg # Globex International
└── default-org.svg         # Fallback logo
```

**Naming Rules:**
- Use lowercase letters
- Replace spaces with hyphens (`-`)
- Remove special characters
- Match the organization name slug

## How to Upload Customer Logos

### Method 1: File System Upload (Recommended for Development)

1. **Prepare the logo file:**
   ```bash
   # Ensure logo meets specifications (32-48px, SVG/PNG, <50KB)
   # Example: swiggy.svg
   ```

2. **Upload to customer-logos directory:**
   ```bash
   cp /path/to/customer-logo.svg \
      grafana-frontend/public/img/customer-logos/customer-name.svg
   ```

3. **Verify the file exists:**
   ```bash
   ls -lh grafana-frontend/public/img/customer-logos/
   ```

4. **Restart Grafana** (for development):
   ```bash
   cd grafana-frontend
   yarn start
   ```

The logo will automatically appear if the organization name matches the filename slug.

### Method 2: Database Configuration (Production)

1. **Upload logo file** to the server:
   ```bash
   scp customer-logo.svg server:/var/lib/grafana/public/img/customer-logos/
   ```

2. **Update organization record** in the database:
   ```sql
   -- Find your organization ID
   SELECT id, name FROM org WHERE name = 'Your Customer Name';

   -- Set the logo URL
   UPDATE org
   SET logo_url = '/public/img/customer-logos/customer-name.svg'
   WHERE id = 123;
   ```

3. **Verify the change:**
   ```sql
   SELECT id, name, logo_url FROM org WHERE id = 123;
   ```

4. **Restart Grafana** or **reload the page** to see changes.

### Method 3: Admin UI Upload (Future Enhancement)

A web-based logo upload interface is planned for future releases, allowing customers to upload their logos directly through the NebulaIQ admin interface.

## Testing Your Logo

### 1. Check File Accessibility

Verify the logo is accessible via browser:
```
https://your-nebulaiq-domain/public/img/customer-logos/customer-name.svg
```

### 2. Verify Organization Name Match

Ensure the organization name slug matches the filename:

```javascript
// Organization name: "Swiggy Food Delivery"
// Expected slug: "swiggy-food-delivery"
// Logo filename: swiggy-food-delivery.svg
```

### 3. Check Browser Console

If the logo doesn't appear, check the browser console for 404 errors:
```
Failed to load resource: /public/img/customer-logos/customer-name.svg
```

### 4. Clear Cache

Sometimes browsers cache images aggressively:
```
Ctrl/Cmd + Shift + R  (Hard refresh)
```

## Customizing Co-Branding Format

### Current Default Format

For non-default organizations, the display format is:
- **Primary Text:** `{OrgName} Observability`
- **Secondary Text:** `Powered by NebulaIQ`

### Future Customization Options

In future releases, you'll be able to customize the branding format per organization:

```sql
-- Future schema extension
ALTER TABLE org ADD COLUMN branding_format VARCHAR(50);

-- Options:
-- 'customer-observability'  → "CustomerName Observability - Powered by NebulaIQ"
-- 'nebulaiq-for-customer'   → "NebulaIQ for CustomerName"
-- 'customer-powered'        → "CustomerName - Powered by NebulaIQ"
-- 'customer-only'           → "CustomerName"
```

## Example Logos

### Swiggy Example

**File:** `swiggy.svg`

```xml
<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" rx="8" fill="#FC8019"/>
  <text x="24" y="32" font-family="Arial" font-size="24"
        font-weight="bold" fill="white" text-anchor="middle">S</text>
</svg>
```

**Display:**
- Logo: Orange square with "S"
- Text: "Swiggy Observability - Powered by NebulaIQ"

### Acme Corp Example

**File:** `acme-corp.svg`

```xml
<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="24" r="22" fill="#2563EB"/>
  <text x="24" y="32" font-family="Arial" font-size="20"
        font-weight="bold" fill="white" text-anchor="middle">ACME</text>
</svg>
```

**Display:**
- Logo: Blue circle with "ACME"
- Text: "Acme Corp Observability - Powered by NebulaIQ"

## Default Fallback Logo

If an organization doesn't have a custom logo, NebulaIQ will:
1. Try to load from file: `/public/img/customer-logos/{org-slug}.svg`
2. Fall back to hiding the logo and showing text only

**Fallback Display:**
```
NebulaIQ Telemetry
```

## Troubleshooting

### Logo Not Appearing

**Problem:** Logo doesn't show up in the top bar.

**Solutions:**
1. Check filename matches organization slug exactly
2. Verify file exists in `public/img/customer-logos/`
3. Check file permissions (must be readable by web server)
4. Clear browser cache (Ctrl/Cmd + Shift + R)
5. Check browser console for 404 errors

### Logo Too Large/Small

**Problem:** Logo appears too large or too small.

**Solutions:**
1. Adjust source SVG viewBox to be square (e.g., `viewBox="0 0 48 48"`)
2. Ensure logo artwork is centered within viewBox
3. Keep logo dimensions between 32-48px
4. Use `object-fit: contain` in CSS (already applied)

### Logo Quality Issues

**Problem:** Logo appears blurry or pixelated.

**Solutions:**
1. Use SVG format instead of PNG (scalable, no quality loss)
2. If using PNG, provide 2x or 3x resolution (96px for Retina displays)
3. Ensure logo has clean, crisp edges in source file

### Logo Color Mismatch

**Problem:** Logo colors don't look right in light/dark themes.

**Solutions:**
1. Provide separate logos for light/dark themes (future feature)
2. Use monochrome logo that adapts to theme colors
3. Test logo in both light and dark modes
4. Avoid pure white/black colors in logo (use theme-adaptive colors)

## Database Schema

### Current Schema

```sql
-- Organization table (Grafana core)
CREATE TABLE org (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(190) NOT NULL,
  logo_url VARCHAR(500),  -- Custom logo path
  created DATETIME NOT NULL,
  updated DATETIME NOT NULL
);
```

### Required Migration

If the `logo_url` column doesn't exist, add it:

```sql
ALTER TABLE org ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500);
```

## API Endpoints (Future)

Planned API endpoints for logo management:

```
POST   /api/orgs/:orgId/logo          # Upload organization logo
GET    /api/orgs/:orgId/logo          # Get organization logo URL
DELETE /api/orgs/:orgId/logo          # Remove organization logo
```

## Support

For issues or questions about customer logo integration:

1. Check this documentation first
2. Review the troubleshooting section
3. Contact NebulaIQ support with:
   - Organization name
   - Logo filename
   - Screenshot of the issue
   - Browser console errors (if any)

---

**Last Updated:** January 2026
**Version:** 1.0.0
**NebulaIQ Telemetry Dashboard**
