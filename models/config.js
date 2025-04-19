const mongoose = require('mongoose');
const mongoUrl = process.env.MONGODB_CLUSTER
const connect = mongoose.connect(mongoUrl)
const Mixed = mongoose.Schema.Types.Mixed
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
    },reviewed:{
      type: Mixed,
      required:false
  }
})
// Create Courses Schema
const Courseschema = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  Author: {
    type: String
  },
  tags: {
    type: [String]
  },
  paidContent: {
    type: Boolean
  },
  reviews:{
    type: Mixed
  },
  discussions: {
    type: Mixed
  },
  Content: {
    Videos: {
      type: [
        Mixed
      ]
    },
    Articles: {
      type: [
        Mixed
      ]
    },
    Quizzes: {
      type: [
        Mixed
      ]
    },
    Assignments: {
      type: [
        Mixed
      ]
    },
    Others: {
      type: [
        Mixed
      ]
    }
  }
})

// Collections
const usersCollection = new mongoose.model("users", LoginSchema)
const coursesCollection = new mongoose.model("courses", Courseschema)

module.exports = {usersCollection,coursesCollection };