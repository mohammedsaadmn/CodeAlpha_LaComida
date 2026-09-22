// ===============================
// SEARCH
// ===============================

const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("keyup", function () {
        const value = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll(".menu-item");

        cards.forEach(function (card) {
            const text = card.innerText.toLowerCase();

            if (text.includes(value)) {
                card.classList.remove("d-none");
                card.classList.add("d-flex");
            } else {
                card.classList.remove("d-flex");
                card.classList.add("d-none");
            }
        });
    });
}


// ===============================
// CART
// ===============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ===============================
// GET PRODUCT FROM CARD
// ===============================

function getProductFromCard(button) {

    const card = button.closest(".menu-item");

    if (!card) return null;

    const name =
        card.querySelector(".card-title")?.innerText.trim()
        || "Food Item";

    let price = 0;
    let size = "";

    // Biryani / products with size
    const sizeSelect = card.querySelector(".biryani-size");

    if (sizeSelect) {

        price = Number(sizeSelect.value);

        const option =
            sizeSelect.options[sizeSelect.selectedIndex];

        size = option.dataset.size || "";

    } else {

        // Normal product
        price = Number(card.dataset.price) || 0;
    }

    return {
        id: size
            ? `${name.toLowerCase().replace(/\s+/g, "-")}-${size.toLowerCase()}`
            : name.toLowerCase().replace(/\s+/g, "-"),

        name: size
            ? `${name} (${size})`
            : name,

        price: price,

        image: card.querySelector("img")?.src || ""
    };
}
// Add product to cart
function addToCart(product) {

    const existingProduct = cart.find(
        item => item.id === product.id
    );

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();

    alert(`${product.name} added to cart! 🛒`);

    updateCartCount();
}


// Save cart
function saveCart() {
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}


// Update cart count
function updateCartCount() {

    const cartCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const cartElement =
        document.getElementById("cartCount");

    if (cartElement) {
        cartElement.innerText = cartCount;
    }
}


// Add click events to Order buttons
const orderButtons =
    document.querySelectorAll(".order-btn");

orderButtons.forEach(function (button) {

    button.addEventListener("click", function (event) {

        event.preventDefault();

        const product =
            getProductFromCard(button);

        if (product) {
            addToCart(product);
        }
    });

});


// ===============================
// CART WINDOW
// ===============================

function showCart() {

    let cartModal =
        document.getElementById("cartModal");

    if (!cartModal) {

        cartModal = document.createElement("div");

        cartModal.id = "cartModal";

        cartModal.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: 400px;
            max-width: 90%;
            height: 100vh;
            background: white;
            z-index: 9999;
            box-shadow: -5px 0 20px rgba(0,0,0,0.3);
            padding: 25px;
            overflow-y: auto;
        `;

        document.body.appendChild(cartModal);
    }

    renderCart();
}


// Render cart
function renderCart() {

    const cartModal =
        document.getElementById("cartModal");

    if (!cartModal) return;

    let html = `
        <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:20px;
        ">
            <h2>🛒 Shopping Cart</h2>

            <button
                onclick="closeCart()"
                style="
                    border:none;
                    background:#dc3545;
                    color:white;
                    padding:8px 12px;
                    border-radius:5px;
                    cursor:pointer;
                "
            >
                ✕
            </button>
        </div>
    `;

    if (cart.length === 0) {

        html += `
            <h4>Your cart is empty.</h4>
        `;

    } else {

        cart.forEach(function (item, index) {

            html += `
                <div style="
                    border-bottom:1px solid #ddd;
                    padding:15px 0;
                    margin-bottom:10px;
                ">

                    <h4>${item.name}</h4>

                    <p>
                        ₹${item.price} × ${item.quantity}
                    </p>

                    <div>

                        <button
                            onclick="decreaseQuantity(${index})"
                        >
                            −
                        </button>

                        <strong style="margin:0 10px;">
                            ${item.quantity}
                        </strong>

                        <button
                            onclick="increaseQuantity(${index})"
                        >
                            +
                        </button>

                        <button
                            onclick="removeFromCart(${index})"
                            style="
                                margin-left:15px;
                                background:#dc3545;
                                color:white;
                                border:none;
                                padding:5px 10px;
                                border-radius:5px;
                            "
                        >
                            Remove
                        </button>

                    </div>

                </div>
            `;
        });

        const total = cart.reduce(
            (sum, item) =>
                sum + item.price * item.quantity,
            0
        );

        html += `
            <h3>
                Total: ₹${total.toFixed(2)}
            </h3>

            <button
                onclick="checkout()"
                style="
                    width:100%;
                    padding:12px;
                    background:#ffc107;
                    border:none;
                    border-radius:6px;
                    font-size:18px;
                    cursor:pointer;
                "
            >
                Proceed to Checkout
            </button>
        `;
    }

    cartModal.innerHTML = html;
}


// Increase quantity
function increaseQuantity(index) {

    cart[index].quantity++;

    saveCart();

    renderCart();

    updateCartCount();
}


// Decrease quantity
function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);
    }

    saveCart();

    renderCart();

    updateCartCount();
}


// Remove product
function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();

    renderCart();

    updateCartCount();
}


// Close cart
function closeCart() {

    const cartModal =
        document.getElementById("cartModal");

    if (cartModal) {
        cartModal.remove();
    }
}


// Checkout
function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty.");

        return;
    }

    window.location.href = "checkout.html";
}


// ===============================
// CART BUTTON
// ===============================

function createCartButton() {

    const container =
        document.getElementById("cartButtonContainer");

    if (!container) return;

    const button = document.createElement("button");

    button.innerHTML = `
        🛒 Cart (<span id="cartCount">0</span>)
    `;

    button.type = "button";
    button.onclick = showCart;

    button.className = "btn btn-warning fw-bold";

    button.style.cssText = `
        padding: 9px 14px;
        border-radius: 8px;
        border: none;
        white-space: nowrap;
        font-size: 15px;
        cursor: pointer;
    `;

    container.appendChild(button);
}

// Start
createCartButton();

updateCartCount();