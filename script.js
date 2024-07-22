document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const searchInput = document.getElementById('search-bar');
    const categoryFilter = document.getElementById('category-filter');
    const loginLink = document.getElementById('login-link');
    const formContainer = document.getElementById('container');
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const cartCountElement = document.getElementById('cart-count');
    const cartTableBody = document.querySelector('#cart-table tbody');
    const totalElement = document.querySelector('.total span');  // Asegúrate de que este selector corresponde al elemento correcto en tu HTML.

    updateCartCount();
    updateCartTableUI();

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(button.getAttribute('data-id'), 10);
            addToCart(productId);
        });
    });

    if (signUpButton && signInButton && formContainer) {
        signUpButton.addEventListener('click', () => {
            formContainer.classList.add('right-panel-active');
        });

        signInButton.addEventListener('click', () => {
            formContainer.classList.remove('right-panel-active');
        });
    }

    if (loginLink && formContainer) {
        loginLink.addEventListener('click', (event) => {
            event.preventDefault();
            formContainer.style.display = 'block';
        });
    }

    if (searchInput && categoryFilter) {
        searchInput.addEventListener('input', filterProducts);
        categoryFilter.addEventListener('change', filterProducts);
    }

    function addToCart(id) {
        const product = getProductById(id);
        if (product) {
            const existingProduct = cart.find(p => p.id === product.id);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                product.quantity = 1;
                cart.push(product);
            }
            saveCart();
            updateCartCount();
            updateCartTableUI();
        } else {
            console.error('Producto no encontrado:', id);
        }
    }

    function getProductById(id) {
        const products = [
            { id: 1, name: 'Air Jordan 1', price: 250.00 },
            { id: 2, name: 'Air Jordan 3', price: 200.00 }
        ];
        return products.find(product => product.id === id);
    }

    function updateCartTableUI() {
        if (!cartTableBody) return;
        cartTableBody.innerHTML = '';
        let total = 0;
        cart.forEach((product, index) => {
            if (product.price !== undefined) {  // Asegura que el precio está definido
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>$${product.price.toFixed(2)}</td>
                    <td>$${(product.quantity * product.price).toFixed(2)}</td>
                    <td><button class="btn-remove" data-id="${product.id}">Eliminar</button></td>
                `;
                cartTableBody.appendChild(row);
                total += product.quantity * product.price;
            } else {
                console.error('Error: Precio no definido para el producto', product);
            }
        });
        updateTotal(total);
        document.querySelectorAll('.btn-remove').forEach(button => {
            button.addEventListener('click', function() {
                removeProduct(parseInt(this.getAttribute('data-id'), 10));
            });
        });
    }
    


    function removeProduct(id) {
        const productIndex = cart.findIndex(p => p.id === id);
        if (productIndex !== -1) {
            cart.splice(productIndex, 1);
            saveCart();
            updateCartTableUI();
            updateCartCount();
        }
    }

    function updateCartCount() {
        if (cartCountElement) {
            cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        }
    }

    function updateTotal(total) {
        if (totalElement) {
            totalElement.textContent = `Total: $${total.toFixed(2)}`;
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function filterProducts() {
        const searchQuery = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const productElements = document.querySelectorAll('.producto');
        
        productElements.forEach(product => {
            const productName = product.querySelector('h3').textContent.toLowerCase();
            const productCategory = product.getAttribute('data-category');
            
            if ((productName.includes(searchQuery) || searchQuery === '') && (productCategory === selectedCategory || selectedCategory === 'all')) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
});


function selectSize(selectedElement) {
    // Remover la clase 'active' de todos los elementos
    document.querySelectorAll('.size li').forEach(li => {
        li.classList.remove('active');
    });

    // Agregar la clase 'active' al elemento seleccionado
    selectedElement.classList.add('active');
}