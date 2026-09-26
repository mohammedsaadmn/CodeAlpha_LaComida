// ===============================
// GET LOGGED-IN USER
// ===============================

const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser"));

const ordersContainer =
    document.getElementById("ordersContainer");

const API_URL =
    "http://localhost:5000/api/orders";


// ===============================
// CHECK LOGIN
// ===============================

if (!loggedInUser) {
    alert("Please login to view your orders.");
    window.location.href = "login.html";
}


// ===============================
// LOAD ORDERS FROM MONGODB
// ===============================

async function loadOrders() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load orders");
        }

        const allOrders = await response.json();

        console.log("Orders from MongoDB:", allOrders);


        // ===============================
        // FILTER USER ORDERS
        // ===============================

        const userId =
            loggedInUser.id ||
            loggedInUser._id;

        console.log("Filtering orders for logged-in MongoDB user ID:", userId);

        const orders = allOrders.filter(function (order) {

            const orderUserId =
                typeof order.user === "object"
                    ? order.user?._id
                    : order.user;

            return (
                orderUserId &&
                String(orderUserId) === String(userId)
            );

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

            return;
        }


        // ===============================
        // DISPLAY NEWEST ORDER FIRST
        // ===============================

        const reversedOrders =
            [...orders].reverse();


        ordersContainer.innerHTML = "";


        reversedOrders.forEach(function (order) {

            let itemsHTML = "";


            // ===============================
            // ORDER ITEMS
            // ===============================

            order.items.forEach(function (item) {

                const itemTotal =
                    Number(item.price) *
                    Number(item.quantity);


                itemsHTML += `
                    <div class="order-item">

                        <div class="d-flex justify-content-between">

                            <strong>
                                ${item.name}
                            </strong>

                            <strong>
                                ₹${itemTotal.toFixed(2)}
                            </strong>

                        </div>

                        <small class="text-muted">

                            ₹${Number(item.price).toFixed(2)}
                            ×
                            ${item.quantity}

                            ${item.size
                                ? ` (${item.size})`
                                : ""}

                        </small>

                    </div>
                `;
            });


            // ===============================
            // ORDER CARD
            // ===============================

            const orderDate =
                order.orderDate ||
                order.createdAt;


            const formattedDate =
                orderDate
                    ? new Date(orderDate).toLocaleString()
                    : "Date unavailable";


            ordersContainer.innerHTML += `

                <div class="order-card">

                    <div class="order-header">

                        <div>

                            <h4 class="mb-1">
                                Order #${order._id}
                            </h4>

                            <div class="order-id">
                                ${formattedDate}
                            </div>

                        </div>


                        <span class="status">

                            🟡 ${order.orderStatus || "Order Placed"}

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
                                Payment Status:
                            </strong>

                            ${order.paymentStatus || "Pending"}

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
                        ₹${Number(order.total).toFixed(2)}

                    </div>

                </div>

            `;

        });


    } catch (error) {

        console.error(
            "Error loading orders:",
            error
        );


        ordersContainer.innerHTML = `

            <div class="empty-orders">

                <h2>⚠️ Unable to load orders</h2>

                <p class="text-muted">

                    Please make sure the backend server
                    is running.

                </p>

                <button
                    class="back-btn"
                    onclick="location.reload()"
                >
                    🔄 Try Again
                </button>

            </div>

        `;

    }

}


// ===============================
// START
// ===============================

loadOrders();