const mongoose = require('mongoose');

const phoneSchema = new mongoose.Schema({
    providerName:{type: String},
    number:{type: Number}
});

module.exports = mongoose.model('Phone',phoneSchema);