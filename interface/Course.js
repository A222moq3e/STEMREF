class Course{

    constructor(name, description, Author, tags, paidContent,review, content){
            this.name=name;
            this.description=description;
            this.Author=Author;
            this.tags=tags;
            this.paidContent=paidContent;
            this.review = review
            this.content=content;
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