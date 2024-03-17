// const Pages = require('../models/config');
const crypto = require('crypto');
const  Course  = require('../interface/Course.js');// course not Course, Strange
const  Student  = require('../interface/Student.js');
const  Educator  = require('../interface/Educator.js');

const Swal = require('sweetalert2')
// console.log('in pages.js');
const { usersCollection, coursesCollection } = require('../models/config');

function escapeRegExp(string) {
    if (typeof string !== 'string') throw new TypeError('Expected a string');
    string = string.replace(/-/g, '\\x2d');
    string = string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return string // $& means the whole matched string
}

module.exports = {
    index:(req,res)=>{  
        console.log('log in home');  

        return res.render("home",buildDataBeforeRender(req))
    },
    
    loginGet:(req,res)=>{
        if(req.session.user && req.session.user.authenticated) return res.redirect("/search")

        res.render("login")
    },
    loginPost:async  (req,res)=>{
        const MaxAttemps = 5;
        if(req.session.failedAttempts &&req.session.failedAttempts>=MaxAttemps) return res.status(403).send('forbbiden, to many faileded attmeps')
        try {
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
        // if(req.session.user && !req.session.user.authenticated) return res.redirect("/login")
        // if(req.session.user.userType == "educator") return res.redirect("/EducatorDashboard")

       try{
        if(req.query.q){
            console.log(req.query.q);
            const sanitizedQuery = escapeRegExp(req.query.q);
            console.log(sanitizedQuery);
            const data = await coursesCollection.find({name: {$regex :sanitizedQuery, $options: 'i'}});
            console.log(data);
            return res.render('search',{data:data, user:req.session.user,q:req.query.q})
        }
        else{
            const data = await coursesCollection.find({})
            console.log(coursesCollection)
            return res.render('search',{data:data, user:req.session.user,q:''})
        }
       }catch(e){
        console.log(e);
       }
    },
    // Pricing
    pricing:(req,res)=>{
    // if(req.session.user && !req.session.user.authenticated ) return res.redirect("/login")
        res.render("pricing",{data:{user:req.session.user}})
    },
    // User Data
    profile:(req,res)=>{

        res.render('profile',{data:{accesses:req.session.user.authenticated, user:req.session.user}})
    
    },

    EducatorDashboardGet: (req,res)=>{
        // const educator = new Educator(req.session.user.name,req.session.email);
        res.render('EducatorDashboard',{ data:{user:req.session.user}});
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

        
            const courseIsExist = await coursesCollection.findOne({name: data.name})
            if(courseIsExist){
                const coursedata = await coursesCollection.updateOne({name: data.name},data);
                console.log('course Updated:',coursedata);
                // res.status(200).send('course update!');
                res.render('EducatorDashboard',{ data:{user:req.session.user,acc:'Updated'}});
            }else{
                // add Data   
                const coursedata = await coursesCollection.insertMany(data);
                console.log('course Added:',coursedata);
                // res.status(200).send('course add!');
                res.render('EducatorDashboard',{ data:{user:req.session.user,acc:'inserted'}});
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

function buildDataBeforeRender(req){
    let renderData = {data:{accesses:false}};
    if(req.session.user)
    renderData = {data:{accesses:req.session.user.authenticated, user:req.session.user}};
    return renderData;

}


// function checkIsLogin(){
//     if(!req.session && !req.session.user) return res.render('login')
// }

