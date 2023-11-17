const Pages = require('../models/config');
console.log('in pages.js');

module.exports = {
    index:(req,res)=>{  
        console.log('log in home');  
        if(req.session.user)
        res.render("home",{data:{accesses:req.session.authenticated, user:req.session.user}})
        else
        res.render("home",{data:{accesses:req.session.authenticated}})
    }
}