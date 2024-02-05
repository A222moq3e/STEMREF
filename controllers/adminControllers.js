

const  Admin  = require('../interface/Admin.js');


module.exports = {
    adminGet:(req,res)=>{
        const admin = new Admin(req.session.user.name,req.session.user.email)
        res.render('admin',{data:{user:admin}})
    },
    adminPost:(req,res)=>{
        res.send('admin',{data:{user:admin}})
    }

}