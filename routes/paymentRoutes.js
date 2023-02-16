const express = require('express');
const router =express.Router();
const {isLoggedIn} = require('../middlewares/userLoggedIn');

const {sendStripeKey , captureStripePayment} = require('../controllers/paymentControllers');

router.route('/sendStripeKey').get(isLoggedIn , sendStripeKey);
router.route('/captureStripePayment').post(isLoggedIn , captureStripePayment);


module.exports = router;
