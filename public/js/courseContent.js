let nameCourse = document.querySelector('.top-text h1').innerText;
let stars = document.querySelectorAll('.stars input');
let reviewComment = document.getElementById('review-comment');

for(let star of stars){
    star.addEventListener('change',()=>{
        let num = star.getAttribute('data-num-star');
        send_stars(num);
    });
}

async function send_stars(num){
    const reviewText = reviewComment ? reviewComment.value.trim() : '';
    
    const response = await fetch('/courseContent/'+nameCourse+'/stars',{
        method:'POST', 
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            starsNum: num,
            reviewText: reviewText
        })
    });
    
    if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        return false;
    }
    
    const data = await response.json();
    
    // Show success message
    Swal.fire({
        icon: 'success',
        title: 'Thank You!',
        text: 'Your review has been submitted successfully.',
        timer: 2000,
        showConfirmButton: false
    }).then(() => {
        // Hide the review form
        document.querySelector('.stars').classList.add('hide');
        // Refresh the page to show the updated review
        location.reload();
    });
    
    return data;
}

document.querySelector('.review-btn').addEventListener('click',(e)=>{
    e.target.classList.toggle('active');
    document.querySelector('.stars').classList.toggle('hide');
    // Hide reviews list when opening review form
    document.querySelector('.reviewsContainer').classList.add('hide');
});

document.querySelector('.discussion-btn').addEventListener('click',(e)=>{
    e.target.classList.toggle('active');
    document.querySelector('.discussionBox').classList.toggle('hide');
    // Hide reviews when opening discussion
    document.querySelector('.reviewsContainer').classList.add('hide');
});

// New button to show reviews
const showReviewsBtn = document.querySelector('.show-reviews-btn');
if (showReviewsBtn) {
    showReviewsBtn.addEventListener('click',(e)=>{
        e.target.classList.toggle('active');
        document.querySelector('.reviewsContainer').classList.toggle('hide');
        // Hide other panels
        document.querySelector('.stars').classList.add('hide');
        document.querySelector('.discussionBox').classList.add('hide');
    });
}