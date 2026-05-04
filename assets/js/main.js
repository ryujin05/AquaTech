const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const randomBetween = (min, max) => min + Math.random() * (max - min);

const initBubbleField = (canvas, prefersReducedMotion, options = {}) => {
  const context = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!context) {
    return;
  }

  const isNightOceanTheme = options.theme === "night-ocean";
  const palette = isNightOceanTheme
    ? {
        glowInner: "rgba(132, 247, 255, 0.16)",
        glowMid: "rgba(116, 214, 255, 0.06)",
        glowOuter: "rgba(116, 214, 255, 0)",
        waveStroke: "rgba(145, 245, 255, ALPHA)",
        bubbleHigh: "rgba(252, 255, 255, ALPHA)",
        bubbleMid: "rgba(169, 241, 255, ALPHA)",
        bubbleLow: "rgba(118, 204, 255, ALPHA)",
        bubbleOutline: "rgba(200, 247, 255, ALPHA)",
      }
    : {
        glowInner: "rgba(186, 240, 255, 0.1)",
        glowMid: "rgba(150, 225, 250, 0.035)",
        glowOuter: "rgba(150, 225, 250, 0)",
        waveStroke: "rgba(151, 229, 255, ALPHA)",
        bubbleHigh: "rgba(255, 255, 255, ALPHA)",
        bubbleMid: "rgba(171, 236, 255, ALPHA)",
        bubbleLow: "rgba(137, 219, 250, ALPHA)",
        bubbleOutline: "rgba(221, 248, 255, ALPHA)",
      };

  const state = {
    width: 0,
    height: 0,
    dpr: 1,
    bubbles: [],
    waves: [],
    pointer: {
      active: false,
      x: 0,
      y: 0,
      force: 0,
      vx: 0,
      vy: 0,
    },
    lastWaveTime: 0,
    lastFrame: performance.now(),
  };

  const settings = {
    density: prefersReducedMotion ? 0.000026 : 0.00006,
    minRadius: prefersReducedMotion ? 10 : 9,
    maxRadius: prefersReducedMotion ? 24 : 35,
    friction: 0.994,
    buoyancy: prefersReducedMotion ? -0.003 : -0.008,
    mouseRadius: prefersReducedMotion ? 66 : 122,
    mousePush: prefersReducedMotion ? 1.05 : 4.1,
    maxSpeed: 2.9,
    restitution: 0.86,
  };

  const spawnWave = (x, y, intensity = 1) => {
    state.waves.push({
      x,
      y,
      radius: prefersReducedMotion ? 10 : 8,
      alpha: clamp(0.08 + intensity * 0.2, 0.08, prefersReducedMotion ? 0.24 : 0.45),
      growth: prefersReducedMotion ? 1.5 : 2.2,
      fade: prefersReducedMotion ? 0.012 : 0.016,
    });

    if (state.waves.length > 40) {
      state.waves.shift();
    }
  };

  const createBubble = (x = Math.random() * state.width, y = Math.random() * state.height) => {
    const radius = randomBetween(settings.minRadius, settings.maxRadius);
    return {
      x,
      y,
      radius,
      vx: randomBetween(-0.38, 0.38),
      vy: randomBetween(-0.3, 0.18),
      wobbleSeed: Math.random() * Math.PI * 2,
      tint: randomBetween(0.58, 1),
      mass: radius * radius * 0.015,
    };
  };

  const syncBubbleCount = () => {
    const viewportDensityScale = state.width < 860 ? 0.58 : 1;
    const minBubbles = prefersReducedMotion ? 12 : 18;
    const targetCount = Math.max(
      minBubbles,
      Math.round(state.width * state.height * settings.density * viewportDensityScale),
    );

    while (state.bubbles.length < targetCount) {
      state.bubbles.push(createBubble());
    }

    if (state.bubbles.length > targetCount) {
      state.bubbles.length = targetCount;
    }
  };

  const resize = () => {
    state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.width = Math.max(window.innerWidth, 320);
    state.height = Math.max(window.innerHeight, 320);
    canvas.width = Math.floor(state.width * state.dpr);
    canvas.height = Math.floor(state.height * state.dpr);
    canvas.style.width = `${state.width}px`;
    canvas.style.height = `${state.height}px`;
    context.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    syncBubbleCount();
  };

  const resolveBubbleCollisions = () => {
    for (let i = 0; i < state.bubbles.length; i += 1) {
      const bubbleA = state.bubbles[i];

      for (let j = i + 1; j < state.bubbles.length; j += 1) {
        const bubbleB = state.bubbles[j];
        const dx = bubbleB.x - bubbleA.x;
        const dy = bubbleB.y - bubbleA.y;
        const distanceSquared = dx * dx + dy * dy;
        const minDistance = bubbleA.radius + bubbleB.radius;

        if (distanceSquared === 0 || distanceSquared >= minDistance * minDistance) {
          continue;
        }

        const distance = Math.sqrt(distanceSquared);
        const nx = dx / distance;
        const ny = dy / distance;
        const overlap = minDistance - distance;

        bubbleA.x -= nx * overlap * 0.5;
        bubbleA.y -= ny * overlap * 0.5;
        bubbleB.x += nx * overlap * 0.5;
        bubbleB.y += ny * overlap * 0.5;

        const relativeVx = bubbleB.vx - bubbleA.vx;
        const relativeVy = bubbleB.vy - bubbleA.vy;
        const velocityAlongNormal = relativeVx * nx + relativeVy * ny;

        if (velocityAlongNormal > 0) {
          continue;
        }

        const restitution = 0.84;
        const inverseMassA = 1 / bubbleA.mass;
        const inverseMassB = 1 / bubbleB.mass;
        const impulse = -(1 + restitution) * velocityAlongNormal / (inverseMassA + inverseMassB);
        const impulseX = impulse * nx;
        const impulseY = impulse * ny;

        bubbleA.vx -= impulseX * inverseMassA;
        bubbleA.vy -= impulseY * inverseMassA;
        bubbleB.vx += impulseX * inverseMassB;
        bubbleB.vy += impulseY * inverseMassB;
      }
    }
  };

  const applyPointerForce = (bubble, dt) => {
    if (!state.pointer.active) {
      return;
    }

    const dx = bubble.x - state.pointer.x;
    const dy = bubble.y - state.pointer.y;
    const distanceSquared = dx * dx + dy * dy;
    const radius = settings.mouseRadius + bubble.radius;

    if (distanceSquared <= 0 || distanceSquared >= radius * radius) {
      return;
    }

    const distance = Math.sqrt(distanceSquared);
    const influence = 1 - distance / radius;
    const nearOnly = influence * influence;
    const motionFactor = prefersReducedMotion ? 0.72 : 1;
    const push = settings.mousePush * nearOnly * (1 + state.pointer.force * 0.42) * motionFactor;
    const nx = dx / distance;
    const ny = dy / distance;
    const pointerTransfer = clamp(
      (Math.abs(state.pointer.vx) + Math.abs(state.pointer.vy)) * 0.028,
      0,
      1.4,
    );

    bubble.vx += nx * push * dt * 8.6 + state.pointer.vx * nearOnly * 0.044 * motionFactor;
    bubble.vy += ny * push * dt * 8.6 + state.pointer.vy * nearOnly * 0.044 * motionFactor;
    bubble.vx += nx * pointerTransfer * 0.36;
    bubble.vy += ny * pointerTransfer * 0.36;
  };

  const updateWaves = (dt) => {
    if (state.waves.length === 0) {
      return;
    }

    for (let i = state.waves.length - 1; i >= 0; i -= 1) {
      const wave = state.waves[i];
      wave.radius += wave.growth * dt;
      wave.alpha -= wave.fade * dt;

      if (wave.alpha <= 0) {
        state.waves.splice(i, 1);
      }
    }
  };

  const updateBubbles = (dt, now) => {
    state.bubbles.forEach((bubble) => {
      const wobble = Math.sin(now * 0.0012 + bubble.wobbleSeed) * 0.012;
      bubble.vx += wobble * dt;
      bubble.vy += settings.buoyancy * dt;

      applyPointerForce(bubble, dt);

      bubble.vx *= settings.friction;
      bubble.vy *= settings.friction;

      bubble.vx = clamp(bubble.vx, -settings.maxSpeed, settings.maxSpeed);
      bubble.vy = clamp(bubble.vy, -settings.maxSpeed, settings.maxSpeed);

      bubble.x += bubble.vx * dt * 1.2;
      bubble.y += bubble.vy * dt * 1.2;

      if (bubble.x - bubble.radius < 0) {
        bubble.x = bubble.radius;
        bubble.vx *= -settings.restitution;
      } else if (bubble.x + bubble.radius > state.width) {
        bubble.x = state.width - bubble.radius;
        bubble.vx *= -settings.restitution;
      }

      if (bubble.y - bubble.radius < 0) {
        bubble.y = bubble.radius;
        bubble.vy *= -settings.restitution;
      } else if (bubble.y + bubble.radius > state.height) {
        bubble.y = state.height - bubble.radius;
        bubble.vy *= -settings.restitution;
      }
    });

    resolveBubbleCollisions();
  };

  const drawBackgroundGlow = () => {
    const gradient = context.createRadialGradient(
      state.width * 0.74,
      state.height * 0.22,
      20,
      state.width * 0.52,
      state.height * 0.62,
      state.width * 0.8,
    );
    gradient.addColorStop(0, palette.glowInner);
    gradient.addColorStop(0.56, palette.glowMid);
    gradient.addColorStop(1, palette.glowOuter);
    context.fillStyle = gradient;
    context.fillRect(0, 0, state.width, state.height);
  };

  const drawPointerWaves = () => {
    if (state.waves.length === 0) {
      return;
    }

    state.waves.forEach((wave) => {
      context.beginPath();
      context.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      context.strokeStyle = palette.waveStroke.replace("ALPHA", String(wave.alpha));
      context.lineWidth = 1.5;
      context.stroke();
    });
  };

  const drawBubbles = (now) => {
    context.clearRect(0, 0, state.width, state.height);
    drawBackgroundGlow();
    drawPointerWaves();

    state.bubbles.forEach((bubble) => {
      const breathe = 1 + Math.sin(now * 0.001 + bubble.wobbleSeed) * 0.045;
      const radius = bubble.radius * breathe;

      const fillGradient = context.createRadialGradient(
        bubble.x - radius * 0.42,
        bubble.y - radius * 0.42,
        radius * 0.24,
        bubble.x,
        bubble.y,
        radius,
      );
      fillGradient.addColorStop(
        0,
        palette.bubbleHigh.replace("ALPHA", String(0.74 * bubble.tint)),
      );
      fillGradient.addColorStop(
        0.45,
        palette.bubbleMid.replace("ALPHA", String(0.5 * bubble.tint)),
      );
      fillGradient.addColorStop(
        1,
        palette.bubbleLow.replace("ALPHA", String(0.23 * bubble.tint)),
      );

      context.beginPath();
      context.fillStyle = fillGradient;
      context.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.strokeStyle = palette.bubbleOutline.replace("ALPHA", String(0.62 * bubble.tint));
      context.lineWidth = 1.25;
      context.arc(bubble.x, bubble.y, radius, 0, Math.PI * 2);
      context.stroke();

      context.beginPath();
      context.fillStyle = `rgba(255, 255, 255, ${0.42 * bubble.tint})`;
      context.arc(
        bubble.x - radius * 0.34,
        bubble.y - radius * 0.36,
        radius * 0.2,
        0,
        Math.PI * 2,
      );
      context.fill();
    });
  };

  const animate = (now) => {
    const dt = Math.min((now - state.lastFrame) / 16.666, 2.3);
    state.lastFrame = now;

    updateBubbles(dt, now);
    updateWaves(dt);
    drawBubbles(now);

    if (state.pointer.active) {
      state.pointer.force *= 0.92;
      state.pointer.vx *= 0.78;
      state.pointer.vy *= 0.78;
    }

    window.requestAnimationFrame(animate);
  };

  const onPointerMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    const nextX = event.clientX - rect.left;
    const nextY = event.clientY - rect.top;
    const deltaX = nextX - state.pointer.x;
    const deltaY = nextY - state.pointer.y;
    const movementX = "movementX" in event ? Number(event.movementX || 0) : deltaX;
    const movementY = "movementY" in event ? Number(event.movementY || 0) : deltaY;

    state.pointer.x = nextX;
    state.pointer.y = nextY;
    state.pointer.active = true;
    state.pointer.vx = movementX;
    state.pointer.vy = movementY;
    state.pointer.force = clamp(Math.hypot(deltaX, deltaY) * 0.07, 0, 2.2);

    const now = performance.now();
    const waveGap = prefersReducedMotion ? 132 : 56;
    if (state.pointer.force > 0.42 && now - state.lastWaveTime > waveGap) {
      spawnWave(nextX, nextY, state.pointer.force * 0.55);
      state.lastWaveTime = now;
    }
  };

  const onPointerDown = (event) => {
    onPointerMove(event);
    state.pointer.force = Math.max(state.pointer.force, prefersReducedMotion ? 1.4 : 2.4);
    spawnWave(state.pointer.x, state.pointer.y, prefersReducedMotion ? 0.95 : 1.6);
    state.lastWaveTime = performance.now();
  };

  const onPointerLeave = () => {
    state.pointer.active = false;
    state.pointer.force = 0;
    state.pointer.vx = 0;
    state.pointer.vy = 0;
  };

  resize();
  drawBubbles(performance.now());

  window.addEventListener("resize", resize);
  const hasPointerEvents = "onpointermove" in window;

  if (hasPointerEvents) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
  } else {
    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("mousedown", onPointerDown, { passive: true });
    window.addEventListener("mouseleave", onPointerLeave);
  }

  window.addEventListener("blur", onPointerLeave);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      onPointerLeave();
    }
  });

  window.requestAnimationFrame(animate);
};



(() => {
  window.__AQUATECH_MAIN_LOADED = true;

  const body = document.body;
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const progressBar = document.getElementById("scroll-progress-bar");
  const yearLabel = document.getElementById("year");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bubbleCanvas = document.getElementById("bubble-canvas");
  const isNightOceanTheme = body.classList.contains("night-ocean");

  if (bubbleCanvas instanceof HTMLCanvasElement) {
    initBubbleField(
      bubbleCanvas,
      prefersReducedMotion,
      isNightOceanTheme ? { theme: "night-ocean" } : { theme: "default" },
    );
  }



  if (yearLabel) {
    yearLabel.textContent = String(new Date().getFullYear());
  }

  const closeMenu = () => {
    if (!navToggle || !navLinks) {
      return;
    }

    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("is-open");
    body.classList.remove("nav-open");
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      const nextState = !expanded;

      navToggle.setAttribute("aria-expanded", String(nextState));
      navLinks.classList.toggle("is-open", nextState);
      body.classList.toggle("nav-open", nextState);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  const updateProgressBar = () => {
    if (!progressBar) {
      return;
    }

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
    progressBar.style.transform = `scaleX(${progress})`;
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(() => {
      updateProgressBar();
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  updateProgressBar();

  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) {
        return;
      }

      faqItems.forEach((other) => {
        if (other !== item) {
          other.open = false;
        }
      });
    });
  });

  const searchParams = new URLSearchParams(window.location.search);
  const requestedService = searchParams.get("service");
  document.querySelectorAll("select[data-prefill='service']").forEach((selectElement) => {
    if (!(selectElement instanceof HTMLSelectElement) || !requestedService) {
      return;
    }

    const matchedOption = Array.from(selectElement.options).find(
      (option) => option.value.toLowerCase() === requestedService.toLowerCase(),
    );

    if (matchedOption) {
      selectElement.value = matchedOption.value;
    }
  });

  const leadForms = document.querySelectorAll("form.contact-form[data-api-form='lead']");
  leadForms.forEach((formElement) => {
    if (!(formElement instanceof HTMLFormElement)) {
      return;
    }

    const statusElement = formElement.querySelector("[data-form-status]");
    const submitButton = formElement.querySelector("button[type='submit']");

    const setFormStatus = (message, type = "info") => {
      if (!statusElement) {
        return;
      }

      statusElement.textContent = message;
      statusElement.classList.remove("is-error", "is-success");

      if (type === "error") {
        statusElement.classList.add("is-error");
      }

      if (type === "success") {
        statusElement.classList.add("is-success");
      }
    };

    formElement.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(formElement);
      const payload = {
        full_name: String(formData.get("full_name") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        service_interest: String(formData.get("service_interest") || "").trim(),
        message: String(formData.get("message") || "").trim(),
        source_page: String(formData.get("source_page") || window.location.pathname),
      };

      const agreementCheckbox = formElement.querySelector("input[name='agreement']");
      const hasAgreement = agreementCheckbox instanceof HTMLInputElement && agreementCheckbox.checked;

      if (!payload.full_name || !payload.phone || !payload.service_interest || !hasAgreement) {
        setFormStatus("Vui lòng điền đầy đủ thông tin và đồng ý được liên hệ.", "error");
        return;
      }

      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = true;
      }

      setFormStatus("Đang gửi yêu cầu...", "info");

      try {
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            typeof result.message === "string"
              ? result.message
              : "Không thể gửi thông tin lúc này. Vui lòng thử lại sau.",
          );
        }

        formElement.reset();

        const sourceInput = formElement.querySelector("input[name='source_page']");
        if (sourceInput instanceof HTMLInputElement) {
          sourceInput.value = window.location.pathname;
        }

        setFormStatus(
          "Gửi thành công! Nhấn vào đây để chat nhanh qua Zalo.",
          "success",
        );

        // Make the success message clickable
        statusElement.addEventListener("click", () => {
          window.open("https://zalo.me/0867385383", "_blank");
        }, { once: true });

        // Redirect to Zalo after 1 second
        setTimeout(() => {
          window.open("https://zalo.me/0867385383", "_blank");
        }, 1000);
      } catch (error) {
        setFormStatus(
          error instanceof Error
            ? error.message
            : "Không thể gửi thông tin lúc này. Vui lòng thử lại sau.",
          "error",
        );
      } finally {
        if (submitButton instanceof HTMLButtonElement) {
          submitButton.disabled = false;
        }
      }
    });
  });

  if (prefersReducedMotion) {
    return;
  }

  const gsapGlobal = window.gsap;
  const scrollTriggerGlobal = window.ScrollTrigger;

  if (!gsapGlobal || !scrollTriggerGlobal) {
    return;
  }

  gsapGlobal.registerPlugin(scrollTriggerGlobal);

  const isCompactViewport = window.matchMedia("(max-width: 860px)").matches;
  const revealDistance = isCompactViewport ? 22 : 32;
  const revealDuration = isCompactViewport ? 0.62 : 0.72;
  const revealStart = isCompactViewport ? "top 92%" : "top 88%";

  gsapGlobal.from(".site-header", {
    y: -60,
    autoAlpha: 0,
    duration: 0.7,
    ease: "power2.out",
  });

  gsapGlobal.from("[data-hero]", {
    y: isCompactViewport ? 20 : 28,
    autoAlpha: 0,
    duration: isCompactViewport ? 0.68 : 0.82,
    stagger: isCompactViewport ? 0.1 : 0.14,
    ease: "power3.out",
  });

  const revealTargets = gsapGlobal.utils.toArray("[data-animate]");
  revealTargets.forEach((element) => {
    // Skip animating certain critical sections that should always be visible
    if (element.classList.contains('process-intro') ||
        element.classList.contains('process-closing') ||
        element.classList.contains('contact-panel') ||
        element.classList.contains('service-cta') ||
        element.classList.contains('contact-shell')) {
      return;
    }

    gsapGlobal.from(element, {
      y: revealDistance,
      autoAlpha: 0,
      duration: revealDuration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: revealStart,
        once: true,
      },
    });
  });

  document.querySelectorAll("[data-count]").forEach((counterElement) => {
    const target = Number(counterElement.getAttribute("data-count") || "0");
    const suffix = counterElement.getAttribute("data-suffix") || "";

    counterElement.textContent = `${target}${suffix}`;

    scrollTriggerGlobal.create({
      trigger: counterElement,
      start: "top 90%",
      once: true,
      onEnter: () => {
        const countState = { value: target * 0.18 };

        gsapGlobal.to(countState, {
          value: target,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => {
            counterElement.textContent = `${Math.round(countState.value)}${suffix}`;
          },
          onComplete: () => {
            counterElement.textContent = `${target}${suffix}`;
          },
        });
      },
    });
  });

  const timelineTrack = document.querySelector(".timeline-track");
  if (timelineTrack) {
    const timelineSection = timelineTrack.closest("section");

    gsapGlobal.from(timelineTrack, {
      scaleY: 0,
      transformOrigin: "top center",
      ease: "none",
      scrollTrigger: {
        trigger: timelineSection || timelineTrack,
        start: "top 72%",
        end: "bottom 36%",
        scrub: 0.4,
      },
    });
  }

  const finalCta = document.querySelector("[data-final-cta]");
  if (finalCta) {
    gsapGlobal.from(finalCta, {
      y: isCompactViewport ? 24 : 34,
      scale: isCompactViewport ? 1 : 0.97,
      autoAlpha: 0,
      duration: isCompactViewport ? 0.68 : 0.92,
      ease: "power3.out",
      scrollTrigger: {
        trigger: finalCta,
        start: isCompactViewport ? "top 94%" : "top 86%",
        once: true,
      },
    });

    const ctaButtons = finalCta.querySelectorAll(".btn");
    if (ctaButtons.length > 0) {
      gsapGlobal.from(ctaButtons, {
        y: 14,
        autoAlpha: 0,
        duration: 0.48,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: finalCta,
          start: isCompactViewport ? "top 90%" : "top 82%",
          once: true,
        },
      });
    }
  }

  scrollTriggerGlobal.refresh();
})();
