document.getElementById('submit').addEventListener('click', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username && password) {
    try {
      const response = await fetch('http://localhost:3000/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (response.ok) {
        window.location.href = result.redirectUrl; // Redirect after successful submission
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit. Please try again.');
    }
  } else {
    alert('Please fill in all fields.');
  }
});