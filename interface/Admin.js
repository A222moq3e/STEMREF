const User = require('./User');
class Admin extends User{
    constructor(name,email){
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