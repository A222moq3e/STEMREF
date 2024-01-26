class Student extends User{
    constructor(name,email,paidUser){
        super(name,email,true,'student')
        this.paidUser = paidUser;
    }

    searchCourse(){
        // some functions
    }
}
module.exports = Student;