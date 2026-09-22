// =====================================
// REGISTER
// =====================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

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


        // GET EXISTING USERS

        const users =
            JSON.parse(localStorage.getItem("users")) || [];


        // CHECK EXISTING EMAIL

        const existingUser =
            users.find(function (user) {

                return user.email === email;

            });


        if (existingUser) {

            alert("An account with this email already exists.");

            return;
        }


        // CREATE USER

        const newUser = {

            id: Date.now(),

            name: name,

            email: email,

            password: password

        };


        users.push(newUser);


        // SAVE USERS

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        alert("🎉 Account created successfully!");


        // GO TO LOGIN

        window.location.href = "login.html";

    });

}



// =====================================
// LOGIN
// =====================================

const loginForm = document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        // GET USERS

        const users =
            JSON.parse(localStorage.getItem("users")) || [];


        // FIND USER

        const user =
            users.find(function (user) {

                return (
                    user.email === email &&
                    user.password === password
                );

            });


        if (!user) {

            alert("❌ Invalid email or password.");

            return;
        }


        // SAVE LOGGED-IN USER

        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(user)
        );


        alert(
            `🎉 Welcome ${user.name}!`
        );


        // GO HOME

        window.location.href = "index.html";

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

