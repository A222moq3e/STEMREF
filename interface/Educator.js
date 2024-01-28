const User = require('./user');
class Educator extends User{
    constructor(name,email){
        super(name,email,true,'educator','avatar8.svg')
    }
    addCourse(){
        // some function
    }
    updateCourse(){
        // some function
    }
    
}
module.exports = Educator;