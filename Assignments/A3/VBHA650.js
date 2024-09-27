document.addEventListener("DOMContentLoaded", function () {
  // Sidebar and section handling
  const links = document.querySelectorAll(".sidebar-links a");
  const sections = document.querySelectorAll("section");

  function showSection(sectionId) {
      sections.forEach((section) => {
          section.style.display = "none";
      });

      const activeSection = document.querySelector(sectionId);
      if (activeSection) {
          activeSection.style.display = "flex";
      }

      const commentiframe = document.getElementById('comments-iframe');
      commentiframe.src = commentiframe.src;

      const commentMessage = document.getElementById('comment-message');
      commentMessage.textContent = "";
  }

  function setActiveLink(selectedLink) {
      links.forEach((link) => {
          link.classList.remove("active");
      });
      selectedLink.classList.add("active");
  }

  links.forEach((link) => {
      link.addEventListener("click", function (e) {
          e.preventDefault();
          const sectionId = this.getAttribute("href");
          showSection(sectionId);
          setActiveLink(this);
      });
  });

  showSection("#home");
  setActiveLink(document.querySelector('a[href="#home"]'));

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
          const url = `https://cws.auckland.ac.nz/nzsl/api/Comment?comment=${encodeURIComponent(commentInput)}`;

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

  const eventsContainer = document.querySelector(".events-container");

  async function fetchEventCount() {
    try {
      const response = await fetch("https://cws.auckland.ac.nz/nzsl/api/EventCount");
      const eventCount = await response.json();
      return eventCount;
    } catch (error) {
      console.error("Error fetching event count:", error);
      return 0;
    }
  }

  async function fetchEventByIndex(index) {
    try {
      const response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/Event/${index}`, {
        headers: {
          'Accept': 'text/calendar'
        }
      });
      const eventData = await response.text();
      return eventData;
    } catch (error) {
      console.error(`Error fetching event ${index}:`, error);
      return null;
    }
  }

  function convertUtcToNZTime(utcString) {
    const year = parseInt(utcString.slice(0, 4), 10);
    const month = parseInt(utcString.slice(4, 6), 10) - 1;
    const day = parseInt(utcString.slice(6, 8), 10);
    const hours = parseInt(utcString.slice(9, 11), 10);
    const minutes = parseInt(utcString.slice(11, 13), 10);
    const seconds = parseInt(utcString.slice(13, 15), 10);

    const utcDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds));

    return utcDate.toLocaleString("en-NZ", {
        timeZone: "Pacific/Auckland",
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });
  }

  function formatDateString(isoString) {
    const year = isoString.slice(0, 4);
    const month = isoString.slice(4, 6);
    const day = isoString.slice(6, 8);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[parseInt(month, 10) - 1];

    return `${parseInt(day, 10)} ${monthName} ${year}`;
  }

  function parseVCalendarData(data) {
    data_list = data.split("\n");
    const start_time = data_list[6].split(":")[1];
    const end_time = data_list[7].split(":")[1];
    const summary = data_list[9].split(":")[1];
    const description = data_list[10].split(":")[1];
    const location = data_list[11].split(":")[1];
    
    const startNZTime = convertUtcToNZTime(start_time);
    const endNZTime = convertUtcToNZTime(end_time);
    const formattedDate = formatDateString(start_time);


    const event = {};

    event.summary = summary;
    event.description = description;
    event.location = location;
    event.dtstart = startNZTime;
    event.dtend = endNZTime;
    event.date = formattedDate;

    return event;
  }

  function createEventCard(event, index) {
    const eventCard = document.createElement("div");
    eventCard.classList.add("event-card");

    const eventDate = document.createElement("div");
    eventDate.classList.add("event-date");
    eventDate.innerHTML = `<p>📅<br>${event.date.split(" ")[0]} ${event.date.split(" ")[1]}<br>${event.date.split(" ")[2]}</p>`;

    const eventDetails = document.createElement("div");
    eventDetails.classList.add("event-details");
    eventDetails.innerHTML = `
      <h4>${event.summary}</h4>
      <p>${event.description}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <p><strong>Starts:</strong> ${event.dtstart}</p>
      <p><strong>Finishes:</strong> ${event.dtend}</p>
    `;

    const eventIcon = document.createElement("div");
    eventIcon.classList.add("event-icon");
    eventIcon.innerHTML = `<a href="https://cws.auckland.ac.nz/nzsl/api/Event/${index}" download="event_${index}.ics" class="icon-btn">Add to Calendar</a>`;

    eventCard.appendChild(eventDate);
    eventCard.appendChild(eventDetails);
    eventCard.appendChild(eventIcon);

    return eventCard;
  }

  async function loadEvents() {
    const eventCount = await fetchEventCount();
    
    for (let i = 0; i < eventCount; i++) {
      const eventData = await fetchEventByIndex(i);
      if (eventData) {
        const parsedEvent = parseVCalendarData(eventData);
        const eventCard = createEventCard(parsedEvent, i);
        eventsContainer.appendChild(eventCard);
      }
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
          registerMessage.style.color = "red"; // Set error message color
          return;
      }

      const requestData = {
          username: username,
          password: password,
          address: address
      };

      try {
          const response = await fetch('https://cws.auckland.ac.nz/nzsl/api/Register', {
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

  const versionElement = document.querySelector('.version');

    async function fetchVersion() {
        try {
            const response = await fetch('https://cws.auckland.ac.nz/nzsl/api/Version');

            if (response.ok) {
                const version = await response.text();
                versionElement.textContent = `Version: ${version}`;
            } else {
                versionElement.textContent = "Failed to fetch version.";
                console.error("Failed to fetch version: ", response.statusText);
            }
        } catch (error) {
            versionElement.textContent = "Error fetching version.";
            console.error("Error fetching version: ", error);
        }
    }

    const userInfo = document.getElementById('user-info');
    let storedUsername = null;
    let storedPassword = null;

    function encodeCredentials(username, password) {
        return btoa(`${username}:${password}`);
    }

    async function handleLogin(event) {
        event.preventDefault();

        loginMessage.textContent = "";

        const username = document.getElementById('login_name').value.trim();
        const password = document.getElementById('login_password').value.trim();

        if (!username || !password) {
            alert("Please fill in both username and password.");
            return;
        }

        const authHeader = `Basic ${encodeCredentials(username, password)}`;

        try {
            const response = await fetch('https://cws.auckland.ac.nz/nzsl/api/TestAuth', {
                method: 'GET',
                headers: {
                    'Authorization': authHeader
                }
            });

            const result = await response.text();

            if (response.ok) {
                storedUsername = username;
                storedPassword = password;
                loginMessage.textContent = `User ${storedUsername} logged in!`;
                loginMessage.style.color = "green";
                updateSidebarForLogin(username);
                loginForm.reset();
                commentMessage.textContent = "";
            } else {
                loginMessage.textContent = "Invalid Credentials. Please try again!";
                loginMessage.style.color = "red";
            }
        } catch (error) {
            console.log("Debug Server Error!")
        }

    }

    function updateSidebarForLogin(username) {
        userInfo.innerHTML = '';

        const userItem = document.createElement('div');
        userItem.classList.add('sidebar-item');
        userItem.innerHTML = `
            <span>${username}</span> - <a href="#" id="logout-link"><strong>LOGOUT</strong></a>
        `;

        userInfo.appendChild(userItem);

        const logoutLink = document.getElementById('logout-link');
        logoutLink.addEventListener('click', handleLogout);
    }

    function handleLogout(event) {
        event.preventDefault();

        storedUsername = null;
        storedPassword = null;

        showGuestMode();
        
        alert("You have logged out.");
        loginMessage.textContent = "";
    }

    function showGuestMode() {
        userInfo.innerHTML = '<span>Browsing as Guest</span>';
    }

    showGuestMode();

    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    loginForm.addEventListener('submit', handleLogin);


  fetchVersion();

  registerForm.addEventListener('submit', handleRegister);

  loadEvents();

  fetchSigns();

  searchBar.addEventListener("input", function () {
    const query = searchBar.value.trim();
    fetchSigns(query);
  });
});