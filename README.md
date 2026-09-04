# Ella Ruth | Official Personal Website
### Author · Certified Vitality Coach · Speaker · Faithful Worshipper at Safe Haven Ministries
#### Columbia, Mississippi

> *"Age is not a slow retreat; for a child of God, it is an accumulation of wisdom, stamina, and sacred purpose."* — Ella Ruth

A world-class, full-stack personal platform and community hub for **Ella Ruth** — author, inspirational speaker, 85-year-young vitality coach, and devoted worshipper at Safe Haven Ministries in Columbia, MS. Built with React, TypeScript, Express, and SQLite with WAL mode durability.

---

## 🌟 About Ella Ruth & Her Church Home

- **Personal Calling:** Ella Ruth is an author, speaker, and certified health & vitality coach who empowers men and women to reject premature frailty, embrace biblical body stewardship, and live with vibrant energy.
- **Her Church Home:** Ella Ruth is **not the founder** of Safe Haven Ministries, but an active, faithful worshipper and community servant who has walked in dedicated fellowship with the church for decades. This platform honors Safe Haven Ministries by spotlighting its Sunday & Wednesday worship services, community outreach banquets, and prison reentry missions.

---

## ✨ Key Features & Capabilities

| Module | Purpose & Capabilities |
|---|---|
| **85 & Thriving Vitality Hub** | Interactive 60-second vitality assessment · 1-on-1 coaching inquiry pipeline · Free 7-Day Morning Vitality Blueprint lead generator |
| **Faith Teachings & Sermons** | Devotional reader · Audio previews · Core study notes · Scripture highlights |
| **Community Prayer Circle** | Public & private prayer requests · Real-time "Prayed" counter backed by SQLite |
| **My Church Home (Safe Haven Ministries)** | Weekly service times (Sunday 10:00 AM & Wednesday 6:30 PM) · Outreach spotlight · Community dinners |
| **Upcoming Events & Speaking** | Speaking engagements & workshops · RSVP with guest counter · `.ics` calendar file export |
| **Community Outreach & Giving** | Support for local outreach and Mombasa, Kenya children's school feeding · Generates itemized tax receipts (`SHR-XXXXXX`) |
| **Staff & Admin CMS** | Secure administrative dashboard for managing announcements, events, sermons, and reviewing submissions |

---

## 🏗️ Architecture & Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Vanilla CSS design system, Lucide icons.
- **Backend:** Express 4 embedded with Vite development middleware.
- **Database:** SQLite via `better-sqlite3` configured in **WAL (Write-Ahead Logging)** mode with prepared statements, foreign key enforcement, and synchronous durability.
  - *Zero-latency reads ($<0.1\text{ ms}$)*
  - *ACID-compliant single-file database supporting up to 281 Terabytes*
- **Testing:** Comprehensive **73-test automated test suite** across all layers (`vitest`, `@testing-library/react`, `supertest`, `jsdom`).

---

## 🔒 Security & Best Practices

- **OWASP Headers Middleware:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection`, `Referrer-Policy: strict-origin-when-cross-origin`.
- **Administrative Passcode Guard:** Admin endpoints require the `x-admin-passcode` header.
- **Rate Limiting:** Sliding-window rate limiter on all public submissions (contact, prayer, RSVP, donations, coaching).
- **Privacy Protection:** Private prayer requests are strictly isolated and never exposed through public endpoints.
- **Input Validation:** String lengths, email formats, and number boundaries validated before database writes.
- **Database Isolation:** SQLite runtime files (`data/*.sqlite*`) are excluded from Git version control.

---

## 🧪 Testing Suite (73 Tests)

Run the full automated test suite:
```bash
npm test
```

| Test Suite | Coverage | Count |
|---|---|---|
| `server/api.test.ts` | Supertest integration tests for REST API, OWASP headers, admin passcode, and input validations | 27 tests |
| `server/db.test.ts` | Direct SQLite database query constraints, attendees count updates, privacy isolation | 15 tests |
| `src/services/api.test.ts` | Client API wrapper methods, mock fetch calls, and fallback resilience | 14 tests |
| `src/components/components.test.tsx` | UI tests for modals (`DonationModal`, `VolunteerModal`, `PrayerModal`, `DevotionalDownloadModal`, `Navbar`, `Footer`) | 10 tests |
| `src/components/pages/pages.test.tsx` | Integration tests for page workflows (`ContactPage`, `EventsPage`, `CoachingPage`, `TeachingPage`) | 7 tests |

To run strict TypeScript checking:
```bash
npm run lint
```

To test production bundling:
```bash
npm run build
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v20+ or v24+
- npm

### 2. Installation
```bash
git clone https://github.com/ellaruth/safe-haven-ministries.git
cd safe-haven-ministries

npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
ADMIN_PASSCODE=SafeHaven2026!
```

### 4. Run Development Server
```bash
npm run dev
```
Open **http://localhost:3000** in your browser.

---

## 📁 Repository Directory Structure

```text
safe-haven-ministries/
├── server.ts                       # Express + Vite full-stack server
├── server/
│   ├── db.ts                       # SQLite database schema, prepared queries & seed data
│   ├── db.test.ts                  # Database unit tests
│   └── api.test.ts                 # Supertest REST API tests
├── src/
│   ├── App.tsx                     # Main application layout, routing & state
│   ├── main.tsx                    # React DOM root entry
│   ├── types.ts                    # TypeScript domain interfaces
│   ├── services/
│   │   ├── api.ts                  # Typed client API wrapper
│   │   └── api.test.ts             # Client API unit tests
│   ├── data/
│   │   └── initialData.ts          # Baseline seed data, timeline & content fixtures
│   ├── components/
│   │   ├── Navbar.tsx              # Clean navigation header with brand mark
│   │   ├── Footer.tsx              # Footer with bio, newsletter & church links
│   │   ├── BannerAnnouncement.tsx  # Dynamic ticker banner
│   │   ├── DonationModal.tsx       # Tax receipt donation modal
│   │   ├── VolunteerModal.tsx      # Community service application
│   │   ├── DevotionalDownloadModal.tsx # Vitality guide download lead
│   │   ├── PrayerModal.tsx         # Prayer petition modal
│   │   ├── AdminCMSModal.tsx       # Staff administrative portal
│   │   ├── components.test.tsx     # Modal & layout component tests
│   │   └── pages/
│   │       ├── HomePage.tsx        # Personal hero, 3 pillars & featured teaching
│   │       ├── AboutPage.tsx       # Ella Ruth's journey, calling & testimony
│   │       ├── MinistryPage.tsx    # "My Church Home: Safe Haven Ministries"
│   │       ├── CoachingPage.tsx    # 85 & Thriving Vitality Coaching hub
│   │       ├── TeachingPage.tsx    # Faith Teachings, Sermons & Prayer Wall
│   │       ├── EventsPage.tsx      # Speaking engagements, banquets & .ics export
│   │       ├── GalleryPage.tsx     # Photo albums (ministry, coaching, banquets)
│   │       ├── GetInvolvedPage.tsx # Community partnership pathways
│   │       ├── ContactPage.tsx     # Direct inquiry & speaking bookings
│   │       └── pages.test.tsx      # Page integration tests
├── vite.config.ts                  # Vite & Vitest configuration
├── package.json                    # Dependencies & NPM scripts
└── README.md                       # Comprehensive documentation
```

---

*“I’m 85 years young — challenging men and women to live longer, healthier lives through biblical vitality, while walking in devoted fellowship with our church and community.”* — Ella Ruth
