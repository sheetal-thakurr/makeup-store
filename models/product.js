const mongoose = require('mongoose');
const User = require('./user');

const productSchema = new mongoose.Schema({


    name: {
        type: String,
        required: [true , 'please enter product name'],
        trim: true,
        maxlenght: [120 , 'name should not be more than 120 charactors']
    },
    price: {
        type: String,
        required: [true , 'please enter product name'],
        maxlenght: [true , 'name should not be more than 120 charactors']
    },
    description: {
        type: String,
        required: [true , 'please enter product description'],
    },
    photos: [
        {
            id:{
                type: String,
                required: true
            },
            secure_url:{
                type: String,
                required: true
            }
        }
    ],

    // photo: {
    //         id:{
    //             type: String,
    //             required: true
    //         },
    //         secure_url:{
    //             type: String,
    //             required: true
    //         }
    //     },

    category: {
        type: String,
        required: [true , 'please select product category form - HairCare , FaceCare , BodyCare , MakeupProducts'],
        enum: {
            values: ['HairCare', 'FaceCare' , 'BodyCare' , 'MakeupProducts'],

            message : "please select product category only from - HairCare , FaceCare , BodyCare and  MakeupProducts"
        }
    },

    brand: {
        type: String,
        required: [true , 'please add a   brand for product'],
    },
    ratings: {
        type: Number,
        default: 0
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },

    reviews:[
        {
            user: {
                type: mongoose.Schema.ObjectId ,
                ref: 'User'
            },
            name: {
                type: String ,
                required: true
            },
            rating: {
                type: Number ,
                required: true
            },
            feedback: {
                type: String ,
                required: true
            },
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId ,
        ref: 'User',
        required: true

    },
    createAt: {
        type: Date,
        default: Date.now
    }
});



module.exports = mongoose.model("Product" , productSchema);