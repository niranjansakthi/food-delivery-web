// js/cart.js - Manage shopping cart items, checkout flow

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    const cartContainer = document.getElementById('cart-items-container');
    const checkoutContainer = document.getElementById('checkout-items');

    if (cartContainer) {
        renderCartItems(cartContainer);
    }

    if (checkoutContainer) {
        renderCheckoutSummary();
    }

    // Checkout form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
});

function addToCart(itemDetails) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existing = cart.find(i => i.id === itemDetails.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...itemDetails, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showToast(`${itemDetails.name} added to cart`, "success");
}

function updateQuantity(itemId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.id === itemId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== itemId);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        
        // Re-render
        const container = document.getElementById('cart-items-container');
        if (container) renderCartItems(container);
    }
}

function renderCartItems(container) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotalEl = document.getElementById('cart-subtotal');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="padding: 40px;">
                <h3 class="mt-4">Your cart is empty</h3>
                <p class="text-muted mt-2 mb-4">You can go to home page to view more restaurants</p>
                <a href="restaurants.html" class="btn btn-primary">See Restaurants NEAR YOU</a>
            </div>`;
        if (subtotalEl) subtotalEl.textContent = '₹0';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach(item => {
        // Fallback for image
        let img = item.image || `https://source.unsplash.com/150x150/?food,${encodeURIComponent(item.name)}`;
        let price = item.price || 150; // Mock price if not returned
        
        html += `
            <div class="cart-item">
                <img src="${img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">₹${price}</div>
                </div>
                <div class="cart-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
        total += price * item.quantity;
    });

    container.innerHTML = html;
    if (subtotalEl) {
        subtotalEl.textContent = `₹${total}`;
    }
}

function renderCheckoutSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('checkout-items');
    const totalEl = document.getElementById('checkout-total');
    let html = '';
    let total = 0;
    
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    cart.forEach(item => {
        let price = item.price || 150; 
        html += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px dashed #eee; padding-bottom: 10px;">
                <span>${item.name} x ${item.quantity}</span>
                <strong>₹${price * item.quantity}</strong>
            </div>
        `;
        total += price * item.quantity;
    });
    
    const deliveryFee = 40;
    html += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; color: #686b78;">
                <span>Delivery Fee</span>
                <strong>₹${deliveryFee}</strong>
            </div>
    `;

    container.innerHTML = html;
    if (totalEl) totalEl.textContent = `₹${total + deliveryFee}`;
}

async function handleCheckoutSubmit(e) {
    e.preventDefault();
    if (!requireAuth()) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const btn = document.getElementById('place-order-btn');
    const address = document.getElementById('address').value;
    
    btn.disabled = true;
    btn.textContent = 'Processing...';

    // Map cart to items for the backend
    const items = cart.map(i => ({
        menu_item_id: i.id,
        quantity: i.quantity
    }));
    
    try {
        const payload = {
            user_id: localStorage.getItem('user_id') || 1, // fallback
            restaurant_id: cart[0].restaurant_id || 1,
            items: items
        };

        const res = await fetch(`${API_BASE}/orders/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            localStorage.removeItem('cart');
            showToast('Order placed successfully!', 'success');
            setTimeout(() => window.location.href = 'index.html', 2000);
        } else {
            const err = await res.json();
            throw new Error(err.detail || 'Failed to place order');
        }
    } catch (err) {
        showToast(err.message, 'error');
        btn.disabled = false;
        btn.textContent = 'Place Order';
    }
}
