const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true //compository field
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Phone'
    }]

});

module.exports = mongoose.model('User',userSchema)