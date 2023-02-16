const User = require('../models/user');
const BigPromise = require('../middlewares/promise');
const cookie_token = require('../utils/cookieToken');
const cloudinary = require('cloudinary').v2;
const emailHelper = require('../utils/mailHelper');
const crypto = require('crypto');
// const { Error } = require('mongoose');


exports.signup = BigPromise(async (req, res, next) => {
   let result;

   if (!req.files) {
      return next(new Error('this field is required'))
   }

   const { name, email, password } = req.body;

   if (!email || !name || !password) {
      return next(new Error("name , email and password are required "));
   }

   const file = req.files.photo;
   result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "uplodedbyuser",
      width: 400,
      crop: 'scale'

   });

   const user = await User.create({
      name,
      email,
      password,
      photo: {
         id: result.public_id,
         secure_url: result.secure_url
      },
   });
   console.log(user);

   //  const token = user.getjwtToke();

   //  const option = {
   //     expires: new Date (
   //         // Date.now() + 4 * 24 *60 * 60 * 1000 
   //         Date.now() + process.env.COOKIE_EXPIRY * 24 *60 * 60 * 1000
   //     ),
   //     httpOnly: true
   //  }

   //  res.status(200).cookie('token ' , token , option).json ({
   //     success: true,
   //      token ,
   //      user
   //   });
   cookie_token(user, res);


});

exports.login = BigPromise(async (req, res, next) => {
   const { email, password } = req.body;

   // check that user entered email or password
   if (!email || !password) {
      return next(new Error('email and password both are compulsary'))
   };

   const user = await User.findOne({ email }).select("+password");

   //  check that user exist or not in data bse
   if (!user) {
      return next(new Error("you are not registered in our makeup store"));
   }

   //  comparing the password
   const check_password = await user.isValidatedPassword(password);

   // if password do not match
   if (!check_password) {
      return next(new Error("Email or Password do not match or exist"));
   }

   cookie_token(user, res);

});

exports.logout = BigPromise(async (req, res, next) => {
   res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true
   });

   res.status(200).json({
      success: true,
      message: "Logout Success...!"
   });
});


exports.forgotPassword = BigPromise(async (req, res, next) => {

   const { email } = req.body;

   const user = await User.findOne({ email });

   if (!user) {
      return next(new Error('email not found'))
   }

   const forgotToken = user.getForgotPasswordToken();

   await user.save({ validateBeforeSave: false });

   const myURL = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`

   const message = `copy and paste this link in your URL and hit enter \n\n\n ${myURL}`

   try {
      await emailHelper({
         email: user.email,
         subject: "LCO - makeupstore password reset email",
         message: message
      });

      res.status(200).json({
         success: true,
         message: "email sent successfully..."
      })

   } catch (error) {
      user.forgotPasswordToken = undefined
      user.forgotPasswordExpiry = undefined
      await user.save({ validateBeforeSave: false });

      return next(new Error("something went wrong"));
   }
});

exports.passwordReset = BigPromise(async (req, res, next) => {

   const token = req.params.token;

   const encrypt_token = crypto
      .createHash("sha256")
      .update(token)
      .digest('hex')

   const user = await User.findOne({
      encrypt_token,
      forgotPasswordExpiry: { $gt: Date.now() }
   });

   if (!user) {
      return next(new Error("token is invalid or expired...!"))
   };

   if (req.body.password !== req.body.confirmPassword) {
      return next(new Error('password and confirmPassword do not match'))
   }


   user.password = req.body.password

   user.forgotPasswordToken = undefined
   user.forgotPasswordExpiry = undefined

   await user.save({ validateBeforeSave: false });

   // send json response or send token its totally depend on you

   cookie_token(user, res);

});

exports.loggedInUserDetails = BigPromise(async (req, res, next) => {

   const user = User.findById(req.user.id);

   res.status(200).json({
      success: true,
      message: "user  details",
        user

   });
   console.log(user);
});

exports.passwordChange = BigPromise(async (req, res, next) => {

   const userId = req.user.id

   const user = await User.findById(userId).select("+password");

   const checkPassword = await user.isValidatedPassword(req.body.oldPassword)

   if (!checkPassword) {
      return next(new Error('Old password is incorrect..!'))
   }

   user.password = req.body.password

   await user.save({ validateBeforeSave: false });
   cookie_token(user, res);
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {

   const newDataOfUser = {

      name: req.body.name,
      email: req.body.email,
   };

   if (req.files) {
      const user = await User.findById(req.user.id);

      const imageId = user.photo.id

      await cloudinary.uploader.destroy(imageId);

      const result = await cloudinary.uploader.upload(req.user.file.tempFilePath, {
         folder: "uplodedbyuser",
         width: 400,
         crop: 'scale'
      })


      newDataOfUser.photo = {
         id: result.public_id,
         secure_url: result.secure_url
      }
   }
   // if (!req.body.name || !req.body.email) {
   //    return next(new Error('name and email required'));
   // }
   const user = await User.findByIdAndUpdate(req.user.id, newDataOfUser, {
      new: true,
      runValidators: true,
      useFindAndModify: false
   })

   res.status(200).json({
      success: true,
      user
   })
});


exports.allAdminUsers = BigPromise(async (req, res, next) => {

   const users = await User.find();

   res.status(200).json({
      success: true,
      users
   })

});

exports.adminGetOlnyOneUser = BigPromise(async (req, res, next) => {

   const user = await User.findById(req.params.id);

   if (!user) {
      return next(new Error('user not found'))
   }
   res.status(200).json({
      success: true,
      user
   })

});


exports.adminUpdateOneUserDetails = BigPromise(async (req, res, next) => {

   const newDataOfUser = {

      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
   };

   // if (!req.body.name || !req.body.email) {
   //    return next(new Error('name and email required'));
   // }
   const users = await User.findByIdAndUpdate(req.params.id, newDataOfUser, {
      new: true,
      runValidators: true,
      useFindAndModify: false
   })

   res.status(200).json({
      success: true,
      users
   })
});

exports.adminDeleteOneUser = BigPromise(async (req, res, next) => {

   const user = await User.findById(req.params.id);

   if (!user) {
      return next(new Error('user not exist'))
   }

   const imageId = user.photo.id;

   await cloudinary.uploader.destroy(imageId);
   await user.remove()

   res.status(200).json({
      success: true,
      message: 'user removed from database'
   })

});

exports.allManagersUsers = BigPromise(async (req, res, next) => {

   const users = await User.find({ role: 'user' });

   res.status(200).json({
      success: true,
      users
   })

});