class User{
    constructor(name,email,authentication,userType){
        this.name= name;
        this.authentication = authentication;
        this.userType = userType;
    }
    verfiyLogin(){
        //some function
    }
    getName() {
        return this.name;
    }

    getAuthentication() {
        return this.authentication;
    }

    getUserType() {
        return this.userType;
    }

    getUserData(){
        return {
            name:  getName(),
            authentication: getAuthentication(),
            userType: getUserType()
        }
    }
}