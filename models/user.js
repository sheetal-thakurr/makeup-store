const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

// mongoose.userSchema
const userSchema = new mongoose.Schema({
    // name: String
    name:{
        type: String ,
        required: [true , "Please enter a name"],
        maxlenght: [40 , "Name should be under 40 characters"]
    },

    email:{
        type: String ,
        required: [true , "Please enter an email"],
        validate: [validator.isEmail , "Please enter email in the correct format"],
        unique: true
    },

    password:{
        type: String ,
        required: [true , "Please enter a password"],
        minlength: [6, "password should be atleast 6 characters"],
        select : false
    },

    role:{
        type: String ,
        default: "user" ,
    },

    photo:{
        id: {
           type: String,
           required: true
        },
        secure_url: {
            type: String,
            required: true
         },
    },

    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    createdAt:{
        type: Date,
        default: Date.now
    }

})

// encrypt password before save - HOOKS

userSchema.pre("save" , async function (next) {
    if (!this.isModified("password")) {
       return next() ;
    }
    
    this.password = await bcrypt.hash(this.password , 10);
})
 
// validate the password with passed on by user -METHODS

userSchema.methods.isValidatedPassword = async function(userPswrd){
  return  await bcrypt.compare(userPswrd , this.password);
}

//  create and return jwt Token
userSchema.methods.getjwtToke = function(){
   return jwt.sign({id: this._id} , process.env.JWT_SECUTITY , {
       expiresIn: process.env.JWT_EXPIRY  ,
    });
};

// generate forgot password token (string)

userSchema.methods.getForgotPasswordToken = function(){
    // generate a random and long string
    const forgotToken = crypto.randomBytes(20).toString('hex');

    // this.forgotPasswordToken = forgotToken;
    this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest('hex')

    // time of token
    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

    return forgotToken;
}

module.exports = mongoose.model("User" , userSchema)