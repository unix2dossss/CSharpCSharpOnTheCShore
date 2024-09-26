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

  function createGridItem(sign) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");

    const image = document.createElement("img");
    image.src = "https://i.ibb.co/Hq9s35p/98196f62-00aa-4cfb-a0e2-1c48d17cef65.png"; // Placeholder image
    image.alt = `Sign for ${sign.description}`;
    image.classList.add("grid-img");

    const description = document.createElement("p");
    description.textContent = sign.description;

    gridItem.appendChild(image);
    gridItem.appendChild(description);

    return gridItem;
  }

  // Function to fetch signs based on input
  async function fetchSigns(query="") {
    api_url = `https://cws.auckland.ac.nz/nzsl/api/Signs/${query}`
    if (query.length === 0) {
      api_url = `https://cws.auckland.ac.nz/nzsl/api/AllSigns`
    }

    try {
      const response = await fetch(api_url);
      const signs = await response.json(); // Assuming API returns JSON
      resultsContainer.innerHTML = ""; // Clear previous results

      signs.forEach(sign => {
        const gridItem = createGridItem(sign);
        resultsContainer.appendChild(gridItem);
      });
    } catch (error) {
      console.error("Error fetching signs:", error);
    }
  }

  fetchSigns();
  // Event listener for search input
  searchBar.addEventListener("input", function () {
    const query = searchBar.value.trim();
    fetchSigns(query); // Fetch signs dynamically based on input
  });

});
