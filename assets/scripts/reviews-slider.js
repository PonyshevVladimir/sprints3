const arrowPrev = document.querySelector('.reviews-slider__arrow-prev');
const arrowNext = document.querySelector('.reviews-slider__arrow-next');
const sliderLine = document.querySelector('.reviews-slider__line');
let sliderItem = document.querySelectorAll('.reviews-slider__item');

let currentIndex = 0;
let maxIndex = 0;

function getVisibleCardsCount() {
    const width = window.innerWidth;
    if (width <= 860) return 1;
    if (width <= 992) return 2;
    return 3;
}

function updateMaxIndex() {
    if (sliderItem.length === 0) return;
    const visibleCards = getVisibleCardsCount();

    maxIndex = sliderItem.length - visibleCards;

    if (currentIndex > maxIndex) {
        currentIndex = maxIndex;
    }
}

function updateSlider() {
    if (sliderItem.length === 0 || !sliderLine) return;

    const wrapper = document.querySelector('.reviews-slider__wrapper');
    if (!wrapper) return;

    const computedStyle = window.getComputedStyle(wrapper);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
    const wrapperWidth = wrapper.offsetWidth - paddingLeft - paddingRight;

    let cardWidth;
    let gap;

    if (window.innerWidth <= 860) {
        gap = 20;
        cardWidth = wrapperWidth;

        sliderItem.forEach(item => {
            item.style.width = `${cardWidth}px`;
        });
    } else {
        gap = 30;
        cardWidth = sliderItem[0].offsetWidth;

        sliderItem.forEach(item => {
            item.style.width = '';
        });
    }

    const step = cardWidth + gap;
    const totalX = currentIndex * step;

    sliderLine.style.transform = `translateX(-${totalX}px)`;
}

arrowPrev.addEventListener('click', function () {
    if (currentIndex > 0) {
        currentIndex -= 1;
        updateSlider();
    }
});

arrowNext.addEventListener('click', function () {
    if (currentIndex < maxIndex) {
        currentIndex += 1;
        updateSlider();
    }
});

window.addEventListener('resize', () => {
    updateMaxIndex();
    updateSlider();
});

function generateStarsHTML(starsCount) {
    let starsHTML = '';
    const count = Number(starsCount);
    for (let i = 0; i < count; i++) {
        starsHTML += `<img src="./assets/icons/star.svg" class="reviews-slider-star" alt="">`;
    }
    for (let i = 0; i < (5 - count); i++) {
        starsHTML += `<img src="./assets/icons/star-not.svg" class="reviews-slider-star" alt="">`;
    }
    return starsHTML;
}

function renderReviews(reviewsArray) {
    let html = '';
    reviewsArray.forEach(review => {
        html += `
            <div class="reviews-slider__item">
                <img src="${review['bg-image']}" alt="" class="reviews-slider__item-bg">
                <img src="${review['bg-image']}" alt="" class="reviews-slider__item-shadow" aria-hidden="true">
                <div class="reviews-slider__content">
                    <div class="reviews-slider__avatar-wrapper">
                        <img src="${review.avatar}" alt="" class="reviews-slider__avatar-img">
                        <img src="${review.avatar}" alt="" class="reviews-slider__avatar-shadow" aria-hidden="true">
                    </div>
                    <h3 class="reviews-slider__name">${review.name}</h3>
                    <p class="reviews-slider__job">${review.job}</p>
                    <blockquote class="reviews-slider__text">“${review.text}”</blockquote>
                    <div class="reviews-slider__stars">
                        ${generateStarsHTML(review.stars)}
                    </div>
                </div>
            </div>
        `;
    });

    sliderLine.innerHTML = html;

    sliderItem = document.querySelectorAll('.reviews-slider__item');

    updateMaxIndex();
    updateSlider();
}

async function getReviews() {
    try {
        let response = await fetch('http://localhost:3001/reviews');
        let data = await response.json();
        renderReviews(data);
    } catch (error) {
        console.error('Ошибка загрузки отзывов:', error);
    }
}

getReviews();
