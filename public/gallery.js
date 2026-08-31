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
  const fullViewTrigger = gallery.querySelector("[data-full-view-trigger]");
  const fullView = document.querySelector("[data-full-view]");
  const fullViewClose = fullView.querySelector("[data-full-view-close]");
  const fullViewImage = fullView.querySelector("[data-full-view-image]");
  const fullViewTitle = fullView.querySelector("[data-full-view-title]");
  const fullViewNumber = fullView.querySelector("[data-full-view-number]");
  const fullViewCategory = fullView.querySelector("[data-full-view-category]");
  let activeIndex = 0;
  let pointerStart = null;
  let suppressStageClick = false;

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
      work.querySelector(".work-picture").tabIndex = isActive ? 0 : -1;
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
    gallery.dataset.titleSize = selected.dataset.titleSize || "normal";

    thumbnails[activeIndex].scrollIntoView({ block: "nearest", inline: "nearest" });

    if (moveFocus) thumbnails[activeIndex].focus({ preventScroll: true });
  };

  const openFullView = () => {
    const selected = works[activeIndex];
    const selectedImage = selected.querySelector(".work-image");

    fullViewImage.src = selectedImage.getAttribute("src");
    fullViewImage.alt = selectedImage.alt;
    fullViewTitle.textContent = selected.dataset.title;
    fullViewNumber.textContent = `${pad(activeIndex)} / ${String(works.length).padStart(2, "0")}`;
    fullViewCategory.textContent = selected.dataset.category;
    document.body.classList.add("has-full-view");
    fullView.showModal();
  };

  const closeFullView = () => fullView.close();

  thumbnails.forEach((button) => {
    button.addEventListener("click", () => showWork(Number(button.dataset.index)));
  });

  previous.addEventListener("click", () => showWork(activeIndex - 1));
  next.addEventListener("click", () => showWork(activeIndex + 1));
  fullViewTrigger.addEventListener("click", openFullView);
  fullViewClose.addEventListener("click", closeFullView);

  fullView.addEventListener("close", () => {
    document.body.classList.remove("has-full-view");
    fullViewTrigger.focus({ preventScroll: true });
  });

  gallery.addEventListener("keydown", (event) => {
    if (event.target.matches(".work-picture") && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      openFullView();
      return;
    }
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
    suppressStageClick = true;
    window.setTimeout(() => { suppressStageClick = false; }, 400);
    showWork(activeIndex + (deltaX < 0 ? 1 : -1));
  });

  stage.addEventListener("pointercancel", () => { pointerStart = null; });

  stage.addEventListener("click", (event) => {
    if (suppressStageClick) {
      suppressStageClick = false;
      return;
    }
    if (event.target.closest(".work-picture")) openFullView();
  });

  const indexFromHash = () => works.findIndex((work) => `#${work.id}` === window.location.hash);

  window.addEventListener("hashchange", () => {
    const requestedIndex = indexFromHash();
    if (requestedIndex >= 0) showWork(requestedIndex);
  });

  const requestedIndex = indexFromHash();
  showWork(requestedIndex >= 0 ? requestedIndex : 0);
}
