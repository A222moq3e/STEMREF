class User{
    constructor(name,email,authenticated,userType,img){
        this.name= name;
        if(email) this.email = email;
        else this.email = 'no email'
        this.authenticated = authenticated;
        this.userType = userType;
        this.setImage(img)
    }
    verfiyLogin(){
        //some function
    }
    resetPassword(){
        // some functions
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
    setImage(img){
        if(img)this.img = img
        else this.img = 'avatar3.svg'
    }
    // setUserType(userType){
    //     if(userType)this.userType = userType
    //     else this.userType = userType
    // }
    getUserData(){
        return {
            name:  getName(),
            authentication: getAuthentication(),
            userType: getUserType()
        }
    }
}
module.exports= User;