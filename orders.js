// ===============================
// GET LOGGED-IN USER
// ===============================

const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser"));

const ordersContainer =
    document.getElementById("ordersContainer");


// ===============================
// CHECK LOGIN
// ===============================

if (!loggedInUser) {

    alert("Please login to view your orders.");

    window.location.href = "login.html";

}


// ===============================
// LOAD USER ORDERS
// ===============================

const allOrders =
    JSON.parse(localStorage.getItem("orders")) || [];


// Only show orders belonging to the logged-in user
const orders = allOrders.filter(function (order) {

    return order.userId === loggedInUser.id;

});


// ===============================
// CHECK ORDERS
// ===============================

if (orders.length === 0) {

    ordersContainer.innerHTML = `

        <div class="empty-orders">

            <h2>📦 No orders yet</h2>

            <p class="text-muted">
                You haven't placed any orders yet.
            </p>

            <a
                href="index.html"
                class="back-btn"
            >
                🍔 Browse Menu
            </a>

        </div>

    `;

}


// ===============================
// DISPLAY ORDERS
// ===============================

else {

    // Show newest order first
    const reversedOrders = [...orders].reverse();

    reversedOrders.forEach(function (order) {

        let itemsHTML = "";

        order.items.forEach(function (item) {

            itemsHTML += `

                <div class="order-item">

                    <div class="d-flex justify-content-between">

                        <strong>
                            ${item.name}
                        </strong>

                        <strong>
                            ₹${(
                                item.price *
                                item.quantity
                            ).toFixed(2)}
                        </strong>

                    </div>

                    <small class="text-muted">

                        ₹${item.price.toFixed(2)}
                        ×
                        ${item.quantity}

                    </small>

                </div>

            `;

        });


        ordersContainer.innerHTML += `

            <div class="order-card">

                <div class="order-header">

                    <div>

                        <h4 class="mb-1">
                            Order #${order.orderId}
                        </h4>

                        <div class="order-id">
                            ${order.orderDate}
                        </div>

                    </div>

                    <span class="status">
                        🟡 Order Placed
                    </span>

                </div>


                <h5>
                    🛍️ Items
                </h5>

                ${itemsHTML}


                <div class="mt-3">

                    <p class="mb-1">
                        <strong>
                            Payment:
                        </strong>

                        ${order.paymentMethod}
                    </p>

                    <p class="mb-1">
                        <strong>
                            Delivery:
                        </strong>

                        ${order.address},
                        ${order.city}
                    </p>

                </div>


                <div class="total">

                    Total:
                    ₹${order.total.toFixed(2)}

                </div>

            </div>

        `;

    });

}