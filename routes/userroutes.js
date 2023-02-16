const express = require('express');
const router = express.Router();

const { signup , login , logout , forgotPassword 
    , passwordReset , loggedInUserDetails ,passwordChange 
, updateUserDetails ,allAdminUsers ,allManagersUsers ,
 adminGetOlnyOneUser , adminUpdateOneUserDetails , adminDeleteOneUser} = require('../controllers/usercontrollers');
const {isLoggedIn ,customRole} = require('../middlewares/userLoggedIn');

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userDetails").get(isLoggedIn,loggedInUserDetails);
router.route("/password/change").post(isLoggedIn,passwordChange);
router.route("/userDetails/change").post(isLoggedIn,updateUserDetails);


router.route("/admin/users").get(isLoggedIn, customRole('admin') , allAdminUsers);
router.route("/managers/users").get(isLoggedIn, customRole('manager') , allManagersUsers);

router.route("/admin/users/:id").get(isLoggedIn, customRole('admin') , adminGetOlnyOneUser)
.put(isLoggedIn, customRole('admin') , adminUpdateOneUserDetails)
.delete(isLoggedIn, customRole('admin') , adminDeleteOneUser);








module.exports = router;