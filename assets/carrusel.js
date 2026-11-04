(function () {
  const carousel = document.querySelector(".tribo-carousel");
  if (!carousel) return;

  const viewport = carousel.querySelector(".tribo-carousel-viewport");
  const track = carousel.querySelector(".tribo-carousel-track");
  const previousButton = carousel.querySelector(".tribo-carousel-button--prev");
  const nextButton = carousel.querySelector(".tribo-carousel-button--next");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!viewport || !track || !previousButton || !nextButton) {
    console.error("No se pudo iniciar el carrusel: faltan elementos de navegación.");
    return;
  }

  let isAnimating = false;
  let autoPlay;

  function getStep() {
    const firstSlide = track.firstElementChild;
    if (!firstSlide) return 0;
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 0;
    return firstSlide.getBoundingClientRect().width + gap;
  }

  function moveNext() {
    if (isAnimating || track.children.length < 2) return;
    isAnimating = true;
    const step = getStep();
    track.style.transition = "";
    track.style.transform = "translateX(-" + step + "px)";

    function finish() {
      if (!isAnimating) return;
      isAnimating = false;
      track.append(track.firstElementChild);
      track.style.transition = "none";
      track.style.transform = "translateX(0)";
      track.offsetHeight;
      track.style.transition = "";
    }

    track.addEventListener("transitionend", finish, { once: true });
    window.setTimeout(finish, 550);
  }

  function movePrevious() {
    if (isAnimating || track.children.length < 2) return;
    isAnimating = true;
    const step = getStep();
    track.style.transition = "none";
    track.prepend(track.lastElementChild);
    track.style.transform = "translateX(-" + step + "px)";
    track.offsetHeight;
    window.requestAnimationFrame(function () {
      track.style.transition = "";
      track.style.transform = "translateX(0)";
    });

    function finish() {
      if (!isAnimating) return;
      isAnimating = false;
      track.style.transition = "";
      track.style.transform = "";
    }

    track.addEventListener("transitionend", finish, { once: true });
    window.setTimeout(finish, 550);
  }

  function startAutoPlay() {
    window.clearInterval(autoPlay);
    if (reducedMotion.matches) return;
    autoPlay = window.setInterval(function () {
      if (!document.hidden && !carousel.matches(":hover") && !carousel.contains(document.activeElement)) {
        moveNext();
      }
    }, 5000);
  }

  previousButton.addEventListener("click", movePrevious);
  nextButton.addEventListener("click", moveNext);
  reducedMotion.addEventListener("change", startAutoPlay);
  startAutoPlay();
})();
