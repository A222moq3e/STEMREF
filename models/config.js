const mongoose = require('mongoose');
// const { boolean } = require('webidl-conversions');
const connect = mongoose.connect("mongodb+srv://A1222:pass123@cluster0.ct1c2i5.mongodb.net/STEMREF?retryWrites=true&w=majority")
// const connect = mongoose.connect("mongodb://localhost:27017/STEMREF")
// mongodb+srv://A1222:pass123@cluster0.ct1c2i5.mongodb.net/?retryWrites=true&w=majority

console.log('in config.js');
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
    ,userType:{
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
    "Author": {
      "name": "String"
    },
    "tags": {
      "type": ["String"]
    },
    "paidContent": {
      "type": "boolean"
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