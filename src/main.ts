document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll(".section");
  const toggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  // Navegación SPA
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const sectionId = (e.target as HTMLElement).dataset["section"];
      sections.forEach(sec => sec.classList.remove("active"));
      document.getElementById(sectionId!)?.classList.add("active");
      navMenu?.classList.remove("active");
    });
  });

  // Menú responsive
  toggle?.addEventListener("click", () => {
    navMenu?.classList.toggle("active");
  });
});
