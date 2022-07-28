const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
    providerName:{
        type: String,
        required: true
    },
    number:{
        type: Number,
        required:true
    }
});

module.exports = mongoose.model('Phone',phoneSchema);