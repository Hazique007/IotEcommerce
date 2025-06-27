const express = require('express');
const router = express.Router();
const useCaseController = require('../controllers/usecaseController');

router.post('/', useCaseController.addUseCase);
router.get('/', useCaseController.getAllUseCases);
router.put('/:id', useCaseController.updateUseCase);
router.delete('/:id', useCaseController.deleteUseCase);
router.get('/paginated', useCaseController.getPaginatedUseCases);

module.exports = router;
