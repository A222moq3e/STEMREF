

const  Admin  = require('../interface/Admin.js');
const { usersCollection, coursesCollection } = require('../models/config');

module.exports = {
    adminGet:async (req,res)=>{
        const admin = new Admin(req.session.user.name,req.session.user.email)
        const users =  await usersCollection.find({})
        res.render('admin',{data:{user:admin,users:users,path:'/'+req.path.split('/')[1]}})
    },
    adminPost:(req,res)=>{
        const admin = new Admin(req.session.user.name,req.session.user.email)
        res.render('admin',{data:{user:admin}})
    },
    adminPut:async (req,res)=>{
        // TODO: update user
        const admin = new Admin(req.session.user.name,req.session.user.email)
        console.log(`Update Successfully, ${req.params.user} to ${req.params.userType}`);
        const usersUpdate =  await usersCollection.updateOne({name:req.params.user},{userType:req.params.userType});
        // res.render('admin',{data:{user:admin,users:users}})
        res.send("update successfully")
    }

}