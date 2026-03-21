// js/restaurants.js - Fetch and render restaurants (Icon & Gradient Based)

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('restaurants-container');
    if (!container) return;

    // Show skeletons
    container.innerHTML = `
        <div class="card skeleton"></div>
        <div class="card skeleton"></div>
        <div class="card skeleton"></div>
    `;

    // Icon mapping function
    function getRestaurantIcon(name) {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('pizza')) return '🍕';
        if (lowerName.includes('burger')) return '🍔';
        if (lowerName.includes('coffee')) return '☕';
        if (lowerName.includes('dessert') || lowerName.includes('cake')) return '🍰';
        if (lowerName.includes('healthy') || lowerName.includes('salad')) return '🥗';
        if (lowerName.includes('biryani') || lowerName.includes('rice')) return '🍛';
        if (lowerName.includes('pasta') || lowerName.includes('italian')) return '🍝';
        if (lowerName.includes('sushi') || lowerName.includes('japanese')) return '🍣';
        return '🍴'; // Default
    }

    // Gradient mapping function
    function getGradientTheme(name) {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('pizza') || lowerName.includes('burger') || lowerName.includes('spicy')) return 'card-grad-orange';
        if (lowerName.includes('healthy') || lowerName.includes('salad') || lowerName.includes('green')) return 'card-grad-green';
        if (lowerName.includes('dessert') || lowerName.includes('cake') || lowerName.includes('sweet') || lowerName.includes('coffee')) return 'card-grad-purple';
        return 'card-grad-orange'; // Default theme
    }

    try {
        const res = await fetch(`${API_BASE}/restaurants/`);
        const restaurants = await res.json();

        if (restaurants.length === 0) {
            container.innerHTML = '<p class="text-center w-100">No restaurants found.</p>';
            return;
        }

        let html = '';
        restaurants.forEach(rest => {
            const icon = getRestaurantIcon(rest.restaurant_name);
            const gradClass = getGradientTheme(rest.restaurant_name);
            const rating = (4.0 + Math.random()).toFixed(1);

            html += `
                <div class="card ${gradClass}">
                    <div class="card-icon">${icon}</div>
                    <h3 class="card-title">${rest.restaurant_name}</h3>
                    <p class="card-text">${rest.location || 'Premium Dining Experience'}</p>
                    
                    <div class="card-footer">
                        <div class="card-meta">
                            <span class="rating-chip">★ ${rating}</span>
                            <span>• 30-40 MINS</span>
                        </div>
                        <a href="menu.html?restaurant_id=${rest.id}" class="btn btn-outline btn-small">Enter</a>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        container.classList.add('page-fade-in');

    } catch (err) {
        console.error(err);
        container.innerHTML = `<p class="text-center text-danger w-100">Failed to load restaurants: ${err.message}</p>`;
    }
});
