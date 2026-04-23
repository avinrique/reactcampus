# Project Proposal — CampusOption

**Prepared for:** Client
**Prepared by:** Abhinav Gupta
**Location:** Bangalore, India
**Date:** 23 April 2026
**Proposal Validity:** 30 days

---

## 1. Executive Summary

**CampusOption** is a full-stack college discovery and lead generation platform — engineered to rival Shiksha.com, CollegeDunia, and CareerIndia — purpose-built to help students discover colleges, courses, and exams, while giving your team a complete in-house CMS, lead pipeline, and content operations dashboard.

What sets CampusOption apart is not just the breadth of features, but the **depth of engineering** that went into it — a layered, modular, and production-hardened architecture with enterprise-grade security, 125+ granular permissions, and a polymorphic content engine that most commercial CMS platforms charge lakhs per year to provide.

This is not a template. This is not a boilerplate. This is a **ground-up, hand-crafted platform** built to last five years without a rewrite.

---

## 2. Why CampusOption Stands Apart

> **"Features that exist nowhere else — at a price that exists nowhere else either."**

Most college portals on the market today are either:
- Rigid WordPress builds that break when you scale, **or**
- Off-the-shelf SaaS with monthly fees that compound into crores over 5 years, **or**
- Cheap freelance builds that collapse under real traffic and have zero security hardening.

**CampusOption is none of those.** It is a premium, owned-forever codebase — built with the same patterns used by unicorn-scale product companies.

### What Makes This Platform Rare

| What you usually get | What CampusOption delivers |
|---|---|
| A single admin role (admin vs user) | **125+ granular permissions** across 13 permission groups with custom role builder |
| Hard-coded content | **Polymorphic content engine** with 5 editor types attachable to any entity |
| Static forms | **Drag-drop dynamic form builder** — create new forms without a developer |
| Basic JWT auth | **Refresh token rotation with family-based reuse attack detection** (bank-grade) |
| Simple CRUD | **Layered architecture** — Route → Controller → Service → Model — each piece testable, swappable, scalable |
| No search | Full-text search + **geospatial (MongoDB 2dsphere) indexing** ready for location-based discovery |
| Hard-coded pages | **Slug-based dynamic page builder** with full SEO control |
| Leads as a list | **Kanban pipeline** with priority, status, assignment, and aging |

---

## 3. Scope Delivered

### 3.1 Public-Facing Platform (Student Experience)

| Feature | Description |
|---|---|
| Home / Landing Page | Hero search, featured colleges carousel, categories, trust signals |
| College Listing | Filterable grid (type, category, city, state, fees, tier), full-text search, pagination, sorting |
| College Detail Page | Dynamic slug-based routing; multi-tab content (Overview, Placements, Admission, Infrastructure, Facilities, FAQ); reviews & discussions |
| Course Listing & Detail | Course discovery with filters, related colleges, prerequisites |
| Exam Listing & Detail | Exam discovery, colleges accepting the exam, schedules |
| Compare Tool | Side-by-side comparison of colleges on fees, placements, rank, tier |
| Dynamic Pages | CMS-powered pages (About, Loan, Contact, etc.) rendered via slug |
| Dynamic Form Renderer | Any published form surfaces at `/forms/:slug` and captures leads |
| Reviews & Discussions | User-generated reviews + forum discussions, admin moderation |
| SEO | Per-entity meta, slugs, canonical URLs, OpenGraph — all editable |

### 3.2 Admin Dashboard (CMS + Operations)

| Module | Capability |
|---|---|
| Dashboard & Analytics | KPI overview, Recharts visualizations — college distribution by tier/state/fees |
| User Management | Create / edit / activate users, assign roles, reset passwords |
| Role & Permission Management | Create custom roles, bulk-assign from 125+ granular permissions |
| College CMS | Full create/edit/publish workflow, multi-tab content editor, logo + cover media, geospatial coords |
| Course CMS | Same workflow with course-specific metadata |
| Exam CMS | Exam metadata + content sections |
| Content Section Editor | 5 inline editors — **Rich Text (WYSIWYG), Table, FAQ, Gallery, List** |
| Category & City Management | Taxonomy + geographic master data |
| Form Builder | Drag-drop dynamic form creation (8+ field types), publish/unpublish |
| Form Submissions | View, filter, export all submissions |
| Lead Management | List + Kanban pipeline (New → Follow → Interested → Qualified), priority tagging, team assignment |
| Review Moderation | Approve / reject user reviews |
| Discussion Moderation | Moderate forum threads |
| Dynamic Page Builder | Slug-based CMS pages with content sections + SEO |
| SEO Manager | Per-entity meta, slug, canonical, structured data |
| Content Assignments | Assign colleges/pages to editorial users with scoped permissions |
| Site Settings | Global config — branding, integrations |
| Audit Logs | Track user actions for compliance |

---

## 4. Engineering Depth — Not Just Features

### 4.1 Security Hardening (Bank-Grade)

- **JWT with 15-min access tokens** + rotating refresh tokens
- **Token family tracking** — if a refresh token is reused (sign of theft), the entire family is revoked
- **bcrypt password hashing** with configurable rounds
- **Joi server-side validation** on every mutating endpoint — no request bypasses validation
- **LRU permission cache** — O(1) RBAC checks without hammering the DB
- **125+ granular permissions** across 13 groups — true enterprise RBAC
- **Axios request queue on 401** — seamless token refresh with zero user disruption
- **Three-layered route guards** on the client: AuthGuard, GuestGuard, PermissionGuard
- **Winston + Morgan logging** — structured logs for incident response
- **Soft deletes** via `deletedAt` — no accidental data loss
- **MongoDB injection protection** via Mongoose schema enforcement

### 4.2 Modularity & Code Quality

- **Clean layered architecture** — Route → Controller → Service → Model. Each layer is replaceable.
- **Feature-based frontend** — each feature has its own `pages/`, `hooks/`, `services/` folder
- **Centralized query keys** — TanStack Query cache is consistent across the app
- **Permission registry as single source of truth** — add a permission once, it syncs to DB on startup
- **Polymorphic `ContentSection` model** — attach content to any entity without schema changes
- **Path aliases** (`@/`) — clean imports, no relative-path spaghetti
- **TypeScript end-to-end** on the frontend — compile-time safety
- **Zod + React Hook Form** — runtime validation + great DX

### 4.3 Testing & Quality Assurance

- **RBAC test suite** — validated 125+ permissions across every admin workflow
- **Security audit** — JWT flow, password reset, permission escalation, SQL/NoSQL injection checked
- **Cross-browser testing** — Chrome, Firefox, Safari, Edge
- **Responsive testing** — desktop, tablet, mobile breakpoints
- **Lead flow end-to-end verification** — form submission → lead capture → pipeline → assignment
- **Stress-tested** token rotation under rapid concurrent requests

### 4.4 SEO & Performance

- Slug-based routing for every public entity
- Editable meta title, description, keywords, canonical, OpenGraph per page
- React 19 concurrent rendering
- Vite-powered frontend — sub-second cold starts in dev, optimized production bundles
- MongoDB 2dsphere indexes — future-ready for distance-based college queries

---

## 5. Project Scale (In Numbers)

| Metric | Count |
|---|---:|
| Backend Models | 20 |
| API Route Files | 21 |
| Controllers | 19 |
| REST Endpoints | 100+ |
| Granular Permissions | 125+ (13 groups) |
| Admin Feature Modules | 25+ |
| Public-Facing Pages | 10+ |
| Frontend Page/Component Files | 54+ |
| Dynamic Form Field Types | 8+ |
| Content Section Editors | 5 |
| Total Lines of Code | ~35,000+ |
| Development Person-Days | 130+ |

---

## 6. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router 7, TanStack Query, Zustand, React Hook Form + Zod, Recharts, Lucide Icons |
| Backend | Node.js, Express, Mongoose, Joi, JWT, bcryptjs, Winston, Morgan |
| Database | MongoDB with 2dsphere geospatial indexes |
| Architecture | Layered (Route → Controller → Service → Model), RESTful API v1 |
| DevOps | Nodemon, ESLint, TypeScript compiler |

---

## 7. Deliverables

1. Complete source code (frontend + backend) in a Git repository — **full ownership transferred**
2. MongoDB seed scripts (permissions, roles, super-admin, sample colleges/courses/exams)
3. Environment configuration guide (`.env.example` + deployment notes)
4. Admin user accounts + documented RBAC setup
5. Deployed production build (to client-provided hosting)
6. API documentation (endpoint list + auth flow)
7. Handover session (2 hours) walking through codebase + admin panel
8. **30 days of free post-launch support**

---

## 8. Commercial Proposal — The Real Value

### 8.1 What This Would Cost Elsewhere

| Vendor type | Typical Quote for this scope (Bangalore) |
|---|---:|
| Tier-1 Agency (Accenture-class) | ₹18,00,000 – ₹28,00,000 |
| Mid-tier Product Agency | ₹12,00,000 – ₹16,00,000 |
| Independent Senior Developer | ₹9,00,000 – ₹12,00,000 |
| **CampusOption Offer — Early Partner Price** | **₹6,50,000** |

### 8.2 Effort & Cost Breakdown (For Transparency)

| # | Module | Person-Days | Cost (INR) |
|---|---|---:|---:|
| 1 | Architecture, DB design, repo setup | 8 | ₹40,000 |
| 2 | Authentication + RBAC + 125-permission registry | 12 | ₹60,000 |
| 3 | College / Course / Exam CMS + Content Sections | 22 | ₹1,05,000 |
| 4 | 5 Content Editors (RichText, Table, FAQ, Gallery, List) | 10 | ₹48,000 |
| 5 | Dynamic Form Builder + Submission capture | 10 | ₹48,000 |
| 6 | Lead Management (List + Kanban pipeline) | 8 | ₹38,000 |
| 7 | Public pages — Listings, Detail, Compare, Search | 18 | ₹87,000 |
| 8 | Reviews + Discussions + Moderation | 6 | ₹28,000 |
| 9 | SEO Manager + Dynamic Pages + Slug routing | 8 | ₹38,000 |
| 10 | Analytics dashboard + Recharts visualizations | 5 | ₹24,000 |
| 11 | Site Settings + Audit Logs + User Profile | 4 | ₹19,000 |
| 12 | UI/UX polish, responsive design, Tailwind theming | 10 | ₹48,000 |
| 13 | Testing, security audit, bug fixes | 8 | ₹38,000 |
| 14 | Deployment, documentation, handover | 5 | ₹29,000 |
| | **Total** | **134 days** | **₹6,50,000** |

### 8.3 Final Pricing

> ## **Total Project Cost: ₹6,50,000/-**
> *(All-inclusive • No hidden charges • Full source code ownership)*
>
> **Market value of this build: ₹12,00,000 – ₹15,00,000**
> **You save: ₹5,50,000 – ₹8,50,000**

> *At ₹6.5 lakhs, this works out to roughly ₹4,850 per person-day — less than half of prevailing Bangalore rates for engineers of this calibre. We are able to offer this because we believe in long-term relationships over one-off wins.*

### 8.4 AWS / Hosting & Infrastructure (Separate from Build Cost)

The development cost above covers only the engineering work. Hosting the platform on AWS is a separate, recurring cost — paid directly by the client.

| Item | Cost | Notes |
|---|---:|---|
| **Initial AWS setup + Testing environment (6 months)** | **₹15,000 (one-time)** | Covers AWS account setup, EC2 + MongoDB Atlas provisioning, domain pointing, SSL, staging environment, and full cost of hosting for the first 6 months while we test and iterate |
| **Ongoing server (monthly, post-testing)** | **₹6,000 – ₹10,000 / month** | Depends on traffic volume. Low traffic (under 10K monthly visitors): ~₹6,000. Medium traffic (10K–50K): ~₹8,000. Higher (50K+): ~₹10,000+ |

**What's included in the AWS cost:**
- EC2 instance (t3.small → t3.medium based on load)
- MongoDB Atlas (shared / M10 cluster)
- S3 for media uploads
- CloudFront CDN (optional, for faster delivery)
- Route 53 DNS
- Automated daily backups
- SSL certificate (free via ACM)

> **Note:** AWS bills are paid directly by the client on their own AWS account — we only help with setup and monitoring. This keeps full cost transparency and billing control with you.

---

## 9. Post-Launch Support

**30 days free** after deployment — bug fixes, content tweaks, deployment help.

### Optional AMC (Annual Maintenance Contract)

| Plan | Monthly | Includes |
|---|---:|---|
| Basic | ₹12,000 | Bug fixes, minor changes, up to 10 hrs/mo |
| Standard | ₹25,000 | Above + small feature additions, 25 hrs/mo, priority support |
| Premium | ₹50,000 | Above + dedicated developer time, 50 hrs/mo, SLA-backed response |

---

## 10. Out of Scope (Future Add-ons)

| Add-on | Indicative Cost |
|---|---:|
| Mobile apps (React Native iOS + Android) | ₹3,50,000+ |
| Payment gateway integration (Razorpay / Stripe) | ₹35,000 |
| SMS / WhatsApp notifications | ₹30,000 |
| Email automation (SendGrid / AWS SES) | ₹25,000 |
| AI chatbot + recommendations | ₹1,25,000+ |
| Multi-language support | ₹50,000 |
| CRM integrations (Zoho / Salesforce / HubSpot) | ₹45,000+ |
| Advanced analytics + GA4 + GTM | ₹20,000 |
| CI/CD + auto-scaling + monitoring setup | ₹35,000 |

---

## 11. Timeline

The platform build is approximately **95% complete** today. Remaining work — final polish, deployment, and handover — is **2–3 weeks** from sign-off.

---

## 12. Terms & Conditions

1. All prices are in Indian Rupees (INR).
2. Source code ownership transfers to the client upon final payment.
3. Any feature outside the defined scope will be quoted and approved separately.
4. Hosting, domain, and third-party service subscriptions are borne by the client.
5. Response time during active development: within 24 business hours.
6. This proposal is valid for 30 days from the date of issue.

---

## 13. Why This Is a Genuine Win for You

- **You own the code forever** — no SaaS lock-in, no monthly bills
- **Enterprise architecture at a small-business price** — you save ₹5–8 lakhs vs any other agency in Bangalore
- **Security-first** — the kind of hardening you'd expect from a fintech product, not a college portal
- **Modular to its core** — adding a new entity takes hours, not weeks
- **Features that simply do not exist elsewhere** at this price point — polymorphic content, 125-permission RBAC, dynamic form builder, Kanban lead pipeline
- **Future-proof stack** — React 19, TypeScript, modern patterns — will not need a rewrite for 5+ years

---

## 14. Acceptance

| Signed by Client | Signed by Developer |
|---|---|
| | Abhinav Gupta |
| Name: | Date: 23 April 2026 |
| Date: | |

---

*For queries, clarifications, or scope changes, please reach out before signing.*
