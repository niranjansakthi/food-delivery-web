const API_BASE = "http://localhost:8000";

// --- GLOBAL UTILITIES ---

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Check logged in user status
function requireAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        showToast("Please login first", "error");
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return false;
    }
    return true;
}

// Setup common UI (Navbar toggle, Cart count)
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    // Auth state in navbar
    const token = localStorage.getItem('token');
    const loginLink = document.getElementById('login-link');
    if(loginLink) {
        if(token) {
            loginLink.innerHTML = '<i class="fa-solid fa-sign-out-alt"></i> Logout';
            loginLink.href = "#";
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                showToast("Logged out successfully", 'success');
                setTimeout(() => window.location.reload(), 1000);
            });
        }
    }
});

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        badge.textContent = count;
        if(count > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

// --- API METHODS ---

async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        // Just mocking token setup... FastAPI usually uses Bearer token
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.detail || "API Request Failed");
        }
        
        return data;
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

// RESTAURANTS
async function getRestaurants() {
    return await fetchAPI('/restaurants/'); // Using actual backend route names based on seed
}

// MENU
async function getMenu() {
    return await fetchAPI('/menu/');
}

// OFFERS
async function getOffers() {
    return await fetchAPI('/offers/');
}

// AUTH
async function loginUser(credentials) {
    // For FastAPI OAuth2PasswordRequestForm it sometimes expects FormData, but json if using standard pydantic model. Adjusting to JSON assuming standard model.
    return await fetchAPI('/users/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });
}

async function registerUser(userData) {
    return await fetchAPI('/users/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

// ORDERS
async function placeOrder(orderData) {
    return await fetchAPI('/orders/', {
        method: 'POST',
        body: JSON.stringify(orderData)
    });
}

async function getOrderHistory(userId) {
    return await fetchAPI(`/orders/user/${userId}`);
}
