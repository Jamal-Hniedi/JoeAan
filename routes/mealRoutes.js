const express = require('express');
const controller = require('../controllers/mealController');
const authController = require('../controllers/authController');

const router = express.Router();


router.route('/')
    .get(controller.getAllMeals)
    .post(authController.protect,
        authController.restrictTo('admin'),
        controller.createMeal);

router.route('/:id')
    .get(controller.getMeal)
    .patch(authController.protect,
        authController.restrictTo('admin'),
        controller.updateMeal)
    .delete(authController.protect,
        authController.restrictTo('admin'),
        controller.deleteMeal);

module.exports = router;