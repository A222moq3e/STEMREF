// const Pages = require('../models/config');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const argon2 = require("argon2");
// const cryptoRandomString = require('crypto-random-string');
const { usersCollection, coursesCollection } = require("../models/config");

module.exports = {
  forgetGet: (req, res) => {
    return res.render("forget", { data: { ok: false } });
  },
  forgetPost: async (req, res) => {
    const { email } = req.body;
    const baseUrl = (() => {
      const proto = req.get("x-forwarded-proto") || req.protocol;
      const host = req.get("host") || req.headers.host;
      if (host) return `${proto}://${host}`;
      return process.env.BASE_URL || "http://127.0.0.1:3443";
    })();
    const resetToken = crypto.randomBytes(20).toString("hex");
    const tokenExpires = Date.now() + 3600000; // 1 hour
    const user = await usersCollection.findOne({ email });
    if (user) {
      await usersCollection.findOneAndUpdate(
        { email },
        { $set: { token: resetToken, tokenExpires } },
      );
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL || "stemref@gmail.com",
          pass: process.env.MY_EMAIL_PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL || "stemref@gmail.com",
        to: email,
        subject: "Password Reset",
        text: `Click to reset your password: ${baseUrl}/reset-password/${resetToken}`,
      };
      try {
        await transporter.sendMail(mailOptions);
      } catch (err) {
        console.error("Email error:", err);
      }
    }
    return res.render("forget", { data: { ok: true } });
  },
  resetPasswordGet: async (req, res) => {
    const { token } = req.params;
    const user = await usersCollection.findOne({
      token,
      tokenExpires: { $gt: Date.now() },
    });
    if (!user) return res.send("Password reset link is invalid or has expired");
    res.render("reset-password-form", { token });
  },
  resetPasswordPost: async (req, res) => {
    const { token } = req.params;
    const { newPassword, newPasswordRepeat } = req.body;
    if (newPassword !== newPasswordRepeat) {
      return res.send("Passwords do not match");
    }
    const user = await usersCollection.findOne({
      token,
      tokenExpires: { $gt: Date.now() },
    });
    if (!user) return res.send("Password reset link is invalid or has expired");
    const hashed = await argon2.hash(newPassword);
    await usersCollection.findOneAndUpdate(
      { token },
      { $set: { password: hashed }, $unset: { token: "", tokenExpires: "" } },
    );
    res.send("Password has been reset successfully");
  },
};
