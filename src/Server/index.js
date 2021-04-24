const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const usersRoute = require('./routes/users.routes');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');

app.use(cors());
app.use('/bank/users',usersRoute);

mongoose.connect('mongodb+srv://nettalee19:dM_HqsyqT9K8LK.@cluster0.u9jns.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log("database connected")
})

app.get('/',(req,res)=>{
    res.json({success : 'Bank API'})
    
})

app.listen(process.env.PORT || 5000, () => {
    console.log(`application start at ${process.env.PORT || 5000}`)
})




