class Student extends User{
    constructor(name,email,paidUser){
        super(name,email,true,'student')
        this.paidUser = paidUser;
    }
    resetPassword(){
        // some functions
    }
    searchCourse(){
        // some functions
    }
}
module.exports = Student;