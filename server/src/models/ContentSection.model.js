const mongoose = require('mongoose');
const { CONTENT_TYPES } = require('../utils/constants');

const contentSectionSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true,
    },
    sectionKey: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    content: { type: mongoose.Schema.Types.Mixed, default: null },
    contentType: { type: String, enum: CONTENT_TYPES, default: 'richtext' },
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

contentSectionSchema.index({ college: 1, sectionKey: 1, order: 1 });

module.exports = mongoose.model('ContentSection', contentSectionSchema);
