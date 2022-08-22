const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const serverless = require('serverless-http');
const port = process.env.PORT || 9000;

const app = express()
app.use(cors());
const URL = "mongodb+srv://Enris:"+process.env.MONGO_ATLAS_PW+"@cluster0.2vpoqtq.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(URL , {useNewUrlParser:true})

const con = mongoose.connection

con.on('open',() => {
    console.log('Connected...')
})



app.use(express.json())


const usersRouter = require('./routes/users')
app.use('/users',usersRouter)

const OneToMany = require('./routes/OneToMany')
app.use('/one2many',OneToMany)

/*
app.listen(port, ()=>{
    console.log(`Server started at: http://localhost:${port}`);
})*/

module.exports.handler = serverless(app);
