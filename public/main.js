document.getElementById('submit').addEventListener('click', async (e) => {
  e.preventDefault(); // Prevent default form submission behavior

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username && password) {
    try {
      // Send the form data to the backend
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      // Check for HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      // Handle success
      const result = await response.json();
      console.log('Submission successful:', result);
      window.location.href = result.redirectUrl; // Redirect to the thank-you page
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit. Please try again.');
    }
  } else {
    alert('Please fill in all fields.');
  }
});