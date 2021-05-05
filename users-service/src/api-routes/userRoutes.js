const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

//C
router.post('/', userController.createUser);
//R
router.get('/:email', userController.readUser);
//U
router.put('/', userController.updateUser);
//D
router.delete('/:email', userController.deleteUser);

router.post('/login', userController.userLogin);

router.post('/token', userController.verifyToken);

module.exports = router;