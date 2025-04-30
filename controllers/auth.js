const argon2 = require('argon2');
const { buildDataBeforeRender } = require('../middlewares/misc.js');
const Student = require('../models/classes/Student.js');
const Educator = require('../models/classes/Educator.js');
const Admin = require('../models/classes/Admin.js');

// console.log('in pages.js');
const { usersCollection, coursesCollection } = require('../models/config.js');

module.exports = {
    loginGet:(req,res)=>{
        const err = req.query.err;
        const data = err ? { err: decodeURIComponent(err) } : undefined;
        res.render("login", { data });
    },
    loginPost:async  (req,res)=>{
        const MaxAttemps = 5;
        // check attemps
        if(req.session.failedAttempts &&req.session.failedAttempts>=MaxAttemps) return res.status(403).send('forbbiden, to many faileded attmeps')
        try {
            // check, no empty parameters
            if(!req.body.username || !req.body.password){
                return res.status(401).render('login',{data:{err:"no parameter founds!"}});
            }
            const check = await usersCollection.findOne({name:req.body.username})
            if(!check){
                return res.status(401).render('login',{data:{err:"user not found!"}});
            }
           
            const match = await argon2.verify(check.password, req.body.password);
            if (!match) {
                req.session.failedAttempts = (req.session.failedAttempts || 0) + 1;
                return res.status(401).render('login',{data:{err:'wrong password'}});
            }
            // console.log(check.userType);
            switch(check.userType){
                case 'student':
                    req.session.user = new Student(check.name,check.email,check.subscribe, check.reviewed);
                    req.session.userId = check._id;
                    return res.status(302).redirect('search');
                case 'user':
                    req.session.user = new Student(check.name,check.email,check.subscribe, check.reviewed);
                    req.session.userId = check._id;
                    return res.status(302).redirect('/search');
                case 'educator':
                    req.session.user = new Educator(check.name,check.email);
                    req.session.userId = check._id;
                    return res.status(302).redirect('/EducatorDashboard');
                case 'admin':
                    req.session.user = new Admin(check.name,check.email);
                    req.session.userId = check._id;
                    return res.status(302).redirect('/');

                default:
                    // res.status(404).send('wrong data, contact with Support')
                    return res.render('login',{data:{err:'wrong data, contact with Support'}})
            }
            
        } catch (error) {
            console.log(error);
            res.send("wrong Details")
        }
    },
    registerGet:(req,res)=>{
        // if(req.session.user && req.session.user.authenticated) return res.redirect("/search")
        const buildDataBeforeRenderData = buildDataBeforeRender(req)
        return  res.render("register",{...buildDataBeforeRenderData})
    },
    registerPost: async (req,res)=>{
        try{
            const hashed = await argon2.hash(req.body.password);
            const data = {
                name: req.body.username,
                password: hashed,
                email: req.body.email,
                userType: "user"
            }
            // check if the user already exists
            const userIsExist = await usersCollection.findOne({name: data.name})
            if(userIsExist){
                return res.render('register',{data:{err:"User already exists. Please choose diffrent Name"}});
            }
            const emailIsExist = await usersCollection.findOne({email: data.email});
            if(emailIsExist){
                return res.render('register',{data:{err:"Email already exists. Please choose a different email"}});
            }
            // add Data   
            const userdata = await usersCollection.insertMany(data);
            return res.redirect("login")
            
        }catch (error) {
            console.log(error);
            res.status(401).send("wrong Details")
        }
    
    },
    signout:(req,res)=>{
        req.session.destroy(error => {
            if (error) {
                console.log(error);
                res.send("Error Logging out");
            } else {
                res.redirect('/');
            }
        });
    }
}
