const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

mongoose.Promise = global.Promise;

module.exports = connectDatabase = async () => {
    try{
        const URL = "mongodb+srv://Enris:"+process.env.MONGO_ATLAS_PW+"@cluster0.2vpoqtq.mongodb.net/?retryWrites=true&w=majority";
        const databaseConnection = await mongoose.connect(URL , {useNewUrlParser:true})

    }catch (error) {
        console.error(`Error::: ${error.message}`);
        process.exit(1);
      }
}
