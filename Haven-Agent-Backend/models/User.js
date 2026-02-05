const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  isLicensedAgent: {
    type: Boolean,
    default: false
  },
  worksUnderAgency: {
    type: Boolean,
    default: false
  },
  agreesToRules: {
    type: Boolean,
    default: false
  },
  documents: {
    emiratesId: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      filePath: String
    },
    workVisa: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      filePath: String
    },
    brokerLicense: {
      uploaded: { type: Boolean, default: false },
      verified: { type: Boolean, default: false },
      filePath: String
    }
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  accountActivated: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);