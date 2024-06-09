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
let bgIconUse = {
    "Videos":"undraw_video_files_fu10.svg",
    "Articles":"undraw_online_articles_re_yrkj.svg",
    "Quizzes":"undraw_online_test_re_kyfx.svg",
    "Assignments":"undraw_task_re_wi3v.svg",
    "Others":"undraw_task_re_wi3v.svg",
    "share":"fa-solid fa-share",
    "normal":"undraw_mathematics_-4-otb.svg"
}
module.exports = {
    courseContent:async (req,res)=>{
        return res.redirect('search',{data:{user:req.session.user}})
    },
    courseContentByName:async (req,res)=>{
        console.log('in courseContentByName');
       try{
            // if(req.session.user && !req.session.user.authenticated ) res.redirect("/login")
            const data = await coursesCollection.findOne({name: req.params.name})
            const course = new Course(data.name,data.description,data.Author,data.tags,data.paidContent,data.reviews,data.Content);
            let reviews = course.reviews
            // console.log(course);
            let sum=0
            let avg=0
            if(reviews){
                console.log('in reviews');
                for(let r of Object.keys(reviews)){
                    sum+= parseInt(reviews[r])
                    console.log(sum);
                }
                avg = (sum/Object.keys(reviews).length).toPrecision(2);
            }
            // const user = new Student(req.session.user.name,req.session.user.email);
            // const user = new 
            if(!data) return res.send('sorry this course not found')
            res.render('courseContent',{data:{course:course,user:req.session.user,icons:iconUse,bgIconUse:bgIconUse,catograySearch:'',avg:avg}})
       }catch(e){
            console.log(e);
       }
        
        // res.render('courseContent')
    },
    courseContentByNameAndCatogray:async (req,res)=>{
        console.log('in courseContentByNameAndCatogray');
        try{
            // if(req.session.user && !req.session.user.authenticated) res.redirect("/login")
        const data = await coursesCollection.findOne({name: req.params.name})
        const course = new Course(data.name,data.description,data.Author,data.tags,data.paidContent,data.reviews,data.Content);
        // course.removeContent();
        // console.log(req.params.catogray);
        let catogray = req.params.catogray;
        let reviews = course.reviews
        let sum=0
        let avg=0
        if(reviews){
            for(let r of Object.keys(reviews)){
                sum+= parseInt(reviews[r])
                console.log(sum);
            }
            avg = Math.round(sum/Object.keys(reviews).length,2)
        }
        
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
            res.render('courseContent',{data:{name:req.params.name, course:course, content:urls, catograySearch:catogray,icons:iconUse,bgIconUse:bgIconUse,user:req.session.user,avg:avg}})
            // res.render('courseContent',{data:{course:course,user:req.session.user}})
        }
        // res.render('courseContent')
        }catch(e){
            console.log(e);
        }
    },
    courseContentRate:async (req,res)=>{
    console.log('in courseContentRate');
        try{
            // if(req.session.user && !req.session.user.authenticated) res.redirect("/login")
            let stars = req.body.starsNum;
            let courseName = req.params.name;
            let username = req.session.user.name;
            let courseData = await coursesCollection.findOne({name:courseName})
            let userData = await usersCollection.findOne({name:username})
            courseData.reviews = courseData.reviews?courseData.reviews:{};
            
            userData.reviewed = userData.reviewed?userData.reviewed:{};
            

            courseData.reviews[username]=stars;
            userData.reviewed[courseName] =stars
            console.log(courseData);
            
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