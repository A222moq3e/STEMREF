// const Pages = require('../models/config');
const { usersCollection, coursesCollection } = require('../models/config');

module.exports = {
    courseContent:async (req,res)=>{
        res.redirect('search',{data:{user:req.session.user}})
    },
    courseContentByName:async (req,res)=>{
        if(!req.session.authenticated ) res.redirect("/login")
        const data = await coursesCollection.findOne({name: req.params.name})
        if(!data)
            res.send('sorry this course not found')
        else{
            res.render('courseContent',{data:{name:req.params.name, desc:data.description, content:data.Content,icons:iconUse,user:req.session.user}})
        }
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