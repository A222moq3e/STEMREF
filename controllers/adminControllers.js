

const  Admin  = require('../interface/Admin.js');
const { usersCollection, coursesCollection } = require('../models/config');

module.exports = {
    adminGet:async (req,res)=>{
        // Get admin Page
        const admin = new Admin(req.session.user.name,req.session.user.email)
        let type = "users";
        let query = req.query.q?{name:req.query.q}:{};
        const users =  await usersCollection.find(query)
        res.render('admin',{data:{user:admin,users:users,path:'/'+req.path.split('/')[1]}})
    },
    adminPost:(req,res)=>{
        // For future data
        const admin = new Admin(req.session.user.name,req.session.user.email)
        // res.render('admin',{data:{user:admin}})
        res.status(403).send('nothing here')
    },
    adminPut:async (req,res)=>{
        // Update User Data
        const admin = new Admin(req.session.user.name,req.session.user.email)
        console.log(`Update Successfully, ${req.params.user} to ${req.params.userType}`);
        const usersUpdate =  await usersCollection.updateOne({name:req.params.user},{userType:req.params.userType});
        // res.render('admin',{data:{user:admin,users:users}})
        res.send("update successfully")
    },
    // Removed
    // adminSearchUsers: async (req,res)=>{
    //     // Search for Users
    //     const admin = new Admin(req.session.user.name,req.session.user.email)
    //     const users =  await usersCollection.find({})
    //     res.send('data serched')
    //     // res.render('admin',{data:{user:admin,users:users,path:'/'+req.path.split('/')[1]}})
    // }

}