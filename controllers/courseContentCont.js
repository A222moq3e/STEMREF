// const Pages = require('../models/config');
const { usersCollection, coursesCollection, reviewsCollection } = require('../models/config');
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
            const courseDoc = await coursesCollection
                .findOne({ name: req.params.name })
                .populate('Author', 'name');
            const course = new Course(
                courseDoc.name,
                courseDoc.description,
                courseDoc.Author.name,
                courseDoc.tags,
                courseDoc.paidContent,
                courseDoc.reviews,
                courseDoc.Content,
                courseDoc.createdAt
            );
            // Load all reviews for this course
            const reviewDocs = await reviewsCollection.find({ course: courseDoc._id }).populate('user','name').lean();
            const ratings = reviewDocs.map(r => r.rating);
            const avg = ratings.length ? (ratings.reduce((a,b)=>(a+b),0)/ratings.length).toPrecision(2) : 0;
            
            if(!courseDoc) return res.send('sorry this course not found')
            res.render('courseContent',{data:{
                course: course,
                user: req.session.user,
                icons: iconUse,
                bgIconUse: bgIconUse,
                CategorySearch: '',
                avg: avg,
                color: getReviewColor(avg),
                reviews: reviewDocs,
                createdAt: courseDoc.createdAt,
                updatedAt: courseDoc.updatedAt
            }})
       }catch(e){
            console.log(e);
       }
        
        // res.render('courseContent')
    },
    courseContentByNameAndCategory:async (req,res)=>{
        console.log('in courseContentByNameAndCategory');
        try{
            // if(req.session.user && !req.session.user.authenticated) res.redirect("/login")
            const courseDoc = await coursesCollection
                .findOne({ name: req.params.name })
                .populate('Author', 'name');
            const course = new Course(
                courseDoc.name,
                courseDoc.description,
                courseDoc.Author.name,
                courseDoc.tags,
                courseDoc.paidContent,
                courseDoc.reviews,
                courseDoc.Content,
                courseDoc.createdAt
            );
            let Category = req.params.Category;

            // Load all reviews for this course
            const reviewDocs = await reviewsCollection.find({ course: courseDoc._id }).populate('user','name').lean();
            const ratings = reviewDocs.map(r => r.rating);
            const avg = ratings.length ? (ratings.reduce((a,b)=>(a+b),0)/ratings.length).toPrecision(2) : 0;

            // console.log(courseDoc.Content[Category]);
            let urls = courseDoc.Content[Category]
            let urls_filterd = urls.filter((url)=>{
                return url.name != "" ;
            })
            urls = urls_filterd

            if(!courseDoc)
                res.send('sorry this course not found')
            else{
                res.render('courseContent',{data:{
                    name: req.params.name,
                    course: course,
                    content: urls,
                    CategorySearch: Category,
                    icons: iconUse,
                    bgIconUse: bgIconUse,
                    user: req.session.user,
                    avg: avg,
                    color: getReviewColor(avg),
                    reviews: reviewDocs,
                    createdAt: courseDoc.createdAt,
                    updatedAt: courseDoc.updatedAt
                }})
            }
        }catch(e){
            console.log(e);
        }
    },
    courseContentRate:async (req,res)=>{
        console.log('in courseContentRate');
        try{
            const stars = Number(req.body.starsNum);
            const reviewText = req.body.reviewText || ''; // Get optional review text
            const course = await coursesCollection.findOne({ name: req.params.name });
            const user = await usersCollection.findOne({ name: req.session.user.name });
            
            // Upsert review in its own collection with optional text
            await reviewsCollection.updateOne(
                { course: course._id, user: user._id },
                { $set: { 
                    rating: stars,
                    text: reviewText
                }},
                { upsert: true }
            );
            
            // Recompute average
            const all = await reviewsCollection.find({ course: course._id });
            const avgVal = all.length
                ? (all.reduce((sum,r)=> sum + r.rating, 0) / all.length).toPrecision(2)
                : 0;
            return res.status(200).json({ success: true, average: avgVal });
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