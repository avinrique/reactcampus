const sanitizeHtml = require('sanitize-html');

/**
 * Strip ALL HTML — for plain text user input (reviews, discussions, names, etc.)
 */
const stripHtml = (str) => {
  if (typeof str !== 'string') return str;
  return sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} }).trim();
};

/**
 * Allow safe HTML — for admin richtext content (content sections, page blocks)
 */
const cleanHtml = (str) => {
  if (typeof str !== 'string') return str;
  return sanitizeHtml(str, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'details', 'summary', 'mark', 'del', 'ins',
      'iframe', 'video', 'source',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      a: ['href', 'name', 'target', 'rel'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
      video: ['src', 'controls', 'width', 'height'],
      source: ['src', 'type'],
      '*': ['class', 'id', 'style'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedIframeHostnames: ['www.youtube.com', 'www.google.com'],
  });
};

/**
 * Recursively strip HTML from all string values in an object.
 * Use for sanitizing user-submitted form data, review data, etc.
 */
const stripHtmlDeep = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(stripHtmlDeep);
  const cleaned = {};
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string') {
      cleaned[key] = stripHtml(val);
    } else if (typeof val === 'object' && val !== null) {
      cleaned[key] = stripHtmlDeep(val);
    } else {
      cleaned[key] = val;
    }
  }
  return cleaned;
};

module.exports = { stripHtml, cleanHtml, stripHtmlDeep };
