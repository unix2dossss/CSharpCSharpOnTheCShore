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

  // Function to parse calendar data (VCALENDAR format)
  function parseVCalendarData(data) {
    data_list = data.split("\n");
    const start_time = data_list[6].split(":")[1];
    const end_time = data_list[7].split(":")[1];
    const summary = data_list[9].split(":")[1];
    const description = data_list[10].split(":")[1];
    const location = data_list[11].split(":")[1];
    
    const event = {};

    event.summary = summary;
    event.description = description;
    event.location = location;
    event.dtstart = start_time;
    event.dtend = end_time;

    return event;
  }

  // Function to create event cards dynamically
  function createEventCard(event, index) {
    // console.log(event)
    const eventCard = document.createElement("div");
    eventCard.classList.add("event-card");

    const eventDate = document.createElement("div");
    eventDate.classList.add("event-date");
    const startDate = new Date(event.dtstart); // Parse the start date
    eventDate.innerHTML = `<p>${startDate.getDate()} ${startDate.toLocaleString('default', { month: 'short' })}<br>${startDate.getFullYear()}</p>`;

    const eventDetails = document.createElement("div");
    eventDetails.classList.add("event-details");
    eventDetails.innerHTML = `
      <h4>${event.summary}</h4>
      <p>${event.description}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <p><strong>Starts:</strong> ${new Date(event.dtstart).toLocaleString()}</p>
      <p><strong>Finishes:</strong> ${new Date(event.dtend).toLocaleString()}</p>
    `;

    const eventIcon = document.createElement("div");
    eventIcon.classList.add("event-icon");
    eventIcon.innerHTML = `<a href="https://cws.auckland.ac.nz/nzsl/api/Event/${index}" download="event_${index}.ics" class="icon-btn">
      <img src="" alt="Add to Calendar">
    </a>`;

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

    // Call the function to fetch and display the version
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