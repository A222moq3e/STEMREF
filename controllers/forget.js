// const Pages = require('../models/config');
// const { usersCollection, coursesCollection } = require('../models/config');
const nodemailer = require('nodemailer');

module.exports = {
    forgetGet: (req,res)=>{
        return res.render('forget',{data:{ok:false}})
    },
    forgetPost: async(req,res)=>{
        const { email } = req.body;
        const myEmail  ='stemref@gmail.com'
        const myEmailPassword =  process.env.MY_EMAIL_PASSWORD
        const url = 'https://127.0.0.1:3443/'
        const resetToken = 'some token'
        const googleClientid = process.env.GOOGLE_CLIENT_ID
        const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET 
        const googleOauthRedirectUrl = process.env.GOOGLE_OAUTH_REDIRECT_URL


        // Create a Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: myEmail,
            pass: myEmailPassword,
            },
        });
        console.log('transporter',transporter);
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
    resetPasswordGet:(req, res) => {
        const { token } = req.params;
      
        // Validate the token and check if it's still valid
      
        res.render('reset-password-form', { token }); // Render the password reset form template
    },
    resetPasswordPost:(req, res) => {
        const { token } = req.params;
        const { newPassword } = req.body;
      
        // Validate the new password
      
        // Update the user's password in MongoDB using the token
      
        res.redirect('/reset-password-success'); // Redirect to a success page
    }
      
}