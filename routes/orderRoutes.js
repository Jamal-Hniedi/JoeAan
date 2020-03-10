const express = require('express');
const controller = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/')
    .get(authController.restrictTo('admin'),
        controller.getAllOrders)
    .post(controller.createOrder);

module.exports = router;