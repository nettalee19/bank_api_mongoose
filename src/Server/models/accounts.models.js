const mongoose = require('mongoose')

const Accounts = mongoose.model('accounts',{
    id:{
        type: String,
        required: true,
        unique: true
    },
    cash:{
        type: Number,
        required: false,
        default: 0,
        unique: false
    },
    credit:{
        type: Number,
        required: true,
        default: 0,
        unique: false
    }
})


module.exports= Accounts;