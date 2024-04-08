// const Pages = require('../models/config');
const crypto = require('crypto');
const  Course  = require('../interface/Course.js');// course not Course, Strange
const  Student  = require('../interface/Student.js');
const  Educator  = require('../interface/Educator.js');
const  Admin  = require('../interface/Admin.js');

const Swal = require('sweetalert2');
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
        // if(req.session.user && req.session.user.authenticated) return res.redirect("/search")

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
        return  res.render("register")
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
    },

    // Search Page
    search:async (req,res)=>{
        // Change this
        // if(req.session.user && !req.session.user.authenticated) return res.redirect("/login")
        // if(req.session.user.userType == "educator") return res.redirect("/EducatorDashboard")

       try{
        let sortWay = {name:1};
        const sortTranslator ={
            "Alphabatical": {name:1},
            "Recomend": {name:1},//TODO: add way to know recomonded
            "popular": {name:1},//TODO: add way to know popular, by add number of views
            "Release": {},//TODO: add way to know popular, by add date to course
        }
        if(req.query.sort){
            sortWay = sortTranslator[req.query.sort];
        }
        const searchQuery = req.query.q?req.query.q:'';
        const sanitizedQuery = escapeRegExp(searchQuery);
        const data = await coursesCollection.find({name: {$regex :sanitizedQuery, $options: 'i'}}).sort(sortWay);

        const renderedData = {data:data, user:req.session.user,
                                q:req.query.q?req.query.q:'',
                                sort:req.query.sort?req.query.sort:'',
                                sortTranslator:sortTranslator,
                                path:'/'+req.path.split('/')[1]};
        

        return res.render('search',renderedData)
       }catch(e){
            console.log(e);
       }
    },
    // Pricing
    pricing:(req,res)=>{
    // if(req.session.user && !req.session.user.authenticated ) return res.redirect("/login")
        res.render("pricing",buildDataBeforeRender(req))
    },
    // User Data
    profile:(req,res)=>{
        res.render('profile',buildDataBeforeRender(req))
    },

    EducatorDashboardGet: (req,res)=>{
        // const educator = new Educator(req.session.user.name,req.session.email);
        res.render('EducatorDashboard',{ data:{user:req.session.user,path:'/'+req.path.split('/')[1]}});
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
                },
                date: new Date(),
                inserter:req.session.user

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
                res.render('EducatorDashboard',{ data:{user:req.session.user,acc:'Updated',path:'/'+req.path.split('/')[1]}});
            }else{
                // add Data   
                const coursedata = await coursesCollection.insertMany(data);
                console.log('course Added:',coursedata);
                // res.status(200).send('course add!');
                res.render('EducatorDashboard',{ data:{user:req.session.user,acc:'inserted',path:'/'+req.path.split('/')[1]}});
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
    renderData = {data:{accesses:req.session.user.authenticated, user:req.session.user,path:'/'+req.path.split('/')[1]}};
    return renderData;

}


// function checkIsLogin(){
//     if(!req.session && !req.session.user) return res.render('login')
// }

