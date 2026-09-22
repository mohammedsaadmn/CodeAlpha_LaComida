let currentTotal = 0;

// ===============================
// LOAD CART
// ===============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ===============================
// CHECK CART
// ===============================

if (cart.length === 0) {
    alert("Your cart is empty!");
    window.location.href = "index.html";
}


// ===============================
// DISPLAY ORDER SUMMARY
// ===============================

function renderOrderSummary() {

    const summary = document.getElementById("orderSummary");

    let html = "";

    cart.forEach(function (item) {

        html += `
            <div class="order-item">

                <div class="d-flex justify-content-between">
                    <strong>
                        ${item.name}
                    </strong>

                    <strong>
                        ₹${item.price.toFixed(2)}
                    </strong>
                </div>

                <small class="text-muted">
                    Quantity: ${item.quantity}
                </small>

                <div class="text-end">
                    ₹${(item.price * item.quantity).toFixed(2)}
                </div>

            </div>
        `;
    });

    summary.innerHTML = html;
}


// ===============================
// CALCULATE TOTAL
// ===============================

function calculateTotal() {

    const subtotal = cart.reduce(
        function (sum, item) {
            return sum + (Number(item.price) * Number(item.quantity));
        },
        0
    );

    const deliveryFee = 40;

    const grandTotal = subtotal + deliveryFee;

    // Save the total so UPI QR can use it
    currentTotal = grandTotal;

    document.getElementById("subtotal").innerText =
        `₹${subtotal.toFixed(2)}`;

    document.getElementById("deliveryFee").innerText =
        `₹${deliveryFee.toFixed(2)}`;

    document.getElementById("grandTotal").innerText =
        `₹${grandTotal.toFixed(2)}`;

    return grandTotal;
}

// ===============================
// UPI PAYMENT UI
// ===============================

const codRadio = document.getElementById("cod");
const upiRadio = document.getElementById("upi");
const upiPaymentBox = document.getElementById("upiPaymentBox");
const upiAmount = document.getElementById("upiAmount");
const upiQrCode = document.getElementById("upiQrCode");
const upiPayButton = document.getElementById("upiPayButton");


// ===============================
// UPDATE PAYMENT UI
// ===============================

function updatePaymentUI() {

    calculateTotal();

    if (upiRadio && upiRadio.checked) {

        upiPaymentBox.classList.remove("d-none");

        upiAmount.innerText =
            `₹${currentTotal.toFixed(2)}`;

        generateUPIQR();

    } else {

        upiPaymentBox.classList.add("d-none");

    }
}


// ===============================
// GENERATE UPI QR
// ===============================

function generateUPIQR() {

    if (!upiQrCode) return;

    upiQrCode.innerHTML = "";

    // =====================================
    // PUT YOUR REAL UPI ID HERE
    // =====================================

    const merchantUPI = "ms7710420@okaxis";

    const merchantName = "La Comida";

    calculateTotal();

    const amount = currentTotal.toFixed(2);

    const transactionRef =
        "ORD" + Date.now();

    const upiURL =
        `upi://pay?pa=${encodeURIComponent(merchantUPI)}` +
        `&pn=${encodeURIComponent(merchantName)}` +
        `&tr=${transactionRef}` +
        `&am=${amount}` +
        `&cu=INR`;

    if (typeof QRCode === "undefined") {

        console.error(
            "QRCode library is not loaded."
        );

        upiQrCode.innerHTML =
            "<p class='text-danger'>QR code could not be loaded.</p>";

        return;
    }

    new QRCode(upiQrCode, {
        text: upiURL,
        width: 180,
        height: 180
    });
}


// ===============================
// PAYMENT METHOD EVENTS
// ===============================

if (codRadio) {
    codRadio.addEventListener(
        "change",
        updatePaymentUI
    );
}

if (upiRadio) {
    upiRadio.addEventListener(
        "change",
        updatePaymentUI
    );
}


// ===============================
// OPEN UPI APP
// ===============================

if (upiPayButton) {

    upiPayButton.addEventListener(
        "click",
        function () {

            calculateTotal();

            const merchantUPI =
                "YOUR_REAL_UPI_ID";

            const merchantName =
                "La Comida";

            const amount =
                currentTotal.toFixed(2);

            const transactionRef =
                "ORD" + Date.now();

            const upiURL =
                `upi://pay?pa=${encodeURIComponent(merchantUPI)}` +
                `&pn=${encodeURIComponent(merchantName)}` +
                `&tr=${transactionRef}` +
                `&am=${amount}` +
                `&cu=INR`;

            window.location.href = upiURL;
        }
    );
}

// ===============================
// PLACE ORDER
// ===============================

document
    .getElementById("checkoutForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        // ===============================
        // CUSTOMER DETAILS
        // ===============================

        const name =
            document
                .getElementById("customerName")
                .value
                .trim();

        const phone =
            document
                .getElementById("phone")
                .value
                .trim();

        const address =
            document
                .getElementById("address")
                .value
                .trim();

        const city =
            document
                .getElementById("city")
                .value
                .trim();


        // ===============================
        // PAYMENT METHOD
        // ===============================

        const selectedPayment =
            document.querySelector(
                'input[name="payment"]:checked'
            );

        if (!selectedPayment) {

            alert("Please select a payment method.");

            return;
        }

        const payment =
            selectedPayment.value;


        // ===============================
        // VALIDATE DELIVERY DETAILS
        // ===============================

        if (!name || !phone || !address || !city) {

            alert(
                "Please fill all delivery details."
            );

            return;
        }


        // ===============================
        // CALCULATE TOTAL
        // ===============================

        const subtotal = cart.reduce(
            (sum, item) =>
                sum + (item.price * item.quantity),
            0
        );

        const deliveryFee = 40;

        const total =
            subtotal + deliveryFee;


       let transactionId = "";
let paymentStatus = "Pending";

// ================================
// PAYMENT PROCESS
// ================================

if (payment === "UPI") {
    // UPI payment is initiated through the QR code / UPI app.
    // We do NOT mark it as Paid automatically.
    paymentStatus = "Awaiting Payment Confirmation";
}

// COD
if (payment === "Cash on Delivery") {
    paymentStatus = "Pending";
}

// GET LOGGED-IN USER
const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser) {
    alert("Please login before placing an order.");
    window.location.href = "login.html";
    return;
}
        // ===============================
        // CREATE ORDER
        // ===============================

       const order = {
    orderId: "ORD" + Date.now(),

    userId: loggedInUser.id,
    userName: loggedInUser.name,
    userEmail: loggedInUser.email,

    customerName: name,

            phone:
                phone,

            address:
                address,

            city:
                city,

            paymentMethod:
                payment,

            paymentStatus:
                paymentStatus,

            transactionId:
                transactionId,

            items:
                cart,

            subtotal:
                subtotal,

            deliveryFee:
                deliveryFee,

            total:
                total,

            orderStatus:
                "Order Placed",

            orderDate:
                new Date().toLocaleString()
        };


        // ===============================
        // GET PREVIOUS ORDERS
        // ===============================

        const orders =
            JSON.parse(
                localStorage.getItem("orders")
            ) || [];


        // ===============================
        // SAVE ORDER
        // ===============================

        orders.push(order);

        localStorage.setItem(
            "orders",
            JSON.stringify(orders)
        );


        // ===============================
        // CLEAR CART
        // ===============================

        localStorage.removeItem("cart");


        // ===============================
        // SUCCESS MESSAGE
        // ===============================

        alert(
            `🎉 Order placed successfully!\n\n` +
            `Order ID: ${order.orderId}\n` +
            `Payment: ${payment}\n` +
            `Payment Status: ${paymentStatus}\n` +
            `Total: ₹${total.toFixed(2)}`
        );


        // ===============================
        // GO TO ORDERS
        // ===============================

        window.location.href =
            "orders.html";

    });

// ===============================
// PAY WITH UPI BUTTON
// ===============================

if (upiPayButton) {

    upiPayButton.addEventListener("click", function () {

        calculateTotal();

        const merchantUPI = "ms7710420@okaxis";
        const merchantName = "La Comida";
        const amount = currentTotal.toFixed(2);
        const transactionRef = "ORD" + Date.now();

        const upiURL =
            `upi://pay?pa=${encodeURIComponent(merchantUPI)}` +
            `&pn=${encodeURIComponent(merchantName)}` +
            `&tr=${encodeURIComponent(transactionRef)}` +
            `&am=${encodeURIComponent(amount)}` +
            `&cu=INR`;

        // Create a temporary link
        const link = document.createElement("a");
        link.href = upiURL;
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();

        setTimeout(function () {
            document.body.removeChild(link);
        }, 1000);

    });
}
// ===============================
// START
// ===============================

renderOrderSummary();

calculateTotal();