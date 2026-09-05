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
  const fullViewCanvas = fullView.querySelector("[data-full-view-canvas]");
  const fullViewImage = fullView.querySelector("[data-full-view-image]");
  const fullViewTitle = fullView.querySelector("[data-full-view-title]");
  const fullViewNumber = fullView.querySelector("[data-full-view-number]");
  const fullViewCategory = fullView.querySelector("[data-full-view-category]");
  const fitToggle = fullView.querySelector("[data-viewer-fit]");
  const announcement = gallery.querySelector("[data-announcement]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const rail = gallery.querySelector(".thumbnail-rail");
  let activeIndex = 0;
  let imageAnimation = null;
  let selectionRequest = 0;
  let pointerStart = null;
  let suppressStageClick = false;
  let fullViewDrag = null;

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

  const showWork = async (nextIndex, moveFocus = false) => {
    const normalized = (nextIndex + works.length) % works.length;
    const selected = works[normalized];
    const request = ++selectionRequest;
    const direction = nextIndex < activeIndex ? -1 : 1;
    const selectedImage = selected.querySelector(".work-image");
    try { await selectedImage.decode(); } catch { /* Display the image's alt text on failure. */ }
    if (request !== selectionRequest) return;

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
    if (/^#work-\d+$/.test(location.hash)) history.replaceState(null, "", `#${selected.id}`);
    currentLabel.textContent = pad(activeIndex);
    category.textContent = selected.dataset.category;
    subtitle.textContent = selected.dataset.subtitle;
    renderCharacters(title, selected.dataset.title);
    renderCharacters(titleEcho, selected.dataset.title);
    gallery.dataset.tone = selected.dataset.tone;
    gallery.dataset.titleSize = selected.dataset.titleSize || "normal";
    gallery.dataset.titleZone = Number(selected.dataset.faceY || 0.5) > 0.42 ? "top" : "bottom";

    // Move only the thumbnail strip; selecting a work must not scroll the page.
    const thumb = thumbnails[activeIndex];
    const thumbBox = thumb.getBoundingClientRect();
    const railBox = rail.getBoundingClientRect();
    if (thumbBox.left < railBox.left || thumbBox.right > railBox.right) {
      rail.scrollTo({ left: thumb.offsetLeft - rail.clientWidth / 2 + thumb.clientWidth / 2, behavior: reducedMotion.matches ? "instant" : "smooth" });
    }
    announcement.textContent = `${pad(activeIndex)} / ${works.length}、${selected.dataset.title}`;
    imageAnimation?.cancel();
    if (!reducedMotion.matches) {
      imageAnimation = selectedImage.animate([
        { opacity: 0, transform: `translateX(${direction * 28}px) scale(0.97)`, clipPath: direction > 0 ? "inset(0 18% 0 0)" : "inset(0 0 0 18%)", filter: "blur(12px)" },
        { opacity: 1, transform: "translateX(0) scale(1)", clipPath: "inset(0 0 0 0)", filter: "blur(0)" }
      ], { duration: 850, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
    }

    if (moveFocus) thumbnails[activeIndex].focus({ preventScroll: true });
    return selected;
  };

  const centerFullViewOnFace = (selected) => {
    const faceX = Number(selected.dataset.faceX || 0.5);
    const faceY = Number(selected.dataset.faceY || 0.5);
    const targetX = fullViewImage.offsetLeft + fullViewImage.clientWidth * faceX;
    const targetY = fullViewImage.offsetTop + fullViewImage.clientHeight * faceY;

    fullViewCanvas.scrollLeft = Math.max(0, targetX - fullViewCanvas.clientWidth / 2);
    fullViewCanvas.scrollTop = Math.max(0, targetY - fullViewCanvas.clientHeight / 2);
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
    if (!fullView.open) fullView.showModal();
    fullViewCanvas.focus({ preventScroll: true });

    const revealFace = () => window.requestAnimationFrame(() => {
      if (!fullView.classList.contains("is-fit")) centerFullViewOnFace(selected);
    });
    if (fullViewImage.complete) revealFace();
    else fullViewImage.addEventListener("load", revealFace, { once: true });
  };

  const closeFullView = () => fullView.close();

  thumbnails.forEach((button) => {
    button.addEventListener("click", () => showWork(Number(button.dataset.index)));
  });

  previous.addEventListener("click", () => showWork(activeIndex - 1));
  next.addEventListener("click", () => showWork(activeIndex + 1));
  fullViewTrigger.addEventListener("click", openFullView);
  fullViewClose.addEventListener("click", closeFullView);
  fitToggle.addEventListener("click", () => {
    const fit = fullView.classList.toggle("is-fit");
    fitToggle.setAttribute("aria-pressed", String(fit));
    fitToggle.textContent = fit ? "実寸表示" : "全体表示";
    fullViewCanvas.setAttribute("aria-label", fit ? "作品全体の表示" : "実寸画像。スクロールまたはドラッグで移動できます");
    if (!fit) window.requestAnimationFrame(() => centerFullViewOnFace(works[activeIndex]));
  });
  for (const [selector, offset] of [["[data-viewer-prev]", -1], ["[data-viewer-next]", 1]]) {
    fullView.querySelector(selector).addEventListener("click", async () => {
      const selected = await showWork(activeIndex + offset);
      if (selected && fullView.open) openFullView();
    });
  }
  reducedMotion.addEventListener("change", () => { if (reducedMotion.matches) imageAnimation?.cancel(); });

  fullView.addEventListener("close", () => {
    fullViewDrag = null;
    fullViewCanvas.classList.remove("is-grabbing");
    document.body.classList.remove("has-full-view");
    fullViewTrigger.focus({ preventScroll: true });
  });

  fullViewCanvas.addEventListener("pointerdown", (event) => {
    if (fullView.classList.contains("is-fit") || event.pointerType === "touch" || event.button !== 0) return;
    fullViewDrag = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: fullViewCanvas.scrollLeft,
      top: fullViewCanvas.scrollTop
    };
    fullViewCanvas.setPointerCapture(event.pointerId);
    fullViewCanvas.classList.add("is-grabbing");
  });

  fullViewCanvas.addEventListener("pointermove", (event) => {
    if (!fullViewDrag || event.pointerId !== fullViewDrag.pointerId) return;
    event.preventDefault();
    fullViewCanvas.scrollLeft = fullViewDrag.left - (event.clientX - fullViewDrag.x);
    fullViewCanvas.scrollTop = fullViewDrag.top - (event.clientY - fullViewDrag.y);
  });

  const stopFullViewDrag = (event) => {
    if (!fullViewDrag || event.pointerId !== fullViewDrag.pointerId) return;
    if (fullViewCanvas.hasPointerCapture(event.pointerId)) {
      fullViewCanvas.releasePointerCapture(event.pointerId);
    }
    fullViewDrag = null;
    fullViewCanvas.classList.remove("is-grabbing");
  };

  fullViewCanvas.addEventListener("pointerup", stopFullViewDrag);
  fullViewCanvas.addEventListener("pointercancel", stopFullViewDrag);

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
    if (!event.isPrimary) { pointerStart = null; return; }
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStart = { x: event.clientX, y: event.clientY, pointerId: event.pointerId, onPicture: Boolean(event.target.closest(".work-picture")) };
    if (event.pointerType !== "mouse") stage.setPointerCapture(event.pointerId);
  });

  stage.addEventListener("pointerup", (event) => {
    if (!pointerStart || pointerStart.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    const onPicture = pointerStart.onPicture;
    pointerStart = null;
    if (Math.abs(deltaX) < 54 || Math.abs(deltaX) < Math.abs(deltaY)) {
      if (event.pointerType !== "mouse" && onPicture && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        suppressStageClick = true;
        openFullView();
      }
      return;
    }
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

  thumbnails.forEach((button, index) => button.setAttribute("aria-label", `${works[index].dataset.title}を表示`));
  works.forEach((work) => { work.querySelector(".work-image").draggable = false; });
  document.querySelectorAll(".works-index li").forEach((item, index) => {
    const link = document.createElement("a");
    link.href = `#${works[index].id}`;
    link.append(...item.childNodes);
    item.append(link);
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      history.replaceState(null, "", link.hash);
      await showWork(index);
      gallery.scrollIntoView({ behavior: reducedMotion.matches ? "instant" : "smooth" });
      works[index].querySelector(".work-picture").focus({ preventScroll: true });
    });
  });

  window.addEventListener("hashchange", () => {
    const requestedIndex = indexFromHash();
    if (requestedIndex >= 0) showWork(requestedIndex);
  });

  const requestedIndex = indexFromHash();
  showWork(requestedIndex >= 0 ? requestedIndex : 0);
}
