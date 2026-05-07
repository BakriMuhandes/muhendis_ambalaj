# Architecture & Implementation Plan

## 1. Project Overview

This project is a company accounting and billing system composed of:

- **Android Admin App** for the business owner and limited-access employees
- **Customer Web Portal** for customers to view their own account data
- **REST API Backend** to serve both clients
- **Relational Database** for secure accounting records

### Main Goals

- Record delivered products/services per customer
- Automatically calculate line totals and running balances
- Record customer payments with exact dates
- Support USD as the base currency with optional TRY display using a manually entered exchange rate
- Allow customers to log in and see only their own deliveries, payments, totals, and reports
- Keep the customer side strictly **read-only**
- Make the entire user-facing system available in **Turkish**

---

## 2. Key Assumptions

1. The business has a single main owner/admin account.
2. Employees may be added later with configurable limited permissions.
3. A customer account belongs to exactly one customer record.
4. Accounting is based on:
   - deliveries (borç / charge)
   - payments (ödeme / credit)
5. The legal/accounting source of truth remains the server database.
6. Exchange rate entry is manual and stored together with the transaction/report context when needed.
7. Product autofill learns from previous entries entered by the admin side.
8. The first release focuses on one company/tenant, but the schema should allow future multi-company support if needed.

---

## 3. Recommended Tech Stack

## 3.1 Android App

**Recommendation: Native Android with Kotlin**

### Why

- Best long-term Android performance
- Strong offline-ready architecture options
- Better support for forms, autofill flows, local caching, and printing/export integrations
- Easier maintenance for an Android-first business workflow

### Suggested Android Stack

- **Language:** Kotlin
- **UI:** Jetpack Compose
- **Architecture:** Clean Architecture + MVVM
- **Navigation:** Navigation Compose
- **Networking:** Retrofit + OkHttp
- **Serialization:** Kotlinx Serialization or Moshi
- **Local storage/cache:** Room
- **Dependency Injection:** Hilt
- **Security:** EncryptedSharedPreferences / Android Keystore
- **Date/time:** kotlinx-datetime or java.time

## 3.2 Backend

**Recommendation: NestJS (Node.js + TypeScript)**

### Why

- Clear modular architecture
- Strong support for RBAC, DTO validation, auth, reports, and REST APIs
- Good maintainability for medium-sized business systems
- Strong ecosystem for Excel export, charts data endpoints, audit logging, and scheduled tasks

### Suggested Backend Stack

- **Runtime:** Node.js LTS
- **Framework:** NestJS
- **ORM:** Prisma
- **Validation:** class-validator / Zod
- **Auth:** JWT access + refresh token strategy
- **Password hashing:** Argon2
- **File exports:** ExcelJS
- **API docs:** Swagger/OpenAPI

## 3.3 Database

**Recommendation: PostgreSQL**

### Why

- Strong relational integrity
- Good support for transactional accounting data
- Reliable indexing for reports and date-range queries
- Easy to scale later

## 3.4 Web Portal

**Recommendation: Next.js**

### Suggested Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS + component library (e.g. shadcn/ui)
- **Charts:** Recharts or Chart.js
- **Auth handling:** secure HTTP-only token/cookie flow or customer JWT session
- **Printing:** browser print stylesheet + export-ready report pages

## 3.5 Deployment

- **Backend:** Dockerized NestJS service
- **Web:** Vercel / Docker / Nginx deployment
- **Database:** Managed PostgreSQL
- **Object/file storage (optional):** S3-compatible storage for future attachments
- **Reverse proxy:** Nginx
- **Monitoring:** Sentry + structured logs

---

## 4. High-Level Architecture

```text
Android Admin App  --->|
                       |--> REST API Backend --> PostgreSQL
Customer Web Portal -->|
```

### Client Responsibilities

- Android app:
  - admin/employee login
  - customer creation
  - delivery entry
  - payment entry
  - autofill suggestions
  - report requests

- Customer website:
  - customer login
  - view-only dashboards
  - report filtering
  - download and print

### Backend Responsibilities

- authentication
- authorization
- customer isolation
- accounting calculations
- report generation
- export generation
- audit trail
- exchange-rate-aware display calculation support

---

## 5. Domain Model

Core business entities:

- Company
- User
- Role
- Customer
- CustomerCredential
- EmployeePermission
- ProductMemory (autofill source)
- Delivery
- DeliveryItem
- Payment
- ExchangeRateNote
- ReportRequestLog
- AuditLog

---

## 6. Database Schema Design

## 6.1 Main Tables

### `companies`

| Field | Type | Notes |
|---|---|---|
| id | uuid | PK |
| name | varchar(150) | company name |
| default_currency | varchar(3) | default `USD` |
| locale | varchar(10) | default `tr-TR` |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `users`

Used for admin and employee accounts.

| Field | Type | Notes |
|---|---|---|
| id | uuid | PK |
| company_id | uuid | FK कंपनies.id |
| full_name | varchar(150) | |
| username | varchar(100) | unique within company |
| password_hash | text | Argon2 |
| role | varchar(20) | `admin`, `employee` |
| is_active | boolean | |
| last_login_at | timestamptz | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `employee_permissions`

| Field | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK users.id |
| can_view_customers | boolean | |
| can_create_customers | boolean | |
| can_create_deliveries | boolean | |
| can_edit_deliveries | boolean | |
| can_create_payments | boolean | |
| can_view_reports | boolean | |
| can_export_reports | boolean | |
| can_manage_employees | boolean | usually false |
| can_manage_settings | boolean | usually false |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `customers`

| Field | Type | Notes |
|---|---|---|
| id | uuid | PK |
| company_id | uuid | FK companies.id |
| customer_code | varchar(50) | internal reference |
| full_name | varchar(150) | customer name |
| phone | varchar(50) | optional |
| email | varchar(150) | optional |
| address | text | optional |
| notes | text | optional |
| is_active | boolean | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `customer_credentials`

Separate table for customer portal access.

| Field | Type | Notes |
|---|---|---|
| id | uuid | PK |
| customer_id | uuid | FK customers.id unique |
| username | varchar(100) | unique |
| password_hash | text | Argon2 |
| must_change_password | boolean | optional future feature |
| last_login_at | timestamptz | |
| is_active | boolean | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `product_memories`

Used for autofill suggestions.

| Field | Type | Notes |
|---|---|---|
| id | uuid | PK |
| company_id | uuid | FK companies.id |
| normalized_key | varchar(200) | normalized name/size search key |
| display_name | varchar(200) | full product name |
| size_label | varchar(100) | optional |
| default_unit | varchar(50) | optional |
| last_used_price_usd | numeric(12,2) | |
| usage_count | integer | |
| last_used_at | timestamptz | |
| created_by_user_id | uuid | FK users.id |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `deliveries`

Header row for a delivery/transaction day.

| Field | Type | Notes |
|---|---|---|
| id | uuid | PK |
| company_id | uuid | FK companies.id |
| customer_id | uuid | FK customers.id |
| created_by_user_id | uuid | FK users.id |
| transaction_date | date | auto-filled to current date by default |
| currency_base | varchar(3) | usually `USD` |
| exchange_currency | varchar(3) | nullable, e.g. `TRY` |
| exchange_rate | numeric(12,4) | nullable manual rate |
| exchange_note | text | nullable |
| subtotal_usd | numeric(12,2) | sum of items |
| note | text | optional |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `delivery_items`

| Field | Type | Notes |
|---|---|---|
| id | uuid | PK |
| delivery_id | uuid | FK deliveries.id |
| customer_id | uuid | denormalized FK for indexing/reporting |
| product_name | varchar(200) | saved final full name |
| product_size | varchar(100) | optional |
| quantity | numeric(12,3) | |
| unit_price_usd | numeric(12,2) | |
| line_total_usd | numeric(12,2) | quantity * unit_price |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `payments`

| Field | Type | Notes |
|---|---|---|
| id | uuid | PK |
| company_id | uuid | FK companies.id |
| customer_id | uuid | FK customers.id |
| entered_by_user_id | uuid | FK users.id |
| payment_date | date | exact payment date |
| amount_usd | numeric(12,2) | source accounting amount |
| exchange_currency | varchar(3) | nullable |
| exchange_rate | numeric(12,4) | nullable |
| amount_exchange | numeric(12,2) | nullable displayed/stored equivalent |
| exchange_note | text | nullable |
| payment_method | varchar(50) | cash, bank, transfer, etc. |
| reference_no | varchar(100) | optional |
| note | text | optional |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `audit_logs`

| Field | Type | Notes |
|---|---|---|
| id | uuid | PK |
| company_id | uuid | FK companies.id |
| actor_type | varchar(20) | `admin`, `employee`, `customer`, `system` |
| actor_id | uuid | nullable |
| action | varchar(100) | e.g. `CREATE_DELIVERY` |
| entity_type | varchar(100) | |
| entity_id | uuid | |
| metadata | jsonb | changed fields, context |
| created_at | timestamptz | |

### `report_request_logs`

| Field | Type | Notes |
|---|---|---|
| id | uuid | PK |
| company_id | uuid | FK companies.id |
| requested_by_type | varchar(20) | `admin`, `employee`, `customer` |
| requested_by_id | uuid | |
| customer_id | uuid | nullable for admin summary reports |
| report_type | varchar(30) | monthly, yearly, custom |
| from_date | date | |
| to_date | date | |
| export_format | varchar(20) | xlsx, pdf, print |
| created_at | timestamptz | |

## 6.2 Derived Balance Rule

Customer balance should be calculated as:

```text
Toplam Borç = Sum(delivery_items.line_total_usd)
Toplam Ödeme = Sum(payments.amount_usd)
Güncel Bakiye = Toplam Borç - Toplam Ödeme
```

### Recommendation

Do **not** store the final balance as editable source data.
Instead:

- calculate live in queries/services, or
- cache in a materialized/report table updated transactionally

For v1, use service-level calculation with optimized SQL and indexes.

## 6.3 Recommended Indexes

- `customers(company_id, full_name)`
- `customer_credentials(username)`
- `deliveries(company_id, customer_id, transaction_date desc)`
- `delivery_items(customer_id, product_name)`
- `payments(company_id, customer_id, payment_date desc)`
- `product_memories(company_id, normalized_key)`
- `audit_logs(company_id, created_at desc)`

## 6.4 Entity Relationships

- Company 1 → many Users
- Company 1 → many Customers
- User 1 → 1 EmployeePermission (for employee users)
- Customer 1 → 1 CustomerCredential
- Customer 1 → many Deliveries
- Delivery 1 → many DeliveryItems
- Customer 1 → many Payments
- Company 1 → many ProductMemories

---

## 7. Role & Permission Design

## 7.1 Roles

- **Admin**
- **Employee**
- **Customer**

## 7.2 Permission Matrix

| Action | Admin | Employee | Customer |
|---|---:|---:|---:|
| Login | ✅ | ✅ | ✅ |
| View own dashboard | ✅ | ✅ | ✅ (own only) |
| Create customers | ✅ | Optional | ❌ |
| Generate customer credentials | ✅ | Optional | ❌ |
| Create deliveries | ✅ | Optional | ❌ |
| Edit deliveries | ✅ | Optional | ❌ |
| Delete deliveries | ✅ | Optional restricted | ❌ |
| Record payments | ✅ | Optional | ❌ |
| View all customers | ✅ | Optional | ❌ |
| View single customer own data | ✅ | Optional | ✅ own only |
| Export reports | ✅ | Optional | ✅ own only |
| Print reports | ✅ | Optional | ✅ own only |
| Manage employees | ✅ | ❌ | ❌ |
| Manage settings | ✅ | ❌ | ❌ |
| Change customer data from portal | ❌ | ❌ | ❌ |

### Recommended v1 Employee Defaults

- can view customers
- can create deliveries
- can create payments
- can view reports
- cannot manage employees
- cannot manage system settings
- cannot access other security controls

---

## 8. Authentication & Authorization Design

## 8.1 Authentication Flows

### Admin / Employee

- username + password
- backend returns JWT access token + refresh token
- app stores tokens securely

### Customer

- username + password
- customer login endpoint issues customer-scoped token/session
- every request is filtered to that specific customer ID

## 8.2 Authorization Rules

### Admin

- unrestricted within company boundary

### Employee

- limited by explicit permissions table

### Customer

- all queries automatically constrained by `customer_id = authenticated_customer_id`
- no write endpoints exposed

## 8.3 Security Controls

- Argon2 password hashing
- short-lived access tokens
- refresh token rotation
- HTTPS only
- rate limiting on login endpoints
- audit logging for sensitive actions
- server-side permission checks on every protected endpoint
- no trust in client-side role checks
- account lockout / temporary throttling after repeated failed logins

## 8.4 Data Isolation Strategy

Customer-side isolation must be enforced in **backend services and queries**, not only in UI.

Example:

- customer token contains `customer_id`
- report endpoint ignores any customer ID passed from customer client
- backend always uses authenticated customer ID for customer portal requests

---

## 9. API Design

Base path:

```text
/api/v1
```

## 9.1 Auth Endpoints

### Admin/Employee

- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/change-password`
- `GET /auth/me`

### Customer

- `POST /customer-auth/login`
- `POST /customer-auth/logout`
- `GET /customer-auth/me`

## 9.2 Customer Management Endpoints

- `GET /customers`
- `POST /customers`
- `GET /customers/:customerId`
- `PATCH /customers/:customerId`
- `POST /customers/:customerId/reset-credentials`
- `GET /customers/:customerId/account-summary`

### Example `POST /customers`

Request:

```json
{
  "fullName": "Ahmet Yılmaz",
  "phone": "+90...",
  "email": "ahmet@example.com",
  "address": "İstanbul",
  "notes": "VIP müşteri"
}
```

Response:

```json
{
  "customerId": "uuid",
  "generatedUsername": "ahmet001",
  "generatedPassword": "TempPass123"
}
```

## 9.3 Employee Management Endpoints

- `GET /employees`
- `POST /employees`
- `GET /employees/:userId`
- `PATCH /employees/:userId`
- `PATCH /employees/:userId/permissions`
- `POST /employees/:userId/reset-password`

## 9.4 Product Autofill Endpoints

- `GET /product-memories/suggest?q=...`
- `POST /product-memories`
- `PATCH /product-memories/:id`

Response example:

```json
[
  {
    "id": "uuid",
    "displayName": "Büyük Boy Plastik Kova",
    "sizeLabel": "20L",
    "lastUsedPriceUsd": 14.50,
    "usageCount": 12
  }
]
```

## 9.5 Delivery Endpoints

- `GET /deliveries`
- `POST /deliveries`
- `GET /deliveries/:deliveryId`
- `PATCH /deliveries/:deliveryId`
- `DELETE /deliveries/:deliveryId`

### Example `POST /deliveries`

```json
{
  "customerId": "uuid",
  "transactionDate": "2026-05-07",
  "exchangeCurrency": "TRY",
  "exchangeRate": 38.25,
  "exchangeNote": "Günlük kur",
  "note": "Sabah teslimatı",
  "items": [
    {
      "productName": "Orta Boy Koli",
      "productSize": "M",
      "quantity": 10,
      "unitPriceUsd": 3.50
    }
  ]
}
```

Backend must calculate each `lineTotalUsd` and `subtotalUsd`.

## 9.6 Payment Endpoints

- `GET /payments`
- `POST /payments`
- `GET /payments/:paymentId`
- `PATCH /payments/:paymentId`
- `DELETE /payments/:paymentId`

### Example `POST /payments`

```json
{
  "customerId": "uuid",
  "paymentDate": "2026-05-07",
  "amountUsd": 250.00,
  "exchangeCurrency": "TRY",
  "exchangeRate": 38.20,
  "exchangeNote": "Nakit ödeme",
  "paymentMethod": "cash",
  "referenceNo": "REF-2026-001",
  "note": "Kısmi ödeme"
}
```

## 9.7 Reporting Endpoints

- `GET /reports/customer-summary?customerId=...`
- `GET /reports/customer-ledger?customerId=...&from=...&to=...`
- `GET /reports/monthly?customerId=...&year=...&month=...`
- `GET /reports/yearly?customerId=...&year=...`
- `GET /reports/custom?customerId=...&from=...&to=...`
- `GET /reports/export/xlsx?...`
- `GET /reports/export/print?...`

## 9.8 Customer Portal Endpoints

These are customer-scoped and must ignore foreign customer IDs.

- `GET /portal/dashboard`
- `GET /portal/deliveries`
- `GET /portal/payments`
- `GET /portal/reports/monthly`
- `GET /portal/reports/yearly`
- `GET /portal/reports/custom`
- `GET /portal/reports/export/xlsx`
- `GET /portal/reports/export/print`

## 9.9 Settings Endpoints

- `GET /settings/company`
- `PATCH /settings/company`
- `GET /settings/currencies`
- `PATCH /settings/security`

---

## 10. Android App Information Architecture

## 10.1 Main App Modules

- Auth
- Dashboard
- Customers
- Deliveries
- Payments
- Reports
- Employees
- Settings

## 10.2 Android Screen List

### 1. Splash / Session Check

- checks existing token
- routes to login or dashboard

### 2. First Password Setup

- shown when admin uses initial setup
- fields:
  - new password
  - confirm password
- action:
  - save secure admin password

### 3. Login Screen

Turkish labels:

- `Kullanıcı Adı`
- `Şifre`
- `Giriş Yap`

### 4. Dashboard

Cards:

- `Bugünkü Teslimatlar`
- `Bugünkü Ödemeler`
- `Toplam Alacak`
- `Müşteri Sayısı`

Quick actions:

- `Yeni Teslimat`
- `Yeni Ödeme`
- `Yeni Müşteri`
- `Raporlar`

### 5. Customer List Screen

- search customer
- add customer button
- customer cards show:
  - name
  - current balance
  - last transaction date

### 6. Add/Edit Customer Screen

Fields:

- `Ad Soyad`
- `Telefon`
- `E-Posta`
- `Adres`
- `Not`

After save:

- generated username
- generated password
- copy/share option

### 7. Customer Detail Screen

Tabs:

- `Genel`
- `Teslimatlar`
- `Ödemeler`
- `Raporlar`

Summary:

- total debt
- total payment
- current balance

### 8. New Delivery Screen

Fields:

- `Müşteri`
- `Tarih` (auto-filled to today)
- `Kur Para Birimi` (optional TRY)
- `Kur`
- `Kur Notu`
- repeatable item rows

Item row fields:

- `Ürün Adı`
- `Boyut`
- `Miktar`
- `Birim Fiyat (USD)`
- `Satır Toplamı`

Behavior:

- typing product name/size triggers autofill suggestions
- unit price auto-filled from history
- line total auto-calculated
- screen subtotal auto-calculated

### 9. Payment Entry Screen

Fields:

- `Müşteri`
- `Tarih`
- `Ödeme Tutarı (USD)`
- `TRY Karşılığı`
- `Kur`
- `Ödeme Yöntemi`
- `Referans No`
- `Not`

### 10. Reports Screen

Filters:

- customer
- monthly
- yearly
- custom range

Actions:

- preview
- export Excel
- print/share

### 11. Employee Management Screen

- employee list
- add employee
- set permissions

### 12. Settings Screen

- company settings
- default currency
- localization info
- security settings

## 10.3 Android Navigation Flow

```text
Splash
  -> Login / Password Setup
  -> Dashboard
      -> Customers
          -> Customer Detail
              -> New Delivery
              -> New Payment
              -> Reports
      -> Reports
      -> Employees
      -> Settings
```

---

## 11. Customer Website Information Architecture

## 11.1 Main Pages

### 1. Login Page

Turkish UI:

- `Kullanıcı Adı`
- `Şifre`
- `Giriş Yap`

### 2. Dashboard

Widgets:

- `Güncel Borç`
- `Toplam Teslimat`
- `Toplam Ödeme`
- `Son İşlem Tarihi`

Charts:

- monthly delivery total
- monthly payment total
- current balance trend

### 3. Deliveries Page

Views:

- daily list
- by item
- date filter

Columns:

- tarih
- ürün adı
- boyut
- miktar
- birim fiyat
- toplam

### 4. Payments Page

Columns:

- ödeme tarihi
- tutar
- yöntem
- referans
- not

### 5. Reports Page

Options:

- `Aylık Rapor`
- `Yıllık Rapor`
- `Özel Tarih Aralığı`

Output:

- Excel-like table
- charts
- total debt
- total payment
- current balance

Actions:

- `Excel İndir`
- `Yazdır`

### 6. Printable Report Page

- print-optimized layout
- company info
- customer info
- date range
- table and totals

## 11.2 Website UX Rules

- read-only only
- no edit buttons
- no mutation routes for customers
- responsive for mobile and desktop browsers

---

## 12. Autofill System Design

## 12.1 Goal

When the admin starts typing product name or size:

- suggest previously used matching items
- auto-fill full product name
- auto-fill last used USD price
- optionally fill size

## 12.2 Data Source

`product_memories` table populated from:

- successful delivery item creation
- optional manual edits by admin in future

## 12.3 Matching Strategy

Use normalized search:

- lowercase
- trim extra spaces
- remove duplicate separators
- optionally normalize Turkish characters for search fallback

Search candidates by:

1. exact normalized key
2. prefix match
3. contains match
4. order by usage count + last used date

## 12.4 Example Flow

Admin types:

- `kova`

Suggestions:

- `Büyük Boy Plastik Kova - 20L - 14.50 USD`
- `Orta Boy Plastik Kova - 10L - 9.20 USD`

On selection:

- fill product name
- fill size
- fill last used price

## 12.5 Backend Support

- lightweight suggestion endpoint
- debounced search from Android client
- optional local Room cache for recent suggestions

## 12.6 Guardrails

- autofill is assistive only, not forced
- admin can always override product name and price
- final accounting values always come from saved transaction payload

---

## 13. Reporting Design

## 13.1 Report Types

- Monthly
- Yearly
- Custom date range

## 13.2 Report Contents

- customer information
- date range
- deliveries table
- payments table
- totals
- current balance
- charts

## 13.3 Excel Export

Use **ExcelJS** on backend to generate:

- sheet 1: summary
- sheet 2: deliveries
- sheet 3: payments

Suggested columns:

### Deliveries

- Tarih
- Ürün
- Boyut
- Miktar
- Birim Fiyat (USD)
- Toplam (USD)

### Payments

- Tarih
- Tutar (USD)
- Kur
- TRY Karşılığı
- Yöntem
- Referans

## 13.4 Chart Data

Backend returns chart-ready aggregated data:

- total deliveries by month
- total payments by month
- balance progression over time

---

## 14. Localization (Turkish)

All user-facing text must be in **Turkish**.

This includes:

- buttons
- menus
- labels
- error messages
- notifications
- report titles
- table headers
- status messages
- printable views
- Excel sheet names and exported headers

## 14.1 Localization Strategy

- keep all strings in translation files
- Android: string resources / localization layer
- Web: i18n dictionary files
- backend-generated exports and messages also use Turkish labels

## 14.2 Formatting Rules

- locale: `tr-TR`
- dates shown in Turkish format
- currency labels shown clearly:
  - `USD`
  - `TRY`

Example labels:

- `Güncel Bakiye`
- `Toplam Borç`
- `Toplam Ödeme`
- `Teslimatlar`
- `Ödemeler`
- `Rapor İndir`

---

## 15. Accounting & Calculation Rules

## 15.1 Delivery Item

```text
Satır Toplamı = Miktar × Birim Fiyat (USD)
```

## 15.2 Delivery Total

```text
Teslimat Toplamı = all line totals summed
```

## 15.3 Customer Balance

```text
Güncel Bakiye = Toplam Teslimatlar - Toplam Ödemeler
```

## 15.4 TRY Display

If exchange rate is provided:

```text
TRY Karşılığı = USD Tutar × Kur
```

Important:

- USD remains the source accounting base
- TRY is display/support information unless future business rules require primary TRY accounting

---

## 16. Audit, Logging, and Traceability

Every important write action should create an audit record:

- customer created
- customer credential reset
- delivery created/edited/deleted
- payment created/edited/deleted
- employee permission changed
- login success/failure

This is important for:

- business traceability
- employee accountability
- debugging
- future compliance needs

---

## 17. Performance Considerations

- paginate deliveries and payments lists
- add date-range indexes
- aggregate report queries at SQL level
- cache recent product suggestions in app
- avoid loading full history on dashboard

---

## 18. Suggested Folder Structure

## 18.1 Backend

```text
backend/
  src/
    modules/
      auth/
      customer-auth/
      users/
      employees/
      customers/
      deliveries/
      payments/
      reports/
      product-memories/
      settings/
      audit/
    common/
    prisma/
```

## 18.2 Android

```text
android-app/
  app/
    src/main/java/.../
      data/
      domain/
      presentation/
      navigation/
      di/
```

## 18.3 Web

```text
web-portal/
  app/
  components/
  lib/
  services/
  i18n/
```

---

## 19. Phased Implementation Roadmap

## Phase 1 — Foundation

### Deliverables

- project setup for backend, Android app, and web portal
- PostgreSQL schema
- auth system
- admin login
- customer login
- base Turkish localization setup

### Acceptance Criteria

- admin can log in
- customer can log in
- protected routes work
- database migrations run successfully

## Phase 2 — Customer & Employee Management

### Deliverables

- create/edit customers
- generate customer credentials
- create employees
- assign permissions

### Acceptance Criteria

- admin can create customer and receive username/password
- admin can create employee with limited permissions
- customer sees only own account after login

## Phase 3 — Delivery Entry & Autofill

### Deliverables

- delivery header + items creation
- auto date filling
- subtotal calculations
- product memories suggestion API
- Android autofill UX

### Acceptance Criteria

- admin can add deliveries for a customer
- line totals and subtotal calculate automatically
- typing existing product terms suggests previous price/name

## Phase 4 — Payment Tracking

### Deliverables

- payment entry
- payment history
- updated running balance
- TRY note and exchange rate support

### Acceptance Criteria

- admin can record payments
- customer balance updates correctly
- payment dates appear correctly in portal and reports

## Phase 5 — Customer Portal Views

### Deliverables

- dashboard
- deliveries list
- payments list
- date filters
- charts

### Acceptance Criteria

- customer can view daily and itemized records
- customer cannot edit anything
- charts and summaries load correctly

## Phase 6 — Reports, Export, and Print

### Deliverables

- monthly/yearly/custom reports
- Excel export
- print view
- report logging

### Acceptance Criteria

- customer can generate own reports
- admin can export customer reports
- printed view is readable and Turkish

## Phase 7 — Hardening & Release

### Deliverables

- audit logs
- rate limiting
- validation hardening
- QA pass
- deployment pipeline

### Acceptance Criteria

- role checks verified
- customer isolation verified
- major workflows tested end-to-end

---

## 20. Suggested Milestones

| Milestone | Scope | Estimated Outcome |
|---|---|---|
| M1 | Foundation + Auth | working backend + logins |
| M2 | Customer/Employee management | account setup usable |
| M3 | Delivery + autofill | main business workflow usable |
| M4 | Payments + balances | accounting flow usable |
| M5 | Customer portal | customer visibility ready |
| M6 | Reports + export + print | operational release candidate |
| M7 | Hardening + deployment | production-ready release |

---

## 21. Testing Strategy

## Backend

- unit tests for calculations
- integration tests for auth
- authorization tests for role restrictions
- customer isolation tests
- report query tests

## Android

- ViewModel tests
- UI tests for forms and calculations
- autofill behavior tests

## Web

- route protection tests
- report rendering tests
- print layout smoke tests

## Critical End-to-End Tests

1. Admin creates customer
2. Admin records delivery
3. Admin records payment
4. Customer logs in and sees correct updated balance
5. Customer exports monthly report
6. Employee access is limited correctly

---

## 22. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Incorrect balance calculations | High | centralize calculation service + tests |
| Customer data leakage | Critical | strict backend scoping by customer ID |
| Poor autofill quality | Medium | ranking by recent usage + usage count |
| Export mismatch vs UI | Medium | shared report service for UI + export |
| Employee over-permissioning | High | explicit permission matrix + audit logs |

---

## 23. Recommended v1 Scope

To reach a usable first release quickly, prioritize:

1. Admin login
2. Customer creation with credentials
3. Delivery entry
4. Payment entry
5. Running balance
6. Customer read-only portal
7. Monthly/yearly/custom reports
8. Excel export
9. Full Turkish UI

---

## 24. Final Recommendation

Build the system as:

- **Android app:** Kotlin + Jetpack Compose
- **Backend:** NestJS + Prisma
- **Database:** PostgreSQL
- **Customer website:** Next.js

This combination best fits:

- accounting-style structured data
- secure role-based access
- Turkish UI support
- report generation
- long-term maintainability

The system should use **USD as the source accounting currency**, support **manual TRY exchange display**, and enforce **strict customer-level data isolation** at the backend level.