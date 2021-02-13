const express=require("express");
const router=express.Router();
const { check,validationResult}=require("express-validator/check");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const config=require("config");


const User=require("../models/User");

//@route    POST api/users               //Type of request  Endpoint
//@desc     Register a user
//@access   Public                       //We need to specify access because some of the routes have to be private where you need to be logged in, you'll need to have tokens and you'll be required to send those tokens to access that route.
router.post("/",[
    check("name","Please add name")
    .not()
    .isEmpty(),
    check("email","Please include a valid email").isEmail(),
    check("password","Please enter a password with 6 or more characters").isLength({
        min:6 })
], 
 async (req,res)=>{  
   // res.send(req.body);
   const errors=validationResult(req);
   if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array() });
   }
  const {name, email, password}=req.body;
  try {
      let user=await User.findOne({email});
      if(user){
          return res.status(400).json({msg:'User already exists'});
      }

     user=new User({
         name,
         email,
         password
     });

     const salt=await bcrypt.genSalt(10);
     user.password=await bcrypt.hash(password,salt);
     await user.save();

     //res.send("User saved");

     const payload={
         user:{
             id:user.id
         }
     }
     
     jwt.sign(payload,config.get("jwtSecret"),{ 
         expiresIn:360000
     },(err,token)=>{
         if(err) throw err;
         res.json({token});
     });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
  }
);

module.exports=router;





