const express = require('express');
const verifyAuthentication = require('../utils/authservice').verify;
const fileService = require('../utils/fileService');
const router = express.Router();

const partController = require('../controllers/partController');

// //R
router.get('/', partController.readPart);
router.use(verifyAuthentication);
// //C
router.post('/', fileService, partController.createPart);
// //U
router.put('/', fileService, partController.updatePart);
// //D
router.delete('/:id', partController.deletePart);

module.exports = router;