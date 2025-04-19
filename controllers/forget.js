// const Pages = require('../models/config');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// const cryptoRandomString = require('crypto-random-string');
const { usersCollection, coursesCollection } = require('../models/config');

module.exports = {
    forgetGet: (req,res)=>{
        return res.render('forget',{data:{ok:false}})
    },
    forgetPost: async(req,res)=>{
        const { email } = req.body;
        const myEmail  ='stemref@gmail.com'
        const myEmailPassword =  process.env.MY_EMAIL_PASSWORD
        const url = 'https://127.0.0.1:3443'
        const resetToken = crypto.randomBytes(20).toString('hex');
        const user = await usersCollection.findOne({name:'test'});
        console.log({token:resetToken});
        console.log(resetToken);
        if(!user) return res.send('wrong email');
        const userAU = await usersCollection.findOneAndUpdate({email:user.email},{token:resetToken});
        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            auth: {
                user: myEmail,
                pass: myEmailPassword,
            },
        });
        try {
            const mailOptions = {
              from: myEmail,
              to: email,
              subject: 'Password Reset',
              text: `Click on the following link to reset your password: http://${url}/reset-password/${resetToken}`,
            };
        
            await transporter.sendMail(mailOptions);
            console.log('Password reset email sent');
            return res.render('forget',{data:{ok:true}})
          } catch (error) {
            console.error('Error sending password reset email:', error);
            return res.render('forget',{data:{ok:false}})
          }
      
    },  
    resetPasswordGet:async(req, res) => {
        const { token } = req.params;
        console.log('token');
        // console.log( req);
        console.log( req.params);
        console.log(token);
        const user = await usersCollection.findOne({token:token});
        console.log('user is');
        console.log(user);
        if(!user) return res.send('wrong token');
        
        res.render('reset-password-form', { token }); 
    },
    resetPasswordPost:async(req, res) => {
        const { token } = req.params;
        const { newPassword, newPasswordRepeat  } = req.body;
        const user = await usersCollection.find({token:token});
        if(!user) return res.send('wrong token');
        // Validate the new password
        if(newPassword!=newPasswordRepeat )res.send('password not matched')
        user.password = createHash(newPassword)
        // Update the user's password in MongoDB using the token
        
        const userAU =  await usersCollection.findOneAndUpdate({token:token},{password: user.password, token:''});
      
      
        res.send('change password success'); 
    }
      
}


function createHash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}