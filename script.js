document.addEventListener('DOMContentLoaded', () => {
    console.log('🌹 Сайт успешно загружен!');
    loadCategories();
    setupSearch();
});

let allPlaces = [];

async function loadCategories() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    try {
        const response = await fetch('local.json');
        if (!response.ok) {
            throw new Error(`HTTP: ${response.status}`);
        }
        allPlaces = await response.json();
        renderCategories(allPlaces);
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
        card.style.cursor = 'pointer';

        // Переход на страницу деталей local.html при клике на карточку
        card.addEventListener('click', (e) => {
            if (e.target.tagName !== 'A' && !e.target.closest('a')) {
                window.location.href = `local.html?id=${encodeURIComponent(place.id)}`;
            }
        });

        const iconHtml = place.icon 
            ? `<img src="${place.icon}" alt="${place.name}" class="card-icon-img" onerror="this.style.display='none'; this.parentElement.innerHTML='<img src=\'icons/place.png\' class=\'card-icon-img\'>';">`
            : '<img src="icons/place.png" alt="מיקום" class="card-icon-img">';

        card.innerHTML = `
            <div class="card-icon-wrapper">
                ${iconHtml}
            </div>
            <div class="card-content">
                <h3>${place.name || 'ללא שם'}</h3>
                <p class="card-description">${place.description || ''}</p>
                
                <div class="card-meta">
                    ${place.category ? `
                        <span class="category-tag">
                            <img src="icons/description.png" alt="" class="tag-icon" onerror="this.style.display='none'">
                            ${place.category}
                        </span>` : ''}
                    ${(place.gradeFrom || place.gradeTo) ? `
                        <span class="grade-tag">
                            <img src="icons/description.png" alt="" class="tag-icon" onerror="this.style.display='none'">
                            ${place.gradeFrom || ''}${(place.gradeFrom && place.gradeTo) ? '–' : ''}${place.gradeTo || ''}
                        </span>` : ''}
                </div>

                ${place.location ? `
                    <div class="location-info">
                        <img src="icons/place.png" alt="" class="meta-icon" onerror="this.style.display='none'">
                        <span>${place.location}</span>
                    </div>` : ''}
                
                <div class="card-footer">
                    ${place.cost ? `
                        <span class="cost-info">
                            <img src="icons/money.png" alt="" class="meta-icon" onerror="this.style.display='none'">
                            <span>${place.cost}</span>
                        </span>` : ''}
                    <a href="local.html?id=${encodeURIComponent(place.id)}" class="card-link">
                        <span>לפרטים מלאים</span>
                        <img src="icons/back.png" alt="" class="card-link-icon" onerror="this.style.display='none'">
                    </a>
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
        const filtered = allPlaces.filter(p => {
            const name = (p.name || '').toLowerCase();
            const cat = (p.category || '').toLowerCase();
            const desc = (p.description || '').toLowerCase();
            return name.includes(query) || cat.includes(query) || desc.includes(query);
        });

        renderCategories(filtered);
    });
}