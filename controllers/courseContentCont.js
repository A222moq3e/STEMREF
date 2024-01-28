// const Pages = require('../models/config');
const { usersCollection, coursesCollection } = require('../models/config');
const  Course  = require('../interface/Course.js');// course not Course, Strange
// const  Student  = require('../interface/Student.js');
console.log('process.env.TEST courseContentCont');
console.log(process.env.TEST);
module.exports = {
    courseContent:async (req,res)=>{
        res.redirect('search',{data:{user:req.session.user}})
    },
    courseContentByName:async (req,res)=>{
       try{
            if(req.session.user && !req.session.user.authenticated ) res.redirect("/login")
            const data = await coursesCollection.findOne({name: req.params.name})
            let iconUse = ''
            const course = new Course(data.name,data.description,data.Author,data.tags,data.paidContent,data.review,data.Content);
            // const user = new Student(req.session.user.name,req.session.user.email);
            // const user = new 
            if(!data) return res.send('sorry this course not found')
            console.log(course.content.Videos);
            res.render('courseContent',{data:{course:course,user:req.session.user,icons:[]}})
       }catch(e){
            console.log(e);
       }
        
        // res.render('courseContent')
    },
    courseContentByNameAndCatogray:async (req,res)=>{
        if(req.session.user && !req.session.user.authenticated) res.redirect("/login")
        const data = await coursesCollection.findOne({name: req.params.name})
        // console.log(req.params.catogray);
        let catogray = req.params.catogray;
        // console.log(data.Content[catogray]);
        let urls = data.Content[catogray]
        let urls_filterd = urls.filter((url)=>{
            return url.name != "" ;
        })
        urls = urls_filterd
        console.log('urls:',urls_filterd);
        // console.log(Array.isArray(urls));
        if(!data)
            res.send('sorry this course not found')
        else{
            res.render('courseContent',{data:{name:req.params.name, desc:data.description, content:urls, catogray:catogray,icons:iconUse,user:req.session.user}})
        }
        // res.render('courseContent')
    }

}