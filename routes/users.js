const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

const User = require('../models/user')
const Sport  = require('../models/phonenumbers'); 

router.get('/', async (req,res,next)=>{
    try{
        const users = await User.find();
        res.status(200).json(users)
    }catch(err){
        res.send('Error '+ err)
    }
})


router.post('/', async(req,res)=> {
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        address: req.body.address
    })
    try{
        const a = await user.save();
        res.status(200).json(a);
    }catch(err){
        res.send(err)
    }
})

router.get('/:id', async (req,res,next)=>{
    try{
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    }catch(err){
        res.send('Error '+ err)
    }
})



router.patch('/:id', async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        const {name,surname,email,address}= req.body

        if(name){
            user.name= name
        }
        if(surname){
            user.surname= surname
        }
        if(email){
            user.email = email
        }
        if(address){
            user.address = address
        }

        const us = await user.save()
        res.status(200).json(us)
    }catch(err){
        res.send('Error')
    }
})


router.delete('/:id', async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        
        const us = await user.remove()
        res.status(200).json(us)
    }catch(err){
        res.send('Error')
    }
})




module.exports = router