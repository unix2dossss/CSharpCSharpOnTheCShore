// Wait for the document to load
document.addEventListener("DOMContentLoaded", function () {
    // Get all navigation links and sections
    const links = document.querySelectorAll(".sidebar-links a");
    const sections = document.querySelectorAll("section");
  
    // Function to show the selected section and hide others
    function showSection(sectionId) {
      sections.forEach((section) => {
        section.style.display = "none"; // Hide all sections
      });
  
      // Show the selected section
      const activeSection = document.querySelector(sectionId);
      if (activeSection) {
        activeSection.style.display = "block";
      }
    }
  
    // Add click event listeners to each link
    links.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent the default anchor behavior
        const sectionId = this.getAttribute("href"); // Get the target section from the href
        showSection(sectionId); // Call the function to show the section
      });
    });
  
    // Show the home section by default on page load
    showSection("#home");
  });
  