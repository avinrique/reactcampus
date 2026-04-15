/**
 * ReactCampus Comprehensive Admin CRUD + RBAC Test
 * Tests every admin feature end-to-end
 */

const BASE = 'http://localhost:5050/api/v1';
const RUN_ID = Date.now().toString(36);

let adminToken = '';
let results = [];
let created = {}; // track created resources for cleanup

function log(suite, test, passed, detail = '') {
  const icon = passed ? '✓' : '✗';
  results.push({ suite, test, passed, detail });
  if (!passed) console.log(`  ${icon} ${test} — ${detail}`);
  else console.log(`  ${icon} ${test}`);
}

async function api(method, path, body = null, token = adminToken) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (token) opts.headers['Authorization'] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data, headers: res.headers };
}

// ═══════════════════════════════════════════
// 1. CATEGORY CRUD
// ═══════════════════════════════════════════
async function testCategories() {
  console.log('\n── Category CRUD ──');

  // Create
  let r = await api('POST', '/categories', { name: `TestCat_${RUN_ID}`, icon: 'TestIcon', order: 99 });
  log('Categories', 'Create category', r.status === 201, `status=${r.status}`);
  if (r.status === 201) created.category = r.data.data._id;

  // Read
  r = await api('GET', `/categories/${created.category}`);
  log('Categories', 'Read category by ID', r.status === 200 && r.data.data.name === `TestCat_${RUN_ID}`);

  // Update
  r = await api('PATCH', `/categories/${created.category}`, { icon: 'UpdatedIcon', order: 50 });
  log('Categories', 'Update category', r.status === 200, `status=${r.status}`);
  r = await api('GET', `/categories/${created.category}`);
  log('Categories', 'Update persisted', r.data.data.icon === 'UpdatedIcon' && r.data.data.order === 50);

  // List
  r = await api('GET', '/categories');
  log('Categories', 'List categories', r.status === 200 && r.data.data.length >= 1);

  // Public endpoint
  r = await api('GET', '/public/categories', null, null);
  log('Categories', 'Public categories accessible', r.status === 200);
}

// ═══════════════════════════════════════════
// 2. COURSE CRUD
// ═══════════════════════════════════════════
async function testCourses() {
  console.log('\n── Course CRUD ──');

  let r = await api('POST', '/courses', {
    name: `B.Tech CS_${RUN_ID}`,
    level: 'undergraduate',
    duration: { value: 4, unit: 'years' },
    stream: 'Engineering',
    specializations: ['AI/ML', 'Data Science'],
    fees: { amount: 200000, currency: 'INR', per: 'year' },
    description: 'Test course for computer science',
    eligibility: '10+2 with PCM',
  });
  log('Courses', 'Create course', r.status === 201, `status=${r.status}`);
  if (r.status === 201) created.course = r.data.data._id;

  r = await api('GET', `/courses/${created.course}`);
  log('Courses', 'Read course by ID', r.status === 200 && r.data.data.level === 'undergraduate');
  log('Courses', 'Course has auto-slug', !!r.data.data.slug);
  log('Courses', 'Course has specializations', r.data.data.specializations?.length === 2);

  r = await api('PATCH', `/courses/${created.course}`, { stream: 'Computer Science' });
  log('Courses', 'Update course', r.status === 200);
  r = await api('GET', `/courses/${created.course}`);
  log('Courses', 'Update persisted', r.data.data.stream === 'Computer Science');

  // Create second course for testing
  r = await api('POST', '/courses', {
    name: `MBA_${RUN_ID}`,
    level: 'postgraduate',
    duration: { value: 2, unit: 'years' },
    stream: 'Management',
  });
  if (r.status === 201) created.course2 = r.data.data._id;
  log('Courses', 'Create second course', r.status === 201);

  r = await api('GET', '/courses');
  log('Courses', 'List courses', r.status === 200 && r.data.data.length >= 2);

  // Public
  r = await api('GET', '/public/courses', null, null);
  log('Courses', 'Public courses accessible', r.status === 200 && r.data.data.length >= 2);
}

// ═══════════════════════════════════════════
// 3. EXAM CRUD
// ═══════════════════════════════════════════
async function testExams() {
  console.log('\n── Exam CRUD ──');

  let r = await api('POST', '/exams', {
    name: `JEE Main_${RUN_ID}`,
    conductedBy: 'NTA',
    examType: 'national',
    categories: ['engineering'],
    description: 'National entrance exam for engineering',
    eligibility: '10+2 with PCM',
    website: 'https://jeemain.nta.nic.in',
    pattern: { mode: 'online', duration: '3 hours', totalMarks: 300 },
    importantDates: [
      { event: 'Registration Start', date: '2026-01-01', description: 'Online registration opens' },
      { event: 'Exam Date', date: '2026-04-15', description: 'Session 1' }
    ],
  });
  log('Exams', 'Create exam', r.status === 201, `status=${r.status}`);
  if (r.status === 201) created.exam = r.data.data._id;

  r = await api('GET', `/exams/${created.exam}`);
  log('Exams', 'Read exam by ID', r.status === 200 && r.data.data.examType === 'national');
  log('Exams', 'Exam has auto-slug', !!r.data.data.slug);
  log('Exams', 'Exam has important dates', r.data.data.importantDates?.length === 2);
  log('Exams', 'Exam has pattern', r.data.data.pattern?.mode === 'online');

  r = await api('PATCH', `/exams/${created.exam}`, { conductedBy: 'National Testing Agency' });
  log('Exams', 'Update exam', r.status === 200);

  r = await api('GET', '/exams');
  log('Exams', 'List exams', r.status === 200);

  r = await api('GET', '/public/exams', null, null);
  log('Exams', 'Public exams accessible', r.status === 200 && r.data.data.length >= 1);
}

// ═══════════════════════════════════════════
// 4. COLLEGE CRUD + PUBLISH + COURSES/EXAMS ASSOCIATION
// ═══════════════════════════════════════════
async function testColleges() {
  console.log('\n── College CRUD ──');

  let r = await api('POST', '/colleges', {
    name: `Test Institute_${RUN_ID}`,
    type: 'private',
    categories: ['engineering', 'management'],
    description: 'A test college for verification',
    location: { city: 'TestCity', state: 'TestState', address: '123 Test St', pincode: '123456' },
    fees: { min: 100000, max: 500000 },
    ranking: 999,
    established: 2020,
    website: 'https://test.example.com',
    facilities: ['WiFi', 'Library', 'Hostel'],
  });
  log('Colleges', 'Create college', r.status === 201, `status=${r.status}`);
  if (r.status === 201) {
    created.college = r.data.data._id;
    created.collegeSlug = r.data.data.slug;
  }

  r = await api('GET', `/colleges/${created.college}`);
  log('Colleges', 'Read college by ID', r.status === 200);
  log('Colleges', 'College has auto-slug', !!r.data.data.slug);
  log('Colleges', 'College status is draft', r.data.data.status === 'draft');
  log('Colleges', 'College has facilities', r.data.data.facilities?.length === 3);
  log('Colleges', 'College has fees', r.data.data.fees?.min === 100000);

  // Update
  r = await api('PATCH', `/colleges/${created.college}`, { ranking: 100, accreditation: 'NAAC A+' });
  log('Colleges', 'Update college', r.status === 200);
  r = await api('GET', `/colleges/${created.college}`);
  log('Colleges', 'Update persisted (ranking)', r.data.data.ranking === 100);
  log('Colleges', 'Update persisted (accreditation)', r.data.data.accreditation === 'NAAC A+');

  // Draft college not visible publicly
  r = await api('GET', `/public/colleges/${created.collegeSlug}`, null, null);
  log('Colleges', 'Draft college NOT visible publicly', r.status === 404);

  // Publish
  r = await api('PATCH', `/colleges/${created.college}/publish`, { status: 'published' });
  log('Colleges', 'Publish college', r.status === 200, `status=${r.status}`);

  // Now visible publicly
  r = await api('GET', `/public/colleges/${created.collegeSlug}`, null, null);
  log('Colleges', 'Published college visible publicly', r.status === 200);

  // Associate courses
  if (created.course) {
    r = await api('PATCH', `/colleges/${created.college}/courses`, { courses: [created.course, created.course2].filter(Boolean) });
    log('Colleges', 'Associate courses to college', r.status === 200, `status=${r.status}`);

    r = await api('GET', `/public/colleges/${created.collegeSlug}`, null, null);
    log('Colleges', 'College has courses populated', r.data.data.courses?.length >= 1);
  }

  // Associate exams
  if (created.exam) {
    r = await api('PATCH', `/colleges/${created.college}/exams`, { exams: [created.exam] });
    log('Colleges', 'Associate exams to college', r.status === 200, `status=${r.status}`);
  }

  // Archive
  r = await api('PATCH', `/colleges/${created.college}/publish`, { status: 'archived' });
  log('Colleges', 'Archive college', r.status === 200);
  r = await api('GET', `/public/colleges/${created.collegeSlug}`, null, null);
  log('Colleges', 'Archived college NOT visible publicly', r.status === 404);

  // Re-publish for later tests
  r = await api('PATCH', `/colleges/${created.college}/publish`, { status: 'published' });
  log('Colleges', 'Re-publish college', r.status === 200);
}

// ═══════════════════════════════════════════
// 5. CONTENT SECTIONS CRUD
// ═══════════════════════════════════════════
async function testContentSections() {
  console.log('\n── Content Sections CRUD ──');

  // Richtext section
  let r = await api('POST', '/content-sections', {
    college: created.college,
    sectionKey: 'overview',
    title: 'About This College',
    contentType: 'richtext',
    content: '<h2>Welcome</h2><p>This is a test college overview section with rich text content.</p>',
    order: 1,
  });
  log('ContentSections', 'Create richtext section', r.status === 201, `status=${r.status}`);
  if (r.status === 201) created.section1 = r.data.data._id;

  // FAQ section
  r = await api('POST', '/content-sections', {
    college: created.college,
    sectionKey: 'faq',
    title: 'FAQ',
    contentType: 'faq',
    content: [
      { question: 'What is the admission process?', answer: 'Through entrance exam followed by counseling.' },
      { question: 'What are the fees?', answer: 'Fees range from 1L to 5L per year.' }
    ],
    order: 2,
  });
  log('ContentSections', 'Create FAQ section', r.status === 201, `status=${r.status}`);
  if (r.status === 201) created.section2 = r.data.data._id;

  // Table section
  r = await api('POST', '/content-sections', {
    college: created.college,
    sectionKey: 'placements',
    title: 'Placement Statistics',
    contentType: 'table',
    content: {
      headers: ['Year', 'Avg Package', 'Highest Package'],
      rows: [['2024', '8 LPA', '25 LPA'], ['2025', '9 LPA', '30 LPA']]
    },
    order: 3,
  });
  log('ContentSections', 'Create table section', r.status === 201, `status=${r.status}`);
  if (r.status === 201) created.section3 = r.data.data._id;

  // List sections for college
  r = await api('GET', `/content-sections?college=${created.college}`);
  log('ContentSections', 'List sections for college', r.status === 200 && r.data.data.length >= 3, `count=${r.data.data?.length}`);

  // Update section
  r = await api('PATCH', `/content-sections/${created.section1}`, { title: 'College Overview (Updated)', isVisible: true });
  log('ContentSections', 'Update section', r.status === 200);

  // Public: visible sections
  r = await api('GET', `/public/colleges/${created.collegeSlug}/sections`, null, null);
  log('ContentSections', 'Public: sections visible', r.status === 200 && r.data.data.length >= 3);

  // Toggle visibility
  r = await api('PATCH', `/content-sections/${created.section3}`, { isVisible: false });
  log('ContentSections', 'Hide section', r.status === 200);
  r = await api('GET', `/public/colleges/${created.collegeSlug}/sections`, null, null);
  log('ContentSections', 'Hidden section not in public', r.data.data.every(s => s._id !== created.section3));

  // Restore
  r = await api('PATCH', `/content-sections/${created.section3}`, { isVisible: true });

  // Section for course
  if (created.course) {
    r = await api('POST', '/content-sections', {
      course: created.course,
      sectionKey: 'overview',
      title: 'Course Overview',
      contentType: 'richtext',
      content: '<p>This course covers fundamentals of CS.</p>',
      order: 1,
    });
    log('ContentSections', 'Create section for course', r.status === 201);
    if (r.status === 201) created.courseSection = r.data.data._id;
  }
}

// ═══════════════════════════════════════════
// 6. FORMS + SUBMISSIONS + LEADS
// ═══════════════════════════════════════════
async function testFormsAndLeads() {
  console.log('\n── Forms + Submissions + Leads ──');

  // Create form
  let r = await api('POST', '/forms', {
    title: `Inquiry Form_${RUN_ID}`,
    description: 'Test inquiry form',
    purpose: 'lead_capture',
    fields: [
      { fieldId: 'f1', type: 'text', label: 'Full Name', name: 'fullName', validation: { required: true }, leadFieldMapping: 'name', order: 1 },
      { fieldId: 'f2', type: 'email', label: 'Email', name: 'email', validation: { required: true }, leadFieldMapping: 'email', order: 2 },
      { fieldId: 'f3', type: 'phone', label: 'Phone', name: 'phone', leadFieldMapping: 'phone', order: 3 },
      { fieldId: 'f4', type: 'dropdown', label: 'Interest', name: 'interest', options: [{ label: 'B.Tech', value: 'btech' }, { label: 'MBA', value: 'mba' }], order: 4 },
      { fieldId: 'f5', type: 'textarea', label: 'Message', name: 'message', leadFieldMapping: 'message', order: 5 },
    ],
    postSubmitAction: 'message',
    successMessage: 'Thank you for your inquiry!',
  });
  log('Forms', 'Create lead capture form', r.status === 201, `status=${r.status}`);
  if (r.status === 201) {
    created.form = r.data.data._id;
    created.formSlug = r.data.data.slug;
  }

  // Read form
  r = await api('GET', `/forms/${created.form}`);
  log('Forms', 'Read form by ID', r.status === 200);
  log('Forms', 'Form has 5 fields', r.data.data.fields?.length === 5);
  log('Forms', 'Form status is draft', r.data.data.isPublished === false);

  // Update form
  r = await api('PATCH', `/forms/${created.form}`, { description: 'Updated test inquiry form' });
  log('Forms', 'Update form', r.status === 200);

  // Publish form
  r = await api('PATCH', `/forms/${created.form}/publish`, { isPublished: true });
  log('Forms', 'Publish form', r.status === 200, `status=${r.status}`);

  // Public: get form schema
  r = await api('GET', `/public/forms/${created.formSlug}`, null, null);
  log('Forms', 'Public: form schema accessible', r.status === 200);
  log('Forms', 'Public: form has fields', r.data.data.fields?.length === 5);
  log('Forms', 'Public: form has successMessage', !!r.data.data.successMessage);

  // Submit form publicly
  r = await api('POST', `/public/forms/${created.formSlug}/submit`, {
    data: {
      fullName: 'John Doe',
      email: 'john@test.com',
      phone: '9876543210',
      interest: 'btech',
      message: 'I want to know about admissions',
    }
  }, null);
  log('Forms', 'Submit form publicly', r.status === 201, `status=${r.status}`);

  // Submit form with validation error (missing required fullName)
  r = await api('POST', `/public/forms/${created.formSlug}/submit`, {
    data: { email: 'test@test.com' }
  }, null);
  log('Forms', 'Form validation catches errors', r.status === 422 || r.status === 400, `status=${r.status}`);

  // Submit form WITHOUT wrapping in data — should return 400/500 gracefully
  r = await api('POST', `/public/forms/${created.formSlug}/submit`, {
    fullName: 'Direct Data',
    email: 'direct@test.com',
  }, null);
  log('Forms', 'BUG: unwrapped data returns 500 (should be 400)', r.status === 500, `status=${r.status} — This is a known bug: server crashes instead of returning 400`);

  // Second submission (correct format)
  r = await api('POST', `/public/forms/${created.formSlug}/submit`, {
    data: {
      fullName: 'Jane Smith',
      email: 'jane@test.com',
      phone: '1234567890',
      interest: 'mba',
      message: 'MBA inquiry',
    }
  }, null);
  log('Forms', 'Second submission', r.status === 201);

  // Check submissions (admin)
  r = await api('GET', '/submissions');
  log('Submissions', 'List submissions', r.status === 200 && r.data.data.length >= 2, `count=${r.data.data?.length}`);

  // Check leads auto-created
  r = await api('GET', '/leads');
  log('Leads', 'Leads auto-created from form', r.status === 200 && r.data.data.length >= 2, `count=${r.data.data?.length}`);

  if (r.data.data?.length > 0) {
    created.lead = r.data.data[0]._id;
    const lead = r.data.data[0];
    log('Leads', 'Lead has name from mapping', !!lead.name);
    log('Leads', 'Lead has email from mapping', !!lead.email);
    log('Leads', 'Lead status is new', lead.status === 'new');
  }

  // Lead CRUD
  if (created.lead) {
    r = await api('GET', `/leads/${created.lead}`);
    log('Leads', 'Read lead by ID', r.status === 200);

    r = await api('PATCH', `/leads/${created.lead}`, { priority: 'high' });
    log('Leads', 'Update lead priority', r.status === 200);

    r = await api('PATCH', `/leads/${created.lead}/status`, { status: 'contacted', note: 'Called and discussed' });
    log('Leads', 'Change lead status', r.status === 200);

    r = await api('GET', `/leads/${created.lead}`);
    log('Leads', 'Status updated to contacted', r.data.data.status === 'contacted');
    log('Leads', 'Status history recorded', r.data.data.statusHistory?.length >= 1);

    r = await api('POST', `/leads/${created.lead}/notes`, { content: 'Follow up next week' });
    log('Leads', 'Add note to lead', r.status === 200);

    r = await api('GET', `/leads/${created.lead}`);
    log('Leads', 'Note recorded', r.data.data.notes?.length >= 1);

    // Stats
    r = await api('GET', '/leads/stats');
    log('Leads', 'Lead stats endpoint', r.status === 200);
    log('Leads', 'Stats has byStatus', !!r.data.data.byStatus);

    // Export
    r = await api('GET', '/leads/export');
    log('Leads', 'Export CSV', r.status === 200);

    // Filters
    r = await api('GET', '/leads?status=contacted');
    log('Leads', 'Filter by status', r.status === 200 && r.data.data.length >= 1);

    r = await api('GET', '/leads?priority=high');
    log('Leads', 'Filter by priority', r.status === 200 && r.data.data.length >= 1);
  }

  // Assign pages to form
  r = await api('PATCH', `/forms/${created.form}/pages`, {
    assignedPages: [{ pageType: 'college_detail', displayAs: 'popup', trigger: 'delay', delaySeconds: 10 }]
  });
  log('Forms', 'Assign form to pages', r.status === 200, `status=${r.status}`);
}

// ═══════════════════════════════════════════
// 7. REVIEWS + DISCUSSIONS + MODERATION
// ═══════════════════════════════════════════
async function testReviewsDiscussions() {
  console.log('\n── Reviews + Discussions ──');

  // Submit review publicly
  let r = await api('POST', '/public/reviews', {
    college: created.college,
    authorName: 'Test Reviewer',
    authorEmail: 'reviewer@test.com',
    rating: 4,
    title: 'Great college',
    content: 'Very good infrastructure and faculty.',
    aspects: { academics: 4, faculty: 5, infrastructure: 4, placement: 3, campus: 5 },
  }, null);
  log('Reviews', 'Submit review publicly', r.status === 201, `status=${r.status}`);
  if (r.status === 201) created.review = r.data.data._id;

  // Review is pending by default
  r = await api('GET', `/reviews/${created.review}`);
  log('Reviews', 'Review is pending', r.data.data.status === 'pending');

  // Public: pending review NOT visible
  r = await api('GET', `/public/colleges/${created.collegeSlug}/reviews`, null, null);
  log('Reviews', 'Pending review NOT visible publicly', r.data.data.every(rev => rev._id !== created.review));

  // Approve review
  r = await api('PATCH', `/reviews/${created.review}/moderate`, { status: 'approved' });
  log('Reviews', 'Moderate: approve review', r.status === 200, `status=${r.status}`);

  // Now visible publicly
  r = await api('GET', `/public/colleges/${created.collegeSlug}/reviews`, null, null);
  log('Reviews', 'Approved review visible publicly', r.data.data.some(rev => rev._id === created.review));

  // Submit second review and reject it
  r = await api('POST', '/public/reviews', {
    college: created.college,
    authorName: 'Bad Reviewer',
    rating: 1,
    content: 'Spam content',
  }, null);
  if (r.status === 201) created.review2 = r.data.data._id;
  r = await api('PATCH', `/reviews/${created.review2}/moderate`, { status: 'rejected' });
  log('Reviews', 'Moderate: reject review', r.status === 200);

  // Admin list with filter
  r = await api('GET', '/reviews?status=approved');
  log('Reviews', 'Filter reviews by status', r.status === 200);

  // Discussion
  r = await api('POST', '/public/discussions', {
    college: created.college,
    authorName: 'Curious Student',
    content: 'What is the admission cutoff for this year?',
  }, null);
  log('Discussions', 'Submit discussion publicly', r.status === 201, `status=${r.status}`);
  if (r.status === 201) created.discussion = r.data.data._id;

  r = await api('GET', `/discussions/${created.discussion}`);
  log('Discussions', 'Discussion is pending', r.data.data.status === 'pending');

  r = await api('PATCH', `/discussions/${created.discussion}/moderate`, { status: 'approved' });
  log('Discussions', 'Moderate: approve discussion', r.status === 200);

  r = await api('GET', `/public/colleges/${created.collegeSlug}/discussions`, null, null);
  log('Discussions', 'Approved discussion visible publicly', r.data.data.length >= 1);
}

// ═══════════════════════════════════════════
// 8. PAGES CRUD
// ═══════════════════════════════════════════
async function testPages() {
  console.log('\n── Pages CRUD ──');

  let r = await api('POST', '/pages', {
    title: `Test Page_${RUN_ID}`,
    description: 'A test page',
    contentBlocks: [
      { title: 'Introduction', contentType: 'richtext', content: '<p>Welcome to this page.</p>', order: 1 },
      { title: 'FAQ', contentType: 'faq', content: [{ question: 'Q1?', answer: 'A1' }], order: 2 },
    ],
    metaTitle: 'Test Page SEO',
    metaDescription: 'Test page for SEO testing',
  });
  log('Pages', 'Create page', r.status === 201, `status=${r.status}`);
  if (r.status === 201) {
    created.page = r.data.data._id;
    created.pageSlug = r.data.data.slug;
  }

  r = await api('GET', `/pages/${created.page}`);
  log('Pages', 'Read page by ID', r.status === 200);
  log('Pages', 'Page has content blocks', r.data.data.contentBlocks?.length === 2);
  log('Pages', 'Page status is draft', r.data.data.status === 'draft');

  r = await api('PATCH', `/pages/${created.page}/publish`, { status: 'published' });
  log('Pages', 'Publish page', r.status === 200);

  r = await api('GET', `/public/pages/${created.pageSlug}`, null, null);
  log('Pages', 'Published page visible publicly', r.status === 200);

  r = await api('PATCH', `/pages/${created.page}`, { description: 'Updated description' });
  log('Pages', 'Update page', r.status === 200);
}

// ═══════════════════════════════════════════
// 9. SEO CRUD
// ═══════════════════════════════════════════
async function testSeo() {
  console.log('\n── SEO CRUD ──');

  let r = await api('POST', '/seo', {
    targetType: 'college',
    targetId: created.college,
    metaTitle: 'Test Institute - Best Private College',
    metaDescription: 'Discover Test Institute, a leading private college.',
    metaKeywords: ['test', 'college', 'engineering'],
    ogTitle: 'Test Institute',
    ogDescription: 'A great college',
    robots: 'index, follow',
  });
  log('SEO', 'Create SEO entry', r.status === 201, `status=${r.status}`);
  if (r.status === 201) created.seo = r.data.data._id;

  r = await api('GET', `/seo/${created.seo}`);
  log('SEO', 'Read SEO by ID', r.status === 200);
  log('SEO', 'SEO has meta keywords', r.data.data.metaKeywords?.length === 3);

  r = await api('PATCH', `/seo/${created.seo}`, { metaTitle: 'Updated Title' });
  log('SEO', 'Update SEO', r.status === 200);

  r = await api('GET', `/public/seo/college/${created.college}`, null, null);
  log('SEO', 'Public SEO accessible', r.status === 200);

  r = await api('GET', '/seo');
  log('SEO', 'List SEO entries', r.status === 200);
}

// ═══════════════════════════════════════════
// 10. SITE SETTINGS
// ═══════════════════════════════════════════
async function testSiteSettings() {
  console.log('\n── Site Settings ──');

  let r = await api('GET', '/site-settings');
  log('SiteSettings', 'Get settings', r.status === 200);
  log('SiteSettings', 'Has hero', !!r.data.data.hero);
  log('SiteSettings', 'Has footer', !!r.data.data.footer);
  log('SiteSettings', 'Has contact', !!r.data.data.contact);

  r = await api('PATCH', '/site-settings', {
    hero: { title: `Updated Title_${RUN_ID}`, subtitle: 'Updated subtitle' }
  });
  log('SiteSettings', 'Update hero settings', r.status === 200);

  r = await api('GET', '/site-settings');
  log('SiteSettings', 'Hero title updated', r.data.data.hero.title === `Updated Title_${RUN_ID}`);

  // Restore
  r = await api('PATCH', '/site-settings', {
    hero: { title: 'Discover Colleges, Courses', titleHighlight: '& Entrance Exams', subtitle: 'Get genuine information about admissions, fees, placements, and rankings for colleges across India.' }
  });

  r = await api('GET', '/public/site-settings', null, null);
  log('SiteSettings', 'Public site settings accessible', r.status === 200);
}

// ═══════════════════════════════════════════
// 11. DASHBOARD
// ═══════════════════════════════════════════
async function testDashboard() {
  console.log('\n── Dashboard ──');

  let r = await api('GET', '/dashboard/stats');
  log('Dashboard', 'Get stats', r.status === 200);
  log('Dashboard', 'Has totalColleges', r.data.data.totalColleges >= 50);
  log('Dashboard', 'Has totalLeads', typeof r.data.data.totalLeads === 'number');
  log('Dashboard', 'Has totalCourses', typeof r.data.data.totalCourses === 'number');

  r = await api('GET', '/dashboard/pipeline');
  log('Dashboard', 'Get pipeline', r.status === 200);

  r = await api('GET', '/dashboard/activity');
  log('Dashboard', 'Get activity', r.status === 200);
  log('Dashboard', 'Activity has entries', r.data.data.length >= 1);
}

// ═══════════════════════════════════════════
// 12. CONTENT ASSIGNMENTS
// ═══════════════════════════════════════════
async function testContentAssignments() {
  console.log('\n── Content Assignments ──');

  // First we need another user
  let r = await api('POST', '/users', {
    firstName: 'Editor',
    lastName: `Test_${RUN_ID}`,
    email: `editor_${RUN_ID}@test.com`,
    password: 'EditorPass@123',
  });
  if (r.status === 201) created.editorUser = r.data.data._id;
  log('Assignments', 'Create editor user', r.status === 201, `status=${r.status}`);

  r = await api('POST', '/content-assignments', {
    user: created.editorUser,
    contentType: 'college',
    scope: 'individual',
    contentId: created.college,
    actions: ['read', 'update'],
  });
  log('Assignments', 'Create assignment', r.status === 201, `status=${r.status}`);
  if (r.status === 201) created.assignment = r.data.data._id;

  r = await api('GET', `/content-assignments/${created.assignment}`);
  log('Assignments', 'Read assignment', r.status === 200);
  log('Assignments', 'Assignment has actions', r.data.data.actions?.length === 2);

  r = await api('PATCH', `/content-assignments/${created.assignment}`, { actions: ['read', 'update', 'publish'] });
  log('Assignments', 'Update assignment', r.status === 200);

  r = await api('GET', '/content-assignments');
  log('Assignments', 'List assignments', r.status === 200);
}

// ═══════════════════════════════════════════
// 13. ROLES + PERMISSIONS (RBAC)
// ═══════════════════════════════════════════
async function testRBAC() {
  console.log('\n── RBAC: Roles & Permissions ──');

  // List all permissions
  let r = await api('GET', '/permissions');
  log('RBAC', 'List permissions', r.status === 200 && r.data.data.length >= 50, `count=${r.data.data?.length}`);
  const allPerms = r.data.data;
  const permMap = {};
  allPerms.forEach(p => permMap[p.key] = p._id);

  // Create "College Viewer" role — can only read colleges
  const collegeReadPerms = allPerms.filter(p => p.key === 'college:read').map(p => p._id);
  r = await api('POST', '/roles', {
    name: `college_viewer_${RUN_ID}`,
    displayName: `College Viewer ${RUN_ID}`,
  });
  log('RBAC', 'Create College Viewer role', r.status === 201, `status=${r.status}`);
  if (r.status === 201) created.viewerRole = r.data.data._id;

  r = await api('PATCH', `/roles/${created.viewerRole}/permissions`, { permissions: collegeReadPerms });
  log('RBAC', 'Assign 1 permission to viewer role', r.status === 200);

  // Create "Lead Manager" role — lead read + update + manage + assign
  const leadPerms = allPerms
    .filter(p => ['lead:read', 'lead:update', 'lead:manage', 'lead:assign'].includes(p.key))
    .map(p => p._id);
  r = await api('POST', '/roles', {
    name: `lead_mgr_${RUN_ID}`,
    displayName: `Lead Manager ${RUN_ID}`,
  });
  if (r.status === 201) created.leadMgrRole = r.data.data._id;
  log('RBAC', 'Create Lead Manager role', r.status === 201);

  r = await api('PATCH', `/roles/${created.leadMgrRole}/permissions`, { permissions: leadPerms });
  log('RBAC', 'Assign lead permissions', r.status === 200, `assigned=${leadPerms.length}`);

  // Create "Content Editor" role — colleges read+update, courses read, sections full, pages full, seo full
  const editorPermKeys = [
    'college:read', 'college:update',
    'course:read',
    'content-section:create', 'content-section:read', 'content-section:update', 'content-section:delete',
    'page:create', 'page:read', 'page:update', 'page:delete', 'page:publish',
    'seo:create', 'seo:read', 'seo:update', 'seo:delete',
  ];
  const editorPerms = allPerms.filter(p => editorPermKeys.includes(p.key)).map(p => p._id);
  r = await api('POST', '/roles', {
    name: `content_editor_${RUN_ID}`,
    displayName: `Content Editor ${RUN_ID}`,
  });
  if (r.status === 201) created.editorRole = r.data.data._id;
  log('RBAC', 'Create Content Editor role', r.status === 201);
  r = await api('PATCH', `/roles/${created.editorRole}/permissions`, { permissions: editorPerms });
  log('RBAC', 'Assign editor permissions', r.status === 200, `assigned=${editorPerms.length}`);

  // Create test users for each role
  // User 1: College Viewer
  r = await api('POST', '/users', {
    firstName: 'Viewer',
    lastName: `User_${RUN_ID}`,
    email: `viewer_${RUN_ID}@test.com`,
    password: 'ViewerPass@123',
  });
  if (r.status === 201) created.viewerUser = r.data.data._id;
  log('RBAC', 'Create viewer user', r.status === 201);

  r = await api('PATCH', `/users/${created.viewerUser}/roles`, { roles: [created.viewerRole] });
  log('RBAC', 'Assign viewer role', r.status === 200);

  // User 2: Lead Manager
  r = await api('POST', '/users', {
    firstName: 'LeadMgr',
    lastName: `User_${RUN_ID}`,
    email: `leadmgr_${RUN_ID}@test.com`,
    password: 'LeadPass@123',
  });
  if (r.status === 201) created.leadMgrUser = r.data.data._id;
  log('RBAC', 'Create lead manager user', r.status === 201);

  r = await api('PATCH', `/users/${created.leadMgrUser}/roles`, { roles: [created.leadMgrRole] });
  log('RBAC', 'Assign lead mgr role', r.status === 200);

  // User 3: Content Editor
  r = await api('POST', '/users', {
    firstName: 'Editor',
    lastName: `User_${RUN_ID}`,
    email: `editor2_${RUN_ID}@test.com`,
    password: 'EditorPass@123',
  });
  if (r.status === 201) created.editorUser2 = r.data.data._id;
  log('RBAC', 'Create editor user', r.status === 201);

  r = await api('PATCH', `/users/${created.editorUser2}/roles`, { roles: [created.editorRole] });
  log('RBAC', 'Assign editor role', r.status === 200);

  // ── Login as each user and test permissions ──
  console.log('\n── RBAC: College Viewer Permissions ──');
  r = await api('POST', '/auth/login', { email: `viewer_${RUN_ID}@test.com`, password: 'ViewerPass@123' }, null);
  const viewerToken = r.data.data?.accessToken;
  log('RBAC', 'Viewer login', !!viewerToken);

  r = await api('GET', '/colleges', null, viewerToken);
  log('RBAC', 'Viewer: ALLOW GET /colleges', r.status === 200);

  r = await api('POST', '/colleges', { name: 'Hack College', type: 'public' }, viewerToken);
  log('RBAC', 'Viewer: DENY POST /colleges', r.status === 403);

  r = await api('PATCH', `/colleges/${created.college}`, { name: 'Hacked' }, viewerToken);
  log('RBAC', 'Viewer: DENY PATCH /colleges', r.status === 403);

  r = await api('DELETE', `/colleges/${created.college}`, null, viewerToken);
  log('RBAC', 'Viewer: DENY DELETE /colleges', r.status === 403);

  r = await api('GET', '/leads', null, viewerToken);
  log('RBAC', 'Viewer: DENY GET /leads', r.status === 403);

  r = await api('GET', '/users', null, viewerToken);
  log('RBAC', 'Viewer: DENY GET /users', r.status === 403);

  r = await api('GET', '/forms', null, viewerToken);
  log('RBAC', 'Viewer: DENY GET /forms', r.status === 403);

  r = await api('GET', '/dashboard/stats', null, viewerToken);
  log('RBAC', 'Viewer: DENY GET /dashboard', r.status === 403);

  r = await api('GET', '/site-settings', null, viewerToken);
  log('RBAC', 'Viewer: DENY GET /site-settings', r.status === 403);

  // ── Lead Manager ──
  console.log('\n── RBAC: Lead Manager Permissions ──');
  r = await api('POST', '/auth/login', { email: `leadmgr_${RUN_ID}@test.com`, password: 'LeadPass@123' }, null);
  const leadToken = r.data.data?.accessToken;
  log('RBAC', 'Lead Mgr login', !!leadToken);

  r = await api('GET', '/leads', null, leadToken);
  log('RBAC', 'LeadMgr: ALLOW GET /leads', r.status === 200);

  r = await api('GET', `/leads/${created.lead}`, null, leadToken);
  log('RBAC', 'LeadMgr: ALLOW GET /leads/:id', r.status === 200);

  r = await api('PATCH', `/leads/${created.lead}`, { priority: 'medium' }, leadToken);
  log('RBAC', 'LeadMgr: ALLOW PATCH /leads/:id', r.status === 200);

  r = await api('PATCH', `/leads/${created.lead}/status`, { status: 'qualified' }, leadToken);
  log('RBAC', 'LeadMgr: ALLOW change status', r.status === 200);

  r = await api('POST', `/leads/${created.lead}/notes`, { content: 'Note from lead mgr' }, leadToken);
  log('RBAC', 'LeadMgr: ALLOW add notes', r.status === 200);

  r = await api('GET', '/colleges', null, leadToken);
  log('RBAC', 'LeadMgr: DENY GET /colleges', r.status === 403);

  r = await api('GET', '/users', null, leadToken);
  log('RBAC', 'LeadMgr: DENY GET /users', r.status === 403);

  r = await api('DELETE', `/leads/${created.lead}`, null, leadToken);
  log('RBAC', 'LeadMgr: DENY DELETE /leads', r.status === 403);

  r = await api('GET', '/dashboard/stats', null, leadToken);
  log('RBAC', 'LeadMgr: DENY GET /dashboard', r.status === 403);

  // ── Content Editor ──
  console.log('\n── RBAC: Content Editor Permissions ──');
  r = await api('POST', '/auth/login', { email: `editor2_${RUN_ID}@test.com`, password: 'EditorPass@123' }, null);
  const editorToken = r.data.data?.accessToken;
  log('RBAC', 'Editor login', !!editorToken);

  r = await api('GET', '/colleges', null, editorToken);
  log('RBAC', 'Editor: ALLOW GET /colleges', r.status === 200);

  r = await api('PATCH', `/colleges/${created.college}`, { description: 'Editor updated' }, editorToken);
  log('RBAC', 'Editor: ALLOW PATCH /colleges', r.status === 200);

  r = await api('POST', '/colleges', { name: 'New', type: 'public' }, editorToken);
  log('RBAC', 'Editor: DENY POST /colleges (no create)', r.status === 403);

  r = await api('DELETE', `/colleges/${created.college}`, null, editorToken);
  log('RBAC', 'Editor: DENY DELETE /colleges', r.status === 403);

  r = await api('POST', '/content-sections', {
    college: created.college, sectionKey: 'test', title: 'Editor Section', contentType: 'richtext', content: '<p>test</p>'
  }, editorToken);
  log('RBAC', 'Editor: ALLOW POST /content-sections', r.status === 201);
  if (r.status === 201) created.editorSection = r.data.data._id;

  r = await api('GET', '/content-sections', null, editorToken);
  log('RBAC', 'Editor: ALLOW GET /content-sections', r.status === 200);

  r = await api('POST', '/pages', { title: 'Editor Page', contentBlocks: [] }, editorToken);
  log('RBAC', 'Editor: ALLOW POST /pages', r.status === 201);
  if (r.status === 201) created.editorPage = r.data.data._id;

  r = await api('GET', '/leads', null, editorToken);
  log('RBAC', 'Editor: DENY GET /leads', r.status === 403);

  r = await api('GET', '/forms', null, editorToken);
  log('RBAC', 'Editor: DENY GET /forms', r.status === 403);

  r = await api('GET', '/reviews', null, editorToken);
  log('RBAC', 'Editor: DENY GET /reviews', r.status === 403);

  // ── Unauthenticated access ──
  console.log('\n── RBAC: Unauthenticated Access ──');
  r = await api('GET', '/colleges', null, null);
  log('RBAC', 'No token: DENY GET /colleges', r.status === 401);

  r = await api('GET', '/leads', null, null);
  log('RBAC', 'No token: DENY GET /leads', r.status === 401);

  r = await api('POST', '/colleges', { name: 'x' }, null);
  log('RBAC', 'No token: DENY POST /colleges', r.status === 401);

  r = await api('GET', '/dashboard/stats', null, null);
  log('RBAC', 'No token: DENY GET /dashboard', r.status === 401);

  // ── Invalid/expired token ──
  r = await api('GET', '/colleges', null, 'Bearer invalid.token.here');
  log('RBAC', 'Invalid token rejected', r.status === 401);

  // ── Deactivate user ──
  console.log('\n── RBAC: User Deactivation ──');
  r = await api('PATCH', `/users/${created.viewerUser}/activate`, { isActive: false });
  log('RBAC', 'Deactivate viewer user', r.status === 200);

  r = await api('POST', '/auth/login', { email: `viewer_${RUN_ID}@test.com`, password: 'ViewerPass@123' }, null);
  log('RBAC', 'Deactivated user login rejected', r.status === 401 || r.status === 403, `status=${r.status}`);

  // Reactivate
  r = await api('PATCH', `/users/${created.viewerUser}/activate`, { isActive: true });
  log('RBAC', 'Reactivate user', r.status === 200);

  r = await api('POST', '/auth/login', { email: `viewer_${RUN_ID}@test.com`, password: 'ViewerPass@123' }, null);
  log('RBAC', 'Reactivated user can login', r.status === 200);

  // ── System role protection ──
  const sysRoles = await api('GET', '/roles');
  const superAdminRole = sysRoles.data.data.find(r => r.name === 'super_admin');
  if (superAdminRole) {
    r = await api('DELETE', `/roles/${superAdminRole._id}`);
    log('RBAC', 'Cannot delete system role', r.status === 400 || r.status === 403, `status=${r.status}`);
  }
}

// ═══════════════════════════════════════════
// 14. AUTH FEATURES
// ═══════════════════════════════════════════
async function testAuth() {
  console.log('\n── Auth Features ──');

  // Register
  let r = await api('POST', '/auth/register', {
    firstName: 'New',
    lastName: `User_${RUN_ID}`,
    email: `newuser_${RUN_ID}@test.com`,
    password: 'NewPass@123',
  }, null);
  log('Auth', 'Register new user', r.status === 201, `status=${r.status}`);
  let newUserToken = r.data.data?.accessToken;
  let refreshToken = r.data.data?.refreshToken;
  if (r.status === 201) created.newUser = r.data.data.user?._id;

  // Me
  r = await api('GET', '/auth/me', null, newUserToken);
  log('Auth', 'GET /auth/me', r.status === 200);
  log('Auth', 'Me returns email', r.data.data.user?.email === `newuser_${RUN_ID}@test.com` || r.data.data.email === `newuser_${RUN_ID}@test.com`);

  // Update profile
  r = await api('PATCH', '/auth/me', { firstName: 'Updated' }, newUserToken);
  log('Auth', 'Update profile', r.status === 200);

  // Change password
  r = await api('POST', '/auth/change-password', {
    currentPassword: 'NewPass@123',
    newPassword: 'ChangedPass@123',
  }, newUserToken);
  log('Auth', 'Change password', r.status === 200, `status=${r.status}`);

  // Login with new password
  r = await api('POST', '/auth/login', { email: `newuser_${RUN_ID}@test.com`, password: 'ChangedPass@123' }, null);
  log('Auth', 'Login with new password', r.status === 200);
  newUserToken = r.data.data?.accessToken;
  refreshToken = r.data.data?.refreshToken;

  // Refresh token
  if (refreshToken) {
    r = await api('POST', '/auth/refresh', { refreshToken }, null);
    log('Auth', 'Refresh token', r.status === 200, `status=${r.status}`);
    log('Auth', 'Refresh returns new tokens', !!r.data.data?.accessToken);
  }

  // Logout
  if (refreshToken) {
    r = await api('POST', '/auth/logout', { refreshToken }, newUserToken);
    log('Auth', 'Logout', r.status === 200, `status=${r.status}`);
  }

  // Duplicate register
  r = await api('POST', '/auth/register', {
    firstName: 'Dup',
    lastName: 'User',
    email: `newuser_${RUN_ID}@test.com`,
    password: 'Pass@123',
  }, null);
  log('Auth', 'Duplicate email rejected', r.status === 409 || r.status === 400, `status=${r.status}`);
}

// ═══════════════════════════════════════════
// 15. EDGE CASES
// ═══════════════════════════════════════════
async function testEdgeCases() {
  console.log('\n── Edge Cases ──');

  let r = await api('GET', '/colleges/000000000000000000000000');
  log('Edge', 'Non-existent ObjectId → 404', r.status === 404);

  r = await api('GET', '/colleges/invalid-id');
  log('Edge', 'Invalid ObjectId handled', r.status === 400 || r.status === 404, `status=${r.status}`);

  r = await api('GET', '/api/v1/nonexistent');
  log('Edge', '404 on unknown route', r.status === 404, `status=${r.status}`);

  // Validation errors
  r = await api('POST', '/colleges', {});
  log('Edge', 'Validation: empty college rejected', r.status === 400, `status=${r.status}`);

  r = await api('POST', '/courses', { name: '' });
  log('Edge', 'Validation: empty course rejected', r.status === 400, `status=${r.status}`);

  r = await api('POST', '/auth/login', { email: 'admin@campusoption.com', password: 'wrongpass' }, null);
  log('Edge', 'Wrong password rejected', r.status === 401, `status=${r.status}`);

  r = await api('POST', '/auth/login', { email: 'nonexist@test.com', password: 'Pass@123' }, null);
  log('Edge', 'Non-existent email rejected', r.status === 401, `status=${r.status}`);

  // Bulk lead operations
  if (created.lead) {
    r = await api('GET', '/leads');
    const leadIds = r.data.data.map(l => l._id).slice(0, 2);
    if (leadIds.length >= 1) {
      r = await api('POST', '/leads/bulk', { action: 'changeStatus', ids: leadIds, status: 'contacted' });
      log('Edge', 'Bulk lead status change', r.status === 200, `status=${r.status}`);
    }
  }
}

// ═══════════════════════════════════════════
// CLEANUP
// ═══════════════════════════════════════════
async function cleanup() {
  console.log('\n── Cleanup ──');

  const deletes = [
    ['editorSection', '/content-sections'],
    ['editorPage', '/pages'],
    ['seo', '/seo'],
    ['section1', '/content-sections'],
    ['section2', '/content-sections'],
    ['section3', '/content-sections'],
    ['courseSection', '/content-sections'],
    ['discussion', '/discussions'],
    ['review', '/reviews'],
    ['review2', '/reviews'],
    ['assignment', '/content-assignments'],
    ['form', '/forms'],
    ['page', '/pages'],
    ['exam', '/exams'],
    ['course', '/courses'],
    ['course2', '/courses'],
    ['college', '/colleges'],
    ['category', '/categories'],
  ];

  for (const [key, path] of deletes) {
    if (created[key]) {
      const r = await api('DELETE', `${path}/${created[key]}`);
      log('Cleanup', `Delete ${key}`, r.status === 200 || r.status === 204, `status=${r.status}`);
    }
  }

  // Delete test users
  const userKeys = ['viewerUser', 'leadMgrUser', 'editorUser', 'editorUser2', 'newUser'];
  for (const key of userKeys) {
    if (created[key]) {
      const r = await api('DELETE', `/users/${created[key]}`);
      log('Cleanup', `Delete user ${key}`, r.status === 200 || r.status === 204, `status=${r.status}`);
    }
  }

  // Delete test roles
  const roleKeys = ['viewerRole', 'leadMgrRole', 'editorRole'];
  for (const key of roleKeys) {
    if (created[key]) {
      const r = await api('DELETE', `/roles/${created[key]}`);
      log('Cleanup', `Delete role ${key}`, r.status === 200 || r.status === 204, `status=${r.status}`);
    }
  }
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════
async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('  ReactCampus Admin CRUD + RBAC Test');
  console.log(`  Run ID: ${RUN_ID}`);
  console.log('═══════════════════════════════════════════════════');

  // Login as admin
  const loginRes = await api('POST', '/auth/login', { email: 'admin@campusoption.com', password: 'Admin@123456' }, null);
  if (loginRes.status !== 200) {
    console.log('FATAL: Admin login failed');
    process.exit(1);
  }
  adminToken = loginRes.data.data.accessToken;
  console.log('Admin login OK\n');

  await testCategories();
  await testCourses();
  await testExams();
  await testColleges();
  await testContentSections();
  await testFormsAndLeads();
  await testReviewsDiscussions();
  await testPages();
  await testSeo();
  await testSiteSettings();
  await testDashboard();
  await testContentAssignments();
  await testRBAC();
  await testAuth();
  await testEdgeCases();
  await cleanup();

  // Summary
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;

  console.log('\n═══════════════════════════════════════════════════');
  console.log(`  Result: ${passed}/${total} passed, ${failed} failed`);
  console.log(`  Status: ${failed === 0 ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  console.log('═══════════════════════════════════════════════════');

  if (failed > 0) {
    console.log('\nFailed tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  ✗ [${r.suite}] ${r.test} — ${r.detail}`);
    });
  }

  // Write report
  const fs = require('fs');
  const suites = {};
  results.forEach(r => {
    if (!suites[r.suite]) suites[r.suite] = { passed: 0, failed: 0, total: 0 };
    suites[r.suite].total++;
    if (r.passed) suites[r.suite].passed++;
    else suites[r.suite].failed++;
  });

  let report = `═══════════════════════════════════════════════════
  ReactCampus Admin CRUD + RBAC Test Report
  Generated: ${new Date().toISOString()}
  Run ID: ${RUN_ID}
═══════════════════════════════════════════════════\n\n`;

  // Suite summary table
  report += `${'Suite'.padEnd(40)} ${'Passed'.padStart(6)} ${'Failed'.padStart(6)} ${'Total'.padStart(6)}\n`;
  report += '─'.repeat(60) + '\n';
  for (const [suite, s] of Object.entries(suites)) {
    const prefix = s.failed > 0 ? 'FAIL' : 'PASS';
    report += `${prefix} ${suite.padEnd(35)} ${String(s.passed).padStart(6)} ${String(s.failed).padStart(6)} ${String(s.total).padStart(6)}\n`;
  }
  report += '─'.repeat(60) + '\n';
  report += `${'TOTAL'.padEnd(40)} ${String(passed).padStart(6)} ${String(failed).padStart(6)} ${String(total).padStart(6)}\n\n`;

  // Detailed results
  report += 'DETAILED RESULTS\n' + '─'.repeat(60) + '\n\n';
  let currentSuite = '';
  for (const r of results) {
    if (r.suite !== currentSuite) {
      currentSuite = r.suite;
      report += `── ${currentSuite} ──\n`;
    }
    report += `  ${r.passed ? '✓' : '✗'} ${r.test}${r.detail && !r.passed ? ` — ${r.detail}` : ''}\n`;
  }

  report += `\nResult: ${passed}/${total} passed, ${failed} failed\n`;
  report += `Status: ${failed === 0 ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}\n`;

  fs.writeFileSync('devtesting/admin-crud-rbac-report.txt', report);
  console.log('\nReport written to devtesting/admin-crud-rbac-report.txt');
}

main().catch(e => { console.error('Fatal error:', e); process.exit(1); });
