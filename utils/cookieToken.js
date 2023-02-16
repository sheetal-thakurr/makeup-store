const cookie_token = (user , res) => {

 const token = user.getjwtToke();

    const option = {
        expires: new Date (
            // Date.now() + 4 * 24 *60 * 60 * 1000 
            Date.now() + process.env.COOKIE_EXPIRY * 24 *60 * 60 * 1000
        ),
        httpOnly: true
     }
 user.password = undefined;
    
     res.status(200).cookie('token ' , token , option).json ({
        success: true,
         token ,
         user
      });
}

module.exports = cookie_token