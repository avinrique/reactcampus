const ContentSection = require('../models/ContentSection.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/ApiError');
const { cleanHtml, stripHtml, stripHtmlDeep } = require('../utils/sanitize');

/**
 * Sanitize content based on contentType.
 */
const sanitizeContent = (contentType, content) => {
  if (content == null) return content;
  if (contentType === 'richtext' && typeof content === 'string') {
    return cleanHtml(content);
  }
  if (contentType === 'faq' && Array.isArray(content)) {
    return content.map((item) => ({
      question: stripHtml(item.question || ''),
      answer: cleanHtml(item.answer || ''),
    }));
  }
  if (typeof content === 'object') {
    return stripHtmlDeep(content);
  }
  if (typeof content === 'string') {
    return stripHtml(content);
  }
  return content;
};

/**
 * Create a new content section.
 */
const create = async (data, userId = null) => {
  if (data.title) data.title = stripHtml(data.title);
  data.content = sanitizeContent(data.contentType, data.content);

  const section = await ContentSection.create(data);

  await AuditLog.create({
    user: userId,
    action: 'created',
    resource: 'contentSection',
    resourceId: section._id,
    details: {
      college: section.college,
      sectionKey: section.sectionKey,
      title: section.title,
    },
  });

  return section;
};

/**
 * Get all content sections for a college or exam, ordered by their order field.
 */
const getByCollege = async (collegeId, examId, courseId) => {
  const filter = courseId ? { course: courseId } : examId ? { exam: examId } : { college: collegeId };
  const sections = await ContentSection.find(filter).sort({ order: 1 });
  return sections;
};

/**
 * Get a single content section by ID.
 */
const getById = async (id) => {
  const section = await ContentSection.findById(id);
  if (!section) {
    throw new ApiError(404, 'Content section not found');
  }
  return section;
};

/**
 * Update a content section.
 */
const update = async (id, data, userId = null) => {
  const section = await ContentSection.findById(id);
  if (!section) {
    throw new ApiError(404, 'Content section not found');
  }

  if (data.title) data.title = stripHtml(data.title);
  const ct = data.contentType || section.contentType;
  if (data.content !== undefined) {
    data.content = sanitizeContent(ct, data.content);
  }

  Object.assign(section, data);
  await section.save();

  await AuditLog.create({
    user: userId,
    action: 'updated',
    resource: 'contentSection',
    resourceId: section._id,
    details: { updatedFields: Object.keys(data) },
  });

  return section;
};

/**
 * Remove a content section.
 */
const remove = async (id, userId = null) => {
  const section = await ContentSection.findById(id);
  if (!section) {
    throw new ApiError(404, 'Content section not found');
  }

  await section.deleteOne();

  await AuditLog.create({
    user: userId,
    action: 'deleted',
    resource: 'contentSection',
    resourceId: section._id,
    details: {
      college: section.college,
      sectionKey: section.sectionKey,
    },
  });

  return section;
};

module.exports = {
  create,
  getByCollege,
  getById,
  update,
  remove,
};
