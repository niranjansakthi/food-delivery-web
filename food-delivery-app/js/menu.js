// js/menu.js - Fetch and display menu items for a specific restaurant (Icon & Gradient)

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('restaurant_id');

    if (!restaurantId) {
        showToast('No restaurant selected', 'error');
        setTimeout(() => window.location.href = 'restaurants.html', 1500);
        return;
    }

    const container = document.getElementById('menu-container');
    if (!container) return;

    container.innerHTML = `
        <div class="card skeleton"></div>
        <div class="card skeleton"></div>
        <div class="card skeleton"></div>
    `;

    // Icon mapping function for menu items
    function getItemIcon(name, category) {
        const lowerName = (name || '').toLowerCase() + ' ' + (category || '').toLowerCase();
        if (lowerName.includes('pizza')) return '🍕';
        if (lowerName.includes('burger')) return '🍔';
        if (lowerName.includes('coffee') || lowerName.includes('latte')) return '☕';
        if (lowerName.includes('dessert') || lowerName.includes('cake') || lowerName.includes('sweet')) return '🍰';
        if (lowerName.includes('healthy') || lowerName.includes('salad') || lowerName.includes('bowl')) return '🥗';
        if (lowerName.includes('biryani') || lowerName.includes('rice')) return '🍛';
        if (lowerName.includes('pasta') || lowerName.includes('italian')) return '🍝';
        if (lowerName.includes('sushi') || lowerName.includes('japanese')) return '🍣';
        if (lowerName.includes('drink') || lowerName.includes('juice')) return '🍹';
        return '🍽️'; // Default
    }

    // Gradient mapping function for menu items
    function getItemGradient(name, category) {
        const lowerName = (name || '').toLowerCase() + ' ' + (category || '').toLowerCase();
        if (lowerName.includes('pizza') || lowerName.includes('burger') || lowerName.includes('spicy')) return 'card-grad-orange';
        if (lowerName.includes('healthy') || lowerName.includes('salad') || lowerName.includes('biryani')) return 'card-grad-green';
        if (lowerName.includes('dessert') || lowerName.includes('cake') || lowerName.includes('drink')) return 'card-grad-purple';
        return 'card-grad-orange'; // Default theme
    }

    try {
        const res = await fetch(`${API_BASE}/menu/`);
        const allMenus = await res.json();

        let html = '';
        allMenus.forEach((menu) => {
            const items = menu.items || [];
            if (items.length === 0) return;

            // Optional: Category Title
            // html += `<h2 class="mt-4 mb-2" style="grid-column: 1 / -1; font-size: 1.25rem;">${menu.category}</h2>`;

            items.forEach((item) => {
                const icon = getItemIcon(item.name, menu.category);
                const gradClass = getItemGradient(item.name, menu.category);
                const price = 100 + Math.floor(Math.random() * 200);

                html += `
                    <div class="card ${gradClass}">
                        <div class="card-icon">${icon}</div>
                        <h3 class="card-title">${item.name}</h3>
                        <p class="card-text">${item.item_type || 'Premium dish crafted with care'}</p>
                        
                        <div class="card-footer">
                            <div class="card-price">₹${price}</div>
                            <button class="btn btn-primary btn-small" onclick='addToCart({"id": ${item.id}, "name": "${item.name}", "price": ${price}, "restaurant_id": ${restaurantId}, "image": "${icon}"})'>
                                Add <i class="fa-solid fa-plus ms-1"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
        });

        if (!html) {
            html = '<p class="text-center w-100 mt-4 mb-4">No menu items found for this restaurant.</p>';
        }

        container.innerHTML = html;
        container.classList.add('page-fade-in');
    } catch (err) {
        console.error(err);
        container.innerHTML = `<p class="text-center text-danger w-100">Failed to load menu: ${err.message}</p>`;
    }
});
