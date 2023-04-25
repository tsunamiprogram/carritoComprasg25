const urlEndPoint = "https://ecommercebackend.fundamentos-29.repl.co/"
const dvListProducts = document.querySelector('#listProducts');
const logoCart = document.querySelector('.cart__toggle');
const listShopping = document.querySelector('.list__shopping');
let listProductsShopping = [];
let listItemsShopping = document.querySelector('#list__items_shopping');
let modalContainer = document.querySelector('#modalContainer');
let modal = document.querySelector('.modalClass');
let empty__cart = document.querySelector('#empty__cart');
logoCart.addEventListener('click', () => {
    listShopping.classList.toggle('show__list__shopping');
})
function addToCart(event){
    if(event.target.classList.contains('add__to__car') || event.target.classList.contains('button__modal__add__to__car')) {
        let product = event.target.parentElement.parentElement
        let objProduct = {};
        if (event.target.classList.contains('add__to__car')) {
            objProduct = {
                id: product.querySelector('.add__to__car').getAttribute('data-id'),
                image: product.querySelector('.card__product__img img').src, 
                name: product.querySelector('.card__product__name p').textContent,
                price: product.querySelector('.card__product__price p').textContent,
                quantity: 1
            };   
        }
        else if (event.target.classList.contains('button__modal__add__to__car')) {
            objProduct = {
                id: product.querySelector('.button__modal__add__to__car').getAttribute('data-id'),
                image: product.querySelector('.modal__product__image img').src, 
                name: product.querySelector('.modal__product__description .modal__product__description_name').textContent,
                price: product.querySelector('.modal__product__description .modal__product__description_price').textContent,
                quantity: 1
            };
        }
        console.log(objProduct);
        if(listProductsShopping.some(product => product.id === objProduct.id)){
            let product = listProductsShopping.map(product => {
            if(product.id === objProduct.id){
                product.quantity ++;
                return product;
            } 
            else {
                return product;
            }})
            listProductsShopping = [...product]
        } 
        else {
            listProductsShopping = [...listProductsShopping, objProduct]
        }
        showProductsInCart();
        if (event.target.classList.contains('button__modal__add__to__car')) {
            modalContainer.classList.remove('show__modal');
            listShopping.classList.add('show__list__shopping');
        }
    }
}
function showProductsInCart() {
    listItemsShopping.innerHTML = "";
    for (let i = 0; i < listProductsShopping.length; i++) {
        const div = document.createElement('div');
        div.innerHTML = `
            <div class="car__product">
                <div class="item__shopping__image">
                    <img src="${listProductsShopping[i].image}">
                </div>
                <div class="car__product__description">
                    <p>${listProductsShopping[i].name}</p>
                    <p>Precio: ${listProductsShopping[i].price}</p>
                    <p>Cantidad: ${listProductsShopping[i].quantity}</p>
                </div>
                <div class="item__shopping__button">
                    <button class="delete__product__button" data-id="${listProductsShopping[i].id}">
                        Delete
                    </button>
                </div>
            </div>
            <hr>`;
        listItemsShopping.appendChild(div);
    }
    saveListProductsShopping();
}
function eventListenersLoader() {
    dvListProducts.addEventListener('click', addToCart);
    modalContainer.addEventListener('click', addToCart);
    dvListProducts.addEventListener('click', showModal);
    listItemsShopping.addEventListener('click', deleteProduct);
    empty__cart.addEventListener('click', emptyCart)
    document.addEventListener('DOMContentLoaded', () => {
        listProductsShopping = JSON.parse(localStorage.getItem('listProductsShopping')) || [];
        showProductsInCart();
    });
    modalContainer.addEventListener('click', closeModal);
}
eventListenersLoader();
function loadInfoProducts() {
    axios.get(urlEndPoint)
    .then(function (response){
      showInfoProducts(response.data);
    })
    .catch(function(error){
      console.log(error)
    })
}
loadInfoProducts();
function showInfoProducts(listProducts) {
    let html = "";
    for(let i = 0; i < listProducts.length; i++){
        html += `
        <div class='card__product'>
            <div class='card__product__img'>
                <img src="${listProducts[i].image}" alt="image">
            </div>
            <div class="card__product__name">
                <p>${listProducts[i].name}</p>
            </div>
            <div class="card__product__price">
                <p>$ ${listProducts[i].price.toFixed(2)}</p>
            </div>
            <div class="card__product__buttons">
                <button class="buttons_shopping add__to__car" id="btnAddToCart" data-id="${listProducts[i].id}">Add to cart</button>
                <button class="buttons_shopping view__product__detail">View Details</button>
            </div>
        </div>`
    }
    dvListProducts.innerHTML = html
}
function saveListProductsShopping() {
    localStorage.setItem('listProductsShopping', JSON.stringify(listProductsShopping));
}
function showModal(event) {
    if(event.target.classList.contains('view__product__detail')) {
        modalContainer.classList.add('show__modal');
        let product = event.target.parentElement.parentElement
        let objProduct = {
            id: product.querySelector('.add__to__car').getAttribute('data-id'),
            image: product.querySelector('.card__product__img img').src, 
            name: product.querySelector('.card__product__name p').textContent,
            price: product.querySelector('.card__product__price p').textContent
        };
        modal.innerHTML = `<div class="modalAll">
                <div class="modal__product">
                    <div class="modal__product__description">
                        <p class="modal__product__description_name">${objProduct.name}</p>
                        <p class="modal__product__description_price">${objProduct.price}</p>
                    </div>
                    <div class="modal__product__image">
                        <img src="${objProduct.image}">
                    </div>
                    <p id="modalSizes">Sizes:</p>
                    <div class="modal__product__sizes">
                        <button>XS</button>
                        <button>S</button>
                        <button>M</button>
                        <button>L</button>
                        <button>XL</button>
                        <button>2XL</button>
                        <button>3XL</button>    
                    </div>
                    <div class="modal__add__to__car">
                        <button id="add__to__cart" class="button__modal__add__to__car" data-id="${objProduct.id}">Add to Cart</button>
                    </div>
                </div>
                <div class="modal__image__design">
                    <img class="modal__image" src="${objProduct.image}">
                </div>
                <div class="modal__image__design__backgroud"></div>
            </div>`;
    }
}
function closeModal(event) {
    if(event.target.classList.contains('closeModal')) {
        modalContainer.classList.remove('show__modal');
        modal.innerHTML = "";
    }
}
function deleteProduct(event) {
    if(event.target.classList.contains('delete__product__button')){
        let productId = event.target.getAttribute('data-id');
        listProductsShopping = listProductsShopping.filter(product => product.id !== productId);
        showProductsInCart();
    }
}
function emptyCart() {
    listProductsShopping = [];
    showProductsInCart();
}