const Order = require('../models/order');
const Product = require('../models/product');
const BigPromise = require('../middlewares/promise');

exports.createOrder = BigPromise(async(req,res,next)=>{

    const {
        shippingInfo ,
        orderItems,
        paymentinfo,
        taxAmmount,
        shippingAmmount,
        totalAmmount,

    } = req.body;

   const order = await Order.create({
    shippingInfo ,
    orderItems,
    paymentinfo,
    taxAmmount,
    shippingAmmount,
    totalAmmount,
    user: req.user._id   
   })

   res.status(200).json({
    success: true,
    order
   })
});

