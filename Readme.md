# The Bandhan Project (tbp;)

Official web portal and dynamic real-time Content Management System (CMS) for **The Bandhan Project (`tbp;`)**.

## 🌟 Features

- **Dynamic Real-Time CMS**: Instant live updates across all open tabs and pages.
- **Events Manager**: Add, edit, delete, activate/deactivate, and schedule upcoming conclaves, workshops, summits, and community drives.
- **Founder's Note**: Dedicated visionary section with inspiring quotes, message narrative, and custom signature.
- **Moments & Highlights Gallery**: Manage photos, captures, and community drives.
- **Live Impact Counters**: Dynamic statistics and figures in the About section.
- **Brand Consistency**: Styled with the signature royal blue palette matching the official `tbp;` logo.
- **Protected Admin Panel**: Secure passcode-protected management dashboard with full website controls, data backups (JSON export/import), and preset resets.

## 🚀 Getting Started

1. Open `index.html` directly in any web browser, or run a local web server:
   ```bash
   npx serve .
   ```
2. Navigate to `admin.html` (or click **Admin Portal** / **Edit Website**) to access the CMS.
3. Default admin passcode: `admin123` *(can be changed anytime in the Security tab)*.

## 📁 Architecture

- `index.html`: Main responsive portal.
- `admin.html`: Content Management System & Administration Control Center.
- `assets/js/site-data.js`: Centralized data store and real-time state synchronizer.
- `assets/js/render-site.js`: Dynamic DOM binder and live updating engine.
- `assets/js/admin.js`: Administrative portal operations, CRUD, and data import/export.
- `assets/css/style.css`: Primary responsive stylesheet and brand design system.
- `assets/css/admin.css`: Professional dashboard styling.

---
© 2026 The Bandhan Project (tbp;). All Rights Reserved.
