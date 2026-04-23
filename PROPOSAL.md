# Project Proposal — ReactCampus

**Prepared for:** Client
**Prepared by:** Abhinav Gupta
**Location:** Bangalore, India
**Date:** 23 April 2026
**Proposal Validity:** 30 days

---

## 1. Executive Summary

ReactCampus is a full-stack college discovery and lead generation platform — built on the lines of CampusOption / Shiksha.com — designed to help students discover colleges, courses, and exams, while giving your team a complete in-house CMS, lead pipeline, and content operations dashboard.

The platform has been engineered from the ground up with a modern, production-grade stack: **React 19 + TypeScript** frontend, **Node.js + Express + MongoDB** backend, a fine-grained **Role-Based Access Control (RBAC)** system with 125+ permissions, and a polymorphic content engine that lets your editorial team publish rich, SEO-optimized pages without developer involvement.

This document summarizes the scope delivered, the technical architecture, and the commercial terms.

---

## 2. Scope Delivered

### 2.1 Public-Facing Platform (Student Experience)

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

### 2.2 Admin Dashboard (CMS + Operations)

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

### 2.3 Authentication & Security

- JWT-based authentication (15-minute access tokens)
- Refresh token rotation with **token-family tracking** to detect reuse attacks
- In-memory LRU permission cache for low-latency RBAC
- Axios interceptor with automatic token refresh + request queuing
- Client-side route guards: `AuthGuard`, `GuestGuard`, `PermissionGuard`
- Joi server-side validation on every mutating endpoint
- bcrypt password hashing
- Winston + Morgan logging

### 2.4 Technical Architecture

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router 7, TanStack Query, Zustand, React Hook Form + Zod, Recharts
- **Backend:** Node.js, Express, Mongoose, Joi, JWT, bcryptjs, Winston
- **Database:** MongoDB with 2dsphere geospatial indexes (for location-based queries)
- **Architecture:** Clean layered design — Route → Controller → Service → Model
- **API:** 100+ REST endpoints, versioned under `/api/v1`

---

## 3. Project Scale

| Metric | Count |
|---|---|
| Backend Models | 20 |
| API Route Files | 21 |
| Controllers | 19 |
| REST Endpoints | 100+ |
| Granular Permissions | 125+ (13 permission groups) |
| Admin Feature Modules | 25+ |
| Public-Facing Pages | 10+ |
| Frontend Page/Component Files | 54+ |
| Dynamic Form Field Types | 8+ |
| Content Section Editors | 5 |

---

## 4. Deliverables

1. Complete source code (frontend + backend) in a Git repository
2. MongoDB seed scripts (permissions, roles, super-admin, sample colleges/courses/exams)
3. Environment configuration guide (`.env.example` + deployment notes)
4. Admin user accounts + documented RBAC setup
5. Deployed production build (to client-provided hosting)
6. API documentation (endpoint list + auth flow)
7. Handover session (2 hours) walking through codebase + admin panel

---

## 5. Commercial Proposal (Bangalore / India Market)

### 5.1 Cost Breakdown

| # | Module | Effort (Person-Days) | Cost (INR) |
|---|---|---:|---:|
| 1 | Architecture, DB design, repo setup, CI-ready config | 8 | ₹40,000 |
| 2 | Authentication + RBAC + 125-permission registry | 12 | ₹60,000 |
| 3 | College / Course / Exam CMS + Content Sections | 22 | ₹1,10,000 |
| 4 | 5 Content Editors (RichText, Table, FAQ, Gallery, List) | 10 | ₹50,000 |
| 5 | Dynamic Form Builder + Submission capture | 10 | ₹50,000 |
| 6 | Lead Management (List + Kanban pipeline) | 8 | ₹40,000 |
| 7 | Public pages — Listings, Detail, Compare, Search | 18 | ₹90,000 |
| 8 | Reviews + Discussions + Moderation | 6 | ₹30,000 |
| 9 | SEO Manager + Dynamic Pages + Slug routing | 8 | ₹40,000 |
| 10 | Analytics dashboard + Recharts visualizations | 5 | ₹25,000 |
| 11 | Site Settings + Audit Logs + User Profile | 4 | ₹20,000 |
| 12 | UI/UX polish, responsive design, Tailwind theming | 10 | ₹50,000 |
| 13 | Testing, bug fixes, security hardening | 8 | ₹40,000 |
| 14 | Deployment, documentation, handover | 5 | ₹25,000 |
| | **Subtotal** | **134 days** | **₹6,70,000** |
| | Project Management & Coordination (10%) | | ₹67,000 |
| | **Total (excl. GST)** | | **₹7,37,000** |
| | GST @ 18% | | ₹1,32,660 |
| | **Grand Total** | | **₹8,69,660** |

### 5.2 Package Summary

> **Total Project Cost: ₹7,37,000 + 18% GST = ₹8,69,660/-**
> *(Approx. USD 8,800 — Bangalore market rate for a full-stack platform of this scale)*

### 5.3 Payment Milestones

| Milestone | % | Amount (excl. GST) |
|---|---:|---:|
| Project kickoff | 25% | ₹1,84,250 |
| Backend + RBAC + Core CMS complete | 25% | ₹1,84,250 |
| Public-facing + Admin modules complete | 25% | ₹1,84,250 |
| Deployment + Handover + Sign-off | 25% | ₹1,84,250 |

---

## 6. Post-Launch Support

Included free for **30 days** after deployment:
- Bug fixes on delivered features
- Minor copy / content tweaks
- Deployment troubleshooting

### Optional AMC (Annual Maintenance Contract)

| Plan | Monthly Cost | Includes |
|---|---:|---|
| Basic | ₹15,000 | Bug fixes, minor changes, up to 10 hrs/mo |
| Standard | ₹30,000 | Above + small feature additions, 25 hrs/mo, priority support |
| Premium | ₹60,000 | Above + dedicated developer time, 50 hrs/mo, SLA-backed response |

---

## 7. Out of Scope (Available as Add-ons)

| Add-on | Estimated Cost |
|---|---:|
| Mobile apps (React Native iOS + Android) | ₹3,50,000 – ₹5,00,000 |
| Payment gateway integration (Razorpay / Stripe) | ₹40,000 |
| SMS / WhatsApp notifications (Twilio / Gupshup) | ₹35,000 |
| Email automation (SendGrid / AWS SES + templates) | ₹30,000 |
| Advanced AI features (chatbot, recommendations) | ₹1,50,000+ |
| Multi-language support (Hindi + regional) | ₹60,000 |
| Third-party integrations (Zoho, Salesforce, HubSpot CRM) | ₹50,000+ |
| Advanced analytics + Google Tag Manager + GA4 | ₹25,000 |
| Dedicated DevOps setup (CI/CD, auto-scaling, monitoring) | ₹40,000 |

---

## 8. Timeline

The platform build spans approximately **10–12 weeks** of focused development. Current status: **95% complete** — core platform, admin CMS, public pages, and RBAC are fully operational. Remaining work is polish, deployment, and handover.

---

## 9. Terms & Conditions

1. All prices are in Indian Rupees (INR) unless stated otherwise.
2. GST @ 18% is applicable on all invoices.
3. Source code ownership transfers to the client upon final payment.
4. Any feature outside the defined scope will be quoted and approved separately.
5. Hosting, domain, third-party service subscriptions (MongoDB Atlas, AWS, email providers, etc.) are borne by the client.
6. Response time during active development: within 24 business hours.
7. This proposal is valid for 30 days from the date of issue.

---

## 10. Why Choose This Build

- **Production-grade architecture** — not a template or boilerplate; built with layered, testable, scalable patterns
- **125+ granular permissions** — enterprise-level access control, not a simple role switch
- **Polymorphic content engine** — add new content types without schema migrations
- **Modern stack** — React 19, MongoDB geospatial, TanStack Query — ready for the next 5 years
- **Zero vendor lock-in** — self-hosted, open-source stack, full code ownership

---

## 11. Acceptance

| Signed by Client | Signed by Developer |
|---|---|
| | Abhinav Gupta |
| Name: | Date: 23 April 2026 |
| Date: | |

---

*For queries, clarifications, or scope changes, please reach out before signing.*
