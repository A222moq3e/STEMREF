class Course{

    constructor(name, description, Author, tags, paidContent, reviews, content, date){
        // TODO: add course create date
        // TODO: GUT ALL THIS SHIT OUT , JUST BE FUNCTIONAL BROOOOOOO
            this.name=name;
            this.description=description;
            this.Author=Author;
            this.tags=tags;
            this.paidContent=paidContent;
            this.reviews = reviews
            this.content=content;
            this.filterEmptyUrls()
            this.date = date?date:new Date(2024,5,4);
            // removed inserter field
            
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
        for(let Category of keys){
            this.content[Category] = this.content[Category].filter((url)=>{
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
    showDate(){
        // return this.date
        return this.date.getFullYear()+'-'+String(this.date.getMonth() + 1).padStart(2, '0')+'-'+String(this.date.getDate()).padStart(2, '0');;
    }
}

module.exports = Course;