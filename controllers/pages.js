const Pages = require('../models/config');


module.exports = {
    index:(req,res)=>{  
        console.log('log in home');  
        if(req.session.user)
        res.render("home",{data:{accesses:req.session.authenticated, user:req.session.user}})
        else
        res.render("home",{data:{accesses:req.session.authenticated}})
    }
}