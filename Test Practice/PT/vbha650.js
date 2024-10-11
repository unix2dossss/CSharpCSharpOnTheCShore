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

    // https://cws.auckland.ac.nz/nzsl/api/TestAuth
    try {
        const response = await fetch('URL', {
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
    // https://cws.auckland.ac.nz/nzsl/api/SignImage/${sign.id}
    const imageUrl = `URL`;
    const imageResponse = await fetch(imageUrl);

    if (imageResponse.ok) {
      image.src = imageUrl;
      image.alt = `Sign for ${sign.description}`;
    }
  } catch (error) {
    console.error("Error fetching image:", error);
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
    // https://cws.auckland.ac.nz/nzsl/api/Signs/${query}
  let apiUrl = ``;

  if (query.length === 0) {
    // https://cws.auckland.ac.nz/nzsl/api/AllSigns
    apiUrl = ``;
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


const postCommentButton = document.getElementById('post-comment-button');
const commentMessage = document.getElementById('comment-message');


  postCommentButton.addEventListener("click", function () {
      if (!storedUsername || !storedPassword) {
          commentMessage.textContent = "Please login to post a comment!";
          commentMessage.style.color = "orange";
          showSection("#user-login");
          setActiveLink(document.querySelector('a[href="#user-login"]'));
      } else {
          postComment();
      }
  });

async function postComment() {
  const commentInput = document.getElementById('comment-input').value.trim();

  if (commentInput) {
      const authHeader = `Basic ${btoa(`${storedUsername}:${storedPassword}`)}`;

      try {
        // https://cws.auckland.ac.nz/nzsl/api/Comment?comment=${encodeURIComponent(commentInput)}
          const url = ``;

          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Authorization': authHeader,
                  'Accept': 'text/plain'
              }
          });

          const result = await response.text();
          commentMessage.textContent = "";


          if (response.ok) {
              document.getElementById('comment-input').value = '';
              const commentiframe = document.getElementById('comments-iframe');
              commentiframe.src = commentiframe.src;
              commentMessage.textContent = "Your comment has been posted!";
              commentMessage.style.color = "green";
          } else {
              commentMessage.textContent = "Failed to post comment. Please try again!";
              commentMessage.style.color = "red";
          }
      } catch (error) {
          console.error("Error posting comment:", error);
          alert("An error occurred while posting your comment. Please try again.");
      }
  } else {
      alert("Please write a comment before posting.");
  }
}


const registerForm = document.getElementById('registration-form');
  const registerMessage = document.getElementById('register-message');
  const nameInput = document.getElementById('register_name');
  const passwordInput = document.getElementById('register_password');
  const addressInput = document.getElementsByName('register_address')[0];

  async function handleRegister(event) {
      event.preventDefault();

      registerMessage.textContent = "";

      const username = nameInput.value.trim();
      const password = passwordInput.value.trim();
      const address = addressInput.value.trim();

      if (!username || !password || !address) {
          registerMessage.textContent = "Please fill in all the fields.";
          registerMessage.style.color = "red";
          return;
      }

      const requestData = {
          username: username,
          password: password,
          address: address
      };

      try {
        // https://cws.auckland.ac.nz/nzsl/api/Register
          const response = await fetch('', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestData)
          });

          const result = await response.text();

          if (response.ok) {
              if (result.includes("registered")) {
                  registerMessage.textContent = result;
                  registerMessage.style.color = "green";
                  registerForm.reset();
              } else {
                  registerMessage.textContent = result;
                  registerMessage.style.color = "red";
              }
          } else {
              registerMessage.textContent = "Something went wrong. Please try again.";
              registerMessage.style.color = "red";
          }
      } catch (error) {
          console.error("Error during registration:", error);
          registerMessage.textContent = "An error occurred. Please try again.";
          registerMessage.style.color = "red";
      }
  }


registerForm.addEventListener('submit', handleRegister);

async function getLogs() {
    try {
        // https://cws.auckland.ac.nz/nzsl/api/Log
        const response = await fetch("");
        const logs = await response.json(); 
        return logs;
    } catch (error) {
        console.error("Error fetching total Logs:", error);
        return [];
    }
}

let dates = [];
let visits = [];
let uniqueVisits = [];
let noOfLogPoints;
let maxVisits;
let minVisits;
let height;
let width;

let visitsTransformed = [];
let uniqueVisitsTransformed = [];

let svg;

async function createSVGBase() {
    let svgWidth = width;
    let svgHeight = height;

    let totalSvgWidth = svgWidth + 30;

    svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "auto");
    svg.setAttribute("viewBox", `-30 0 ${totalSvgWidth} ${svgHeight}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("width", svgWidth);
    rect.setAttribute("height", svgHeight);
    rect.setAttribute("fill", "lightgray");
    rect.setAttribute("stroke", "black");
    rect.setAttribute("stroke-width", "2");

    svg.appendChild(rect);

    let maxText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    maxText.setAttribute("x", -20);
    maxText.setAttribute("y", 10);
    maxText.setAttribute("fill", "black");
    maxText.setAttribute("font-size", "12px");
    maxText.setAttribute("text-anchor", "middle");
    maxText.textContent = maxVisits;
    svg.appendChild(maxText);

    let minText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    minText.setAttribute("x", -20);
    minText.setAttribute("y", svgHeight - 5);
    minText.setAttribute("fill", "black");
    minText.setAttribute("font-size", "12px");
    minText.setAttribute("text-anchor", "middle");
    minText.textContent = minVisits;
    svg.appendChild(minText);
}



async function initValues() {
    const app_logs = await getLogs();
    console.log(app_logs);

    app_logs.forEach(item => {
        dates.push(item.date);
        visits.push(item.visits);
        uniqueVisits.push(item.uniqueVisits);
    });

    const allVisits = [...visits, ...uniqueVisits];

    maxVisits = Math.max(...allVisits);
    minVisits = Math.min(...allVisits);

    height = maxVisits - minVisits;
    width = height * 3.56;

    noOfLogPoints = app_logs.length;
}

async function generateTransformedValues() {
    visitsTransformed = [];
    uniqueVisitsTransformed = [];

    for (let i = 0; i < noOfLogPoints; i++) {
        let v = [];
        let u = [];

        let vx = (width / (noOfLogPoints - 1)) * i;
        let ux = (width / (noOfLogPoints - 1)) * i;

        let vy = height - ((visits[i] - minVisits) / (maxVisits - minVisits) * height);
        let uy = height - ((uniqueVisits[i] - minVisits) / (maxVisits - minVisits) * height);

        v.push(vx);
        v.push(vy);

        u.push(ux);
        u.push(uy);

        visitsTransformed.push(v);
        uniqueVisitsTransformed.push(u);
    }
}


async function generateGraph() {
    await initValues();
    await generateTransformedValues();
    createSVGBase();

    document.getElementById("start-date").textContent = dates[0];
    document.getElementById("end-date").textContent = dates[dates.length - 1];

    let visitsPointsString = visitsTransformed.map(point => point.join(",")).join(" ");
    let uniqueVisitsPointsString = uniqueVisitsTransformed.map(point => point.join(",")).join(" ");

    let visitsPolyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    visitsPolyline.setAttribute("points", visitsPointsString);
    visitsPolyline.setAttribute("fill", "none");
    visitsPolyline.setAttribute("stroke", "red");
    visitsPolyline.setAttribute("stroke-width", "2");

    let uniqueVisitsPolyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    uniqueVisitsPolyline.setAttribute("points", uniqueVisitsPointsString);
    uniqueVisitsPolyline.setAttribute("fill", "none");
    uniqueVisitsPolyline.setAttribute("stroke", "green");
    uniqueVisitsPolyline.setAttribute("stroke-width", "2");

    svg.appendChild(visitsPolyline);
    svg.appendChild(uniqueVisitsPolyline);

    const graphContainer = document.getElementById("graph-container");
    graphContainer.appendChild(svg);

    document.getElementById("visit-data-points").textContent = visits.join(", ")
    document.getElementById("unique-data-points").textContent = uniqueVisits.join(", ");
}



window.addEventListener("resize", async function() {
    if (svg) {
        document.body.removeChild(svg);
    }

    await generateGraph();
});

generateGraph();


function DoPost() {
    const data2send = GetData();
    // https://www.cws.auckland.ac.nz/AddTwoSvc/Api/SumAuth
    fetch("URL", {
       method: "POST",
       headers:
       {
          "Content-Type": "application/json",
          "Authorization": "Basic dXNlcjMzNTpwYXNzd29yZDMzNQ==",
       },
       body: JSON.stringify(data2send)
    })
       .then((response) => response.text())
       .then((result) => {resultData = result; alert(result)});
 }

 function GetData() {
    const a = document.getElementById("a");
    const b = document.getElementById("b");
    const data2send = {
       "a": Number(a.value),
       "b": Number(b.value),
    };
    return data2send;
 }