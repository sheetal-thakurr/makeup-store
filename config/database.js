const mongoose = require('mongoose');

 const dbConnection = () => {
  mongoose.connect(process.env.DB_URL , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log(`DataBase connected successfully`))
  .catch(error => {
    console.log(`DataBase connection failed`);
    console.log(error);
    process.exit(1);
  })   
 }

 module.exports = dbConnection;