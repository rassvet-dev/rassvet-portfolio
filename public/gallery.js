const gallery = document.querySelector("[data-gallery]");

if (gallery) {
  const stage = gallery.querySelector("[data-stage]");
  const works = [...gallery.querySelectorAll(".work")];
  const thumbnails = [...gallery.querySelectorAll(".thumbnail")];
  const currentLabel = gallery.querySelector("[data-current]");
  const title = gallery.querySelector("[data-title-output]");
  const titleEcho = gallery.querySelector("[data-title-echo]");
  const subtitle = gallery.querySelector("[data-subtitle-output]");
  const category = gallery.querySelector("[data-category-output]");
  const previous = gallery.querySelector("[data-prev]");
  const next = gallery.querySelector("[data-next]");
  let activeIndex = 0;
  let pointerStart = null;

  const pad = (value) => String(value + 1).padStart(2, "0");

  const renderCharacters = (element, value) => {
    element.replaceChildren();
    [...value].forEach((character, index) => {
      const span = document.createElement("span");
      span.className = "motion-char";
      span.style.setProperty("--char-index", index);
      span.textContent = character === " " ? "\u00a0" : character;
      element.append(span);
    });
  };

  const showWork = (nextIndex, moveFocus = false) => {
    const normalized = (nextIndex + works.length) % works.length;
    const selected = works[normalized];

    works.forEach((work, index) => {
      const isActive = index === normalized;
      work.classList.toggle("is-active", isActive);
      work.setAttribute("aria-hidden", String(!isActive));
    });

    thumbnails.forEach((button, index) => {
      const isActive = index === normalized;
      button.classList.toggle("is-active", isActive);
      button.toggleAttribute("aria-current", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    activeIndex = normalized;
    currentLabel.textContent = pad(activeIndex);
    category.textContent = selected.dataset.category;
    subtitle.textContent = selected.dataset.subtitle;
    renderCharacters(title, selected.dataset.title);
    renderCharacters(titleEcho, selected.dataset.title);
    gallery.style.setProperty("--accent", selected.dataset.accent);
    gallery.dataset.tone = selected.dataset.tone;

    if (moveFocus) thumbnails[activeIndex].focus({ preventScroll: true });
  };

  thumbnails.forEach((button) => {
    button.addEventListener("click", () => showWork(Number(button.dataset.index)));
  });

  previous.addEventListener("click", () => showWork(activeIndex - 1));
  next.addEventListener("click", () => showWork(activeIndex + 1));

  gallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showWork(activeIndex - 1, true);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showWork(activeIndex + 1, true);
    }
    if (event.key === "Home") {
      event.preventDefault();
      showWork(0, true);
    }
    if (event.key === "End") {
      event.preventDefault();
      showWork(works.length - 1, true);
    }
  });

  stage.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStart = { x: event.clientX, y: event.clientY };
  });

  stage.addEventListener("pointerup", (event) => {
    if (!pointerStart) return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(deltaX) < 54 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    showWork(activeIndex + (deltaX < 0 ? 1 : -1));
  });

  stage.addEventListener("pointercancel", () => { pointerStart = null; });

  showWork(0);
}
