// const Pages = require('../models/config');
const crypto = require('crypto');
// console.log('in pages.js');
const { usersCollection, coursesCollection } = require('../models/config');

module.exports = {
    index:(req,res)=>{  
        console.log('log in home');  
        if(req.session.user)
        res.render("home",{data:{accesses:req.session.authenticated, user:req.session.user}})
        else
        res.render("home",{data:{accesses:req.session.authenticated}})
    },
    
    loginGet:(req,res)=>{
        if(req.session.authenticated) res.redirect("/search")
        else
        res.render("login")
    },
    loginPost:async  (req,res)=>{
        try {
            const check = await usersCollection.findOne({name:req.body.username})
            if(!check){
                res.send("user not found!");
                return;
            }
           
            if(check.password == createHash(req.body.password)){
                req.session.authenticated = true
                req.session.user = {
                    name: req.body.username,
                }
                if(check.userType)req.session.user.userType=check.userType
                // console.log();

                    if(req.session && req.session.user && req.session.user.userType=="educator" ){
                        res.redirect('EducatorDashboard');
                    } else{
                        res.redirect('search')
                    }
            }else{
                res.send("Password is wrong")
            }
            
        } catch (error) {
            console.log(error);
            res.send("wrong Details")
        }
    },
    registerGet:(req,res)=>{
        if(req.session.authenticated) res.redirect("/search")
        else
        res.render("register")
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
            // console.log('userIsExist:', userIsExist);
            if(userIsExist){
                res.send("User already exists. Please choos diffrent Name")
                return;
            }
            // add Data   
            const userdata = await usersCollection.insertMany(data);
            console.log(userdata);
            res.redirect("login")
            
        }catch (error) {
            console.log(error);
            res.send("wrong Details")
        }
    
    },
    signout:(req,res)=>{
        req.session.authenticated = false;
        res.redirect("/");
    },

    // Search Page
    search:async (req,res)=>{
        // Change this
        if(!req.session.authenticated) return res.redirect("/login")
        if(req.session.user.userType == "educator") return res.redirect("/EducatorDashboard")
        console.log(req.session.user);
        if(req.query.q){
            const data = await coursesCollection.find({name: req.query.q})
            res.render('search',{data:data, user:req.session.user})
        }else{
            const data = await coursesCollection.find({})
            res.render('search',{data:data, user:req.session.user})
        }
    },
    // Pricing
    pricing:(req,res)=>{
    if(!req.session.authenticated ) res.redirect("/login")
        res.render("pricing",{data:{user:req.session.user}})
    },
    // User Data
    profile:(req,res)=>{
        if(req.session && req.session.user){
            res.render('profile',{data:{accesses:req.session.authenticated, user:req.session.user}})
        } else{
            res.redirect('login')
        }
    },

    EducatorDashboardGet: (req,res)=>{
        console.log(req.session.user);
        if(req.session && req.session.user && req.session.user.userType=="educator" ){
            res.render('EducatorDashboard',{ user:req.session.user});
        } else{
            res.redirect('login')
        }
    },

    EducatorDashboardPost:async (req,res)=>{
    // console.log(req.body);
        let filteredTags = req.body.tags.filter((el)=> {
            return el != null && el != '';
        });
        try{
            const data= {
                name:req.body.CourseName,
                description: req.body.description,
                tags: filteredTags,
                Content: {
                    Videos:[],
                    Articles:[],
                    Quizzes:[],
                    Assignments:[],
                    Others:[],
                }
            }
            //Videos
            // let videoLength = Array.isArray(req.body.Video) ? req.body.Video.length : 0;
            for(let i=0;i<5;i++)
            {
                if(req.body.Video[i]=='') continue
                let minData ={ name: req.body.Video[i], url:req.body.VideoUrl[i]}
                data.Content.Videos.push(minData)
            }
            //Articles
            // let articleLength = Array.isArray(req.body.article) ? req.body.article.length : 0;
            for(let i=0;i<5;i++){
                if(req.body.article[i]=='') continue
                let minData ={ name: req.body.article[i], url:req.body.articlesUrl[i]}
                data.Content.Articles.push(minData)
            }
            //Quizzes
            for(let i=0;i<5;i++){
                if(req.body.quizzes[i]=='') continue
                let minData ={ name: req.body.quizzes[i], url:req.body.quizzesUrl[i]}
                data.Content.Quizzes.push(minData)
            }
            //Assignments
            // let assignmentsLength = Array.isArray(req.body.assignments) ? req.body.assignments.length : 0;
            for(let i=0;i<5;i++){
                if(req.body.assignments[i]=='') continue
                let minData ={ name: req.body.assignments[i], url:req.body.assignmentsUrl[i]}
                data.Content.Assignments.push(minData)
            }
            //Others
            // let othersLength = Array.isArray(req.body.others) ? req.body.others.length : 0;
            for(let i=0;i<5;i++){
                if(req.body.others[i]=='') continue
                let minData ={ name: req.body.others[i], url:req.body.othersUrl[i]}
                data.Content.Others.push(minData)
            }
        
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
},


}


function createHash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}