const express = require('express');
const router = express.Router();

const { isLoggedIn, customRole } = require('../middlewares/userLoggedIn');
const { testPro,
     addProduct,
     getAllProducts,
     adminGetAllProducts,
     getOneProductById,
     adminUpdateOneProduct,
     admindeleteOneProduct,
     getOnlyOneProductReviews,
     getOnlyOneProducdescription
    } = require('../controllers/productControllers')

//  user routes
router.route('/Products').get(getAllProducts);
router.route('/oneProduct/:id').get(getOneProductById);
router.route('/product/reviews').get(getOnlyOneProductReviews);
router.route('/product/description').get(getOnlyOneProducdescription);




//  admin routes
router.route('/admin/product/addProduct').post(isLoggedIn, customRole('admin'), addProduct);
router.route('/admin/allProducts').get(isLoggedIn, customRole('admin'), adminGetAllProducts);
router.route('/admin/updateOneProduct/:id').put(isLoggedIn, customRole('admin'), adminUpdateOneProduct);
router.route('/admin/deleteOneProduct/:id').delete(isLoggedIn, customRole('admin'), admindeleteOneProduct);



// test route
router.route('/testPro').get(testPro);

module.exports = router;
