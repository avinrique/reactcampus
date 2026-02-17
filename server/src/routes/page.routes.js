const router = require('express').Router();
const ctrl = require('../controllers/page.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/page.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.post('/', authenticate, authorize('page:create'), validate(schema.createPage), ctrl.createPage);
router.get('/', authenticate, authorize('page:read'), ctrl.getPages);
router.get('/:id', authenticate, authorize('page:read'), ctrl.getPageById);
router.patch('/:id', authenticate, authorize('page:update'), validate(schema.updatePage), ctrl.updatePage);
router.delete('/:id', authenticate, authorize('page:delete'), ctrl.deletePage);
router.patch('/:id/publish', authenticate, authorize('page:publish'), validate(schema.publish), ctrl.publishPage);

module.exports = router;
