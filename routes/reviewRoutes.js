const express = require('express');
const controller = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({mergeParams: true});

router.use(authController.protect, controller.setIds);

router.route('/')
    .get(controller.grantPermission,
        controller.getAllReviews)
    .post(controller.createReview);

router.route('/:id')
    .get(controller.getReview)
    .patch(controller.updateReview)
    .delete(controller.deleteReview);

module.exports = router;