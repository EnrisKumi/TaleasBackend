const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

const User = require('../models/user')
const PhoneNumber  = require('../models/phonenumbers'); 

//TODO update swagger and patch 
/**
 * @swagger
 * /one2many/sports:
 *   get:
 *     summary: Returns the list of all the sports
 *     tags: [One to Many]
 *     responses:
 *       200:
 *         description: The list of the sports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sports'
 */

router.get('/phonenr', async (req,res)=>{
    try{
        const getPhoneNr = await PhoneNumber.find({})
        res.status(200).json(getPhoneNr);
    }catch(err){
        res.status(404).json(err);
    }
});


/**
 * @swagger
 * /one2many/users/{id}:
 *  post:
 *    summary: Add to the user the sport that he/she plays
 *    tags: [One to Many]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Sports'
 */

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

/**
 * @swagger
 * /one2many/users/{id}:
 *   get:
 *     summary: Returns the list of all the users by and their sports
 *     tags: [One to Many]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user by id
 *     responses:
 *       200:
 *         description: The user description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

 router.get('/users/:id', async (req,res)=>{
    User.findOne({_id: req.params.id}).populate('phoneNumber').then(function(dbUsers){
        res.json(dbUsers);
    }).catch(function(err){
        res.json(err);
    });
});

router.get('/one2many/:id', async (req,res,next)=>{
    try{
        const phone = await PhoneNumber.findById(req.params.id)
        res.status(200).json(phone)
    }catch(err){
        res.send('Error '+ err)
    }
})



/**
 * @swagger
 * /one2many/sports/{id}:
 *   delete:
 *     summary: Delete a sport by their ID
 *     tags: [One to Many]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 */

router.delete('/phonenr/:id', async(req, res) =>{
    try{
        const findPhone = await PhoneNumber.findById(req.params.id).remove()
        res.status(200).json(findPhone)

    }catch(err)
    {
        res.status(404).json(err)
    }
})

/**
 * @swagger
 * /one2many/users/{id}:
 *  patch:
 *    summary: Update the user by their id
 *    tags: [One to Many]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 */

router.patch('/users/:id', async(req, res) =>{
    try{
        const user = await User.findById(req.params.id)
        const {firstName,lastName}= req.body
        if(firstName){
            user.firstName= firstName
        }
        if(lastName){
            user.lastName= lastName
        }
        const us = await user.save()
        res.json(us)
    }catch(err){
        res.send('Error')
    }
})

module.exports = router