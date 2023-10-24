const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb+srv://A1222:pass123@cluster0.ct1c2i5.mongodb.net/STEMREF?retryWrites=true&w=majority")
// mongodb+srv://A1222:pass123@cluster0.ct1c2i5.mongodb.net/?retryWrites=true&w=majority


connect.then(()=>{
    console.log('db Connected Successfuly');
}).catch(()=>{
    console.log('db Connecte Faild!');
    
})

// Create User Schema
const LoginSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },password:{
        type:String,
        required:true
    },email:{
        type:String,
        required:true
    }
})
// Create Courses Schema
const Courseschema = new mongoose.Schema({
    "name": {
      "type": "String"
    },
    "description": {
      "type": "String"
    },
    "Content": {
      "Videos": {
        "type": [
          "Mixed"
        ]
      },
      "Articles": {
        "type": [
          "Mixed"
        ]
      },
      "Quizzes": {
        "type": [
          "Mixed"
        ]
      },
      "Assignments": {
        "type": [
          "Mixed"
        ]
      },
      "Others": {
        "type": [
          "Mixed"
        ]
      }
    }
  })


// Collections
const usersCollection = new mongoose.model("users", LoginSchema)
const coursesCollection = new mongoose.model("courses", Courseschema)

module.exports = {usersCollection,coursesCollection };