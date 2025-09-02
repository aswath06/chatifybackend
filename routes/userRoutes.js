const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// CRUD
router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// OTP Email Verification
router.post('/verify-email', userController.sendOtp);
router.post('/validate-otp', userController.verifyOtp);

module.exports = router;
