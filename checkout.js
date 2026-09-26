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
// PLACE ORDER
// ===============================

document
    .getElementById("checkoutForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();

        // ===============================
        // CUSTOMER DETAILS
        // ===============================

        const name =
            document.getElementById("customerName")
                .value.trim();

        const phone =
            document.getElementById("phone")
                .value.trim();

        const address =
            document.getElementById("address")
                .value.trim();

        const city =
            document.getElementById("city")
                .value.trim();


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

        const payment = selectedPayment.value;


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
                sum +
                (Number(item.price) *
                 Number(item.quantity)),
            0
        );

        const deliveryFee = 40;

        const total =
            subtotal + deliveryFee;


        // ===============================
        // PAYMENT STATUS
        // ===============================

        let transactionId = "";

        let paymentStatus = "Pending";

        if (payment === "UPI") {
            paymentStatus =
                "Awaiting Payment Confirmation";
        }

        if (payment === "Cash on Delivery") {
            paymentStatus = "Pending";
        }


        // ===============================
        // GET LOGGED-IN USER
        // ===============================

        const loggedInUser =
            JSON.parse(
                localStorage.getItem("loggedInUser")
            );

        if (!loggedInUser) {

            alert(
                "Please login before placing an order."
            );

            window.location.href =
                "login.html";

            return;
        }


        // ===============================
        // ORDER DATA
        // ===============================

        const userIdToSend = loggedInUser.id || loggedInUser._id;
        console.log("Logged-in MongoDB user:", loggedInUser);
        console.log("User ID being sent from checkout:", userIdToSend);

        const orderData = {

            user: userIdToSend,

            customerName: name,

            phone: phone,

            address: address,

            city: city,

            items: cart.map(function (item) {

                return {

                    name: item.name,

                    price: Number(item.price),

                    quantity: Number(item.quantity),

                    image: item.image || "",

                    size: item.size || ""

                };

            }),

            subtotal: subtotal,

            deliveryFee: deliveryFee,

            total: total,

            paymentMethod: payment,

            paymentStatus: paymentStatus,

            transactionId: transactionId,

            orderStatus: "Order Placed"

        };


        // ===============================
        // SEND ORDER TO EXPRESS API
        // ===============================

        try {

            const response = await fetch(
                "http://localhost:5000/api/orders",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(orderData)
                }
            );


            const result =
                await response.json();


            // ===============================
            // CHECK RESPONSE
            // ===============================

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to create order"
                );

            }


            console.log(
                "Order saved to MongoDB:",
                result
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
                `Payment: ${payment}\n` +
                `Payment Status: ${paymentStatus}\n` +
                `Total: ₹${total.toFixed(2)}`
            );


            // ===============================
            // GO TO ORDERS PAGE
            // ===============================

            window.location.href =
                "orders.html";


        } catch (error) {

            console.error(
                "Order creation error:",
                error
            );

            alert(
                "❌ Unable to place the order.\n\n" +
                "Please make sure the backend server is running."
            );

        }

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