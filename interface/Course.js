class Course{

    constructor(name, description, Author, tags, paidContent,reviews, content){
        // TODO: add course create date
            this.name=name;
            this.description=description;
            this.Author=Author;
            this.tags=tags;
            this.paidContent=paidContent;
            this.reviews = reviews
            this.content=content;
            this.filterEmptyUrls()
    }
    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getAuthor() {
        return this.Author;
    }

    getTags() {
        return this.tags;
    }
    getTagsNumber(){
        return this.tags.length;
    }

    getPaidContent() {
        return this.paidContent;
    }

    getContent() {
        return this.content;
    }
    getReview(){
        return this.review;
    }
    removeContent(){
        this.content = '';
    }
    filterEmptyUrls(){
        let keys = Object.keys(this.content)
        for(let catogray of keys){
            this.content[catogray] = this.content[catogray].filter((url)=>{
                return url.name != "" ;
            })
        }
        
    }

    getCourseContent(){
        return {
            name:getName(),
            description:getDescription(),
            Author:getAuthor(),
            tags:getTags(),
            paidContent: getPaidContent(),
            Content:getContent()
        }
    }
}

module.exports = Course;