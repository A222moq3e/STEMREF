const User = require('./User');
class Educator extends User{
    constructor(name,email){
        super(name,email,true,'educator','avatar8.svg',["Home","Insert Course", "Dashboard Educator"])
    }
    addCourse(){
        // some function
    }
    updateCourse(){
        // some function
    }
    
}
module.exports = Educator;