// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌹 Сайт "Ган а-Варадим а-Леваним" успешно загружен!');

    loadCategories();
    setupSearch();
});

/**
 * Плавная прокрутка к секции с местами
 */
function scrollToPlaces() {
    const placesSection = document.getElementById('places-section');
    if (placesSection) {
        placesSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

async function loadCategories() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    try {
        const response = await fetch('local.json');
        if (!response.ok) {
            throw new Error(`שגיאת HTTP: ${response.status}`);
        }
        const places = await response.json();
        renderCategories(places);
    } catch (error) {
        console.error('שגיאה בטעינת המקומות:', error);
        grid.innerHTML = '<p class="empty-state">לא ניתן לטעון את המקומות כרגע. נסו לרענן את העמוד.</p>';
    }
}

/**
 * מרנדר כרטיסי מקומות לתוך ה-grid
 * @param {Array} places - מערך אובייקטים בפורמט { id, name, description, category, icon, ... }
 */
function renderCategories(places) {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (!places || places.length === 0) {
        grid.innerHTML = '<p class="empty-state">בקרוב יתווספו כאן מקומות חדשים 🌱</p>';
        return;
    }

    places.forEach(place => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.dataset.name = place.name || '';
        card.dataset.category = place.category || '';

        card.innerHTML = `
            <div class="card-icon">${place.icon || '📍'}</div>
            <h3>${place.name || ''}</h3>
            <p>${place.description || ''}</p>
            ${place.category ? `<span class="category-tag">${place.category}</span>` : ''}
            ${place.location ? `<div class="location-info">📍 ${place.location}</div>` : ''}
        `;

        grid.appendChild(card);
    });
}

/**
 * מפעיל את שדה החיפוש בנאבבר - מסנן את כרטיסי המקומות לפי שם
 */
function setupSearch() {
    const input = document.getElementById('search-input');
    if (!input) return;

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        const cards = document.querySelectorAll('#categories-grid .category-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const name = (card.dataset.name || '').toLowerCase();
            const isMatch = name.includes(query);
            card.style.display = isMatch ? '' : 'none';
            if (isMatch) visibleCount++;
        });

        toggleNoResultsMessage(cards.length > 0 && visibleCount === 0);
    });
}

/**
 * מציג/מסתיר הודעת "לא נמצאו תוצאות" בזמן חיפוש
 * @param {boolean} show
 */
function toggleNoResultsMessage(show) {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    let message = document.getElementById('no-results-message');

    if (show) {
        if (!message) {
            message = document.createElement('p');
            message.id = 'no-results-message';
            message.className = 'empty-state';
            message.textContent = 'לא נמצאו מקומות התואמים את החיפוש שלכם';
            grid.appendChild(message);
        }
    } else if (message) {
        message.remove();
    }
}