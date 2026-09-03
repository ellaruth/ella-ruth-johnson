# Safe Haven Out Reach Ministries
### Pastor Ella Ruth Johnson · Columbia, MS · Est. 1989

> *"The Spirit of the Lord is upon me, because he has anointed me to proclaim good news to the poor."* — Luke 4:18

A world-class, full-stack ministry & personal coaching platform — built with React, TypeScript, Express, and SQLite as the single source of truth.

---

## ✨ Features

| Area | Capability |
|------|-----------|
| **Ministry Hub** | Events, Sermons, Community Prayer Wall, Announcements |
| **Events** | RSVP with attendee tracking · `.ics` calendar export |
| **Prayer Wall** | Live "Prayed" counter stored in SQLite |
| **Donations** | Tax-receipt generation (`SHR-XXXXXX`) per fund |
| **85 & Thriving Coaching** | Vitality quiz · 1-on-1 coaching inquiry → SQLite |
| **Volunteer Portal** | Application form → staff inbox |
| **Staff CMS** | Admin portal for Events, Sermons, Banners, and all Inboxes |
| **Newsletter** | Subscribe with preference stored in database |
| **Contact** | Full inquiry form → SQLite inbox |

---

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Vanilla CSS
- **Backend**: Express 4 + Vite middleware mode (single `npm run dev`)
- **Database**: Node 24 native `node:sqlite` (`DatabaseSync`) — zero native build tools required
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Cinzel, Lora, Inter)

---

## 🔒 Security

- **OWASP HTTP headers**: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Referrer-Policy`
- **Admin authentication**: `x-admin-passcode` header on all mutation/admin routes
- **Rate limiting**: 30 req/min sliding window per IP on all public submission endpoints
- **Input validation & sanitization**: Length limits, type checks, and value bounds on every field
- **Privacy guard**: Private prayer requests never exposed to public API
- **Body size limit**: 1MB cap to prevent memory exhaustion DoS
- **SQLite excluded from git**: `data/database.sqlite` is in `.gitignore`

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+ (v24 recommended for native SQLite)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/ellaruth/safe-haven-ministries.git
cd safe-haven-ministries

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start the full-stack development server
npm run dev
```

The app will be available at **http://localhost:3000**

### Environment Variables

```env
# .env
ADMIN_PASSCODE=SafeHaven2026!   # Change this before deploying to production
NODE_ENV=development
PORT=3000
```

---

## 📁 Project Structure

```
safe-haven-ministries/
├── server.ts                 # Express + Vite full-stack server
├── server/
│   └── db.ts                 # SQLite schema, seeding & query functions
├── src/
│   ├── App.tsx               # Root component + bootstrap + toast engine
│   ├── services/
│   │   └── api.ts            # Typed REST API client
│   ├── components/
│   │   ├── AdminCMSModal.tsx # Staff portal with inboxes
│   │   ├── DonationModal.tsx # Donation + receipt generation
│   │   ├── VolunteerModal.tsx
│   │   ├── DevotionalDownloadModal.tsx
│   │   ├── PrayerModal.tsx
│   │   └── pages/
│   │       ├── HomePage.tsx
│   │       ├── TeachingPage.tsx  # Sermons + Prayer Wall
│   │       ├── EventsPage.tsx    # Events + RSVP + .ics
│   │       ├── CoachingPage.tsx  # 85 & Thriving Longevity Hub
│   │       ├── ContactPage.tsx
│   │       └── ...
│   ├── data/
│   │   └── initialData.ts    # Baseline seed data
│   └── types.ts              # Shared TypeScript interfaces
├── data/                     # SQLite runtime (gitignored)
├── .env.example
└── package.json
```

---

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/bootstrap` | Public | Single-call page bootstrap |
| `GET/POST` | `/api/events` | POST: Admin | Events CRUD |
| `POST` | `/api/events/:id/rsvp` | Rate-limited | Event RSVP |
| `GET/POST` | `/api/sermons` | POST: Admin | Sermons CRUD |
| `GET/POST` | `/api/prayers` | POST: Rate-limited | Prayer Wall |
| `POST` | `/api/prayers/:id/pray` | Rate-limited | Increment pray count |
| `POST` | `/api/donations` | Rate-limited | Record donation + receipt |
| `POST` | `/api/volunteers` | Rate-limited | Volunteer application |
| `POST` | `/api/coaching/inquiry` | Rate-limited | Coaching consultation |
| `POST` | `/api/newsletter/subscribe` | Rate-limited | Newsletter signup |
| `POST` | `/api/contact` | Rate-limited | Contact message |
| `GET` | `/api/admin/submissions` | **Admin** | View all inboxes |
| `POST` | `/api/admin/reset-defaults` | **Admin** | Reset DB to seed data |

Admin routes require the header: `x-admin-passcode: <ADMIN_PASSCODE>`

---

## 📜 Ministry History

Safe Haven Out Reach Ministries was founded by **Pastor Ella Ruth Johnson** in Columbia, MS in 1989. With over 35 years of faithfully serving the community — from prison & reentry ministry, to women's restoration, to longevity coaching for seniors — this platform is a digital extension of that mission.

---

*Built with love for the Kingdom. All glory to God.*
