document.addEventListener('DOMContentLoaded', function() {
  const markAsAppliedButton = document.getElementById('markAsApplied');

  markAsAppliedButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentTab = tabs[0];
      const url = currentTab.url;
      const urlId = url.split('/').pop(); // Assuming the ID is the last part of the URL

      // Save to local storage
      chrome.storage.local.set({ [urlId]: 'applied' }, function() {
        alert('Job marked as applied.');
      });
    });
  });
});
