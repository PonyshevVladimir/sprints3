(function() {
    const cartHeaderBtn = document.querySelector('.header__cart-toggle');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartCloseBtn = document.querySelector('.cart-aside__close-btn');
    const cartContent = document.querySelector('.cart-aside__content');
    const cartBadge = document.querySelector('.cart-aside__badge');
    const checkoutBtn = document.querySelector('.cart-aside__checkout-btn');
    const headerBadge = document.querySelector('.header__cart-badge');

    const summaryValue = document.querySelector('.cart-aside__summary-value');
    const totalValue = document.querySelector('.cart-aside__total-value');

    function openCart() {
        if (cartOverlay) {
            cartOverlay.classList.add('cart-overlay_open');
            document.body.style.overflow = 'hidden';
            updateCartTotals();
        }
    }

    function closeCart() {
        if (cartOverlay) {
            cartOverlay.classList.remove('cart-overlay_open');
            document.body.style.overflow = '';
        }
    }

    if (cartHeaderBtn) {
        cartHeaderBtn.addEventListener('click', openCart);
    }

    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', closeCart);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', function(event) {
            if (event.target === cartOverlay) {
                closeCart();
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (document.querySelectorAll('.cart-product').length === 0) {
                alert('Ваша корзина пуста!');
                return;
            }

            if (cartContent) {
                cartContent.innerHTML = '';
            }

            updateCartTotals();

            alert('Спасибо за заказ! Корзина успешно очищена.');
            closeCart();
        });
    }

    if (cartContent) {
        cartContent.addEventListener('click', function(e) {
            const target = e.target;

            if (target.classList.contains('cart-product__quanity-btn_plus')) {
                const valueSpan = target.previousElementSibling;
                let currentVal = parseInt(valueSpan.textContent) || 1;
                valueSpan.textContent = currentVal + 1;
                updateCartTotals();
            }

            if (target.classList.contains('cart-product__quanity-btn_minus')) {
                const valueSpan = target.nextElementSibling;
                let currentVal = parseInt(valueSpan.textContent) || 1;
                if (currentVal > 1) {
                    valueSpan.textContent = currentVal - 1;
                    updateCartTotals();
                }
            }

            if (target.closest('.cart-product__remove-btn')) {
                const productCard = target.closest('.cart-product');
                if (productCard) {
                    productCard.remove();
                    updateCartTotals();
                }
            }
        });
    }

    document.body.addEventListener('click', function(e) {
        const addBtn = e.target.closest('.catalog-slider__product-add');
        if (!addBtn) return;

        const catalogItem = addBtn.closest('.catalog-slider__item');
        if (!catalogItem) return;

        const productId = addBtn.getAttribute('data-id');
        const imgUrl = catalogItem.querySelector('.catalog-slider__img').getAttribute('src');
        const name = catalogItem.querySelector('.catalog-slider__product-name').textContent;
        const type = catalogItem.querySelector('.catalog-slider__product-type').textContent;
        const priceText = catalogItem.querySelector('.catalog-slider__product-price').textContent;
        const starsHTML = catalogItem.querySelector('.catalog-slider__stars').innerHTML;
        const ratingValue = catalogItem.querySelector('.cart-product_rating-value')?.textContent || '5.0';

        const existingProducts = document.querySelectorAll('.cart-product');
        let isExist = false;

        existingProducts.forEach(cartProduct => {
            const cartProductName = cartProduct.querySelector('.cart-product__name').textContent;
            if (cartProductName === name) {
                const quantitySpan = cartProduct.querySelector('.cart-product__quanity-value');
                let currentQty = parseInt(quantitySpan.textContent) || 1;
                quantitySpan.textContent = currentQty + 1;
                isExist = true;
            }
        });

        if (!isExist && cartContent) {
            const newProductHTML = `
                <div class="cart-product" data-id="${productId}">
                    <img src="${imgUrl}" alt="${name}" class="cart-product__img">
                    <div class="cart-product__details">
                        <div class="cart-product__meta">
                            <h3 class="cart-product__name">${name}</h3>
                            <p class="cart-product__type">${type}</p>
                        </div>
                        <div class="cart-product__rating">
                            <div class="cart-product__stars">
                                ${starsHTML}
                            </div>
                            <span class="cart-product__rating-value">${ratingValue}</span>
                        </div>
                        <p class="cart-product__price"><span class="cart-product__currency">$</span>${priceText}</p>
                    </div>
                    <div class="cart-product__controls">
                        <button class="cart-product__remove-btn">
                            <img src="./assets/icons/cross.svg" alt="" class="cart-product__remove-img">
                        </button>
                        <div class="cart-product__quanity">
                            <button class="cart-product__quanity-btn cart-product__quanity-btn_minus">-</button>
                            <span class="cart-product__quanity-value">1</span>
                            <button class="cart-product__quanity-btn cart-product__quanity-btn_plus">+</button>
                        </div>
                    </div>
                </div>
            `;
            cartContent.insertAdjacentHTML('beforeend', newProductHTML);
        }

        updateCartTotals();
        openCart();
    });

    function updateCartTotals() {
        const products = document.querySelectorAll('.cart-product');
        let totalItems = 0;
        let totalPrice = 0;

        products.forEach(product => {
            const priceText = product.querySelector('.cart-product__price').textContent;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

            const quantityText = product.querySelector('.cart-product__quanity-value').textContent;
            const quantity = parseInt(quantityText) || 0;

            totalItems += quantity;
            totalPrice += price * quantity;
        });

        if (headerBadge) {
            headerBadge.textContent = totalItems;

            if (totalItems === 0) {
                headerBadge.style.display = 'none';
            } else {
                headerBadge.style.display = 'flex';
            }
        }

        if (cartBadge) {
            cartBadge.textContent = `${totalItems} ${getWordForm(totalItems, ['товар', 'товара', 'товаров'])}`;
        }

        if (summaryValue) summaryValue.textContent = `$${totalPrice}`;
        if (totalValue) totalValue.textContent = `$${totalPrice}`;
    }

    function getWordForm(number, titles) {
        const cases = [2, 0, 1, 1, 1, 2];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }

    updateCartTotals();
})();
