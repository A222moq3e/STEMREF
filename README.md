# STEMREF
# ![logo](https://github.com/A222moq3e/STEMREF/blob/main/public/assets/imgs/logo-min.svg)
## Introduction
Stemref is the worlds largest library of information for Computer Science Content Made by the Students of Imam Mohammad Ibn Saud University,
online website (https://stemref.askardesign.com/)
## Security 
We have developed a secure way to access this content by keeping our database server and host server in differint geological location and by having the database server only accept packets from the host server 

## Install and Run
### To Install this Repository
 just run this command to clone it
```bash
git clone https://username@github.com/A222moq3e/STEMREF.git
```
### and then install the NPM Packages
Using the Package File use the Command
```bash
npm i
```

### Don't Forget to Set your ENV variable 
```env
SECRET_SESSION = 'Session Secret'
# HTTPS Keys
KEYPATH ="~/privkey.pem"
CERTPATH ="~/fullchain.pem"
# Ports
HTTPS_PORT="443"
HTTP_PORT="80"
HOST = "0.0.0.0"
# Google User Credintials
MY_EMAIL_PASSWORD="XXX"
GOOGLE_CLIENT_ID="XXX-XXXX.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="XXX-XXX-X"
GOOGLE_OAUTH_REDIRECT_URL="https://domatin name/forget"
# MongoDB Url
MONGODB_CLUSTER = "mongodb+srv://Mongo Url"
```
### Lastly Run the Code Using this Command
```bash
node ./js/index.js
```
OR if you are using port 80 or 443
```bash
sudo node ./js/index.js
```
