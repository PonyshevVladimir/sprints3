(function() {
    const arrowPrev = document.querySelector('.catalog-slider__arrow-prev');
    const arrowNext = document.querySelector('.catalog-slider__arrow-next');
    const sliderLine = document.querySelector('.catalog-slider__line');
    let sliderItem = document.querySelectorAll('.catalog-slider__item');

    let currentIndex = 0;
    let maxIndex = 0;

    function getVisibleCardsCount() {
        const width = window.innerWidth;
        if (width <= 576) return 1;
        if (width <= 860) return 2;
        if (width <= 1024) return 3;
        return 4;
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

        const wrapper = document.querySelector('.catalog-slider__wrapper');
        if (!wrapper) return;

        const computedStyle = window.getComputedStyle(wrapper);
        const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
        const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
        const wrapperWidth = wrapper.offsetWidth - paddingLeft - paddingRight;

        const width = window.innerWidth;
        let cardWidth;
        let gap;

        if (width <= 576) {
            gap = 0;
            cardWidth = wrapperWidth;
        } else if (width <= 860) {
            gap = 20;
            cardWidth = (wrapperWidth - gap) / 2;
        } else if (width <= 1024) {
            gap = 30;
            cardWidth = (wrapperWidth - (gap * 2)) / 3;
        } else {
            gap = 40;
            cardWidth = sliderItem[0].offsetWidth;
        }

        if (width <= 1024) {
            sliderItem.forEach(item => {
                item.style.width = `${cardWidth}px`;
            });
        } else {
            sliderItem.forEach(item => {
                item.style.width = '';
            });
        }

        let step = cardWidth + gap;
        let totalX = currentIndex * step;

        sliderLine.style.transform = `translateX(-${totalX}px)`;
    }

    arrowPrev.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex -= 1;
            updateSlider();
        }
    });

    arrowNext.addEventListener('click', function() {
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
            starsHTML += `<img src="./assets/icons/star.svg" class="catalog-slider__star" alt="">`;
        }
        for (let i = 0; i < (5 - count); i++) {
            starsHTML += `<img src="./assets/icons/star-not.svg" class="catalog-slider__star" alt="">`;
        }
        return starsHTML;
    }

    function renderProducts(productsArray) {
        let html = '';
        productsArray.forEach(product => {
            html += `
                <div class="catalog-slider__item">
                    <div class="catalog-slider__image-box">
                        <img src="${product.image}" alt="${product.name}" class="catalog-slider__img">
                    </div>
                    <div class="catalog-slider__info-box">
                        <p class="catalog-slider__product-type">${product.type}</p>
                        <h3 class="catalog-slider__product-name">${product.name}</h3>
                        <div class="catalog-slider__stars">
                            ${generateStarsHTML(product.stars)}
                        </div>
                        <div class="catalog-slider__bottom-box">
                            <div class="catalog-slider__price-box">
                                <span class="catalog-slider__product-currency">$</span>
                                <span class="catalog-slider__product-price">${product.price}</span>
                            </div>
                            <button class="catalog-slider__product-add" data-id="${product.id}"></button>
                        </div>
                    </div>
                </div>
            `;
        });

        sliderLine.innerHTML = html;

        sliderItem = document.querySelectorAll('.catalog-slider__item');

        updateMaxIndex();
        updateSlider();
    }

    async function getProducts() {
        try {
            let response = await fetch('http://localhost:3001/products');
            let data = await response.json();
            renderProducts(data);
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        }
    }

    let touchStartX = 0;
    let touchEndX = 0;

    const sliderWrapper = document.querySelector('.catalog-slider__wrapper');

    if (sliderWrapper) {
        sliderWrapper.addEventListener('touchstart', function(event) {
            touchStartX = event.changedTouches[0].screenX;
        }, { passive: true });

        sliderWrapper.addEventListener('touchend', function(event) {
            touchEndX = event.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 50;

        if (touchStartX - touchEndX > swipeThreshold) {
            if (currentIndex < maxIndex) {
                currentIndex += 1;
                updateSlider();
            }
        }

        if (touchEndX - touchStartX > swipeThreshold) {
            if (currentIndex > 0) {
                currentIndex -= 1;
                updateSlider();
            }
        }
    }

    getProducts();
})();
