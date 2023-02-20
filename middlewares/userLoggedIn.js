const User = require('../models/user');
const BigPromise = require('../middlewares/promise');
const jwt = require("jsonwebtoken");
const { Error } = require('mongoose');


exports.isLoggedIn = BigPromise(async (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization").replace("Bearer " , " ");

    if (!token) {
        return next(new Error('first login our website then you can access this page'))
    };

   const decoded =  jwt.verify(token , process.env.JWT_SECUTITY);
   req.user = await User.findById(decoded.id)

   next();

});

exports.customRole = (...Roles) => {
    return (req , res , next) => {
        if (! Roles.includes(req.user.role)) {
            return next(new Error('you can not access this page'))
        }
        next()

        // if (req.user.role === 'admin') {
        //    next() 
        // }
        // else{
        //  return next(new Error('you can not access this page'))
        // }
    }

}