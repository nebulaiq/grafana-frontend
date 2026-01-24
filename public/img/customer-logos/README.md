# Customer Organization Logos

This directory contains custom logos for multi-tenant organizations in NebulaIQ Telemetry.

## Logo Requirements

- **Format**: PNG or SVG (SVG preferred for scalability)
- **Size**: 48x48px recommended (will be displayed at 32x32 in the UI)
- **Background**: Transparent or solid color
- **File size**: Keep under 50KB for optimal performance
- **Naming**: Use organization ID or slug (e.g., `acme-corp.svg`, `org-123.png`)

## Usage

### Default Logo

`default-org.svg` is used as a fallback when an organization doesn't have a custom logo.

### Adding Custom Logos

1. Place the organization logo in this directory
2. Update the organization record in the database with the logo path:
   ```sql
   UPDATE org SET logo_url = '/public/img/customer-logos/your-logo.svg' WHERE id = 123;
   ```
3. The logo will automatically display in the top bar's organization switcher

### Example Organizations

You can add sample logos for testing:

```
customer-logos/
├── default-org.svg          # Default fallback
├── acme-corp.svg            # ACME Corporation
├── globex.png               # Globex Inc
├── initech.svg              # Initech
└── hooli.png                # Hooli
```

## Backend Configuration

To enable custom organization logos, ensure the `org` table has a `logo_url` column:

```sql
ALTER TABLE org ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500);
```

## Frontend Display

The organization logo is displayed in:
- Top bar organization switcher
- Organization settings page
- Organization selection dropdown (if multi-org is enabled)

Logo rendering is handled by the `OrgSwitcher` component in the NebulaIQ top bar.
