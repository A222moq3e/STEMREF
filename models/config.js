const mongoose = require('mongoose');
// const mongoUrl = `mongodb://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@monorail.proxy.rlwy.net:14370`
// const mongoUrl = "mongodb://localhost:27017/STEMREF"
const mongoUrl = "mongodb+srv://A1222:pass123@cluster0.ct1c2i5.mongodb.net/STEMREF?retryWrites=true&w=majority"
// const mongoUrl = process.env.MONGODB_CLUSTER
const connect = mongoose.connect(mongoUrl)
// mongodb+srv://A1222:pass123@cluster0.ct1c2i5.mongodb.net/?retryWrites=true&w=majority

console.log('in config.js');
connect.then(()=>{
    console.log('db Connected Successfuly');
    console.log('url',mongoUrl);
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
    },subscribe:{
      type:String,
      required:false
    },token:{
      type:String,
      required:false
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
    "reviews": {
      "type": ["int"]
    },
    "discussions": {
      "type": "Mixed"
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