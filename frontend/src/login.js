document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (response.ok) {
    alert('Login successful!');
    // Store user data in local storage or session storage
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/';
  } else {
    alert(`Login failed: ${data.error}`);
  }
});
