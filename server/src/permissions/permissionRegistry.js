const PERMISSIONS = [
  // User management
  { key: 'user:create', resource: 'user', action: 'create', description: 'Create new users', group: 'User Management' },
  { key: 'user:read', resource: 'user', action: 'read', description: 'View users', group: 'User Management' },
  { key: 'user:update', resource: 'user', action: 'update', description: 'Update users', group: 'User Management' },
  { key: 'user:delete', resource: 'user', action: 'delete', description: 'Delete users', group: 'User Management' },
  { key: 'user:activate', resource: 'user', action: 'activate', description: 'Activate/deactivate users', group: 'User Management' },
  { key: 'user:assign-role', resource: 'user', action: 'assign-role', description: 'Assign roles to users', group: 'User Management' },

  // Role management
  { key: 'role:create', resource: 'role', action: 'create', description: 'Create roles', group: 'Role Management' },
  { key: 'role:read', resource: 'role', action: 'read', description: 'View roles', group: 'Role Management' },
  { key: 'role:update', resource: 'role', action: 'update', description: 'Update roles', group: 'Role Management' },
  { key: 'role:delete', resource: 'role', action: 'delete', description: 'Delete roles', group: 'Role Management' },
  { key: 'role:assign-permission', resource: 'role', action: 'assign-permission', description: 'Assign permissions to roles', group: 'Role Management' },

  // Permission management
  { key: 'permission:read', resource: 'permission', action: 'read', description: 'View permissions', group: 'Permission Management' },

  // College management
  { key: 'college:create', resource: 'college', action: 'create', description: 'Create colleges', group: 'College Management' },
  { key: 'college:read', resource: 'college', action: 'read', description: 'View colleges (admin)', group: 'College Management' },
  { key: 'college:update', resource: 'college', action: 'update', description: 'Update colleges', group: 'College Management' },
  { key: 'college:delete', resource: 'college', action: 'delete', description: 'Delete colleges', group: 'College Management' },
  { key: 'college:publish', resource: 'college', action: 'publish', description: 'Publish/unpublish colleges', group: 'College Management' },
  { key: 'college:manage-courses', resource: 'college', action: 'manage-courses', description: 'Add/remove courses from colleges', group: 'College Management' },
  { key: 'college:manage-exams', resource: 'college', action: 'manage-exams', description: 'Add/remove exams from colleges', group: 'College Management' },

  // Course management
  { key: 'course:create', resource: 'course', action: 'create', description: 'Create courses', group: 'Course Management' },
  { key: 'course:read', resource: 'course', action: 'read', description: 'View courses (admin)', group: 'Course Management' },
  { key: 'course:update', resource: 'course', action: 'update', description: 'Update courses', group: 'Course Management' },
  { key: 'course:delete', resource: 'course', action: 'delete', description: 'Delete courses', group: 'Course Management' },

  // Exam management
  { key: 'exam:create', resource: 'exam', action: 'create', description: 'Create exams', group: 'Exam Management' },
  { key: 'exam:read', resource: 'exam', action: 'read', description: 'View exams (admin)', group: 'Exam Management' },
  { key: 'exam:update', resource: 'exam', action: 'update', description: 'Update exams', group: 'Exam Management' },
  { key: 'exam:delete', resource: 'exam', action: 'delete', description: 'Delete exams', group: 'Exam Management' },

  // Content section management
  { key: 'content-section:create', resource: 'content-section', action: 'create', description: 'Create content sections', group: 'Content Management' },
  { key: 'content-section:read', resource: 'content-section', action: 'read', description: 'View content sections', group: 'Content Management' },
  { key: 'content-section:update', resource: 'content-section', action: 'update', description: 'Update content sections', group: 'Content Management' },
  { key: 'content-section:delete', resource: 'content-section', action: 'delete', description: 'Delete content sections', group: 'Content Management' },

  // Form management
  { key: 'form:create', resource: 'form', action: 'create', description: 'Create forms', group: 'Form Management' },
  { key: 'form:read', resource: 'form', action: 'read', description: 'View forms', group: 'Form Management' },
  { key: 'form:update', resource: 'form', action: 'update', description: 'Update forms', group: 'Form Management' },
  { key: 'form:delete', resource: 'form', action: 'delete', description: 'Delete forms', group: 'Form Management' },
  { key: 'form:publish', resource: 'form', action: 'publish', description: 'Publish/unpublish forms', group: 'Form Management' },
  { key: 'form:view-submissions', resource: 'form', action: 'view-submissions', description: 'View form submissions', group: 'Form Management' },

  // Lead management
  { key: 'lead:create', resource: 'lead', action: 'create', description: 'Create leads', group: 'Lead Management' },
  { key: 'lead:read', resource: 'lead', action: 'read', description: 'View leads', group: 'Lead Management' },
  { key: 'lead:update', resource: 'lead', action: 'update', description: 'Update leads', group: 'Lead Management' },
  { key: 'lead:delete', resource: 'lead', action: 'delete', description: 'Delete leads', group: 'Lead Management' },
  { key: 'lead:assign', resource: 'lead', action: 'assign', description: 'Assign leads to users', group: 'Lead Management' },
  { key: 'lead:manage', resource: 'lead', action: 'manage', description: 'Full lead management', group: 'Lead Management' },
  { key: 'lead:export', resource: 'lead', action: 'export', description: 'Export leads', group: 'Lead Management' },
  { key: 'lead:view-stats', resource: 'lead', action: 'view-stats', description: 'View lead statistics', group: 'Lead Management' },

  // Review management
  { key: 'review:read', resource: 'review', action: 'read', description: 'View reviews (admin)', group: 'Review Management' },
  { key: 'review:moderate', resource: 'review', action: 'moderate', description: 'Approve/reject reviews', group: 'Review Management' },
  { key: 'review:delete', resource: 'review', action: 'delete', description: 'Delete reviews', group: 'Review Management' },

  // SEO management
  { key: 'seo:create', resource: 'seo', action: 'create', description: 'Create SEO entries', group: 'SEO Management' },
  { key: 'seo:read', resource: 'seo', action: 'read', description: 'View SEO entries', group: 'SEO Management' },
  { key: 'seo:update', resource: 'seo', action: 'update', description: 'Update SEO entries', group: 'SEO Management' },
  { key: 'seo:delete', resource: 'seo', action: 'delete', description: 'Delete SEO entries', group: 'SEO Management' },

  // Page management
  { key: 'page:create', resource: 'page', action: 'create', description: 'Create pages', group: 'Page Management' },
  { key: 'page:read', resource: 'page', action: 'read', description: 'View pages', group: 'Page Management' },
  { key: 'page:update', resource: 'page', action: 'update', description: 'Update pages', group: 'Page Management' },
  { key: 'page:delete', resource: 'page', action: 'delete', description: 'Delete pages', group: 'Page Management' },
  { key: 'page:publish', resource: 'page', action: 'publish', description: 'Publish/unpublish pages', group: 'Page Management' },

  // Dashboard
  { key: 'dashboard:view', resource: 'dashboard', action: 'view', description: 'View dashboard', group: 'Dashboard' },
  { key: 'dashboard:analytics', resource: 'dashboard', action: 'analytics', description: 'View analytics', group: 'Dashboard' },

  // Audit log
  { key: 'audit:read', resource: 'audit', action: 'read', description: 'View audit logs', group: 'Audit' },
];

const getPermissionsByGroup = () => {
  const grouped = {};
  for (const perm of PERMISSIONS) {
    if (!grouped[perm.group]) grouped[perm.group] = [];
    grouped[perm.group].push(perm);
  }
  return grouped;
};

const getAllPermissionKeys = () => PERMISSIONS.map((p) => p.key);

module.exports = { PERMISSIONS, getPermissionsByGroup, getAllPermissionKeys };
