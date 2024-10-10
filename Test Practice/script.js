// Base64 encoded string
let encodedString = "=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"

// Decode the Base64 string
let decodedString = atob(encodedString.split('').reverse().join(''));

console.log(decodedString.split('').reverse().join('')); // Output: "Hello world!"

// Navigation
const navigate = (page) => {
    document.querySelectorAll('.page').forEach(s => s.style.display = 'none');
    document.getElementById(page).style.display = 'block';
};
navigate('home');

// Login system
let [storedUsername, storedPassword] = [null, null];

const login = async () => {
    const [username, password] = [
        document.getElementById('username').value,
        document.getElementById('password').value
    ];

    try {
        const response = await fetch('https://cws.auckland.ac.nz/nzsl/api/TestAuth', {
            method: 'GET',
            headers: { 'Authorization': `Basic ${btoa(`${username}:${password}`)}` }
        });

        response.ok ? (storedUsername = username, storedPassword = password,
            localStorage.setItem('loggedInUser', username),
            showMessage(`User ${username} logged in!`, "green"),
            updateLoginState()) : showMessage("Invalid credentials. Please try again!", "red");
    } catch {}
};

const logout = () => {
    [storedUsername, storedPassword] = [null, null];
    localStorage.removeItem('loggedInUser');
    updateLoginState();
};

const updateLoginState = () => {
    const user = localStorage.getItem('loggedInUser');
    document.getElementById('login-form').style.display = user ? 'none' : 'block';
    document.getElementById('welcome-message').style.display = user ? 'block' : 'none';
    document.getElementById('user').textContent = user || '';
    document.getElementById('login-logout').textContent = user ? 'Logout' : 'Login';
    document.getElementById('login-message').textContent = '';
};

const showMessage = (msg, color) => {
    const loginMessage = document.getElementById('login-message');
    loginMessage.textContent = msg;
    loginMessage.style.color = color;
};

const toggleLogin = () => (localStorage.getItem('loggedInUser') ? logout() : navigate('login'));

// Initialize login state
updateLoginState();
