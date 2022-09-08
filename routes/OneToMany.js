const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

const User = require('../models/user')
const PhoneNumber  = require('../models/phonenumbers'); 


router.get('/phonenr', async (req,res)=>{
    try{
        const getPhoneNr = await PhoneNumber.find({})
        res.status(200).json(getPhoneNr);
    }catch(err){
        res.status(404).json(err);
    }
});



router.post('/users/:id', async(req,res)=>{
    PhoneNumber.create(req.body).then(function(dbSports){
        return User.findOneAndUpdate({_id: req.params.id},
            {
                $push: {phoneNumber: dbSports._id}},{new:true});
    }).then(function(dbUsers){
        res.json(dbUsers);
    }).catch(function(err){
        res.json(err);
    });
});


 router.get('/users/:id', async (req,res)=>{
    User.findOne({_id: req.params.id}).populate('phoneNumber').then(function(dbUsers){
        res.json(dbUsers);
    }).catch(function(err){
        res.json(err);
    });
});

router.get('/phonenr/:id', async (req,res,next)=>{
    try{
        const phone = await PhoneNumber.findById(req.params.id)
        res.status(200).json(phone)
    }catch(err){
        res.send('Error '+ err)
    }
})



router.delete('/phonenr/:id', async(req, res) =>{
    try{
        const findPhone = await PhoneNumber.findById(req.params.id).deleteOne()
        res.status(200).json(findPhone)

    }catch(err)
    {
        res.status(404).json(err)
    }
})


router.patch('/phonenumbers/:id', async(req, res) =>{
    try{
        const phone = await PhoneNumber.findById(req.params.id)
        const {providerName,number}= req.body
        if(providerName){
            phone.providerName= providerName
        }
        if(number){
            phone.number=number
        }
        const us = await phone.save()
        res.json(us)
    }catch(err){
        res.send(err)
    }
})



module.exports = router