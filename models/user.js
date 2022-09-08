const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({

    cognitoId: {
        type: String,
    },
    email: {
        type: String
    },

});

module.exports = mongoose.model('User',userSchema)