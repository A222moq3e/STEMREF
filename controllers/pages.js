// const Pages = require('../models/config');
const crypto = require('crypto');
const  Course  = require('../models/classes/Course.js');// course not Course, Strange
const  Student  = require('../models/classes/Student.js');
const  Educator  = require('../models/classes/Educator.js');
const  Admin  = require('../models/classes/Admin.js');

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
        const buildDataBeforeRenderData = buildDataBeforeRender(req)
        return res.render("home",{...buildDataBeforeRenderData, req})
    },
    


    // Search Page
    search:async (req,res)=>{
        // Change this
        // if(req.session.user && !req.session.user.authenticated) return res.redirect("/login")
        // if(req.session.user.userType == "educator") return res.redirect("/EducatorDashboard")

       try{
        let sortWay = {name:1};
        const sortTranslator ={
            "Alphabetical": {name:1},
            "Recommended": {name:1},//TODO: add way to know recomonded
            "Popular": {name:1},//TODO: add way to know popular, by add number of views
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

// TODO: Make this as middleware
function buildDataBeforeRender(req){
    let renderData = {data:{accesses:false}};
    if(req.session.user)
    renderData = {data:{accesses:req.session.user.authenticated, user:req.session.user,path:'/'+req.path.split('/')[1]}};
    return renderData;
}



// function checkIsLogin(){
//     if(!req.session && !req.session.user) return res.render('login')
// }

