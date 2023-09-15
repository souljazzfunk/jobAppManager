// Fetch all saved job IDs from Chrome's local storage
chrome.storage.local.get(null)
  .then(items => {
    // Query the DOM to find all job list items
    const cards = document.querySelectorAll('.cmn-column.project-list__item, .card.job-card.job-list, .serachListUnit')
    
    // Iterate through each card to apply custom styling for applied jobs
    cards.forEach(card => applyCustomStyling(card, items))
  })
  .catch(err => {
    console.error('An error occurred while fetching saved job IDs:', err)
  })

/**
 * Applies custom styling to a job list item based on its application status.
 * 
 * @param {HTMLElement} card - The card element representing a job list item.
 * @param {Object} items - An object containing saved job data.
 */
const applyCustomStyling = (card, items) => {
  const customColor = '#ddd'

  // Extract the unique job ID
  let jobId = card.getAttribute('action') || card.getAttribute('data-job-offer-id') || card.getAttribute('data-id')
  if (jobId.includes('/')){
    jobId = jobId.split('/').pop()
  }
  
  // Check if this job has been marked as applied
  if (items[jobId] && items[jobId].status === 'applied') {
   // If the inner div exists, change its background color
   const baseDiv = card.querySelector('.base')
   if (baseDiv) {
     baseDiv.style.backgroundColor = customColor
   } else {
    card.style.backgroundColor = customColor
   }
  }
}
