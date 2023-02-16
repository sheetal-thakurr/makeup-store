const Product = require('../models/product');
const BigPromise = require('../middlewares/promise');
const WhereClause = require('../utils/whereClause');
const cloudinary = require('cloudinary').v2;


exports.addProduct = BigPromise(async (req, res, next) => {

// images
    let productImageArray = [];


    if (!req.files) {
        return next(new Error('product photo is required'));
    };

    if (req.files) {
        for (let index = 0; index < req.files.photos.length; index++) {

            let result = await cloudinary.uploader.upload(req.files.photos[index].tempFilePath, {
                folder: "productPhoto",
            });
            productImageArray.push({
                id: result.public_id,
                secure_url: result.secure_url
            });
        }
    };

    req.body.photos = productImageArray;
    req.body.user = req.user.id

    const product = await Product.create(req.body);

    console.log(product);
    console.log(productImageArray.length);

    res.status(200).json({
        success: true,
        product,
        // photo: {
        //     id : result.public_id,
        //     secure_url: result.secure_url
        // }
    });

});

exports.getAllProducts = BigPromise(async (req, res, next) => {

    let resultPerPage = 6;
    let totalCountOfProduct = await Product.countDocuments();

    const productsObj = new WhereClause(Product.find(), req.query).search().filter();

    let products = await productsObj.base;
    let filterProductCount = products.length;

    //  products.limit().skip()
    productsObj.pager(resultPerPage);
    products = await productsObj.base.clone();

    //   const product = await products.base


    console.log(products);
    res.status(200).json({
        success: true,
        // product,
        products,
        totalCountOfProduct,
        filterProductCount
    });

});

// add reviews
exports.addReview = BigPromise(async (req,res,next)=>{
const {rating , feedback , productId} = req.body;

const review = {
    user : req.user._id,
    name: req.user.name,
    rating: Number(rating),
    // feedback: feedback
    feedback
}

const product = await Product.findById(productId);


});

// delete review


// get only reviews
exports.getOnlyOneProductReviews = BigPromise(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);

    let reviews = product.reviews;
    res.status(200).json({
        success:true,
        reviews
    })
});

// get only description
exports.getOnlyOneProducdescription = BigPromise(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);

    let description = product.description;
    res.status(200).json({
        success:true,
        description
    })
})

// admin get all products  
exports.adminGetAllProducts = BigPromise(async (req, res, next) => {

    let products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })
});

// get only one product by anyone based on product id
exports.getOneProductById = BigPromise(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new Error(`no product found with this id ... ${req.params.id}`))
    };

    res.status(200).json({
        success: true,
        product
    })

});

// admin update one product  based on product id
exports.adminUpdateOneProduct = BigPromise(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new Error(`product does not found from this id ... ${req.params.id}`))
    };
    let productImageArray = [];

    if (req.files) {
        // delete the exiting photo
        for (let index = 0; index < product.photos.length; index++) {
            await cloudinary.uploader.destroy(product.photos[index].id)
        }
        // upload and save the images

        for (let index = 0; index < req.files.photos.length; index++) {
            let result = await cloudinary.uploader.upload(req.files.photos[index].tempFilePath, {
                folder: "productPhoto",
            })

            productImageArray.push({
                id: result.public_id,
                secure_url: result.secure_url
            });
        }
    }
    req.body.photos = productImageArray;

    product = await Product.findByIdAndUpdate(req.params.id , req.body , {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        product
    })

});

// admin delete one product  based on product id
exports.admindeleteOneProduct = BigPromise(async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new Error(`product does not found from this id ... ${req.params.id}`))
    };

        for (let index = 0; index < product.photos.length; index++) {
            await cloudinary.uploader.destroy(product.photos[index].id)
        }
    
   await product.remove();

    res.status(200).json({
        success: true,
        message: "product was deleted...!"
    })

});


exports.testPro = async (req, res) => {
    console.log(req.query);
    res.status(200).json({
        success: true,
        greeting: "hello from node js backend course"
    });

}