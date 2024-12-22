document.getElementById('submit').addEventListener('click', (e) => {
  e.preventDefault(); // Prevent form submission from refreshing the page

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username && password) {
    // Save data to local storage
    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    submissions.push({ username, password, timestamp: new Date().toISOString() });
    localStorage.setItem('submissions', JSON.stringify(submissions));

    // Get redirect URL from localStorage or use default
    const redirectUrl = localStorage.getItem('redirectUrl') || 'thankyou.html';
    window.location.href = redirectUrl;
  } else {
    alert('Please fill in all fields before submitting.');
  }
});