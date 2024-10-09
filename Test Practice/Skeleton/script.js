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
