const mongoose = require('mongoose')
//Schema: Terms
var Terms_Schema = new mongoose.Schema({
    name: {type: String},
    title: {type: String},
}, { timestamps: true }
);
module.exports = mongoose.model('Terms', Terms_Schema);