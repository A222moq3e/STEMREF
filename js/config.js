const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb+srv://A1222:pass123@cluster0.ct1c2i5.mongodb.net/STEMREF?retryWrites=true&w=majority")
// mongodb+srv://A1222:pass123@cluster0.ct1c2i5.mongodb.net/?retryWrites=true&w=majority


connect.then(()=>{
    console.log('db Connected Successfuly');
}).catch(()=>{
    console.log('db Connecte Faild!');
    
})

// Create Schema
const LoginSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },password:{
        type:String,
        required:true
    }
})


// Collection
const collection = new mongoose.model("users", LoginSchema)

module.exports = collection;