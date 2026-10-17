/**
 * Method Name: (Immediately Invoked Function Expression)
 * Purpose:     Wraps the whole site script in a private scope in strict mode so no
 *              variables leak into the global namespace. Wires up the footer year,
 *              image fallbacks, sticky header, mobile menu, nav highlighting,
 *              reveal-on-scroll, booking form and lightbox gallery.
 * Parameters:  None
 * Output:      None (runs once on load and attaches event listeners)
 */
(() => {
  "use strict";

  const header = document.querySelector("header");
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menuToggle");
  const backToTop = document.getElementById("backToTop");

  /* ---------- Footer year ---------- */
  /**
   * Method Name: (forEach callback) Footer year updater
   * Purpose:     Writes the current year into every element marked with [data-year].
   * Parameters:  el {HTMLElement} - an element carrying the data-year attribute
   * Output:      None (sets el.textContent)
   */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Placeholder for missing photos ---------- */
  /**
   * Method Name: makePlaceholder
   * Purpose:     Builds an inline SVG "Photo coming soon" image, used when a photo
   *              fails to load. Characters that could break the SVG are stripped
   *              from the label.
   * Parameters:  label {string} - text shown on the placeholder (usually the img alt);
   *                               defaults to "Accommodation" when empty
   * Output:      {string} A URL-encoded SVG data URI suitable for an img src
   */
  const makePlaceholder = (label) => {
    const text = (label || "Accommodation").replace(/[<>&"']/g, "");
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">' +
      '<rect width="800" height="500" fill="#dbe4f3"/>' +
      '<text x="400" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="bold" fill="#004aad">' +
      text +
      "</text>" +
      '<text x="400" y="285" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#5a6270">Photo coming soon</text>' +
      "</svg>";
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  };

  /**
   * Method Name: useFallback
   * Purpose:     Replaces a broken image with the generated placeholder. A flag on
   *              the element ensures this happens only once, so a failing
   *              placeholder can never cause an endless error loop.
   * Parameters:  img {HTMLImageElement} - the image that failed to load
   * Output:      None (sets img.src and img.dataset.fallback)
   */
  const useFallback = (img) => {
    if (img.dataset.fallback) return;
    img.dataset.fallback = "1";
    img.src = makePlaceholder(img.alt);
  };

  /**
   * Method Name: (forEach callback) Image error watcher
   * Purpose:     Registers the fallback handler on each real image, and swaps
   *              immediately if the image has already failed before the script ran.
   * Parameters:  img {HTMLImageElement} - an image found in the document
   * Output:      None (attaches an "error" listener, may call useFallback)
   */
  document.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src");
    if (!src || src.startsWith("data:")) return;
    img.addEventListener("error", () => useFallback(img));
    if (img.complete && img.naturalWidth === 0) useFallback(img);
  });

  /* ---------- Sticky header shadow + back-to-top visibility ---------- */
  /**
   * Method Name: onScroll
   * Purpose:     Adds a "scrolled" class to the header after 50px of scrolling and
   *              shows the back-to-top button after 300px.
   * Parameters:  None (reads window.scrollY)
   * Output:      None (toggles CSS classes)
   */
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 50);
    if (backToTop) backToTop.classList.toggle("visible", y > 300);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    /**
     * Method Name: (click handler) Back to top
     * Purpose:     Smoothly scrolls the page to the top.
     * Parameters:  None
     * Output:      None
     */
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Mobile menu ---------- */
  if (menuToggle && navbar) {
    /**
     * Method Name: setMenu
     * Purpose:     Opens or closes the mobile menu, keeping the toggle button's
     *              aria-expanded state and icon (☰ / ✕) in sync.
     * Parameters:  open {boolean} - true to open the menu, false to close it
     * Output:      None (updates classes, ARIA attribute and button text)
     */
    const setMenu = (open) => {
      navbar.classList.toggle("active", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.textContent = open ? "✕" : "☰";
    };

    /**
     * Method Name: (click handler) Menu toggle
     * Purpose:     Flips the menu between open and closed.
     * Parameters:  None
     * Output:      None
     */
    menuToggle.addEventListener("click", () => {
      setMenu(!navbar.classList.contains("active"));
    });

    // Close after choosing a link
    navbar.querySelectorAll("a").forEach((link) => {
      /**
       * Method Name: (click handler) Nav link close
       * Purpose:     Closes the mobile menu once a link is chosen.
       * Parameters:  None
       * Output:      None
       */
      link.addEventListener("click", () => setMenu(false));
    });

    // Close with Escape or a click outside the header
    /**
     * Method Name: (keydown handler) Menu Escape key
     * Purpose:     Closes the open menu on Escape and returns focus to the toggle.
     * Parameters:  e {KeyboardEvent} - the keydown event
     * Output:      None
     */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navbar.classList.contains("active")) {
        setMenu(false);
        menuToggle.focus();
      }
    });
    /**
     * Method Name: (click handler) Menu outside click
     * Purpose:     Closes the open menu when the user clicks outside the header.
     * Parameters:  e {MouseEvent} - the click event
     * Output:      None
     */
    document.addEventListener("click", (e) => {
      if (
        navbar.classList.contains("active") &&
        header &&
        !header.contains(e.target)
      ) {
        setMenu(false);
      }
    });

    // Reset if the window is resized up to desktop width
    /**
     * Method Name: (resize handler) Menu reset
     * Purpose:     Closes the mobile menu when the window grows past 768px so the
     *              desktop layout starts in a clean state.
     * Parameters:  None
     * Output:      None
     */
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) setMenu(false);
    });
  }

  /* ---------- Highlight the nav link of the section in view ---------- */
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  if (navLinks.length && "IntersectionObserver" in window) {
    const linkById = new Map();
    navLinks.forEach((a) => linkById.set(a.getAttribute("href").slice(1), a));

    /**
     * Method Name: (IntersectionObserver callback) Section highlighter
     * Purpose:     Marks the nav link of the section currently near the middle of
     *              the viewport as active and clears the others.
     * Parameters:  entries {IntersectionObserverEntry[]} - observed section changes
     * Output:      None (toggles the "active" class on nav links)
     */
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) => a.classList.remove("active"));
          const link = linkById.get(entry.target.id);
          if (link) link.classList.add("active");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    linkById.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
  }

  /* ---------- Reveal-on-scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      /**
       * Method Name: (IntersectionObserver callback) Reveal on scroll
       * Purpose:     Adds the "in-view" class the first time an element becomes
       *              visible, then stops observing it so the animation runs once.
       * Parameters:  entries {IntersectionObserverEntry[]} - observed element changes
       *              obs {IntersectionObserver} - the observer, used to unobserve
       * Output:      None
       */
      const revealObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 },
      );
      revealEls.forEach((el) => revealObserver.observe(el));
    } else {
      // Older browsers: show everything immediately
      revealEls.forEach((el) => el.classList.add("in-view"));
    }
  }

  /* ---------- Booking form ---------- */
  const bookingForm = document.querySelector(".booking-form form");
  if (bookingForm) {
    const propertySelect = document.getElementById("property");
    const durationSelect = document.getElementById("duration");

    // Don't allow move-in dates in the past
    const moveIn = document.getElementById("movein");
    if (moveIn) {
      const now = new Date();
      /**
       * Method Name: pad
       * Purpose:     Left-pads a number with a zero to two digits (e.g. 7 -> "07")
       *              for building a YYYY-MM-DD date string.
       * Parameters:  n {number} - month or day value
       * Output:      {string} Two-character zero-padded string
       */
      const pad = (n) => String(n).padStart(2, "0");
      moveIn.min = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
        now.getDate(),
      )}`;
    }

    // Preselect the accommodation when arriving from a "Book this" button
    const wanted = new URLSearchParams(window.location.search).get("property");
    if (
      wanted &&
      propertySelect &&
      [...propertySelect.options].some((o) => o.value === wanted)
    ) {
      propertySelect.value = wanted;
    }

    if (bookingForm.dataset.demo === "true") {
      // show a confirmation instead of sending anything
      const success = document.getElementById("bookingSuccess");
      const successMessage = document.getElementById("successMessage");

      /**
       * Method Name: (submit handler) Demo booking submit
       * Purpose:     Demo mode only. Stops the real submission, builds a thank-you
       *              message from the chosen property, move-in date and lease
       *              length, hides the form and shows the confirmation.
       * Parameters:  e {SubmitEvent} - the form submit event
       * Output:      None (updates the DOM and scrolls to the confirmation)
       */
      bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(bookingForm);
        const place =
          propertySelect.options[propertySelect.selectedIndex].text.trim();
        const length =
          durationSelect.options[durationSelect.selectedIndex].text.trim();

        successMessage.textContent = `Thanks, ${data.get("name")}! Your request for ${place} (move-in: ${data.get("movein")}, lease: ${length}) has been noted.`;
        bookingForm.hidden = true;
        success.hidden = false;
        success.focus();
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    } else {
      // prevent double submissions
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        /**
         * Method Name: (submit handler) Double-submit guard
         * Purpose:     Disables the submit button and shows "Sending…" so the
         *              form cannot be sent twice.
         * Parameters:  None
         * Output:      None
         */
        bookingForm.addEventListener("submit", () => {
          submitBtn.disabled = true;
          submitBtn.textContent = "Sending…";
        });
        /**
         * Method Name: (pageshow handler) Submit button reset
         * Purpose:     Re-enables the button and restores its text when the page is
         *              shown again, e.g. after pressing the browser Back button.
         * Parameters:  None
         * Output:      None
         */
        window.addEventListener("pageshow", () => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
      }
    }
  }

  /* ---------- Lightbox gallery ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const captionText = document.getElementById("caption");
  const items = Array.from(document.querySelectorAll(".gallery-item"));

  if (lightbox && lightboxImg && items.length) {
    const closeBtn = lightbox.querySelector(".lb-close");
    const prevBtn = lightbox.querySelector(".lb-prev");
    const nextBtn = lightbox.querySelector(".lb-next");
    let currentIndex = 0;
    let lastFocused = null;

    /**
     * Method Name: isOpen
     * Purpose:     Reports whether the lightbox is currently displayed.
     * Parameters:  None
     * Output:      {boolean} true if the lightbox has the "open" class
     */
    const isOpen = () => lightbox.classList.contains("open");

    /**
     * Method Name: update
     * Purpose:     Shows the image at currentIndex in the lightbox, with its alt
     *              text and a "(n / total)" caption.
     * Parameters:  None (uses currentIndex and the gallery items)
     * Output:      None (updates the lightbox image and caption)
     */
    const update = () => {
      const img = items[currentIndex].querySelector("img");
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt;
      captionText.textContent = `${img.alt} (${currentIndex + 1} / ${
        items.length
      })`;
    };

    /**
     * Method Name: open
     * Purpose:     Opens the lightbox on a given image, remembers the previously
     *              focused element, locks page scrolling and focuses the close button.
     * Parameters:  index {number} - zero-based position of the image to show
     * Output:      None
     */
    const open = (index) => {
      lastFocused = document.activeElement;
      currentIndex = index;
      update();
      lightbox.classList.add("open");
      document.body.classList.add("no-scroll");
      if (closeBtn) closeBtn.focus();
    };

    /**
     * Method Name: close
     * Purpose:     Closes the lightbox, unlocks page scrolling, clears the image
     *              and returns focus to the element that opened it.
     * Parameters:  None
     * Output:      None
     */
    const close = () => {
      lightbox.classList.remove("open");
      document.body.classList.remove("no-scroll");
      lightboxImg.removeAttribute("src");
      if (lastFocused) lastFocused.focus();
    };

    /**
     * Method Name: showNext
     * Purpose:     Moves to the next image, wrapping from the last back to the first.
     * Parameters:  None
     * Output:      None (updates currentIndex and the display)
     */
    const showNext = () => {
      currentIndex = (currentIndex + 1) % items.length;
      update();
    };
    /**
     * Method Name: showPrev
     * Purpose:     Moves to the previous image, wrapping from the first to the last.
     * Parameters:  None
     * Output:      None (updates currentIndex and the display)
     */
    const showPrev = () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      update();
    };

    /**
     * Method Name: (click handler) Gallery item click
     * Purpose:     Opens the lightbox on the clicked gallery thumbnail.
     * Parameters:  None (the index i comes from the forEach callback)
     * Output:      None
     */
    items.forEach((item, i) => item.addEventListener("click", () => open(i)));
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (nextBtn) nextBtn.addEventListener("click", showNext);
    if (prevBtn) prevBtn.addEventListener("click", showPrev);

    // Click on the dark background closes
    /**
     * Method Name: (click handler) Lightbox backdrop click
     * Purpose:     Closes the lightbox when the dark background itself is clicked.
     * Parameters:  e {MouseEvent} - the click event
     * Output:      None
     */
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });

    // Keyboard: arrows, Escape, and a simple focus trap
    /**
     * Method Name: (keydown handler) Lightbox keyboard controls
     * Purpose:     While open: Right/Left arrows change image, Escape closes, and
     *              Tab/Shift+Tab cycle focus within the lightbox buttons only.
     * Parameters:  e {KeyboardEvent} - the keydown event
     * Output:      None
     */
    document.addEventListener("keydown", (e) => {
      if (!isOpen()) return;
      if (e.key === "ArrowRight") showNext();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "Escape") close();
      else if (e.key === "Tab") {
        const focusable = [closeBtn, prevBtn, nextBtn].filter(Boolean);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Touch swipe on phones
    let touchStartX = 0;
    /**
     * Method Name: (touchstart handler) Swipe start
     * Purpose:     Records the horizontal position where a touch began.
     * Parameters:  e {TouchEvent} - the touchstart event
     * Output:      None (sets touchStartX)
     */
    lightbox.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].clientX;
      },
      { passive: true },
    );
    /**
     * Method Name: (touchend handler) Swipe end
     * Purpose:     Compares where the touch ended with where it started. A swipe of
     *              more than 50px goes to the next image (left) or previous (right).
     * Parameters:  e {TouchEvent} - the touchend event
     * Output:      None
     */
    lightbox.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) {
          if (dx < 0) showNext();
          else showPrev();
        }
      },
      { passive: true },
    );
  }
})();
