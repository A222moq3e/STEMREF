const User = require('./User');
class Student extends User{
    constructor(name,email,subscribe,img){
        super(name,email,true,'student',img)
        if(subscribe)
        this.subscribe = subscribe;
        else
        this.subscribe = false
    }

    searchCourse(){
        // some functions
    }
}
module.exports = Student;