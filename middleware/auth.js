const jwt=require("jsonwebtoken");
const config=require("config");

module.exports=function(req,res,next){
    //Get token from the header
    const token=req.header('x-auth-token'); //'x-auth-token':Key to the token inside the header.
 
    //Check if the token doesn't exists
    if(!token){
        return res.status(401).json({msg:'No Token, authorization denied'});
    }
    
    //If there is a token that exists. 
    try {
        const decoded=jwt.verify(token,config.get('jwtSecret'));
        req.user=decoded.user;
        next();
    } catch (err) {
        res.status(401).json({msg:'Token is not valid'});
    } 
};