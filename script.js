function navigateTo(sectionId) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => section.classList.remove('active'));
  const targetSection = document.getElementById(sectionId);
  targetSection.classList.add('active');
}

document.addEventListener('contextmenu', (e) => e.preventDefault());

// Aufklappbare Projektkarten
document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
      card.addEventListener("click", (event) => {
          event.stopPropagation();
          card.classList.toggle("open");
      });
  });
});

// Nachobenscroll Button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Funktion, die prüft, ob der Button eingeblendet werden soll
window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {  // ab 300px wird der Button angezeigt
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
});

// Beim Klick auf den Button sanft nach oben scrollen
scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// kein # nach url
document.querySelectorAll("a[href^='#']").forEach((anchor) => {
  anchor.addEventListener("click", function (event) {
      event.preventDefault(); // Verhindert Standardverhalten

      const targetId = this.getAttribute("href").substring(1); // ID des Ziels

      if (targetId === "home") {
          // Falls "Home" geklickt wird, nach ganz oben scrollen
          window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
              targetElement.scrollIntoView({ behavior: "smooth" });
          }
      }

      // Hash aus URL entfernen
      setTimeout(() => {
          history.replaceState(null, "", window.location.pathname + window.location.search);
      }, 100);
  });
});

// Menü für Mobile
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("open");
      hamburger.classList.toggle("active");
  });

  // Menü schließen, wenn ein Link angeklickt wird
  document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", function () {
          navLinks.classList.remove("open");
          hamburger.classList.remove("active");
      });
  });
});
