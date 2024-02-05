// const Pages = require('../models/config');
const crypto = require('crypto');
const  Course  = require('../interface/Course.js');// course not Course, Strange
const  Student  = require('../interface/Student.js');
const  Educator  = require('../interface/Educator.js');

const Swal = require('sweetalert2')
// console.log('in pages.js');
const { usersCollection, coursesCollection } = require('../models/config');

module.exports = {
    index:(req,res)=>{  
        console.log('log in home');  
        if(req.session.user)
        res.render("home",{data:{accesses:req.session.user.authenticated, user:req.session.user}})
        else
        res.render("home",{data:{accesses:false}})
    },
    
    loginGet:(req,res)=>{
        if(req.session.user && req.session.user.authenticated) res.redirect("/search")
        else
        res.render("login")
    },
    loginPost:async  (req,res)=>{
        const MaxAttemps = 5;
        if(req.session.failedAttempts &&req.session.failedAttempts>=MaxAttemps) return res.status(403).send('forbbiden, to many faileded attmeps')
        try {
            const check = await usersCollection.findOne({name:req.body.username})
            if(!check){
                return res.render('login',{data:{err:"user not found!"}});
            }
           
            if(check.password != createHash(req.body.password)){
                console.log('wrong password');
                return res.render('login',{data:{err:'wrong password'}})

            } 
            console.log(check.userType);
            switch(check.userType){
                case 'student':
                    req.session.user = new Student(check.name,check.email,check.subscribe, check.reviewed); 
                    res.redirect('search');
                    break;
                case 'user':
                    req.session.user = new Student(check.name,check.email,check.subscribe, check.reviewed); 
                    res.redirect('search');
                    break;
                case 'educator':
                    req.session.user = new Educator(check.name,check.email);
                    res.redirect('EducatorDashboard');
                    break;
                case 'admin':
                    req.session.user = new Student(check.name,check.email); 
                    res.redirect('home');
                    break;
                default:
                    // res.status(404).send('wrong data, contact with Support')
                    res.render('login',{data:{Swal:Swal,err:'wrong data, contact with Support'}})
            }
            
        } catch (error) {
            console.log(error);
            res.send("wrong Details")
        }
    },
    registerGet:(req,res)=>{
        if(req.session.user && req.session.user.authenticated) res.redirect("/search")
        else  res.render("register")
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
            console.log('userIsExist:', userIsExist);
            console.log('userIsExist:', data.name);
            if(userIsExist){
                res.render('register',{data:{Swal:Swal,err:"User already exists. Please choose diffrent Name"}})
                return;
            }
            // add Data   
            const userdata = await usersCollection.insertMany(data);
            res.redirect("login")
            
        }catch (error) {
            console.log(error);
            res.send("wrong Details")
        }
    
    },
    signout:(req,res)=>{
        req.session.user.authenticated = false;
        res.redirect("/");
    },

    // Search Page
    search:async (req,res)=>{
        // Change this
        if(req.session.user && !req.session.user.authenticated) return res.redirect("/login")
        if(req.session.user.userType == "educator") return res.redirect("/EducatorDashboard")

        if(req.query.q){
            const data = await coursesCollection.find({name: {$regex :new RegExp(req.query.q, 'ig')}});
            return res.render('search',{data:data, user:req.session.user,q:req.query.q})
        }else{
            const data = await coursesCollection.find({})
            console.log(coursesCollection)
            return res.render('search',{data:data, user:req.session.user,q:''})
        }
    },
    // Pricing
    pricing:(req,res)=>{
    if(req.session.user && !req.session.user.authenticated ) return res.redirect("/login")
        res.render("pricing",{data:{user:req.session.user}})
    },
    // User Data
    profile:(req,res)=>{
        if(req.session && req.session.user){
            res.render('profile',{data:{accesses:req.session.user.authenticated, user:req.session.user}})
        } else{
            res.redirect('login')
        }
    },

    EducatorDashboardGet: (req,res)=>{
        // const educator = new Educator(req.session.user.name,req.session.email);
        if(req.session && req.session.user && req.session.user.userType=="educator" ){
            res.render('EducatorDashboard',{ data:{user:req.session.user}});
        } else{
            res.redirect('login')
        }
    },

    EducatorDashboardPost:async (req,res)=>{
        // const educator = new Educator(req.session.user,req.session.email);
        if( !Array.isArray(req.body.tags)) return res.send('wrong tags type')
        let filteredTags = req.body.tags.filter((el)=> {
            return el != null && el != '';
        });
        try{
            const data= {
                name:req.body.CourseName,
                description: req.body.description,
                tags: filteredTags,
                review:[],
                discussions:{},
                Content: {
                    Videos:[],
                    Articles:[],
                    Quizzes:[],
                    Assignments:[],
                    Others:[],
                }
            }
            for(let catograyOfContent of Object.keys(data.Content)){
                console.log(catograyOfContent);
                console.log(req.body[catograyOfContent]);
            
                if(req.body[catograyOfContent]){
                    let arrCatagory= req.body[catograyOfContent];
                    let arrCatagoryUrl= req.body[catograyOfContent+'Url'];
                    if(!Array.isArray(arrCatagory) && arrCatagory!='' && arrCatagoryUrl!='' ){
                        let minData ={ name: arrCatagory, url:arrCatagoryUrl}
                        data.Content[catograyOfContent].push(minData)
                    }
                    else
                    for(let i=0;i<arrCatagory.length;i++)
                    {
                        if(arrCatagory[i]=='') continue
                        let minData ={ name: arrCatagory[i], url:arrCatagoryUrl[i]}
                        data.Content[catograyOfContent].push(minData)
                    }
                }
                console.log(data);
            }
            // //Videos
            // // let videoLength = Array.isArray(req.body.Video) ? req.body.Video.length : 0;
            // for(let i=0;i<5;i++)
            // {
            //     if(req.body.Video[i]=='') continue
            //     let minData ={ name: req.body.Video[i], url:req.body.VideoUrl[i]}
            //     data.Content.Videos.push(minData)
            // }
            // //Articles
            // // let articleLength = Array.isArray(req.body.article) ? req.body.article.length : 0;
            // for(let i=0;i<5;i++){
            //     if(req.body.article[i]=='') continue
            //     let minData ={ name: req.body.article[i], url:req.body.articlesUrl[i]}
            //     data.Content.Articles.push(minData)
            // }
            // //Quizzes
            // for(let i=0;i<5;i++){
            //     if(req.body.quizzes[i]=='') continue
            //     let minData ={ name: req.body.quizzes[i], url:req.body.quizzesUrl[i]}
            //     data.Content.Quizzes.push(minData)
            // }
            // //Assignments
            // // let assignmentsLength = Array.isArray(req.body.assignments) ? req.body.assignments.length : 0;
            // for(let i=0;i<5;i++){
            //     if(req.body.assignments[i]=='') continue
            //     let minData ={ name: req.body.assignments[i], url:req.body.assignmentsUrl[i]}
            //     data.Content.Assignments.push(minData)
            // }
            // //Others
            // // let othersLength = Array.isArray(req.body.others) ? req.body.others.length : 0;
            // for(let i=0;i<5;i++){
            //     if(req.body.others[i]=='') continue
            //     let minData ={ name: req.body.others[i], url:req.body.othersUrl[i]}
            //     data.Content.Others.push(minData)
            // }
        
            const courseIsExist = await coursesCollection.findOne({name: data.name})
            if(courseIsExist){
                const coursedata = await coursesCollection.updateOne({name: data.name},data);
                console.log('course Updated:',coursedata);
                res.status(200).send('course update!');
            }else{
                // add Data   
                const coursedata = await coursesCollection.insertMany(data);
                console.log('course Added:',coursedata);
                res.status(200).send('course add!');
                
              
            }
    }catch (error) {
        console.log(error);
        res.send("wrong Details")
    }
    }


}


function createHash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}
// function checkIsLogin(){
//     if(!req.session && !req.session.user) return res.render('login')
// }

