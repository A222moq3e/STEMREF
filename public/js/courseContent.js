/**
 * Course Content Page JavaScript
 * Handles all interactive elements including ratings, reviews, and discussions
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const courseName = document.querySelector('.course-title h1').innerText;
  const ratingInputs = document.querySelectorAll('.rating-stars input');
  const reviewTextArea = document.getElementById('review-comment');
  
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
  
  // Add event listeners to rating inputs
  ratingInputs.forEach(input => {
    input.addEventListener('change', function() {
      highlightStars(this.getAttribute('data-num-star'));
    });
  });
  
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
  
  /**
   * Submit a review for the current course
   */
  async function submitReview() {
    // Find the selected rating
    const selectedRating = document.querySelector('.rating-stars input:checked');
    
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
    
    const starsNum = selectedRating.getAttribute('data-num-star');
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
      
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Thank You!',
        text: 'Your review has been submitted successfully.',
        timer: 2000,
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
    }
  }
  
  /**
   * Highlight stars based on selected rating
   * @param {string} numStar - Number of stars to highlight
   */
  function highlightStars(numStar) {
    const num = parseInt(numStar);
    const starLabels = document.querySelectorAll('.rating-stars label i');
    
    for (let i = 0; i < starLabels.length; i++) {
      if (i < num) {
        starLabels[i].classList.add('warning-color');
      } else {
        starLabels[i].classList.remove('warning-color');
      }
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
  
  /**
   * Show panel
   * @param {HTMLElement} panel - The panel to show
   */
  function showPanel(panel) {
    if (panel) {
      panel.classList.add('active');
    }
  }
});