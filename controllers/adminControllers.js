

const  Admin  = require('../interface/Admin.js');
const  User  = require('../interface/User.js');
const { usersCollection, coursesCollection } = require('../models/config');

module.exports = {
    adminGet:async (req,res)=>{
        const admin = new Admin(req.session.user.name,req.session.user.email)
        const users =  await usersCollection.find({})
        res.render('admin',{data:{user:admin,users:users}})
    },
    adminPost:(req,res)=>{
        res.send('admin',{data:{user:admin}})
    }

}