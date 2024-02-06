let nameCourse = document.querySelector('.top-text h1').innerText;
let stars = document.querySelectorAll('.stars input');
// let i =0 
for(let star of stars){
    star.addEventListener('change',()=>{
        let num = star.getAttribute('data-num-star')
        send_stars(num)
    })
    // console.log(star);
    // if(star.checked){
    //     console.log('star checked is', star);
    // }
    // i++;
}
async function send_stars(num){
    const response = fetch('/courseContent/'+nameCourse+'/stars',{
        method:'POST', 
        headers:{
            'Content-Type': 'application/json', // Set the content type of the request
        },
        body:JSON.stringify({starsNum:num})
    })
    if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        console.log(message);
        return false
    }
    const data = await response.json(); // Get the data from the response
    return data;
}