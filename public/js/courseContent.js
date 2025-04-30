/**
 * Course Content Page JavaScript
 * Handles all interactive elements including ratings, reviews, and discussions
 */

document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const courseName = document.querySelector('.course-title h1').innerText;
  const ratingInputs = document.querySelectorAll('.rating-stars input');
  const ratingLabels = document.querySelectorAll('.rating-stars label');
  const reviewTextArea = document.getElementById('review-comment');
  const ratingFeedbackText = document.createElement('div');
  
  // Setup rating feedback element
  ratingFeedbackText.className = 'rating-feedback';
  document.querySelector('.rating-stars').after(ratingFeedbackText);
  
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
  
  // Convert all rating stars to outlined version initially
  const ratingStars = document.querySelectorAll('.rating-stars label i');
  ratingStars.forEach(star => {
    star.classList.remove('fa-solid');
    star.classList.add('fa-regular');
  });
  
  // Enhanced star rating interaction
  ratingLabels.forEach((label, index) => {
    // Hover effects
    label.addEventListener('mouseenter', () => {
      const hoverRating = 5 - index;
      updateStarsDisplay(hoverRating, 'hover');
      ratingFeedbackText.textContent = ratingMessages[hoverRating];
      ratingFeedbackText.classList.add('visible');
    });
    
    // Click feedback - more interactive
    label.addEventListener('click', () => {
      const clickedRating = 5 - index;
      updateStarsDisplay(clickedRating, 'selected');
      ratingFeedbackText.textContent = ratingMessages[clickedRating];
      
      // Add visual confirmation feedback
      label.classList.add('pulse-animation');
      setTimeout(() => {
        label.classList.remove('pulse-animation');
      }, 500);
      
      // Mark corresponding input as checked
      ratingInputs[index].checked = true;
    });
  });
  
  // Reset stars on mouseleave if no star is selected
  document.querySelector('.rating-stars').addEventListener('mouseleave', () => {
    const selectedInput = document.querySelector('.rating-stars input:checked');
    if (selectedInput) {
      // If a star is selected, keep that selection visible
      updateStarsDisplay(selectedInput.getAttribute('data-num-star'), 'selected');
    } else {
      // Reset to no stars
      resetStarsDisplay();
      ratingFeedbackText.classList.remove('visible');
    }
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
    
    // Update submit button to show loading state
    submitReviewBtn.disabled = true;
    submitReviewBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
    
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
      
      // Show success message with star animation
      Swal.fire({
        icon: 'success',
        title: 'Thank You!',
        html: `<div class="rating-success-animation">
                 <i class="fa-solid fa-star star-animate"></i>
                 <i class="fa-solid fa-star star-animate-delay-1"></i>
                 <i class="fa-solid fa-star star-animate-delay-2"></i>
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
   * Update the display of stars based on the given rating
   * @param {string|number} rating - The rating to display (1-5)
   * @param {string} state - The state of the stars ('hover' or 'selected')
   */
  function updateStarsDisplay(rating, state) {
    const num = parseInt(rating);
    const starIcons = document.querySelectorAll('.rating-stars label i');
    
    starIcons.forEach((star, index) => {
      const reversedIndex = starIcons.length - 1 - index;
      
      // Reset class to regular first
      star.classList.remove('fa-solid');
      star.classList.add('fa-regular');
      
      if (reversedIndex < num) {
        // Change to solid for filled stars
        star.classList.remove('fa-regular');
        star.classList.add('fa-solid');
      }
    });
  }
  
  /**
   * Reset all stars to their default state
   */
  function resetStarsDisplay() {
    const starIcons = document.querySelectorAll('.rating-stars label i');
    starIcons.forEach(star => {
      star.classList.remove('fa-solid');
      star.classList.add('fa-regular');
    });
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