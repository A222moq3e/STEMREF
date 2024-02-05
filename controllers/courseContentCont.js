// const Pages = require('../models/config');
const { usersCollection, coursesCollection } = require('../models/config');
const  Course  = require('../interface/Course.js');// course not Course, Strange
// const  Student  = require('../interface/Student.js');
console.log('process.env.TEST courseContentCont');
console.log(process.env.TEST);
let iconUse = {
    "Videos":"fa-solid fa-circle-play",
    "Articles":"fa-regular fa-newspaper",
    "Quizzes":"fa-solid fa-spell-check",
    "Assignments":"fa-solid fa-pencil",
    "Others":"fa-solid fa-arrow-up-right-from-square",
    "share":"fa-solid fa-share"
}
module.exports = {
    courseContent:async (req,res)=>{
        return res.redirect('search',{data:{user:req.session.user}})
    },
    courseContentByName:async (req,res)=>{
       try{
            if(req.session.user && !req.session.user.authenticated ) res.redirect("/login")
            const data = await coursesCollection.findOne({name: req.params.name})
            const course = new Course(data.name,data.description,data.Author,data.tags,data.paidContent,data.review,data.Content);
            // const user = new Student(req.session.user.name,req.session.user.email);
            // const user = new 
            if(!data) return res.send('sorry this course not found')
            res.render('courseContent',{data:{course:course,user:req.session.user,icons:iconUse,catograySearch:''}})
       }catch(e){
            console.log(e);
       }
        
        // res.render('courseContent')
    },
    courseContentByNameAndCatogray:async (req,res)=>{
        try{
            if(req.session.user && !req.session.user.authenticated) res.redirect("/login")
        const data = await coursesCollection.findOne({name: req.params.name})
        const course = new Course(data.name,data.description,data.Author,data.tags,data.paidContent,data.review,data.Content);
        // course.removeContent();
        // console.log(req.params.catogray);
        let catogray = req.params.catogray;
        // console.log(data.Content[catogray]);
        let urls = data.Content[catogray]
        let urls_filterd = urls.filter((url)=>{
            return url.name != "" ;
        })
        urls = urls_filterd
        // console.log('urls:',urls_filterd);
        // console.log(Array.isArray(urls));
        // console.log(course.content);
        if(!data)
            res.send('sorry this course not found')
        else{
            res.render('courseContent',{data:{name:req.params.name, course:course, content:urls, catograySearch:catogray,icons:iconUse,user:req.session.user}})
            // res.render('courseContent',{data:{course:course,user:req.session.user}})
        }
        // res.render('courseContent')
        }catch(e){
            console.log(e);
        }
    },
    courseContentRate:async (req,res)=>{
        try{
            if(req.session.user && !req.session.user.authenticated) res.redirect("/login")
            let stars = req.body.starsNum;
            let courseName = req.params.name;
            let username = req.session.user.name;
            let courseData = await coursesCollection.findOne({name:courseName})
            let userData = await usersCollection.findOne({name:username})
            courseData.reviews = courseData.reviews?courseData.reviews:{};
            
            userData.reviewed = userData.reviewed?userData.reviewed:{};
            

            courseData.reviews[username]=stars;
            userData.reviewed[courseName] =stars
                
            
            let courseDelete = await coursesCollection.findOneAndRemove({name:courseName})
            let courseInserted = await coursesCollection.insertMany(courseData)
            let userDelete = await usersCollection.findOneAndRemove({name:username})
            let userInserted = await usersCollection.insertMany(userData)
            // let updateByReview = await  usersCollection.findOneAndUpdate({name:username},userData.reviewed)

            // console.log({review:previousReviews});


 
            // let updateByReview = await  coursesCollection.updateOne({name:courseName},{review:previousReviews})

            // console.log(updateByReview);
            return true
        }catch(e){
            console.log(e);
        }
    }

}