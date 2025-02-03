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
