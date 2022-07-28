const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');

const User = require('../models/user')
const Sport  = require('../models/phonenumbers'); 

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         firstName:
 *           type: string
 *           description: The users first name
 *         lastName:
 *           type: string
 *           description: The users lastname
 *       example:
 *         firstName: Enris
 *         lastName: Kumi
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Sports:
 *       type: object
 *       required:
 *         - name
 *         - timePlaying
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the sport
 *         name:
 *           type: string
 *           description: The sport name
 *         timePlaying:
 *           type: Number
 *           description: time playing
 *       example:
 *         name: Basketball
 *         timePlaying: 7
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */


router.get('/', async (req,res,next)=>{
    try{
        const users = await User.find();
        res.status(200).json(users)
    }catch(err){
        res.send('Error '+ err)
    }
})

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

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
        res.send('Error')
    }
})

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Returns a user by their ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

router.get('/:id', async (req,res,next)=>{
    try{
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    }catch(err){
        res.send('Error '+ err)
    }
})

/**
 * @swagger
 * /users/{id}:
 *  patch:
 *    summary: Update a user by their ID
 *    tags: [Users]
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

router.patch('/:id', async (req,res)=>{
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
        res.status(200).json(us)
    }catch(err){
        res.send('Error')
    }
})

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by their ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 */

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