const router = require('express').Router();
const ctrl = require('../controllers/city.controller');
const validate = require('../middlewares/validateRequest');
const schema = require('../validations/city.validation');
const { authenticate } = require('../middlewares/authenticate');
const { authorize } = require('../middlewares/authorize');

router.post('/', authenticate, authorize('city:create'), validate(schema.createCity), ctrl.createCity);
router.get('/', authenticate, authorize('city:read'), validate(schema.listCities), ctrl.getCities);
router.get('/:id', authenticate, authorize('city:read'), validate(schema.getCity), ctrl.getCityById);
router.patch('/:id', authenticate, authorize('city:update'), validate(schema.updateCity), ctrl.updateCity);
router.delete('/:id', authenticate, authorize('city:delete'), validate(schema.deleteCity), ctrl.deleteCity);

module.exports = router;
