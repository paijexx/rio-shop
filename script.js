// 1. Данные товаров
const lps = [
    { id: 1, name: "The Dark Side of the Moon", price: 4500, img: "lp-1.jpg" },
    { id: 2, name: "Born to Die", price: 3800, img: "lp-2.jpg" },
    { id: 3, name: "Abbey Road", price: 4200, img: "lp-3.jpg" },
    { id: 4, name: "After Hours", price: 4000, img: "lp-4.jpg" },
    { id: 5, name: "Rumours", price: 3500, img: "lp-5.jpg" },
    { id: 6, name: "Midnights", price: 3900, img: "lp-6.jpg" },
    { id: 7, name: "AM", price: 3100, img: "lp-7.jpg" },
    { id: 8, name: "Igor", price: 4400, img: "lp-8.jpg" },
    { id: 9, name: "Harry's House", price: 3700, img: "lp-9.jpg" },
    { id: 10, name: "Discovery", price: 5000, img: "lp-10.jpg" }
];

const cds = Array.from({ length: 15 }, (_, i) => ({
    id: i + 11,
    name: `CD Album Classic Vol. ${i + 1}`,
    price: 1200 + (i * 50),
    img: `cd-${i + 1}.jpg`
}));

// Чтение сохраненной корзины из памяти браузера
let cart = JSON.parse(localStorage.getItem('rio_cart')) || [];

// 2. Умная отрисовка товаров (работает только там, где есть нужный id)
function renderProducts(list, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return; 
    
    list.forEach(item => {
        const article = document.createElement('article');
        article.className = 'product-card';
        article.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="product-card__img">
            <h3 class="product-card__title">${item.name}</h3>
            <p class="product-card__price">${item.price} ₽</p>
            <button class="btn btn--wide" onclick="addToCart(${item.id})">В корзину</button>
        `;
        container.appendChild(article);
    });
}

// 3. Логика корзины
window.addToCart = (id) => {
    const allProducts = [...lps, ...cds];
    const product = allProducts.find(p => p.id === id);
    if (product) {
        cart.push(product);
        saveCart();
        updateCartUI();
    }
};

// Функция удаления товара из корзины по индексу элемента
window.removeFromCart = (index) => {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
};

function saveCart() {
    localStorage.setItem('rio_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const counter = document.getElementById('cart-counter');
    if (counter) counter.innerText = cart.length;
    
    const list = document.getElementById('modal-items-list');
    const total = document.getElementById('modal-total-price');
    
    if (list) {
        if (cart.length === 0) {
            list.innerHTML = '<p style="color: #666; text-align: center; padding: 10px 0;">Корзина пуста</p>';
        } else {
            list.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <div>
                        <span style="font-weight: 600;">${item.price} ₽</span>
                        <button class="cart-item__remove" onclick="removeFromCart(${index})" title="Удалить">&times;</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (total) {
        const sum = cart.reduce((acc, item) => acc + item.price, 0);
        total.innerText = sum;
    }
}

// 4. Модальное окно корзины (общие обработчики событий)
const modal = document.getElementById('cart-modal');
const openBtn = document.getElementById('cart-open-btn');
const closeBtn = document.getElementById('cart-close-btn');

if (openBtn) openBtn.onclick = () => modal.classList.add('modal--active');
if (closeBtn) closeBtn.onclick = () => modal.classList.remove('modal--active');

// 5. Переключение вариантов доставки
const deliverySelect = document.getElementById('delivery-select');
if (deliverySelect) {
    deliverySelect.onchange = function() {
        const isPickup = this.value === 'pickup';
        document.getElementById('address-block').style.display = isPickup ? 'none' : 'block';
        document.getElementById('pickup-block').style.display = isPickup ? 'block' : 'none';
        document.getElementById('address-input').required = !isPickup;
    };
}

// 6. Оформление заказа
const orderForm = document.getElementById('order-form');
if (orderForm) {
    orderForm.onsubmit = (e) => {
        e.preventDefault();
        if (cart.length === 0) return alert('Ваша корзина пуста!');
        alert('Заказ успешно оформлен! Ждем вас.');
        cart = [];
        saveCart();
        updateCartUI();
        modal.classList.remove('modal--active');
    };
}

// 7. Обработка формы спецзаказа (на главной странице)
const feedbackForm = document.getElementById('feedback-form');
if (feedbackForm) {
    feedbackForm.onsubmit = (e) => {
        e.preventDefault();
        alert('Спасибо за запрос! Мы проверим доступность релиза и свяжемся с вами по указанному Email.');
        feedbackForm.reset();
    };
}

// Запуск рендеринга при полной загрузке DOM дерева страницы
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(lps, 'lp-grid');
    renderProducts(cds, 'cd-grid');
    updateCartUI();
});

