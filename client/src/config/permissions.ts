export const PERMISSIONS = {
  // User Management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  USER_ACTIVATE: 'user:activate',
  USER_ASSIGN_ROLE: 'user:assign-role',

  // Role Management
  ROLE_CREATE: 'role:create',
  ROLE_READ: 'role:read',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
  ROLE_ASSIGN_PERMISSION: 'role:assign-permission',

  // Permission Management
  PERMISSION_READ: 'permission:read',

  // College Management
  COLLEGE_CREATE: 'college:create',
  COLLEGE_READ: 'college:read',
  COLLEGE_UPDATE: 'college:update',
  COLLEGE_DELETE: 'college:delete',
  COLLEGE_PUBLISH: 'college:publish',
  COLLEGE_MANAGE_COURSES: 'college:manage-courses',
  COLLEGE_MANAGE_EXAMS: 'college:manage-exams',

  // Course Management
  COURSE_CREATE: 'course:create',
  COURSE_READ: 'course:read',
  COURSE_UPDATE: 'course:update',
  COURSE_DELETE: 'course:delete',

  // Exam Management
  EXAM_CREATE: 'exam:create',
  EXAM_READ: 'exam:read',
  EXAM_UPDATE: 'exam:update',
  EXAM_DELETE: 'exam:delete',

  // Content Section Management
  CONTENT_SECTION_CREATE: 'content-section:create',
  CONTENT_SECTION_READ: 'content-section:read',
  CONTENT_SECTION_UPDATE: 'content-section:update',
  CONTENT_SECTION_DELETE: 'content-section:delete',

  // Form Management
  FORM_CREATE: 'form:create',
  FORM_READ: 'form:read',
  FORM_UPDATE: 'form:update',
  FORM_DELETE: 'form:delete',
  FORM_PUBLISH: 'form:publish',
  FORM_VIEW_SUBMISSIONS: 'form:view-submissions',

  // Lead Management
  LEAD_CREATE: 'lead:create',
  LEAD_READ: 'lead:read',
  LEAD_UPDATE: 'lead:update',
  LEAD_DELETE: 'lead:delete',
  LEAD_ASSIGN: 'lead:assign',
  LEAD_MANAGE: 'lead:manage',
  LEAD_EXPORT: 'lead:export',
  LEAD_VIEW_STATS: 'lead:view-stats',

  // Review Management
  REVIEW_READ: 'review:read',
  REVIEW_MODERATE: 'review:moderate',
  REVIEW_DELETE: 'review:delete',

  // Page Management
  PAGE_CREATE: 'page:create',
  PAGE_READ: 'page:read',
  PAGE_UPDATE: 'page:update',
  PAGE_DELETE: 'page:delete',
  PAGE_PUBLISH: 'page:publish',

  // SEO Management
  SEO_CREATE: 'seo:create',
  SEO_READ: 'seo:read',
  SEO_UPDATE: 'seo:update',
  SEO_DELETE: 'seo:delete',

  // Dashboard
  DASHBOARD_VIEW: 'dashboard:view',
  DASHBOARD_ANALYTICS: 'dashboard:analytics',

  // Audit
  AUDIT_READ: 'audit:read',
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_GROUPS: Record<string, { label: string; permissions: string[] }> = {
  'User Management': {
    label: 'User Management',
    permissions: [PERMISSIONS.USER_CREATE, PERMISSIONS.USER_READ, PERMISSIONS.USER_UPDATE, PERMISSIONS.USER_DELETE, PERMISSIONS.USER_ACTIVATE, PERMISSIONS.USER_ASSIGN_ROLE],
  },
  'Role Management': {
    label: 'Role Management',
    permissions: [PERMISSIONS.ROLE_CREATE, PERMISSIONS.ROLE_READ, PERMISSIONS.ROLE_UPDATE, PERMISSIONS.ROLE_DELETE, PERMISSIONS.ROLE_ASSIGN_PERMISSION],
  },
  'Permission Management': {
    label: 'Permission Management',
    permissions: [PERMISSIONS.PERMISSION_READ],
  },
  'College Management': {
    label: 'College Management',
    permissions: [PERMISSIONS.COLLEGE_CREATE, PERMISSIONS.COLLEGE_READ, PERMISSIONS.COLLEGE_UPDATE, PERMISSIONS.COLLEGE_DELETE, PERMISSIONS.COLLEGE_PUBLISH, PERMISSIONS.COLLEGE_MANAGE_COURSES, PERMISSIONS.COLLEGE_MANAGE_EXAMS],
  },
  'Course Management': {
    label: 'Course Management',
    permissions: [PERMISSIONS.COURSE_CREATE, PERMISSIONS.COURSE_READ, PERMISSIONS.COURSE_UPDATE, PERMISSIONS.COURSE_DELETE],
  },
  'Exam Management': {
    label: 'Exam Management',
    permissions: [PERMISSIONS.EXAM_CREATE, PERMISSIONS.EXAM_READ, PERMISSIONS.EXAM_UPDATE, PERMISSIONS.EXAM_DELETE],
  },
  'Content Management': {
    label: 'Content Management',
    permissions: [PERMISSIONS.CONTENT_SECTION_CREATE, PERMISSIONS.CONTENT_SECTION_READ, PERMISSIONS.CONTENT_SECTION_UPDATE, PERMISSIONS.CONTENT_SECTION_DELETE],
  },
  'Form Management': {
    label: 'Form Management',
    permissions: [PERMISSIONS.FORM_CREATE, PERMISSIONS.FORM_READ, PERMISSIONS.FORM_UPDATE, PERMISSIONS.FORM_DELETE, PERMISSIONS.FORM_PUBLISH, PERMISSIONS.FORM_VIEW_SUBMISSIONS],
  },
  'Lead Management': {
    label: 'Lead Management',
    permissions: [PERMISSIONS.LEAD_CREATE, PERMISSIONS.LEAD_READ, PERMISSIONS.LEAD_UPDATE, PERMISSIONS.LEAD_DELETE, PERMISSIONS.LEAD_ASSIGN, PERMISSIONS.LEAD_MANAGE, PERMISSIONS.LEAD_EXPORT, PERMISSIONS.LEAD_VIEW_STATS],
  },
  'Review Management': {
    label: 'Review Management',
    permissions: [PERMISSIONS.REVIEW_READ, PERMISSIONS.REVIEW_MODERATE, PERMISSIONS.REVIEW_DELETE],
  },
  'Page Management': {
    label: 'Page Management',
    permissions: [PERMISSIONS.PAGE_CREATE, PERMISSIONS.PAGE_READ, PERMISSIONS.PAGE_UPDATE, PERMISSIONS.PAGE_DELETE, PERMISSIONS.PAGE_PUBLISH],
  },
  'SEO Management': {
    label: 'SEO Management',
    permissions: [PERMISSIONS.SEO_CREATE, PERMISSIONS.SEO_READ, PERMISSIONS.SEO_UPDATE, PERMISSIONS.SEO_DELETE],
  },
  Dashboard: {
    label: 'Dashboard',
    permissions: [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.DASHBOARD_ANALYTICS],
  },
  Audit: {
    label: 'Audit',
    permissions: [PERMISSIONS.AUDIT_READ],
  },
};
