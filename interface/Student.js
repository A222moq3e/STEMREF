const User = require('./User');
class Student extends User{
    constructor(name,email,subscribe,reviewed,img){
        super(name,email,true,'student',img)
        if(subscribe)
        this.subscribe = subscribe;
        else
        this.subscribe = false
        if(reviewed)
        this.reviewed = reviewed
        else  this.reviewed=[]
    }

    searchCourse(){
        // some functions
    }
}
module.exports = Student;