// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌹 Сайт успешно загружен!');
    loadCategories();
    setupSearch();
});

async function loadCategories() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    try {
        const response = await fetch('local.json');
        if (!response.ok) {
            throw new Error(`HTTP: ${response.status}`);
        }
        const places = await response.json();
        renderCategories(places);
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        grid.innerHTML = '<p class="empty-state">לא ניתן לטעון את המקומות כרגע. נסו לרענן את העמוד.</p>';
    }
}

function renderCategories(places) {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (!places || places.length === 0) {
        grid.innerHTML = '<p class="empty-state">בקרוב יתווספו כאן מקומות חדשים 🌱</p>';
        return;
    }

    places.forEach((place) => {
        const card = document.createElement('div');
        card.className = 'category-card';

        // Проверяем, есть ли иконка, если нет — ставим эмодзи
        const iconHtml = place.icon 
            ? `<img src="${place.icon}" alt="${place.name}" class="card-icon-img" onerror="this.style.display='none'; this.parentElement.innerHTML='📍'">`
            : '📍';

        card.innerHTML = `
            <div class="card-icon-wrapper">
                ${iconHtml}
            </div>
            <div class="card-content">
                <h3>${place.name || 'ללא שם'}</h3>
                <p class="card-description">${place.description || ''}</p>
                
                <div class="card-meta">
                    ${place.category ? `<span class="category-tag">🏷️ ${place.category}</span>` : ''}
                    ${place.gradeFrom || place.gradeTo ? `<span class="grade-tag">📚 ${place.gradeFrom || ''}${place.gradeFrom && place.gradeTo ? '–' : ''}${place.gradeTo || ''}</span>` : ''}
                </div>

                ${place.location ? `<div class="location-info">📍 ${place.location}</div>` : ''}
                
                <div class="card-footer">
                    ${place.cost ? `<span class="cost-info">💰 ${place.cost}</span>` : ''}
                    ${place.externalLink ? `<a href="${place.externalLink}" target="_blank" class="card-link">🔗 למידע נוסף</a>` : ''}
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

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