document.addEventListener('DOMContentLoaded', () => {
  const markAsAppliedButton = document.getElementById('markAsApplied')
  const jobListContainer = document.getElementById('jobListContainer')

  markAsAppliedButton.addEventListener('click', markJobAsApplied)
  displaySavedJobs(jobListContainer)

  // validateCurrentPage()
})

const markJobAsApplied = async () => {
  try {
    const [{ url, title }] = await chrome.tabs.query({ active: true, currentWindow: true });

    let urlId;

    // Handle URLs from en-japan.com
    if (url.includes('en-japan.com')) {
      const match = url.match(/w_(\d+)\//);
      if (match) {
        urlId = match[1];
      }
    }
    // Handle other URLs
    else {
      urlId = url.split('/').pop();
    }

    // Proceed only if urlId is determined
    if (!urlId) {
      console.error('Could not determine job ID from the URL.');
      return;
    }

    const timestamp = new Date().toISOString();

    const jobData = {
      status: 'applied',
      timestamp,
      title
    };

    await chrome.storage.local.set({ [urlId]: jobData });
    displaySavedJobs(document.getElementById('jobListContainer'));

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

const timeAgo = (timestamp) => {
  const now = new Date()
  const date = new Date(timestamp)
  const diffInSeconds = Math.floor((now - date) / 1000)

  let timeAgo = ''
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`
  const minutes = Math.floor(diffInSeconds / 60)
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} months ago`
  const years = Math.floor(months / 12)
  return `${years} years ago`
}

async function displaySavedJobs(container) {
  try {
    const items = await chrome.storage.local.get(null)
    container.innerHTML = ''

    const sortedJobs = Object.keys(items)
      .map(urlId => ({ urlId, ...items[urlId] }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    sortedJobs.forEach(({ urlId, title, timestamp }) => {
      if (items[urlId].status === 'applied') {
        const listItem = document.createElement('li')
        listItem.textContent = `${title} - ${timeAgo(timestamp)}`

        const deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete'
        deleteButton.addEventListener('click', () => editJob(urlId))

        listItem.appendChild(deleteButton)
        container.appendChild(listItem)
      }
    })
  } catch (error) {
    console.error('An error occurred while fetching saved jobs:', error)
  }
}

const editJob = (urlId) => {
  const isConfirmed = confirm('Are you sure you want to delete this job entry?')

  if (isConfirmed) {
    chrome.storage.local.remove(urlId, () => {
      displaySavedJobs(document.getElementById('jobListContainer'))
    })
  }
}


const validateCurrentPage = async () => {
  const [{ url }] = await chrome.tabs.query({ active: true, currentWindow: true })
  const jobDescriptionPattern = /https:\/\/lancersagent\.com\/project\/engineer\/\d+/
  
  if (!jobDescriptionPattern.test(url)) {
    const markAsAppliedButton = document.getElementById('markAsApplied')
    markAsAppliedButton.disabled = true
    markAsAppliedButton.textContent = "Not a job description page"
  }
}