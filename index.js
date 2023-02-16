const app = require('./app');
const dbConnection = require("./config/database");
require("dotenv").config();
const cloudinary = require('cloudinary');
//  databasse connection
dbConnection();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

app.listen(process.env.PORT , () => {
    console.log(`server is running at port ${process.env.PORT}`);
});