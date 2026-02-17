const mongoose = require('mongoose');
const { COLLEGE_STATUS, COLLEGE_TYPES } = require('../utils/constants');

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    type: { type: String, enum: COLLEGE_TYPES, required: true },
    description: { type: String, default: '' },
    logo: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    location: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] },
      },
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
    fees: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
    },
    ranking: { type: Number, default: null },
    established: { type: Number, default: null },
    website: { type: String, default: '' },
    accreditation: { type: String, default: '' },
    affiliation: { type: String, default: '' },
    facilities: [{ type: String }],
    status: { type: String, enum: COLLEGE_STATUS, default: 'draft' },
    deletedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

collegeSchema.index({ 'location.coordinates': '2dsphere' });
collegeSchema.index({ name: 'text', description: 'text', 'location.city': 'text', 'location.state': 'text' });
collegeSchema.index({ status: 1, deletedAt: 1 });

collegeSchema.pre(/^find/, function () {
  if (!this.getQuery().includeDeleted) {
    this.where({ deletedAt: null });
  } else {
    delete this.getQuery().includeDeleted;
  }
});

module.exports = mongoose.model('College', collegeSchema);
