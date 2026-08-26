// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌹 Сайт "Ган а-Варадим а-Леваним" успешно загружен!');
    
    // Здесь в будущем будет логика загрузки JSON:
    // fetch('data/places.json')
    //   .then(response => response.json())
    //   .then(data => renderPlaces(data))
    //   .catch(error => console.error('Ошибка загрузки данных:', error));

    // Пока что добавим плавную прокрутку для кнопки "בואו נתחיל"
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToPlaces();
        });
    }
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
 * Заглушка для будущей функции рендеринга карточек из JSON
 * @param {Array} placesData - массив объектов из JSON
 */
function renderPlaces(placesData) {
    const grid = document.getElementById('categories-grid');
    grid.innerHTML = ''; // Очищаем заглушки
    
    // Пример того, как это будет работать:
    // placesData.forEach(place => {
    //     const card = document.createElement('div');
    //     card.className = 'category-card';
    //     card.innerHTML = `
    //         <h3>${place.name}</h3>
    //         <p>${place.description}</p>
    //     `;
    //     grid.appendChild(card);
    // });
}