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


async function fetchVersion() {
    // https://cws.auckland.ac.nz/Qz2021JGC/api/Version
    const response = await fetch('URL');
    const data = await response.json();
    document.getElementById('version').textContent = 'Version: ' + data;
}

async function fetchCaseData() {
    // https://cws.auckland.ac.nz/Qz2021JGC/api/CaseCounts
    const response = await fetch('URL');
    const data = await response.json();
    const tbody = document.getElementById('case-data');
    Object.entries(data).forEach(([date, caseCount]) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${date}</td><td>${caseCount}</td>`;
        tbody.appendChild(row);
    });
}

async function init() {
    await fetchVersion();
    await fetchCaseData();
}

init();





// ODATA LINK TABLE:

// https://services.odata.org/Northwind/Northwind.svc/
const baseUrl = "URL";

async function GetData(url) {
let allData = [];
while (url) {
    const response = await fetch(url, {
    headers: {
        Accept: "application/json",
    },
    });

    if (!response.ok) {
    console.error("Failed to fetch data:", response.status, response.statusText);
    break;
    }

    const text = await response.json();
    const data = text.value;
    allData = allData.concat(data);

    url = text["odata.nextLink"]
    ? baseUrl + text["odata.nextLink"] + "&$format=json"
    : null;
}
return allData;
}

async function PopulateTable() {
const initialUrl = baseUrl + "Orders?$format=json";
const dataOut = await GetData(initialUrl);
const table = document.getElementById("odata_table");

dataOut.forEach((order, index) => {
    const row = document.createElement("tr");
    row.style.backgroundColor = index % 2 === 0 ? "lightblue" : "lightgray";

    const orderIdCell = document.createElement("td");
    orderIdCell.textContent = order.OrderID;
    row.appendChild(orderIdCell);

    const destinationCell = document.createElement("td");
    destinationCell.textContent = `${order.ShipName}, ${order.ShipAddress}, ${order.ShipCity}, ${order.ShipPostalCode}, ${order.ShipCountry}`;
    row.appendChild(destinationCell);

    table.appendChild(row);
});
}

PopulateTable();


const searchBar = document.getElementById("nzsl-search-bar");
const resultsContainer = document.getElementById("sign-results");

async function createGridItem(sign) {
  const gridItem = document.createElement("div");
  gridItem.classList.add("grid-item");

  const image = document.createElement("img");
  try {
    const imageUrl = `https://cws.auckland.ac.nz/nzsl/api/SignImage/${sign.id}`;
    const imageResponse = await fetch(imageUrl);

    if (imageResponse.ok) {
      image.src = imageUrl;
      image.alt = `Sign for ${sign.description}`;
    } else {
      image.src = "https://i.ibb.co/Hq9s35p/98196f62-00aa-4cfb-a0e2-1c48d17cef65.png";
      image.alt = "Image not available";
    }
  } catch (error) {
    console.error("Error fetching image:", error);
    image.src = "https://i.ibb.co/Hq9s35p/98196f62-00aa-4cfb-a0e2-1c48d17cef65.png";
    image.alt = "Image not available";
  }
  image.classList.add("grid-img");

  const description = document.createElement("p");
  description.textContent = sign.description;

  gridItem.appendChild(image);
  gridItem.appendChild(description);

  return gridItem;
}

async function fetchSigns(query = "") {
  let apiUrl = `https://cws.auckland.ac.nz/nzsl/api/Signs/${query}`;

  if (query.length === 0) {
    apiUrl = `https://cws.auckland.ac.nz/nzsl/api/AllSigns`;
  }

  try {
    const response = await fetch(apiUrl);
    const signs = await response.json();
    resultsContainer.innerHTML = "";

    for (const sign of signs) {
      const gridItem = await createGridItem(sign);
      resultsContainer.appendChild(gridItem);
    }
  } catch (error) {
    console.error("Error fetching signs:", error);
  }
}

fetchSigns();

searchBar.addEventListener("input", function () {
    const query = searchBar.value.trim();
    fetchSigns(query);
});