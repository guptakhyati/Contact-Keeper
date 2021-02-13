const express=require("express");
const router=express.Router();
const { check,validationResult}=require("express-validator/check");
const auth=require('../middleware/auth');

const User=require("../models/User");
const Contact=require("../models/Contact");

//@route    GET api/contacts
//@desc     Get all contacts (of a particular user only though since a user should only be able to access his/her own contacts and not someone else's.)
//@access   Private
router.get("/",auth,async (req,res)=>{
    //res.send("Get all contacts")
    try {
        const contacts=await Contact.find({user:req.user.id}).sort({date:-1}); // Will sort all the contacts of a particular user according to the date with the most recent contacts being displayed on top.
        res.json(contacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    POST api/contacts
//@desc     Add a contact
//@access   Private
router.post("/",[auth,[
    check('name','Name is required')
    .not()
    .isEmpty()
   ]
],
 async (req,res)=>{
     //res.send("Add a contact")
   const errors=validationResult(req);
   if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array() });
   }

   const {name, email, phone, type}=req.body;
   
   try {
    const newContact=new Contact({
        name,
        email,
        phone,
        type,
        user:req.user.id
    }) 
    const contact=await newContact.save();
    res.json(contact); 
       
   } catch (err) {
       console.error(err.message);
       res.status(500).send('Server Error');
   }
 });

//@route    PUT api/contacts/:id
//@desc     Update a contact
//@access   Private
router.put("/:id",auth,async (req,res)=>{
    //res.send("Update a contact")
    const { name,email,phone,type }=req.body;

    //Build contact object
    const contactFields={};
    if(name) contactFields.name=name; 
    if(email) contactFields.email=email;
    if(phone) contactFields.phone=phone;
    if(type) contactFields.type=type;

    try {
      let contact=await Contact.findById(req.params.id);  
      if(!contact) return res.status(404).json({msg:'Contact not found'});
      
      //Make sure the user owns contact so that he/she can update only his/her own contacts.
      if(contact.user.toString()!==req.user.id){
          return res.status(401).json({msg:'Not authorized'});
      }

      contact=await Contact.findByIdAndUpdate(req.params.id,
        {$set:contactFields},
        {new:true});  //If the contact doesn't exist, then create it.
     
      res.json(contact);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route    DELETE api/contacts/:id
//@desc     Delete a contact
//@access   Private
router.delete("/:id",auth,async (req,res)=>{
    //res.send("Delete a contact")
    try {
        let contact=await Contact.findById(req.params.id);  
        if(!contact) return res.status(404).json({msg:'Contact not found'});
        
        //Make sure the user owns contact so that he/she can delete only his/her own contacts.
        if(contact.user.toString()!==req.user.id){
            return res.status(401).json({msg:'Not authorized'});
        }
  
        // contact=await Contact.findByIdAndUpdate(req.params.id,
        //   {$set:contactFields},
        //   {new:true});
        await Contact.findByIdAndRemove(req.params.id);
        
        //res.json(contact);
        res.json({msg:'Contact Removed'}); 
        
      } catch (err) {
          console.error(err.message);
          res.status(500).send('Server Error');
      }
});

module.exports=router;
 