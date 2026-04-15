# ReactCampus Test Stories

> Expected behavior for every feature/page. Used as acceptance criteria during manual browser testing.

---

## 1. PUBLIC PAGES

### 1.1 Home Page (`/`)
- Hero section renders with title, subtitle, search bar
- Category cards display (from site settings)
- Featured Colleges section shows college cards (if enabled)
- Featured Courses section shows course cards (if enabled)
- Featured Exams section shows exam cards (if enabled)
- Stats section shows counters
- CTA section renders with buttons
- Footer renders with links, social links, newsletter section
- Header has navigation links: Colleges, Courses, Exams, About, Contact
- Search bar should navigate to college listing with search query
- Category cards should link to filtered listings

### 1.2 College Listing (`/colleges`)
- Page title/heading renders
- College cards display with: name, location (city, state), type, fees range, logo
- Filters sidebar: type (public/private/deemed/autonomous), category, city, state, search
- Pagination works (50 colleges seeded)
- Clicking a college card navigates to `/colleges/:slug`
- Search filters results in real-time or on submit
- Empty state if no results match filters

### 1.3 College Detail (`/colleges/:slug`)
- College header: name, logo, cover image, location, type, established year
- Key info: fees, accreditation, affiliation, ranking, website
- Tab navigation: Overview, Placements, Admission, Cutoff, Courses, FAQ (based on content sections)
- Content sections render correctly per tab (richtext, table, FAQ, gallery, list)
- Courses list: shows courses associated with this college
- Exams list: shows exams associated with this college
- Sidebar with related info
- Review section: shows approved reviews, star ratings, aspect ratings
- Review submission form (rating, title, content, aspect ratings, name, email)
- Discussion section: shows approved discussions
- Discussion submission form (content, name, email)
- Facilities list renders
- Breadcrumb navigation

### 1.4 Course Listing (`/courses`)
- Page title/heading renders
- Course cards display with: name, level, duration, stream, fees
- Filters: level (undergraduate/postgraduate/diploma/doctorate/certificate), stream, search
- Pagination works
- Clicking a course card navigates to `/courses/:slug`
- NOTE: 0 courses seeded — should show empty state gracefully

### 1.5 Course Detail (`/courses/:slug`)
- Course header: name, level, duration, stream
- Key info: fees, eligibility, specializations
- Tab navigation for content sections
- Colleges offering this course section
- Discussion section
- Breadcrumb navigation

### 1.6 Exam Listing (`/exams`)
- Page title/heading renders
- Exam cards display with: name, conductedBy, examType, categories
- Filters: examType, category, search
- Pagination works
- Clicking an exam card navigates to `/exams/:slug`
- NOTE: 0 exams seeded — should show empty state gracefully

### 1.7 Exam Detail (`/exams/:slug`)
- Exam header: name, conducted by, exam type
- Key info: eligibility, website, pattern (mode, duration, marks, sections)
- Important dates section
- Tab navigation for content sections
- Discussion section
- Breadcrumb navigation

### 1.8 About Page (`/about`)
- About content renders (from site settings)
- Mission section
- Vision section
- Page loads without errors

### 1.9 Contact Page (`/contact`)
- Contact form renders with: name, email, phone, message fields
- Form validation works (required fields)
- Submit sends to `POST /api/v1/public/contact`
- Success message after submission
- Contact details display: email, phone, address
- Map embed (if configured in site settings)

### 1.10 Dynamic Form Page (`/forms/:slug`)
- Form fields render based on schema
- Validation rules apply (required, min/max length, pattern)
- Conditional fields show/hide based on dependencies
- Submit sends data to API
- Post-submit action: show success message, redirect, or both
- Invalid slug shows 404/error state

### 1.11 Dynamic Page (`/pages/:slug`)
- Page title and description render
- Content blocks render by type (richtext, table, FAQ, list)
- College filter section (if enabled)
- Sidebar links render
- Meta tags set for SEO

---

## 2. AUTH PAGES

### 2.1 Login Page (`/login`)
- Email and password fields render
- Validation: required email (valid format), required password
- Submit calls `POST /api/v1/auth/login`
- On success: stores tokens, redirects to `/admin`
- On failure: shows error message (invalid credentials)
- Link to register page
- Already logged in users should be redirected away (GuestGuard)

### 2.2 Register Page (`/register`)
- First name, last name, email, password, confirm password fields
- Validation: all fields required, email format, password strength, passwords match
- Submit calls `POST /api/v1/auth/register`
- On success: stores tokens, redirects appropriately
- On failure: shows error messages
- Link to login page
- Already logged in users should be redirected away (GuestGuard)

---

## 3. ADMIN PAGES

### 3.1 Dashboard (`/admin`)
- Stats cards: total colleges, total courses, total exams, total leads, etc.
- Lead pipeline chart/visualization
- Recent activity feed with audit log entries
- All data loads from dashboard API endpoints
- Unauthorized users redirected to login

### 3.2 College Management (`/admin/colleges`)
**List Page:**
- Table with columns: name, type, status, city, actions
- Pagination, search, filters
- Action buttons: view, edit, delete, manage sections
- Create new button

**Create/Edit Form (`/admin/colleges/new`, `/admin/colleges/:id/edit`):**
- Fields: name, slug (auto-generated), type dropdown, categories multi-select, description (rich text)
- Location fields: address, city, state, pincode
- Fees: min, max, currency
- Other: ranking, established year, website, accreditation, affiliation
- Logo and cover image URL inputs
- Facilities: tag/chip input
- Form validation with error messages
- Save creates/updates college
- Cancel navigates back

**Publish:** Toggle college status (draft → published → archived)
**Manage Courses/Exams:** Assign courses and exams to college
**Content Sections** (`/admin/colleges/:id/sections`): Create/edit content sections for this college

### 3.3 Course Management (`/admin/courses`)
**List:** Table with name, level, duration, stream, status, actions
**Create/Edit:** name, slug, level dropdown, duration (value + unit), stream, specializations, fees, description, eligibility
**Delete:** Confirmation dialog

### 3.4 Exam Management (`/admin/exams`)
**List:** Table with name, examType, conductedBy, status, actions
**Create/Edit:** name, slug, conductedBy, examType dropdown, categories, description, eligibility, website
- Pattern: mode, duration, totalMarks, sections (array of name/questions/marks)
- Important dates: array of event/date/description
**Delete:** Confirmation dialog

### 3.5 Category Management (`/admin/categories`)
**List:** Table with name, slug, icon, order, isActive, actions
**Create/Edit:** name, slug, icon, order, isActive toggle
**Delete:** Confirmation dialog

### 3.6 Content Section Management (`/admin/colleges/:id/sections`, etc.)
- List existing sections for the entity
- Create new section: sectionKey (tab), title, contentType dropdown
- Content editor varies by type:
  - richtext: WYSIWYG editor
  - table: table editor (rows/columns)
  - faq: question/answer pairs
  - gallery: image URLs
  - list: list items
- Order number, isVisible toggle
- Edit/Delete existing sections

### 3.7 Form Builder (`/admin/forms`)
**List:** Table with title, purpose, status (published/draft), actions
**Builder (`/admin/forms/new`, `/admin/forms/:id/edit`):**
- Title, slug, description, purpose dropdown
- Field builder: drag/drop or add fields
  - Each field: type, label, name, placeholder, defaultValue
  - Validation: required, minLength, maxLength, min, max, pattern
  - Options (for dropdown/radio/checkbox)
  - Conditional visibility
  - Lead field mapping
- Post-submit action: message/redirect/both
- Success message, redirect URL
- Publish toggle
- Page assignment: pageType, entityId, displayAs, trigger settings

### 3.8 Form Submissions (`/admin/submissions`)
- Table with form title, submitted by, date, actions
- View submission detail: form fields + submitted values
- Page context info (which page the form was on)

### 3.9 Lead Management (`/admin/leads`)
**List Page:**
- Table: name, email, phone, status, priority, assignedTo, source, date
- Filters: status, priority, assignedTo, dateFrom, dateTo, search
- Bulk actions: change status, assign, delete
- Export CSV button
- Create lead button

**Pipeline View (`/admin/leads/pipeline`):**
- Kanban-style board with columns per status (new, contacted, qualified, converted, lost, closed)
- Drag-and-drop between columns (changes status)
- Lead cards show key info

**Lead Detail (`/admin/leads/:id`):**
- All lead info displayed
- Status change dropdown with history timeline
- Assign to user
- Notes section: view existing, add new note
- Source info (form, submission link)
- College/course association

### 3.10 Review Moderation (`/admin/reviews`)
- Table: college name, author, rating, status, date, actions
- Filter by status (pending/approved/rejected)
- Approve/Reject buttons per review
- View review details (content, aspects ratings)
- Delete button

### 3.11 Discussion Moderation (`/admin/discussions`)
- Table: entity (college/course/exam), author, content preview, status, date, actions
- Filter by status
- Approve/Reject buttons
- View full discussion content
- Delete button

### 3.12 Page Management (`/admin/pages`)
**List:** Table with title, slug, status, actions
**Create/Edit:** title, slug, description, status
- Content blocks builder: add blocks with title, contentType, content, order
- College filter config: enabled toggle, filterBy, courses/exams/type/state/city selection
- Sidebar links: sections with title and link items
- Meta fields: metaTitle, metaDescription, metaKeywords
**Publish:** Toggle status

### 3.13 SEO Management (`/admin/seo`)
**List:** Table with targetType, slug, metaTitle, actions
**Create/Edit:**
- Target type dropdown (college/course/exam/page)
- Target entity selector
- Meta fields: title, description, keywords
- Canonical URL
- OG fields: title, description, image, type
- Twitter card type
- Structured data (JSON)
- Robots directive

### 3.14 User Management (`/admin/users`)
**List:** Table with name, email, roles, isActive, actions
**Create/Edit:** firstName, lastName, email, password (create only), roles multi-select
**Deactivate/Activate:** Toggle user active status
**Assign Roles:** Multi-select role assignment

### 3.15 Role Management (`/admin/roles`)
**List:** Table with name, displayName, permissions count, isSystem, actions
**Create/Edit:** name, displayName
**Assign Permissions:** Checkbox grid grouped by resource (college, course, lead, etc.)
- System roles cannot be deleted

### 3.16 Content Assignments (`/admin/assignments`)
**List:** Table with user, contentType, scope, actions
**Create/Edit:** user selector, contentType, scope (individual/category), content/categories selector, actions checkboxes

### 3.17 Site Settings (`/admin/site-settings`)
- Hero section: title, titleHighlight, subtitle, searchPlaceholder, categories
- Stats: label, value, icon, color (array)
- Featured entities: colleges, courses, exams (multi-select from existing)
- CTA: title, subtitle, buttons
- Contact: email, phone, address, mapEmbedUrl
- Section visibility toggles
- About: content, mission, vision
- Footer: tagline, sections with links, social links, bottom links, copyright, newsletter

### 3.18 Profile Settings (`/admin/settings/profile`)
- Display current user info
- Edit firstName, lastName
- Save updates profile via `PATCH /auth/me`

### 3.19 Change Password (`/admin/settings/password`)
- Current password, new password, confirm new password
- Validation: all required, new passwords match, password strength
- Submit calls `POST /auth/change-password`

---

## 4. CROSS-CUTTING CONCERNS

### 4.1 Navigation
- Header links work on all pages
- Admin sidebar links work
- Breadcrumbs navigate correctly
- Back buttons work
- 404 page for unknown routes

### 4.2 Responsive Design
- Pages render on mobile viewport
- Admin sidebar collapses on mobile
- Tables are scrollable or responsive

### 4.3 Error Handling
- API errors show user-friendly messages (toasts/alerts)
- Network errors handled gracefully
- 404 pages for non-existent entities
- Unauthorized access redirects to login

### 4.4 Loading States
- Skeleton loaders or spinners while data loads
- Buttons show loading state during submission
- No flash of empty content

### 4.5 Console Errors
- No JavaScript errors in console on any page
- No unhandled promise rejections
- No React warnings (key prop, etc.)
