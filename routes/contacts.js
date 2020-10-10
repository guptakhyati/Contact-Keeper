const express=require("express");
const router=express.Router();

//@route    GET api/contacts
//@desc     Get all contacts
//@access   Public
router.get("/",(req,res)=>res.send("Get all contacts"));

//@route    POST api/contacts
//@desc     Add a contact
//@access   Private
router.post("/",(req,res)=>res.send("Add a contact"));

//@route    PUT api/contacts/:id
//@desc     Update a contact
//@access   Private
router.put("/:id",(req,res)=>res.send("Update a contact"));

//@route    DELETE api/users/:id
//@desc     Delete a contact
//@access   Private
router.delete("/:id",(req,res)=>res.send("Delete a contact"));

module.exports=router;
 