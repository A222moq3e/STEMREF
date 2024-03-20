const User = require('./User');
class Admin extends User{
    constructor(name,email,img){
        super(name,email,true,'admin')
    }
    addUser(){
        // some function
    }
    removeUser(){
        // some function
    }

}
module.exports =  Admin;