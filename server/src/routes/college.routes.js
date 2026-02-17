const router = require('express').Router();
const ctrl = require('../controllers/college.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/college.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.post('/', authenticate, authorize('college:create'), validate(schema.createCollege), ctrl.createCollege);
router.get('/', authenticate, authorize('college:read'), ctrl.getColleges);
router.get('/:id', authenticate, authorize('college:read'), ctrl.getCollegeById);
router.patch('/:id', authenticate, authorize('college:update'), validate(schema.updateCollege), ctrl.updateCollege);
router.delete('/:id', authenticate, authorize('college:delete'), ctrl.deleteCollege);
router.patch('/:id/publish', authenticate, authorize('college:publish'), validate(schema.publish), ctrl.publishCollege);
router.patch('/:id/courses', authenticate, authorize('college:manage-courses'), validate(schema.manageCourses), ctrl.manageCourses);
router.patch('/:id/exams', authenticate, authorize('college:manage-exams'), validate(schema.manageExams), ctrl.manageExams);

module.exports = router;
