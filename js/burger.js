document.addEventListener("DOMContentLoaded", () => {
  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  console.log(burgerBtn, mobileMenu);
  if (!burgerBtn || !mobileMenu) return;

  let isOpen = false;

  function openMenu() {
    mobileMenu.classList.remove("scale-y-0", "opacity-0", "pointer-events-none");
    mobileMenu.classList.add("scale-y-100", "opacity-100");
    isOpen = true;
  }

  function closeMenu() {
    mobileMenu.classList.add("scale-y-0", "opacity-0", "pointer-events-none");
    mobileMenu.classList.remove("scale-y-100", "opacity-100");
    isOpen = false;
  }

  burgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen ? closeMenu() : openMenu();
  });

  document.addEventListener("click", (e) => {
    if (
      isOpen &&
      !mobileMenu.contains(e.target) &&
      !burgerBtn.contains(e.target)
    ) {
      closeMenu();
    }
  });

  // fermer quand on clique sur un lien
  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });
});