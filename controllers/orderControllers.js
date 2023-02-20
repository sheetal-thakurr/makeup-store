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

exports.getOneOrderById = BigPromise(async(req,res,next)=>{

//   const orderId = await  Order.findById(req.params.id);
// populate method
  const orderId = await  Order.findById(req.params.id).populate('user', 'name email role')


  if (!orderId) {
    return next(new Error('Please check order id ...!'));
  }
   res.status(200).json({
    success: true,
    orderId
   });
});

exports.getLoggedInOrder = BigPromise(async(req,res,next)=>{

      const order = await  Order.find({user: req.user._id});
    
    
      if (!order) {
        return next(new Error('Please check order id ...!'));
      }
       res.status(200).json({
        success: true,
        order
       });
    });

exports.admingetAllOrders  = BigPromise(async (req,res,next)=>{
    const allOrder =await Order.find();

    res.status(200).json({
        success:true,
        allOrder
    });
}) ;

exports.adminDeleteOrder  = BigPromise(async (req,res,next)=>{
    const order =await Order.findById(req.params.id);

   await order.remove();

    res.status(200).json({
        success:true,
        message: 'order was deleted..!'
    });
});




