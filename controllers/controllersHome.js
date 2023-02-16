const BigPromise = require('../middlewares/promise');


exports.home = BigPromise( async (req ,res) => {
   // const db = await whatever the code ()
   res.status(200).json({
    success : true ,
    greeting : "hello from lco API route"
   });
})

exports.homedummy =  async (req ,res) => {
   try {

   // const db = await whatever the code ()

   
      res.status(200).json({
         success : true ,
         greeting : "this is a dummy api route"
        });
   } catch (error) {
      console.log(error);
   }
  
};