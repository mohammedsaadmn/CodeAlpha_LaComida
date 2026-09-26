// =====================================
// REGISTER
// =====================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;


        // CHECK PASSWORD

        if (password !== confirmPassword) {

            alert("Passwords do not match.");

            return;
        }


        try {

            const response = await fetch("http://localhost:5000/api/auth/register", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                })

            });


            const result = await response.json();


            if (!response.ok) {

                alert(`❌ ${result.message || "Registration failed."}`);

                return;
            }


            console.log("Registered MongoDB user:", result.user);

            alert("🎉 Account created successfully!");


            // GO TO LOGIN

            window.location.href = "login.html";

        } catch (error) {

            console.error("Registration error:", error);

            alert("❌ Unable to connect to backend server. Please make sure the server is running.");

        }

    });

}



// =====================================
// LOGIN
// =====================================

const loginForm = document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        try {

            const response = await fetch("http://localhost:5000/api/auth/login", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })

            });


            const result = await response.json();


            if (!response.ok) {

                alert(`❌ ${result.message || "Invalid email or password."}`);

                return;
            }


            console.log("Logged-in MongoDB user:", result.user);
            console.log("Logged-in MongoDB user ID:", result.user.id || result.user._id);


            // SAVE LOGGED-IN USER

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(result.user)
            );


            alert(
                `🎉 Welcome ${result.user.name}!`
            );


            // GO HOME

            window.location.href = "index.html";

        } catch (error) {

            console.error("Login error:", error);

            alert("❌ Unable to connect to backend server. Please make sure the server is running.");

        }

    });

}

// =====================================
// SHOW LOGGED-IN USER
// =====================================

const loggedInUser =
    JSON.parse(localStorage.getItem("loggedInUser"));

const userDisplay =
    document.getElementById("userDisplay");

if (userDisplay && loggedInUser) {
    userDisplay.innerText = `👋 Hi, ${loggedInUser.name}`;
}


// =====================================
// LOGOUT
// =====================================

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener("click", function () {

        localStorage.removeItem("loggedInUser");

        alert("You have been logged out.");

        window.location.href = "login.html";

    });

}


