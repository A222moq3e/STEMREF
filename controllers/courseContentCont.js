// const Pages = require('../models/config');
const { usersCollection, coursesCollection } = require('../models/config');
const  Course  = require('../models/classes/Course.js');// course not Course, Strange
// const  Student  = require('../interface/Student.js');
console.log('process.env.TEST courseContentCont');
console.log(process.env.TEST);
const iconUse = {
    "Videos":"fa-solid fa-circle-play",
    "Articles":"fa-regular fa-newspaper",
    "Quizzes":"fa-solid fa-spell-check",
    "Assignments":"fa-solid fa-pencil",
    "Others":"fa-solid fa-arrow-up-right-from-square",
    "share":"fa-solid fa-share"
}
const bgIconUse = {
    "Videos":"undraw_video_files_fu10.svg",
    "Articles":"undraw_online_articles_re_yrkj.svg",
    "Quizzes":"undraw_online_test_re_kyfx.svg",
    "Assignments":"undraw_task_re_wi3v.svg",
    "Others":"undraw_task_re_wi3v.svg",
    "share":"fa-solid fa-share",
    "normal":"undraw_mathematics_-4-otb.svg"
}
module.exports = {
    courseContent: async (req, res) => {
        // Redirect to search with session user context
        return res.redirect('/search');
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
            res.render('courseContent',{data:{course:course,user:req.session.user,icons:iconUse,bgIconUse:bgIconUse,catograySearch:'',avg:avg, color:getReviewColor(avg)}})
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
            res.render('courseContent',{data:{name:req.params.name, course:course, content:urls, catograySearch:catogray,icons:iconUse,bgIconUse:bgIconUse,user:req.session.user,avg:avg, color:getReviewColor(avg)}})
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
            const stars = Number(req.body.starsNum);
            const courseName = req.params.name;
            const username = req.session.user.name;
            // Update course reviews
            const course = await coursesCollection.findOne({ name: courseName });
            course.reviews = course.reviews || {};
            course.reviews[username] = stars;
            await coursesCollection.updateOne({ name: courseName }, { $set: { reviews: course.reviews } });
            // Update user reviewed list
            const user = await usersCollection.findOne({ name: username });
            user.reviewed = user.reviewed || {};
            user.reviewed[courseName] = stars;
            await usersCollection.updateOne({ name: username }, { $set: { reviewed: user.reviewed } });
            return res.status(200).json({ success: true, average: Object.values(course.reviews).reduce((a,b)=>a+Number(b),0) / Object.keys(course.reviews).length });
        }catch(e){
            console.log(e);
            return res.status(500).json({ error: 'Unable to rate course' });
        }
    }

}

function getReviewColor(avg){
    let color = "";
    if(avg>=4 && avg <= 5){
        color = "five";
    }else if(avg >= 3 && avg <4){
        color = "four";
    }else if(avg >= 2 && avg <3){
        color = "three";
    }else{
        color = "two";
    }
    return color
}