document.addEventListener("DOMContentLoaded", function () {
  // Sidebar and section handling
  const links = document.querySelectorAll(".sidebar-links a");
  const sections = document.querySelectorAll("section");

  function showSection(sectionId) {
      sections.forEach((section) => {
          section.style.display = "none"; // Hide all sections
      });

      const activeSection = document.querySelector(sectionId);
      if (activeSection) {
          activeSection.style.display = "flex"; // Show the selected section
      }

      const commentiframe = document.getElementById('comments-iframe');
      commentiframe.src = commentiframe.src;

      const commentMessage = document.getElementById('comment-message');
      commentMessage.textContent = "";
  }

  function setActiveLink(selectedLink) {
      links.forEach((link) => {
          link.classList.remove("active"); // Remove active class from all links
      });
      selectedLink.classList.add("active"); // Set active class for selected link
  }

  links.forEach((link) => {
      link.addEventListener("click", function (e) {
          e.preventDefault(); // Prevent default link behavior
          const sectionId = this.getAttribute("href");
          showSection(sectionId);
          setActiveLink(this);
      });
  });

  // Default view is the home section
  showSection("#home");
  setActiveLink(document.querySelector('a[href="#home"]'));

  // ------- Comment Posting --------
  const postCommentButton = document.getElementById('post-comment-button');
  const commentMessage = document.getElementById('comment-message');


  postCommentButton.addEventListener("click", function () {
      if (!storedUsername || !storedPassword) {
          // User is not logged in, redirect to login page
          // alert("Please login to post a comment.");
          commentMessage.textContent = "Please login to post a comment!";
          commentMessage.style.color = "orange"; // Set error message color
          showSection("#user-login");  // Redirect to the login section
          setActiveLink(document.querySelector('a[href="#user-login"]'));
      } else {
          postComment();
      }
  });

// Function to handle posting the comment
async function postComment() {
  const commentInput = document.getElementById('comment-input').value.trim();

  if (commentInput) {
      // Prepare the Authorization header using the stored credentials
      const authHeader = `Basic ${btoa(`${storedUsername}:${storedPassword}`)}`;

      try {
          // Construct the URL with the comment as part of the query string
          const url = `https://cws.auckland.ac.nz/nzsl/api/Comment?comment=${encodeURIComponent(commentInput)}`;

          // Send a POST request to the API with the Authorization header and comment in the query string
          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Authorization': authHeader, // Include the Authorization header
                  'Accept': 'text/plain' // Expect plain text in response
              }
          });

          const result = await response.text(); // Read the response as text
          commentMessage.textContent = "";


          // Handle response from the server
          if (response.ok) {
              document.getElementById('comment-input').value = ''; // Clear the input box
              const commentiframe = document.getElementById('comments-iframe');
              commentiframe.src = commentiframe.src;
              commentMessage.textContent = "Your comment has been posted!";
              commentMessage.style.color = "green"; // Set error message color
          } else {
              commentMessage.textContent = "Failed to post comment. Please try again!";
              commentMessage.style.color = "red"; // Set error message color
          }
      } catch (error) {
          console.error("Error posting comment:", error);
          alert("An error occurred while posting your comment. Please try again.");
      }
  } else {
      alert("Please write a comment before posting.");
  }
}




  // ------- Search --------
  
  const searchBar = document.getElementById("nzsl-search-bar");
  const resultsContainer = document.getElementById("sign-results");

  async function createGridItem(sign) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");

    const image = document.createElement("img");
    try {
      const imageUrl = `https://cws.auckland.ac.nz/nzsl/api/SignImage/${sign.id}`; // Construct the image URL
      const imageResponse = await fetch(imageUrl);

      if (imageResponse.ok) {
        image.src = imageUrl; // Set the image URL if the response is OK
        image.alt = `Sign for ${sign.description}`;
      } else {
        // If image fails, use a placeholder image
        image.src = "https://i.ibb.co/Hq9s35p/98196f62-00aa-4cfb-a0e2-1c48d17cef65.png";
        image.alt = "Image not available";
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      image.src = "https://i.ibb.co/Hq9s35p/98196f62-00aa-4cfb-a0e2-1c48d17cef65.png"; // Placeholder in case of error
      image.alt = "Image not available";
    }
    image.classList.add("grid-img");

    const description = document.createElement("p");
    description.textContent = sign.description;

    gridItem.appendChild(image);
    gridItem.appendChild(description);

    return gridItem;
  }

  // Function to fetch signs based on input
  async function fetchSigns(query = "") {
    let apiUrl = `https://cws.auckland.ac.nz/nzsl/api/Signs/${query}`;

    // If the query is empty, call the AllSigns API
    if (query.length === 0) {
      apiUrl = `https://cws.auckland.ac.nz/nzsl/api/AllSigns`;
    }

    try {
      const response = await fetch(apiUrl);
      const signs = await response.json(); // Assuming API returns JSON
      resultsContainer.innerHTML = ""; // Clear previous results

      for (const sign of signs) {
        const gridItem = await createGridItem(sign);
        resultsContainer.appendChild(gridItem);
      }
    } catch (error) {
      console.error("Error fetching signs:", error);
    }
  }

  const eventsContainer = document.querySelector(".events-container");

  // Function to fetch event count
  async function fetchEventCount() {
    try {
      const response = await fetch("https://cws.auckland.ac.nz/nzsl/api/EventCount");
      const eventCount = await response.json(); // Assuming it returns a number
      return eventCount;
    } catch (error) {
      console.error("Error fetching event count:", error);
      return 0;
    }
  }

  // Function to fetch individual events by index
  async function fetchEventByIndex(index) {
    try {
      const response = await fetch(`https://cws.auckland.ac.nz/nzsl/api/Event/${index}`, {
        headers: {
          'Accept': 'text/calendar' // Expecting the calendar format
        }
      });
      const eventData = await response.text(); // Fetching as plain text
      return eventData; // Returning raw calendar data
    } catch (error) {
      console.error(`Error fetching event ${index}:`, error);
      return null;
    }
  }

  function convertUtcToNZTime(utcString) {
    // Extract components from the string (format: 20240903T010000Z)
    const year = parseInt(utcString.slice(0, 4), 10);     // 2024
    const month = parseInt(utcString.slice(4, 6), 10) - 1; // 09 (months are 0-indexed in JS Date)
    const day = parseInt(utcString.slice(6, 8), 10);      // 03
    const hours = parseInt(utcString.slice(9, 11), 10);   // 01 (hours in 24-hour format)
    const minutes = parseInt(utcString.slice(11, 13), 10); // 00
    const seconds = parseInt(utcString.slice(13, 15), 10); // 00

    // Create a UTC date
    const utcDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds));

    // Return the date in local New Zealand time with the desired format
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
    // Extract the year, month, and day from the string
    const year = isoString.slice(0, 4);     // YYYY
    const month = isoString.slice(4, 6);    // MM
    const day = isoString.slice(6, 8);      // DD

    // Convert numeric month to abbreviated month name
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = monthNames[parseInt(month, 10) - 1];

    // Format the date as "9 Sep 2024"
    return `${parseInt(day, 10)} ${monthName} ${year}`;
  }

  // Function to parse calendar data (VCALENDAR format)
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

  // Function to create event cards dynamically
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

  // Function to load all events
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

  // Get the registration form and elements
  const registerForm = document.getElementById('registration-form');
  const registerMessage = document.getElementById('register-message');
  const nameInput = document.getElementById('register_name');
  const passwordInput = document.getElementById('register_password');
  const addressInput = document.getElementsByName('register_address')[0];

  // Function to handle form submission
  async function handleRegister(event) {
      event.preventDefault(); // Prevent the form from refreshing the page

      // Clear the previous message
      registerMessage.textContent = "";

      // Collect form data
      const username = nameInput.value.trim();
      const password = passwordInput.value.trim();
      const address = addressInput.value.trim();

      // Check if inputs are valid
      if (!username || !password || !address) {
          registerMessage.textContent = "Please fill in all the fields.";
          registerMessage.style.color = "red"; // Set error message color
          return;
      }

      // Prepare data to send in the request body
      const requestData = {
          username: username,
          password: password,
          address: address
      };

      try {
          // Send a POST request to the /api/Register endpoint
          const response = await fetch('https://cws.auckland.ac.nz/nzsl/api/Register', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestData) // Convert requestData object to JSON
          });

          const result = await response.text(); // Read response as text

          // Handle response from the server
          if (response.ok) {
              if (result.includes("registered")) {
                  // Display success message
                  registerMessage.textContent = result; // e.g., "User registered"
                  registerMessage.style.color = "green"; // Set success message color
                  registerForm.reset(); // Clear the form if registration successful
              } else {
                  // Display error message
                  registerMessage.textContent = result; // e.g., "Username not available"
                  registerMessage.style.color = "red"; // Set error message color
              }
          } else {
              registerMessage.textContent = "Something went wrong. Please try again.";
              registerMessage.style.color = "red"; // Set error message color
          }
      } catch (error) {
          console.error("Error during registration:", error);
          registerMessage.textContent = "An error occurred. Please try again.";
          registerMessage.style.color = "red"; // Set error message color
      }
  }

  const versionElement = document.querySelector('.version'); // Select the <p> element with the class "version"

    // Function to fetch the version
    async function fetchVersion() {
        try {
            // Send a GET request to the /api/Version endpoint
            const response = await fetch('https://cws.auckland.ac.nz/nzsl/api/Version');

            if (response.ok) {
                const version = await response.text(); // Assuming the response is plain text
                // Display the version in the <p> element
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

    const userInfo = document.getElementById('user-info'); // Placeholder for username and logout
    let storedUsername = null;
    let storedPassword = null;

    // Function to encode username and password to base64 for Authorization header
    function encodeCredentials(username, password) {
        return btoa(`${username}:${password}`); // base64 encoding
    }

    // Function to handle login form submission
    async function handleLogin(event) {
        event.preventDefault(); // Prevent form from submitting the traditional way

        // Clear the previous message
        loginMessage.textContent = "";

        // Collect username and password from form
        const username = document.getElementById('login_name').value.trim();
        const password = document.getElementById('login_password').value.trim();

        // If username or password is missing, show error message
        if (!username || !password) {
            alert("Please fill in both username and password.");
            return;
        }

        // Prepare the Authorization header using base64 encoding
        const authHeader = `Basic ${encodeCredentials(username, password)}`;

        try {
            // Send GET request to /api/TestAuth with Authorization header
            const response = await fetch('https://cws.auckland.ac.nz/nzsl/api/TestAuth', {
                method: 'GET',
                headers: {
                    'Authorization': authHeader
                }
            });

            const result = await response.text(); // Read response as text

            // Check if the response status is 200 (OK), meaning login is successful
            if (response.ok) {
                // Store the credentials in memory (logged-in state)
                storedUsername = username;
                storedPassword = password;
                loginMessage.textContent = `User ${storedUsername} logged in!`; // e.g., "User registered"
                loginMessage.style.color = "green"; // Set success message color
                // Update the sidebar with the username and logout option
                updateSidebarForLogin(username);
                loginForm.reset(); // Clear the form if registration successful
                commentMessage.textContent = "";
            } else {
                loginMessage.textContent = "Invalid Credentials. Please try again!"; // e.g., "Username not available"
                loginMessage.style.color = "red"; // Set error message color
            }
        } catch (error) {
            console.log("Debug Server Error!")
        }

    }

    // Function to update the sidebar with login info
    function updateSidebarForLogin(username) {
        // Clear any existing content in the user-info div
        userInfo.innerHTML = '';

        // Create a new list item for the username and logout link
        const userItem = document.createElement('div');
        userItem.classList.add('sidebar-item');
        userItem.innerHTML = `
            <span>${username}</span> - <a href="#" id="logout-link">Logout</a>
        `;

        // Add the item to the user-info div
        userInfo.appendChild(userItem);

        // Attach the logout event to the logout link
        const logoutLink = document.getElementById('logout-link');
        logoutLink.addEventListener('click', handleLogout);
    }

    // Function to log out (clears stored credentials and switches to guest mode)
    function handleLogout(event) {
        event.preventDefault();

        // Clear the stored credentials
        storedUsername = null;
        storedPassword = null;

        // Switch back to guest mode in the sidebar
        showGuestMode();
        
        alert("You have logged out.");
        loginMessage.textContent = "";
    }

    // Function to show the guest mode in the sidebar
    function showGuestMode() {
        userInfo.innerHTML = '<span>Browsing as Guest - <a href="#user-login">Login</a></span>';
    }

    // Call showGuestMode initially to ensure guest mode is shown by default
    showGuestMode();

    // Attach the submit event listener to the login form
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    loginForm.addEventListener('submit', handleLogin);


  fetchVersion();

  // Attach the submit event listener to the registration form
  registerForm.addEventListener('submit', handleRegister);

  // Load events when the page is ready
  loadEvents();

  // Call AllSigns when the page first loads to show all signs
  fetchSigns();

  // Event listener for search input
  searchBar.addEventListener("input", function () {
    const query = searchBar.value.trim();
    fetchSigns(query); // Fetch signs dynamically based on input
  });
});