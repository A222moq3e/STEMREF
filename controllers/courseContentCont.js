// const Pages = require('../models/config');
const { usersCollection, coursesCollection } = require('../models/config');
const  Course  = require('../interface/course.js');// course not Course, Strange
// import {Course} from '../interface/course.js'; // course not Course, Strange

module.exports = {
    courseContent:async (req,res)=>{
        res.redirect('search',{data:{user:req.session.user}})
    },
    courseContentByName:async (req,res)=>{
        if(!req.session.authenticated ) res.redirect("/login")
        const data = await coursesCollection.findOne({name: req.params.name})
        let iconUse = ''
        const course = new Course(data.name,data.description,data.Author,data.tags,data.paidContent,data.review,data.content);
        if(!data)
            return res.send('sorry this course not found')
        res.render('courseContent',{data:course})
        
        // res.render('courseContent')
    },
    courseContentByNameAndCatogray:async (req,res)=>{
        if(!req.session.authenticated ) res.redirect("/login")
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