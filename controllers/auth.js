const crypto = require('crypto');
const  Course  = require('../models/classes/Course.js');// course not Course, Strange
const  Student  = require('../models/classes/Student.js');
const  Educator  = require('../models/classes/Educator.js');

const Swal = require('sweetalert2');
// console.log('in pages.js');
const { usersCollection, coursesCollection } = require('../models/config.js');

module.exports = {
    loginGet:(req,res)=>{
        if(req.session.user && req.session.user.authenticated) res.redirect("/search")
        res.render("login")
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
           
            if(check.password != createHash(req.body.password)){
                console.log('wrong password');
                return res.status(401).render('login',{data:{err:'wrong password'}})
            } 
            // console.log(check.userType);
            switch(check.userType){
                case 'student':
                    req.session.user = new Student(check.name,check.email,check.subscribe, check.reviewed); 
                    return res.status(302).redirect('search');
                case 'user':
                    req.session.user = new Student(check.name,check.email,check.subscribe, check.reviewed); 
                    return res.status(302).redirect('/search');
                case 'educator':
                    req.session.user = new Educator(check.name,check.email);
                    return res.status(302).redirect('/EducatorDashboard');
                case 'admin':
                    req.session.user = new Admin(check.name,check.email); 
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
            const data= {
                name:req.body.username,
                password: createHash(req.body.password),
                email: req.body.email,
                userType: "user"
            }
            // check if the user already exists
            const userIsExist = await usersCollection.findOne({name: data.name})
            if(userIsExist){
                return res.render('register',{data:{err:"User already exists. Please choose diffrent Name"}});
            }
            const emailIsExist = await usersCollection.findOne({name: data.name})
            if(emailIsExist){
                return res.render('register',{data:{err:"Email already exists. Please choose diffrent email"}});
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
        // req.session.user.authenticated = false;
        // console.log('session',req.session);
        req.session = null
        // delete req.session

        return res.redirect("/")
    }
}