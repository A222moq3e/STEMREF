# STEMREF
# ![logo](https://github.com/A222moq3e/STEMREF/blob/main/public/assets/imgs/logo-min.svg)

# Technologies
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Introduction
Stemref is the worlds largest library of information for Computer Science Content Made by the Students of Imam Mohammad Ibn Saud University,
online website (https://stemref.askardesign.com/)
## Security 
We have developed a secure way to access this content by keeping our database server and host server in differint geological location and by having the database server only accept packets from the host server 

## Install and Run

Either Run the Docker compose file using 

```sh
docker compose up
```

or you can try
### To Install this Repository
 just run this command to clone it
```bash
git clone https://username@github.com/A222moq3e/STEMREF.git
```
### and then install the NPM Packages
Using the Package File use the Command
```bash
pnpm i
```

### Don't Forget to Set your ENV variable 
```env
SECRET_SESSION = 'Session Secret'
PORT=5000
BASE_URL=""

MY_EMAIL_PASSWORD="XXX"
GOOGLE_CLIENT_ID="XXX-XXXX.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="XXX-XXX-X"
GOOGLE_OAUTH_REDIRECT_URL="https://domatin name/forget"
# MongoDB Url
MONGODB_CLUSTER = "mongodb+srv://Mongo Url"
```
### Lastly Run the Code Using this Command

```sh
pnpm run dev
```

