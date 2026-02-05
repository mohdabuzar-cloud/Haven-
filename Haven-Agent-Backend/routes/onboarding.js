const express = require('express');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const multer = require('multer');
const { 
  updateEligibility, 
  updateDetails, 
  uploadDocument,
  submitVerification, 
  approveVerification,
  getOnboardingStatus 
} = require('../controllers/onboardingController');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = new Set([
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
    ]);
    if (!allowed.has(file.mimetype)) {
      return cb(new Error('Unsupported file type'));
    }
    cb(null, true);
  },
});

// Apply auth middleware to all routes in this file
router.use(auth);

router.put('/eligibility', updateEligibility);
router.put('/details', updateDetails);
router.post('/documents/:docType', upload.single('file'), uploadDocument);
router.post('/submit-verification', submitVerification);
router.post('/approve-verification', adminAuth, approveVerification);
router.get('/status', getOnboardingStatus);

module.exports = router;