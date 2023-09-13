chrome.storage.local.get(null, function(items) {
  const forms = document.querySelectorAll('.cmn-column.project-list__item');

  forms.forEach(function(form) {
    const action = form.getAttribute('action');
    const urlId = action.split('/').pop(); // Assuming the ID is the last part of the URL

    if (items[urlId] === 'applied') {
      form.style.backgroundColor = '#dbeafe'; // Change to your desired color
    }
  });
});
