const mongoose = require('mongoose');

const file = new mongoose.Schema({
    path : {
        type : "String",
        required : true
    },
    originalName : {
        type : "String",
        required : true
    },
    downloadCount : {
        type : "Number",
        required : true,
        default : 0
    },
    code : {
        type : "Number",
        required : true,
        unique : true

    }
});


module.exports =  mongoose.model('File',file);