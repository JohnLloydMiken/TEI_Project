# TEI Bill Deposit Refund System

> An internal web application for Tarlac Electric Inc. (TEI) that manages and tracks customer bill deposit refund eligibility. Customer Service Department (CSD) staff can verify individual or bulk account eligibility, and administrators can upload and manage qualified customer lists.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the App](#running-the-app)
- [User Roles](#user-roles)
- [Key Workflows](#key-workflows)
  - [Admin: Upload Customer List](#admin-upload-customer-list)
  - [CSD: Individual Eligibility Check](#csd-individual-eligibility-check)
  - [CSD: Batch Eligibility Check](#csd-batch-eligibility-check)
- [API Reference](#api-reference)
- [Deadline Logic](#deadline-logic)
- [Excel File Format](#excel-file-format)
- [Database Schema](#database-schema)
- [Scripts](#scripts)

---

## Overview

The **TEI Bill Deposit Refund System** is a role-based internal portal built with Next.js 16. It allows TEI administrators to upload monthly lists of qualified customers for bill deposit refunds, and enables CSD staff to check refund eligibility, view deadlines, and mark deposits as claimed — individually or in bulk.

---

## Features

**For Administrators**
- Upload monthly qualified customer lists via Excel (`.xlsx` / `.xls`)
- Preview uploaded data before confirming
- Automatically replace an existing batch for the same month/year
- View and manage upload history

**For CSD Staff**
- Check individual account eligibility by account number
- Batch-check multiple accounts by pasting account numbers
- Batch-check via Excel file upload
- Mark eligible accounts as claimed
- View deadline countdown and status (Eligible / Claimed / Expired)
- Widget dashboard showing totals per status

**General**
- JWT-based authentication with role separation (ADMIN / CSD)
- Animated, responsive UI with Tailwind CSS and Framer Motion
- Toast notifications for all user actions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion / Motion |
| Database | Microsoft SQL Server |
| ORM | Prisma 7 (with `@prisma/adapter-mssql`) |
| Auth | NextAuth.js v4 (JWT + Credentials) |
| Excel Parsing | SheetJS (`xlsx`) |
| File Upload | `react-dropzone` |
| Notifications | Sonner |
| Password Hashing | bcryptjs |
| Icons | Lucide React |

---

## Project Structure

```
tei_project/
├── prisma/
│   ├── schema.prisma          # Database models
│   ├── seed.ts                # Database seeder
│   ├── seeder/
│   │   └── user-seed.ts       # User seed helper
│   └── migrations/            # SQL migration files
├── src/
│   ├── app/
│   │   ├── (admin)/           # Admin-only routes
│   │   │   └── dashboard/
│   │   │       ├── upload-list/
│   │   │       └── claimed-history/
│   │   ├── (csd)/             # CSD staff routes
│   │   │   ├── individual-checker/
│   │   │   └── batch-checker/
│   │   │       ├── paste/
│   │   │       └── upload/
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth route
│   │   │   ├── customers/     # Customer lookup endpoints
│   │   │   ├── admin/upload/  # Excel upload endpoint
│   │   │   └── action/claim/  # Mark-as-claimed endpoint
│   │   ├── login/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── eligibility-checker/
│   │   │   │   ├── individual-checker.tsx
│   │   │   │   ├── batch-paste.tsx
│   │   │   │   ├── batch-upload.tsx
│   │   │   │   ├── customer-card.tsx
│   │   │   │   ├── ExcelDropzone.tsx
│   │   │   │   ├── batch/
│   │   │   │   │   ├── customer-table.tsx
│   │   │   │   │   └── not-found.tsx
│   │   │   │   └── widgets/
│   │   │   ├── admin/upload-list/
│   │   │   ├── dashboard-header.tsx
│   │   │   └── dashboard-sidebar.tsx
│   │   ├── login/
│   │   └── layout/
│   ├── config/
│   │   └── dashboard-nav.config.ts  # Sidebar nav per role
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── authOptions.ts     # NextAuth config
│   │   ├── deadlineLogic.ts   # Deadline computation
│   │   └── xlsx/
│   │       ├── parse-excel.ts         # Server-side admin upload parser
│   │       └── parseAccountExcel.ts   # Client-side batch upload parser
│   ├── services/              # Client-side data hooks
│   │   ├── useFetchQulifiedUsers.ts
│   │   ├── useBatchFetchCustomers.ts
│   │   ├── useMarkeAsClaimed.ts
│   │   └── ...
│   ├── types/                 # TypeScript type definitions
│   └── middleware.ts          # Route protection by role
```

---

## Getting Started

### Prerequisites

- **Node.js** `>= 20.9.0`
- **Microsoft SQL Server** (local or remote instance)
- **npm** or compatible package manager

### Installation

```bash
git clone <your-repo-url>
cd tei_project
npm install
```

### Environment Variables

Create a `.env` file in the project root. Use the following as a template:

```env
# SQL Server connection string
DATABASE_URL="sqlserver://YOUR_SERVER:1433;database=BillDeposit;user=YOUR_USER;password=YOUR_PASSWORD;trustServerCertificate=true;encrypt=false"

# Individual DB config (used by the seeder)
DB_SERVER=YOUR_SERVER
DB_PORT=1433
DB_NAME=BillDeposit
DB_USER=YOUR_USER
DB_PASSWORD=YOUR_PASSWORD

# NextAuth
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

> **Note:** `NEXTAUTH_SECRET` should be a long, random string. Generate one with `openssl rand -base64 32`.

### Database Setup

**1. Run Prisma migrations** to create the database schema:

```bash
npx prisma migrate deploy
```

**2. Generate the Prisma client:**

```bash
npx prisma generate
```

**3. Seed the database** with default users and sample data:

```bash
npx tsx prisma/seed.ts
```

This creates the following default accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@tei.com` | `admin123` |
| CSD Staff | `csd1@tei.com` | `csd123` |
| CSD Staff | `csd2@tei.com` | `csd123` |

> **Important:** Change these passwords in production.

### Running the App

```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

The app will be available at `http://localhost:3000`. It redirects to `/login` by default.

---

## User Roles

| Role | Access |
|---|---|
| **ADMIN** | Upload customer lists, view claimed history, manage CSD users, export data |
| **CSD** | Individual eligibility checker, batch checker (paste & upload), claimed list, export records |

Role-based routing is enforced both in `src/middleware.ts` (server-side redirect) and in individual page components.

---

## Key Workflows

### Admin: Upload Customer List

1. Navigate to **Upload List** in the sidebar.
2. Select the **batch month and year**.
3. Drag-and-drop or browse for an `.xlsx` / `.xls` file.
4. Preview the parsed data (first 8 rows shown).
5. Click **Confirm Upload**.
   - If a batch already exists for that month/year, it is **replaced** automatically.
   - The entire operation runs in a single database transaction.

### CSD: Individual Eligibility Check

1. Navigate to **Eligibility Checker**.
2. Enter an account number (e.g. `TEI-00001`) and click **Search**.
3. A customer card appears showing:
   - Account name, number, and deposit amount
   - Notification date and deadline date
   - Days remaining (animated progress bar)
   - Status badge: `Eligible`, `Claimed`, or `Expired`
4. Click **Mark as Claimed** to record the claim (only available for `Eligible` accounts).

### CSD: Batch Eligibility Check

**Paste method:**
1. Navigate to **Batch (paste)**.
2. Paste account numbers (one per line) into the textarea.
3. Click **Search** to check all accounts in a single API call.

**Upload method:**
1. Navigate to **Batch (upload)**.
2. Drop an Excel file containing an `Account No` or `Account Number` column.
3. Results are split into **Found** and **Not Found** tabs.
4. Eligible accounts can be claimed directly from the results table.

---

## API Reference

### `GET /api/customers/[accountNumber]`
Fetch a single customer by account number. Returns customer details enriched with deadline info.

**Response:**
```json
{
  "data": {
    "id": 1,
    "accountNo": "TEI-00001",
    "customerName": "Pedro Reyes",
    "depositAmount": "1500.00",
    "notificationDate": "2025-04-01T00:00:00.000Z",
    "deadlineDate": "2025-05-01T00:00:00.000Z",
    "daysRemaining": 12,
    "isExpired": false,
    "status": "Eligible",
    "batch": { "month": 4, "year": 2025, "fileName": "april_2025.xlsx" }
  }
}
```

### `POST /api/customers/batch`
Fetch multiple customers in one request.

**Request body:**
```json
{ "accountNumbers": ["TEI-00001", "TEI-00002", "TEI-99999"] }
```

**Response:**
```json
{
  "data": {
    "found": [ /* enriched customer objects */ ],
    "notFound": ["TEI-99999"]
  }
}
```

### `GET /api/customers/all`
Returns all customers with their batch info. Used for dashboard widgets.

### `GET /api/customers/claimed`
Returns all customers that have been claimed.

### `POST /api/admin/upload`
Admin-only. Accepts `multipart/form-data` with `file`, `month`, and `year`. Parses, validates, and imports an Excel customer list.

### `PATCH /api/action/claim`
Marks a customer as claimed by the currently logged-in CSD user.

**Request body:**
```json
{ "accountNo": "TEI-00001" }
```

---

## Deadline Logic

All deadline computation lives in `src/lib/deadlineLogic.ts` and runs **server-side only**.

- The deadline is set to **exactly 1 calendar month** after the `notificationDate`.
- Status priority: `Claimed` > `Expired` > `Eligible`.
- A customer is `Expired` only if today is **strictly after** the deadline date (day-level comparison).
- `daysRemaining` is always `0` for `Claimed` accounts.

```
Eligible  → notificationDate + 1 month has not passed, not yet claimed
Expired   → deadline date has passed, not claimed
Claimed   → claimedAt is not null
```

---

## Excel File Format

### Admin Upload (customer list)

| Column | Type | Required |
|---|---|---|
| `account_no` / `Account No` | Text | Yes |
| `customer_name` / `Customer Name` | Text | Yes |
| `deposit_amount` / `Deposit Amount` | Number | Yes |
| `notification_date` / `Notification Date` | Date | Yes |
| `address` | Text | Optional |
| `email` | Text | Optional |
| `phone` | Text | Optional |

- Column headers are **case-insensitive** and support common variations.
- Duplicate account numbers within the same file will cause the upload to abort.

### Batch Upload (account numbers only)

The file must contain a column named `Account No` or `Account Number`. Only that column is read; all other columns are ignored.

---

## Database Schema

```
User
  id, name, email, password, role (ADMIN|CSD), createdAt

UploadBatch
  id, fileName, uploadedBy (→ User), uploadedAt, month, year

Customer
  id, accountNo, customerName, address, email, phone
  depositAmount, notificationDate, claimedAt, claimedBy (→ User)
  batchId (→ UploadBatch)
  UNIQUE (accountNo, batchId)
```

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma migrate deploy` | Apply database migrations |
| `npx prisma generate` | Regenerate Prisma client |
| `npx tsx prisma/seed.ts` | Seed the database |
| `npx prisma studio` | Open Prisma database browser |

---

## Notes

- This is an **internal-use system** — not intended for public access.
- The app is currently configured to allow a dev origin at `172.16.3.179` (see `next.config.ts`). Update this for your network environment.
- The `src/generated/prisma` directory is git-ignored and must be regenerated after cloning via `npx prisma generate`.

---

*© 2026 Tarlac Electric Inc. — Internal Use Only. v1.0*