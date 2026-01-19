/**
 * Course Content Page JavaScript
 * Handles all interactive elements including ratings, reviews, and discussions
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const courseName = document.querySelector('.course-title h1').innerText;
  const reviewTextArea = document.getElementById('review-comment');
  
  // Setup rating stars
  setupStarRating();
  
  // Panel elements
  const reviewsPanel = document.querySelector('.reviews-panel');
  const addReviewPanel = document.querySelector('.add-review-panel');
  const discussionPanel = document.querySelector('.discussion-panel');
  
  // Button elements
  const reviewBtn = document.querySelector('.review-btn');
  const showReviewsBtn = document.querySelector('.show-reviews-btn');
  const discussionBtn = document.querySelector('.discussion-btn');
  const submitReviewBtn = document.querySelector('.submit-review-btn');
  const closeReviewsBtn = document.querySelector('.close-reviews-btn');
  const closeAddReviewBtn = document.querySelector('.close-add-review-btn');
  const closeDiscussionBtn = document.querySelector('.close-discussion-btn');
  
  /**
   * Sets up the star rating system with proper interactions
   * This function now correctly handles the existing star rating from HTML
   */
  function setupStarRating() {
    // Find rating panel and existing star rating
    const container = document.querySelector('.add-review-panel');
    if (!container) return;
    
    const starRating = container.querySelector('.star-rating');
    if (!starRating) return;
    
    // Create the feedback element
    const feedbackEl = document.createElement('div');
    feedbackEl.className = 'rating-feedback';
    starRating.after(feedbackEl);
    
    // Rating feedback messages
    const ratingMessages = {
      '5': 'Excellent! This content is outstanding!',
      '4': 'Very good! This content is quite helpful.',
      '3': 'Good. Content meets expectations.',
      '2': 'Fair. Content needs some improvement.',
      '1': 'Poor. Content needs significant improvement.'
    };
    
    // Add event listeners to existing star inputs
    const starInputs = starRating.querySelectorAll('input[type="radio"]');
    starInputs.forEach(input => {
      input.addEventListener('change', function() {
        // Display feedback message
        feedbackEl.textContent = ratingMessages[this.value];
        feedbackEl.classList.add('visible');
        
        // Add animation effect to the clicked star
        const label = this.nextElementSibling;
        label.classList.add('pulse-animation');
        setTimeout(() => {
          label.classList.remove('pulse-animation');
        }, 500);
      });
    });
  }
  
  // Add event listener to submit review button
  if (submitReviewBtn) {
    submitReviewBtn.addEventListener('click', submitReview);
  }
  
  // Panel toggle buttons
  if (reviewBtn) {
    reviewBtn.addEventListener('click', function() {
      togglePanel(addReviewPanel);
      reviewBtn.classList.toggle('active');
      
      // Hide other panels
      hidePanel(reviewsPanel);
      hidePanel(discussionPanel);
      showReviewsBtn.classList.remove('active');
      discussionBtn.classList.remove('active');
    });
  }
  
  if (showReviewsBtn) {
    showReviewsBtn.addEventListener('click', function() {
      togglePanel(reviewsPanel);
      showReviewsBtn.classList.toggle('active');
      
      // Hide other panels
      hidePanel(addReviewPanel);
      hidePanel(discussionPanel);
      reviewBtn.classList.remove('active');
      discussionBtn.classList.remove('active');
    });
  }
  
  if (discussionBtn) {
    discussionBtn.addEventListener('click', function() {
      togglePanel(discussionPanel);
      discussionBtn.classList.toggle('active');
      
      // Hide other panels
      hidePanel(reviewsPanel);
      hidePanel(addReviewPanel);
      showReviewsBtn.classList.remove('active');
      reviewBtn.classList.remove('active');
    });
  }
  
  // Close button event listeners
  if (closeReviewsBtn) {
    closeReviewsBtn.addEventListener('click', function() {
      hidePanel(reviewsPanel);
      showReviewsBtn.classList.remove('active');
    });
  }
  
  if (closeAddReviewBtn) {
    closeAddReviewBtn.addEventListener('click', function() {
      hidePanel(addReviewPanel);
      reviewBtn.classList.remove('active');
    });
  }
  
  if (closeDiscussionBtn) {
    closeDiscussionBtn.addEventListener('click', function() {
      hidePanel(discussionPanel);
      discussionBtn.classList.remove('active');
    });
  }
  
  // YouTube video embedding: setup embed player for video links
  const category = document.body.dataset.category;
  if (category === 'Videos') {
    const allLinks = document.querySelectorAll('.content-item');
    console.log('All content-item links count:', allLinks.length);
    const videoLinks = Array.from(allLinks).filter(link => /youtube\.com|youtu\.be/.test(link.href));
    console.log('Filtered video links count:', videoLinks.length, videoLinks);
    // On click, prevent default and embed selected video
    videoLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        embedVideo(this.href);
      });
    });
  }

  function embedVideo(videoUrl) {
    try {
      const urlObj = new URL(videoUrl);
      let videoId = urlObj.hostname.includes('youtu.be') ? urlObj.pathname.slice(1) : urlObj.searchParams.get('v');
      const params = new URLSearchParams();
      if (urlObj.searchParams.get('list')) params.set('list', urlObj.searchParams.get('list'));
      if (urlObj.searchParams.get('index')) params.set('index', urlObj.searchParams.get('index'));
      const embedSrc = `https://www.youtube.com/embed/${videoId}${params.toString() ? `?${params.toString()}` : ''}`;
      const headerSection = document.querySelector('.course-header');
      if (headerSection && videoId) {
        // Keep the back button intact
        const backBtnEl = headerSection.querySelector('.course-header__back');
        const backBtnHTML = backBtnEl ? backBtnEl.outerHTML : '';
        // Replace header content with back button and embedded player
        headerSection.innerHTML = backBtnHTML + 
          `<div class="video-embed-container">` +
            `<iframe width="100%" height="400" src="${embedSrc}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` +
          `</div>`;
        // Trigger transition after insertion
        const videoContainer = headerSection.querySelector('.video-embed-container');
        if (videoContainer) {
          // Delay to ensure initial styles applied
          setTimeout(() => videoContainer.classList.add('loaded'), 20);
        }
      }
    } catch (e) {
      console.error('Invalid video URL', e);
    }
  }
  
  /**
   * Submit a review for the current course
   */
  async function submitReview() {
    // Find the selected rating
    const selectedRating = document.querySelector('.star-rating input:checked');
    
    if (!selectedRating) {
      Swal.fire({
        icon: 'error',
        title: 'Rating Required',
        text: 'Please select a star rating before submitting',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }
    
    // Update submit button to show loading state
    submitReviewBtn.disabled = true;
    submitReviewBtn.innerHTML = '<span class="spinner">⏳</span> Submitting...';
    
    const starsNum = selectedRating.value;
    const reviewText = reviewTextArea ? reviewTextArea.value.trim() : '';
    
    try {
      const response = await fetch(`/courseContent/${courseName}/stars`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          starsNum: starsNum,
          reviewText: reviewText
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Show success message with star animation
      Swal.fire({
        icon: 'success',
        title: 'Thank You!',
        html: `<div class="rating-success-animation">
                 <span class="star-animate">★</span>
                 <span class="star-animate-delay-1">★</span>
                 <span class="star-animate-delay-2">★</span>
               </div>
               <p>Your ${starsNum}-star review has been submitted</p>`,
        timer: 2500,
        showConfirmButton: false
      }).then(() => {
        // Refresh the page to show the updated review
        location.reload();
      });
      
      return data;
    } catch (error) {
      console.error('Error submitting review:', error);
      Swal.fire({
        icon: 'error',
        title: 'Something went wrong',
        text: 'Please try submitting your review again later.',
        timer: 3000,
        showConfirmButton: false
      });
      // Reset submit button
      submitReviewBtn.disabled = false;
      submitReviewBtn.innerHTML = 'Submit Review';
    }
  }
  
  /**
   * Toggle panel visibility
   * @param {HTMLElement} panel - The panel to toggle
   */
  function togglePanel(panel) {
    if (panel) {
      panel.classList.toggle('active');
    }
  }
  
  /**
   * Hide panel
   * @param {HTMLElement} panel - The panel to hide
   */
  function hidePanel(panel) {
    if (panel) {
      panel.classList.remove('active');
    }
  }
  
});