const express = require('express');
const zod = require('zod');
const userRouter = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = require("../config");
const {User} = require('../db');
const { authMiddleware } = require('../middleware');


const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstname: zod.string(),
    lastname: zod.string()
})
userRouter.post("/signup",async(req,res)=>{
    const body = req.body;
    const {success} = signupSchema.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Incorrect Input."
        })
    }
    const user = User.findOne({
        username: body.username
    })

    if (user._id){
        return res.status(411).json({
            message: "Email is taken"
        })
    }

    const dbUser = await User.create(body);
    const token = jwt.sign({
        userId:dbUser._id
    },JWT_SECRET)


    res.status(200).json({
        message: "User created",
        token:token
    })

})

/////////////////////////////////////////////////////////////////

const signinBody = zod.object({
    username:zod.string(),
    password:zod.string()
})

userRouter.post("/signin",async(req,res)=>{
    const body = req.body;
    const {success} = signinBody.safeParse(body);
    if(!success){
        res.status(411).json({
            message:"Incorrect Inputs"
        })
    }
    const user = await User.findOne({
        username:body.username,
        password:body.password
    })
    if(user){
        const token = jwt.sign({
            userId:user._id
        },JWT_SECRET);
        res.status(200).json({
            token:token
        })
        return
    }
    res.status(411).json({
        message:"Error while logging in"
    })
})
//////////////////////////////////////////////////
const updateBody = zod.object({
    password: zod.string(),
    firstname:zod.string(),
    lastname:zod.string()
})
userRouter.put("/",authMiddleware,async(req,res)=>{
    const {success} = updateBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message:"Could not update your information"
        })
    }
    await User.updateOne(req.body,{
        id: req.userId
    })

    res.status(200).json({
        message:"Updated succesfully."
    })
})
///////////////////////////

userRouter.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})






module.exports={
    userRouter
}