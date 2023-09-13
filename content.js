// Fetch all saved job IDs from Chrome's local storage
chrome.storage.local.get(null)
  .then(items => {
    // Query the DOM to find all job list items
    const forms = document.querySelectorAll('.cmn-column.project-list__item');
    
    // Iterate through each form to apply custom styling for applied jobs
    forms.forEach(form => applyCustomStyling(form, items));
  })
  .catch(err => {
    console.error('An error occurred while fetching saved job IDs:', err);
  });

/**
 * Applies custom styling to a job list item based on its application status.
 * 
 * @param {HTMLElement} form - The form element representing a job list item.
 * @param {Object} items - An object containing saved job data.
 */
const applyCustomStyling = (form, items) => {
  // Extract the last part of the URL from the form action attribute as the unique job ID
  const action = form.getAttribute('action');
  const urlId = action.split('/').pop();
  
  // Check if this job has been marked as applied
  if (items[urlId] && items[urlId].status === 'applied') {
    // Apply custom styling for jobs that are marked as applied
    form.style.backgroundColor = '#dbeafe';
  }
};
