const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cookie_parser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const app = express();


// swagger documantation
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// regular middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// cookies and file middleware
app.use(cookie_parser());
app.use(fileUpload({
    useTempFiles: true ,
    tempFileDir : "/tmp/"
}));

// app.set( "view engine" , "ejs" );
app.set("view engine" ,"ejs" );



// morgan middleware~
app.use(morgan('tiny'));

// import all routes 
const  homeroute = require("./routes/homeroutes");
const user_route = require("./routes/userroutes")
const product_route = require("./routes/productRoutes");
const payment_route = require('./routes/paymentRoutes');

// router middleware
app.use("/api/v1",homeroute);
app.use("/api/v1",user_route);
app.use("/api/v1" ,product_route);
app.use("/api/v1" ,payment_route);


app.get("/signupform" , (req , res) =>{
    res.render('signupform');
})

app.get("/loginform" , (req , res) =>{
    res.render('login');
})


// exporting app.js 
module.exports = app ;