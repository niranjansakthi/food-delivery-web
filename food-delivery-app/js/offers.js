// js/offers.js - Fetch and display offers (Icon & Gradient Basis)

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('offers-container');
    if (!container) return;

    // Show skeletons
    container.innerHTML = `
        <div class="card skeleton"></div>
        <div class="card skeleton"></div>
    `;

    try {
        const res = await fetch(`${API_BASE}/offers/`);
        const offers = await res.json();

        if (offers.length === 0) {
            container.innerHTML = '<p class="text-center w-100 mt-4 mb-4">No exclusive offers at the moment.</p>';
            return;
        }

        let html = '';
        offers.forEach((offer) => {
            const icon = '🎟️'; 
            const gradClass = 'card-grad-orange'; // All offers use orange-gold theme

            html += `
                <div class="card ${gradClass}">
                    <div class="card-icon">${icon}</div>
                    <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px;">
                        <h3 class="card-title">${offer.title}</h3>
                        <span class="rating-chip" style="background: rgba(239, 68, 68, 0.1); color: var(--error-color);">
                            🎁 ${offer.discount}% OFF
                        </span>
                    </div>
                    <p class="card-text">Special curated deal for you. Use code <strong>YUMMY${offer.discount}</strong> to avail this offer.</p>
                    
                    <div class="card-footer">
                        <div class="card-meta">
                            <span>Exclusive Reward</span>
                        </div>
                        <a href="restaurants.html" class="btn btn-primary btn-small">Claim</a>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        container.classList.add('page-fade-in');

    } catch (err) {
        console.error(err);
        container.innerHTML = `<p class="text-center text-danger w-100">Failed to load offers: ${err.message}</p>`;
    }
});
