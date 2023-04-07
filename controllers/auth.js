import jwt  from "jsonwebtoken"
import bcrypt from "bcryptjs"

import User from '../models/auth.js'

export const signup= async (req,res) =>{
    const {name, email,password}= req.body;
    
    try{
        const existingUser= await User.findOne({email})
        if(existingUser){
           return res.status(404).json({message:"User already exist"})
        }
        const hashedPassword= await bcrypt.hash(password,12)
        const newUser= await User.create({name, email, password:hashedPassword})
        
        const token= jwt.sign({email: newUser.email , id: newUser._id}, process.env.JWT_SECRET, { expiresIn:'1h'} )
        res.status(200).json({result:newUser, token})
    }catch(error){
        res.status(500).json("Something went wrong...")
        console.log(error)
    }
}

export const login= async (req,res) =>{
    const {email,password}= req.body;
    try{
        const existingUser= await User.findOne({email})
        if(!existingUser){
           return res.status(404).json({message:"User not exist"})
        }
        const isPasswordCrt= await bcrypt.compare(password, existingUser.password)
        if(!isPasswordCrt){
            res.status(404).json({message: "Invalid password"})
        }
        const token= jwt.sign({email: existingUser.email , id: existingUser._id}, process.env.JWT_SECRET, { expiresIn:'1h'} )
        res.status(200).json({result:existingUser, token})
       
    }catch(error){
        res.status(500).json("Something went wrong...")
    }
}