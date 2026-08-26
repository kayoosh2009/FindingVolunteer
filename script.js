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

/**
 * טוען את רשימת הקטגוריות מתוך data/local.json ומרנדר אותן
 */
async function loadCategories() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    try {
        const response = await fetch('data/local.json');
        if (!response.ok) {
            throw new Error(`שגיאת HTTP: ${response.status}`);
        }
        const categories = await response.json();
        renderCategories(categories);
    } catch (error) {
        console.error('שגיאה בטעינת הקטגוריות:', error);
        grid.innerHTML = '<p class="empty-state">לא ניתן לטעון את הקטגוריות כרגע. נסו לרענן את העמוד.</p>';
    }
}

/**
 * מרנדר כרטיסי קטגוריה לתוך ה-grid
 * @param {Array} categories - מערך אובייקטים בפורמט { id, name, description, icon }
 */
function renderCategories(categories) {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (!categories || categories.length === 0) {
        grid.innerHTML = '<p class="empty-state">בקרוב יתווספו כאן קטגוריות חדשות 🌱</p>';
        return;
    }

    categories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.dataset.name = category.name || '';

        card.innerHTML = `
            <div class="card-icon">${category.icon || '📍'}</div>
            <h3>${category.name || ''}</h3>
            <p>${category.description || ''}</p>
        `;

        grid.appendChild(card);
    });
}

/**
 * מפעיל את שדה החיפוש בנאבבר - מסנן את כרטיסי הקטגוריות לפי שם
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
            message.textContent = 'לא נמצאו קטגוריות התואמות את החיפוש שלכם';
            grid.appendChild(message);
        }
    } else if (message) {
        message.remove();
    }
}