# ReactCampus Security Audit Report

> Comprehensive security review conducted on 2026-04-15
> Methodology: Code review + live exploit verification
> Scope: Full-stack (Express API + React frontend)

---

## Executive Summary

The ReactCampus application has some good security foundations (helmet, mongoSanitize, bcrypt, JWT with refresh rotation), but has **several critical and high-severity vulnerabilities** that must be fixed before production deployment. The most urgent issues are: no rate limiting (brute force possible), stored XSS in user-generated content, tokens stored in localStorage (XSS theft vector), and wide-open CORS.

**Findings:** 23 security issues identified
- Critical: 4
- High: 7
- Medium: 8
- Low: 4

---

## CRITICAL SEVERITY

### SEC-01: No Rate Limiting on Any Endpoint
- **CVSS:** 9.1 (Critical)
- **Category:** Brute Force / DoS
- **Confirmed:** Yes (20 rapid failed logins, 10 rapid registrations — no blocking)
- **Files:** `server/src/app.js` — `express-rate-limit` NOT installed
- **Impact:**
  - Brute force password attacks on `/auth/login`
  - Account creation spam on `/auth/register`
  - Form submission spam on `/public/forms/:slug/submit`
  - Contact form spam on `/public/contact`
  - Review/discussion spam on public submission endpoints
- **Fix:**
  ```bash
  npm install express-rate-limit
  ```
  ```js
  // app.js
  const rateLimit = require('express-rate-limit');
  app.use('/api/v1/auth/login', rateLimit({ windowMs: 15*60*1000, max: 10 }));
  app.use('/api/v1/auth/register', rateLimit({ windowMs: 60*60*1000, max: 5 }));
  app.use('/api/v1/public', rateLimit({ windowMs: 15*60*1000, max: 100 }));
  ```

### SEC-02: Stored XSS in User-Generated Content
- **CVSS:** 8.1 (High/Critical)
- **Category:** Cross-Site Scripting (Stored)
- **Confirmed:** Yes — `<img src=x onerror="alert(document.cookie)">` stored raw in DB
- **Affected endpoints:**
  - `POST /public/reviews` — `content`, `title`, `authorName` fields
  - `POST /public/discussions` — `content`, `authorName` fields
  - `POST /public/contact` — `message` field
  - `POST /content-sections` — `content` field (admin, but richtext is rendered publicly)
  - `PATCH /colleges/:id` — `description` field
- **Impact:** Attacker submits a review with JS payload. When admin views reviews or public users visit the college page, the script executes in their browser, stealing session tokens from localStorage.
- **Files:**
  - `server/src/middlewares/sanitize.js` — exists but **NOT used** in `app.js`
  - `server/src/app.js` — sanitize middleware not imported
  - No HTML sanitization library installed (no `sanitize-html`, `xss`, or `DOMPurify`)
- **Fix:**
  1. Install `sanitize-html` or `xss` package
  2. Apply sanitization before storing user-generated content
  3. OR: Import and use the existing `sanitize.js` middleware in `app.js`
  4. Frontend: Never use `dangerouslySetInnerHTML` without sanitizing

### SEC-03: Tokens Stored in localStorage (XSS Theft Vector)
- **CVSS:** 7.5 (High)
- **Category:** Insecure Token Storage
- **Files:**
  - `client/src/lib/axios.ts:27,68` — `localStorage.setItem('accessToken', ...)`
  - `client/src/features/auth/hooks/useLogin.ts:16-17`
  - `client/src/features/auth/hooks/useRegister.ts:16-17`
- **Impact:** Combined with SEC-02 (stored XSS), an attacker can steal both accessToken and refreshToken from localStorage, gaining persistent access to the victim's account.
- **Fix:** Move tokens to httpOnly cookies with Secure and SameSite flags. The refresh token especially should never be in localStorage.

### SEC-04: CORS Allows All Origins
- **CVSS:** 7.5 (High)
- **Category:** Cross-Origin Security
- **Confirmed:** Yes — `Access-Control-Allow-Origin: *` returned for any origin
- **File:** `server/src/app.js:12` — `app.use(cors())` with no config
- **Impact:** Any malicious website can make authenticated API requests if the user has a valid token (from localStorage, which is accessible cross-origin via XSS).
- **Fix:**
  ```js
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  }));
  ```

---

## HIGH SEVERITY

### SEC-05: Weak JWT Secret
- **Category:** Authentication
- **File:** `.env:6`, `server/src/config/index.js:10`
- **Issue:** Default JWT secret is `your-jwt-secret-change-in-production` — a weak, guessable placeholder. If deployed without changing, attackers can forge valid JWTs.
- **Fix:** Generate a strong random secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### SEC-06: No Password Complexity Requirements
- **Category:** Authentication
- **File:** `server/src/auth/auth.validation.js:8,28`
- **Issue:** Password only requires min 8 chars. "12345678" and "password" are accepted.
- **Fix:** Add regex pattern:
  ```js
  password: Joi.string().min(8).max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({ 'string.pattern.base': 'Password must include uppercase, lowercase, number, and special character' })
  ```

### SEC-07: Unauthenticated Logout Endpoint
- **Category:** Session Management
- **Confirmed:** Yes — `POST /auth/logout` with no auth returns 200
- **File:** `server/src/auth/auth.routes.js:10`
- **Issue:** `router.post('/logout', ctrl.logout)` has no `authenticate` middleware. Any user can attempt to invalidate refresh tokens.
- **Fix:** Add `authenticate` middleware: `router.post('/logout', authenticate, ctrl.logout)`

### SEC-08: Form Submission Crashes Server (500 instead of 400)
- **Category:** Input Validation / DoS
- **Confirmed:** Yes — already documented as Issue #6
- **File:** `server/src/routes/public.routes.js:349` — `data: req.body.data` used without validation
- **Impact:** Server returns 500 with stack trace when `data` field is missing
- **Fix:** Add null check in `submission.service.js` or add `validate(schema)` to route

### SEC-09: Excessive Body Parser Limit (10MB)
- **Category:** DoS
- **File:** `server/src/app.js:16` — `express.json({ limit: '10mb' })`
- **Impact:** Attackers can send large payloads consuming server memory
- **Fix:** Reduce to `1mb` or `500kb` for normal API operations

### SEC-10: Public Endpoints Expose Internal IDs
- **Category:** Information Disclosure
- **Confirmed:** Yes — `createdBy` field exposed in public college responses
- **Impact:** Internal user ObjectIds exposed, could aid targeted attacks
- **Fix:** Exclude `createdBy`, `deletedAt`, and internal fields from public responses using `.select('-createdBy -deletedAt')`

### SEC-11: User Enumeration via Registration
- **Category:** Information Disclosure
- **File:** `server/src/auth/auth.service.js:30-31`
- **Issue:** Returns `409 "Email already registered"` vs generic validation errors. Attackers can enumerate registered emails.
- **Fix:** Return generic `400 "Registration failed"` for all errors

---

## MEDIUM SEVERITY

### SEC-12: Sanitize Middleware Exists But Not Used
- **File:** `server/src/middlewares/sanitize.js` — 22 lines of XSS prevention
- **File:** `server/src/app.js` — not imported
- **Impact:** The team wrote sanitization code but forgot to enable it
- **Fix:** Add `app.use(require('./middlewares/sanitize'))` to `app.js` (after body parser)

### SEC-13: ReDoS via User-Controlled Regex
- **Category:** DoS
- **Files:**
  - `server/src/routes/public.routes.js:48-49` — `$regex: qCity, $options: 'i'` with user input
  - `server/src/services/lead.service.js:30-34` — `$regex: query.search` with user input
  - `server/src/services/submission.service.js:72` — `new RegExp(v.pattern)` from form config
- **Impact:** Attackers can send pathological regex patterns causing CPU exhaustion
- **Fix:** Escape regex special chars: `search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')` before passing to `$regex`

### SEC-14: Mass Assignment via Object.assign
- **Category:** Authorization Bypass
- **Files:** All service update methods use `Object.assign(model, data)`:
  - `server/src/services/college.service.js:118`
  - `server/src/services/page.service.js:102`
  - `server/src/services/form.service.js:96`
  - `server/src/services/course.service.js:96`
  - `server/src/services/exam.service.js:92`
  - And others
- **Impact:** While Joi validation limits which fields pass, if validation schema is incomplete or a new model field is added without validation, it becomes writable. Defense-in-depth issue.
- **Fix:** Use explicit field picking instead of `Object.assign()`:
  ```js
  const { name, description, type } = data;
  Object.assign(college, { name, description, type });
  ```

### SEC-15: No CSRF Protection
- **Category:** Cross-Site Request Forgery
- **Impact:** Combined with CORS: *, any website can trigger state-changing operations if user is authenticated
- **Fix:** Implement CSRF tokens or use SameSite cookies

### SEC-16: Timing Attack in Login
- **File:** `server/src/auth/auth.service.js:50-56`
- **Issue:** bcrypt comparison only runs for existing users, non-existent users return faster
- **Fix:** Always run bcrypt comparison even for non-existent users:
  ```js
  const user = await User.findOne({ email }).select('+passwordHash');
  const dummyHash = '$2a$12$dummyhashfortiminganticountermeasure';
  const valid = await bcrypt.compare(password, user?.passwordHash || dummyHash);
  if (!user || !valid) throw new ApiError(401, 'Invalid credentials');
  ```

### SEC-17: No Helmet CSP Configuration
- **File:** `server/src/app.js:11` — `app.use(helmet())` with defaults
- **Impact:** Default CSP may not prevent inline scripts, eval, etc.
- **Fix:** Configure explicit CSP with restrictive directives

### SEC-18: Lead Endpoints Lack Assignment-Based Scoping
- **Files:** `server/src/routes/lead.routes.js`, `server/src/services/lead.service.js`
- **Issue:** Unlike colleges/pages which have `read-assigned` permissions, all users with `lead:read` can see ALL leads. No way to scope a sales user to only their assigned leads.
- **Fix:** Add `lead:read-assigned` permission and filter leads by `assignedTo` for scoped users

### SEC-19: No Token Invalidation on Password Change
- **File:** `server/src/auth/auth.service.js:106-121`
- **Issue:** Changing password doesn't invalidate existing access tokens (valid for 15 min)
- **Fix:** Revoke all refresh tokens for the user on password change (already done), but also consider shorter access token expiry or token blacklisting

---

## LOW SEVERITY

### SEC-20: Default Admin Credentials in Code
- **File:** `server/src/config/index.js:15-20`
- **Issue:** Fallback admin credentials hardcoded if env vars not set
- **Fix:** Require env vars and fail startup if not set

### SEC-21: trust proxy Set Without Validation
- **File:** `server/src/app.js:25` — `app.set('trust proxy', 1)`
- **Impact:** If deployed behind multiple proxies, IP extraction may be incorrect
- **Fix:** Configure based on deployment architecture

### SEC-22: No HTTPS Enforcement
- **Impact:** Tokens transmitted over HTTP can be intercepted
- **Fix:** Add HSTS header in production, redirect HTTP to HTTPS

### SEC-23: Audit Logging Gaps
- **Issue:** Auth events (login attempts, password changes) are not logged to audit trail
- **Fix:** Add audit log entries in auth.service.js for login, logout, password change events

---

## What's Implemented Well

| Control | Status | Notes |
|---------|--------|-------|
| Password hashing | Good | bcrypt with 12 rounds |
| NoSQL injection prevention | Good | `express-mongo-sanitize` blocks `$gt`, `$ne` etc. (verified) |
| JWT token structure | Good | Short-lived access (15min), refresh rotation with family tracking |
| Refresh token reuse detection | Good | Entire family revoked on reuse |
| Password hash exclusion | Good | `select: false` on passwordHash, not leaked in responses |
| Soft delete implementation | Good | Pre-hooks filter deleted records |
| RBAC enforcement | Good | 81 granular permissions, middleware enforced |
| Privilege escalation prevention | Good | Role assignment checks caller has all target permissions |
| System role protection | Good | System roles cannot be deleted |
| User deactivation | Good | Deactivated users cannot login |
| Input validation | Partial | Joi schemas exist but not applied to all routes |

---

## Remediation Priority

### P0 — Fix Before Any Production Use
1. **SEC-01:** Install and configure `express-rate-limit`
2. **SEC-02:** Enable XSS sanitization (import existing `sanitize.js` + install `sanitize-html`)
3. **SEC-03:** Move tokens from localStorage to httpOnly cookies
4. **SEC-04:** Restrict CORS to allowed origins only
5. **SEC-05:** Set a strong, random JWT secret

### P1 — Fix This Week
6. **SEC-06:** Add password complexity requirements
7. **SEC-07:** Add `authenticate` to logout route
8. **SEC-08:** Add data validation to form submission route
9. **SEC-09:** Reduce body parser limit to 1MB
10. **SEC-10:** Exclude internal fields from public responses

### P2 — Fix Before Launch
11. **SEC-11 through SEC-19:** User enumeration, ReDoS, mass assignment, CSRF, CSP, timing attack, lead scoping, token invalidation

### P3 — Best Practice Improvements
12. **SEC-20 through SEC-23:** Default credentials, trust proxy, HTTPS, audit logging
