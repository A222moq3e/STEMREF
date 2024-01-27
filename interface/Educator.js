const User = require('./user');
class Educator extends User{
    constructor(name,email){
        super(name,email,true,'educator')
    }
    addCourse(){
        // some function
    }
    updateCourse(){
        // some function
    }
    
}
module.exports = Educator;