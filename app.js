const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require ('swagger-jsdoc');
const cors = require('cors');
const serverless = require('serverless-http');
const port = process.env.PORT || 9000;

//start app
const app = express()
app.use(cors());
const URL = "mongodb+srv://Enris:"+process.env.MONGO_ATLAS_PW+"@cluster0.2vpoqtq.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(URL , {useNewUrlParser:true})

const con = mongoose.connection

con.on('open',() => {
    console.log('Connected...')
})

const options = {
    definition: {
        openapi:"3.0.0",
        infor: {
            title: "Rest API",
            version: "1.0.0",
            description: "A simple api"
        },
        servers : [
            {
                url: "http://localhost:9000"
            }
        ],
    },
    apis:["./routes/*.js"]
};

const specs = swaggerJsDoc(options);

app.use(express.json())

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const usersRouter = require('./routes/users')
app.use('/users',usersRouter)

const OneToMany = require('./routes/OneToMany')
const swaggerJSDoc = require('swagger-jsdoc')
app.use('/one2many',OneToMany)

/*
app.listen(port, ()=>{
    console.log(`Server started at: http://localhost:${port}`);
})*/

module.exports.handler = serverless(app);
