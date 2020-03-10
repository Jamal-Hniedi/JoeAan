const express = require('express');
const controller = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.route('/')
    .get(controller.getAllUsers)
    .post(controller.createUser);

router.route('/:id')
    .get(controller.getUser)
    .patch(controller.updateUser)
    .delete(controller.deleteUser);

module.exports = router;