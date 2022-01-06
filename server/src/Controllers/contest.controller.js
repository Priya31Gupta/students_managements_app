const express = require('express');
const router = express.Router();

const {body,validationResult} = require("express-validator");

const contest = require("../models/contest.model");

router.get("",async (req,res)=>{
    const page = +req.query.page||1;
    const size = +req.query.size||5;
    const offset = (page-1)*5;
    const con = await contest.find().skip(offset).limit(size).lean().exec();
    const totalUserCount = await contest.find().count();
    const total_pages=Math.ceil(totalUserCount/size);
 
    res.send({con,total_pages});
})



router.get("/sort_type",async (req,res)=>{
    const page = +req.query.page||1;
    const size = +req.query.size||5;
    const offset = (page-1)*5;
    const con = await contest.find({type:req.query.type}).skip(offset).limit(size).lean().exec();
    const totalUserCount = await contest.find().count();
    const total_pages=Math.ceil(totalUserCount/size);
 
    res.send({con,total_pages});
})

router.get("/sort_deadline",async (req,res)=>{
    const page = +req.query.page||1;
    const size = +req.query.size||5;
    const offset = (page-1)*5;
    const con = await contest.find().skip(offset).sort({deadline:1}).lean().exec();
    const totalUserCount = await contest.find().count();
    const total_pages=Math.ceil(totalUserCount/size);
 
    res.send({con,total_pages});
})

router.post("",
body("title").notEmpty().withMessage("title is required"),
body("type").notEmpty().withMessage("type is required"),
body("deadline").notEmpty().withMessage("deadline is required"),
body("time").notEmpty().withMessage("sorry! time is required"),
body("day").notEmpty().withMessage("sorry! day is required"),
async (req,res)=>{
    const errors = validationResult(req);
        let final_error=null;
        if(!errors.isEmpty()){
            console.log(errors)
            final_error=errors.array().map(errors=>{
                return {
                    param:errors.param,
                    msg:errors.msg,
                    value:errors.value
                }
            })
            return res.status(400).json({error:final_error});
        }
        console.log(final_error)
    const con = await contest.create(req.body);
    res.send(con);
})

router.get("/:id",async(req,res)=>{
    const con = await contest.findById(req.params.id);
    res.send(con);
})

router.delete("/:id",async(req,res)=>{
    const con = await contest.findByIdAndDelete(req.params.id);
    res.send(con);
})

router.patch("/:id",async(req,res)=>{
    const con = await contest.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.send(con);
})

module.exports = router;