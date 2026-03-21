// js/auth.js - Handle user login and registration

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Toggle functionality
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');

    if (showRegisterLink && loginSection && registerSection) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginSection.classList.add('hidden');
            registerSection.classList.remove('hidden');
        });
        
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerSection.classList.add('hidden');
            loginSection.classList.remove('hidden');
        });
    }

    // Login Submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const btn = loginForm.querySelector('button');
            
            btn.disabled = true;
            btn.innerText = 'Logging in...';
            
            try {
                // Adjusting to FastAPI expectations depending on implementation. 
                // Mostly it will be email & password
                const res = await fetch(`${API_BASE}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await res.json();
                if (data.token || data.access_token) {
                    localStorage.setItem('token', data.token || data.access_token);
                    localStorage.setItem('user', JSON.stringify({ email })); 
                    showToast('Login successful!', 'success');
                    setTimeout(() => window.location.href = 'index.html', 1500);
                } else if (!res.ok) {
                    throw new Error(data.detail || 'Login failed');
                } else {
                    // fallback if not using token based auth
                    localStorage.setItem('token', 'mock_token');
                    localStorage.setItem('user_id', data.id || 1);
                    showToast('Logged in!', 'success');
                    window.location.href = 'index.html';
                }
            } catch (err) {
                showToast(err.message, 'error');
            } finally {
                btn.disabled = false;
                btn.innerText = 'Login';
            }
        });
    }

    // Register Submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const btn = registerForm.querySelector('button');
            
            btn.disabled = true;
            btn.innerText = 'Registering...';
            
            try {
                const res = await fetch(`${API_BASE}/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: name, email, password })
                });
                
                const data = await res.json();
                if (res.ok) {
                    showToast('Registration successful! Please login.', 'success');
                    registerSection.classList.add('hidden');
                    loginSection.classList.remove('hidden');
                } else {
                    throw new Error(data.detail || 'Registration failed');
                }
            } catch (err) {
                showToast(err.message, 'error');
            } finally {
                btn.disabled = false;
                btn.innerText = 'Register';
            }
        });
    }
});
