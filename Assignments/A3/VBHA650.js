document.addEventListener("DOMContentLoaded", function () {
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
});
