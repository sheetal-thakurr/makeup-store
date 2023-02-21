const mongoose = require('mongoose');
// const User = require('./user');
const orderSchema = new mongoose.Schema({

    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: Number,
            required: true
        },
        postalCode: {
            type: Number,
            required: true
        },
        city: {
            type: String,
            required: true
        },
     
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },

    },
    user: {
        type: mongoose.Schema.ObjectId, // mongoose.Schema.Types.ObjectId
        ref: 'User',
        required: true
    },
    orderItems: [
        {
            name:{
                type: String,
                required: true
            },
            quantity:{
                type: Number,
                required: true
            },
            image:{
                type: String,
                required: true
            },
            price:{
                type: Number,
                required: true
            },
           product:{
            type: mongoose.Schema.ObjectId, // mongoose.Schema.Types.ObjectId
            ref: 'Product',
            required: true
           }
        }
    ],
    stock: {
        type: Number,
        required: [true , 'please add product stock number']
    },
    paymentinfo:{
        id: {
            type: String
        }
    },
    taxAmmount:{
        type: Number,
        required: true
    },
    shippingAmmount:{
        type: Number,
        required: true
    },
    totalAmmount:{
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        require: true,
        default: "processing"
    },
    deliveredAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

module.exports =   mongoose.model("Order" , orderSchema);