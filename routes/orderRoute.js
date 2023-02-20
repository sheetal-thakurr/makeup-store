const express = require('express');
const router = express.Router();

const {isLoggedIn,customRole } = require('../middlewares/userLoggedIn');
const
 {createOrder ,
    getOneOrderById ,
     getLoggedInOrder,
     admingetAllOrders,
     adminDeleteOrder,
 } = require('../controllers/orderControllers');


router.route("/order/create").post(isLoggedIn,createOrder);
router.route("/order/:id").get(isLoggedIn,getOneOrderById);

// you should place all /:id routes in after all the routes
router.route("/myorder").get(isLoggedIn,getLoggedInOrder);

// admin routes
router.route("/admin/allOrder").get(isLoggedIn, customRole('admin'), admingetAllOrders);
router.route("/admin/deleteOrder/:id").delete(isLoggedIn, customRole('admin'), adminDeleteOrder);



module.exports = router;
