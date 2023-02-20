const express = require('express');
const router = express.Router();

const {isLoggedIn } = require('../middlewares/userLoggedIn');
const {createOrder } = require('../controllers/orderControllers');

router.route("/order/create").post(isLoggedIn,createOrder);

module.exports = router;
