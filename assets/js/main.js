/**
 * Anuraag G Rao — Portfolio Interactive Engine
 * Apple-style motion, Bento Grid 2.0, Command Palette (⌘K), Canvas Parallax & Web Audio Haptics
 * Pure Vanilla ES6+ — Zero Frameworks
 */

(function () {
    "use strict";

    // -------------------------------------------------------------
    // Configuration & State
    // -------------------------------------------------------------
    const EMAIL = "hello@anuraaggrao.com";
    const PHRASES = [
        "Building high-throughput backend APIs with Python & FastAPI.",
        "Engineering resilient IoT telemetry pipelines on TimescaleDB.",
        "Architecting autonomous AI operators & memory vaults.",
        "Optimizing PostgreSQL hypertable queries for sub-50ms p95s.",
        "Deploying hardened microservices with Docker & Kubernetes.",
        "Shipping automated CI/CD matrices with GitHub Actions.",
        "Tinkering with hardware telemetry on Raspberry Pi nodes."
    ];

    const FACTS = [
        "Pulled a teammate to safety from a steep cliff ledge during a trek — stayed calm and led the emergency descent.",
        "Binged all three seasons of Re:Zero in 72 hours — hyperfocus mode engaged.",
        "Traveled solo across Tokyo, Himeji, and Hiroshima exploring historic castles and train networks.",
        "Practices an intermittent fasting / OMAD routine — mental discipline on and off the terminal.",
        "Completed the TCS World 10K Majja Run 4.2K in Bengaluru.",
        "Peak Valorant rank: Diamond 3 (Reyna / Initiator main).",
        "Hardware hacker: keeps multiple headless Raspberry Pi cluster nodes running local home infrastructure.",
        "Engineering philosophy: a bug is never fixed until a regression test proves it can never return."
    ];

    let audioCtx = null;
    let soundEnabled = localStorage.getItem("sound-enabled") === "true";
    let lastFactIdx = -1;
    let toastTimeout = null;

    // -------------------------------------------------------------
    // Web Audio Haptic Clicks
    // -------------------------------------------------------------
    function initAudio() {
        if (!audioCtx && typeof (window.AudioContext || window.webkitAudioContext) !== "undefined") {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
    }

    function playHapticSound(freq = 800, type = "sine", duration = 0.04) {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.4, audioCtx.currentTime + duration);

            gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch {
            // Audio context not allowed or failed
        }
    }

    function toggleSound() {
        soundEnabled = !soundEnabled;
        localStorage.setItem("sound-enabled", soundEnabled ? "true" : "false");
        updateSoundUI();
        if (soundEnabled) {
            initAudio();
            playHapticSound(900, "triangle", 0.08);
            showToast("Haptic audio enabled");
        } else {
            showToast("Haptic audio muted");
        }
    }

    function updateSoundUI() {
        const soundBtn = document.getElementById("sound-btn");
        if (!soundBtn) return;
        const icon = soundBtn.querySelector(".sound-icon") || soundBtn;
        icon.textContent = soundEnabled ? "🔊" : "🔇";
        soundBtn.setAttribute("aria-label", soundEnabled ? "Mute haptic audio" : "Enable haptic audio");
        soundBtn.setAttribute("title", soundEnabled ? "Audio on (click to mute)" : "Audio muted (click to enable)");
    }

    // -------------------------------------------------------------
    // Toast Notification System
    // -------------------------------------------------------------
    function showToast(message, duration = 2200) {
        let toast = document.getElementById("toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "toast";
            toast.setAttribute("role", "status");
            toast.setAttribute("aria-live", "polite");
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.remove("toast-hide");
        toast.classList.add("toast-show");
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.replace("toast-show", "toast-hide");
        }, duration);
    }

    // -------------------------------------------------------------
    // Theme Switcher (Dark / Light)
    // -------------------------------------------------------------
    function getInitialMode() {
        const stored = localStorage.getItem("theme-mode");
        if (stored === "dark" || stored === "light") return stored;
        return (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) ? "light" : "dark";
    }

    function setTheme(mode) {
        const html = document.documentElement;
        html.setAttribute("data-mode", mode);
        localStorage.setItem("theme-mode", mode);
        const btn = document.getElementById("theme-btn");
        if (btn) {
            const isDark = mode === "dark";
            btn.textContent = isDark ? "☀️" : "🌙";
            btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
            btn.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
        }
    }

    function toggleTheme() {
        playHapticSound(600, "sine");
        const current = document.documentElement.getAttribute("data-mode") || getInitialMode();
        const next = current === "dark" ? "light" : "dark";
        setTheme(next);
        showToast(`Theme: ${next === "dark" ? "Dark Mode" : "Light Mode"}`);
    }

    // -------------------------------------------------------------
    // Dynamic Island Live Bengaluru Clock & Scroll State
    // -------------------------------------------------------------
    function initDynamicIsland() {
        const timeEl = document.getElementById("island-time");
        const island = document.getElementById("dynamic-island");
        const scrollBar = document.getElementById("scroll-progress");
        const navPills = document.querySelectorAll(".island-nav .nav-pill");
        const sections = Array.from(document.querySelectorAll("section[id], #top"));

        // Live Clock (Asia/Kolkata)
        function updateClock() {
            if (!timeEl) return;
            const now = new Date();
            const timeString = now.toLocaleTimeString("en-US", {
                timeZone: "Asia/Kolkata",
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });
            timeEl.textContent = `BLR · ${timeString}`;
        }
        updateClock();
        setInterval(updateClock, 1000);

        // Scroll progress & active nav highlight
        let ticking = false;
        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                    const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;

                    if (scrollBar) {
                        scrollBar.style.width = `${progress}%`;
                    }

                    if (island) {
                        if (scrollY > 40) {
                            island.classList.add("scrolled");
                        } else {
                            island.classList.remove("scrolled");
                        }
                    }

                    // Highlight active section pill
                    const scrollMiddle = scrollY + window.innerHeight * 0.35;
                    let currentSectionId = "";
                    for (const section of sections) {
                        const top = section.offsetTop;
                        const height = section.offsetHeight;
                        if (scrollMiddle >= top && scrollMiddle < top + height) {
                            currentSectionId = section.getAttribute("id");
                        }
                    }

                    navPills.forEach(pill => {
                        const target = pill.getAttribute("data-nav");
                        if (target && target === currentSectionId) {
                            pill.classList.add("active");
                        } else {
                            pill.classList.remove("active");
                        }
                    });

                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    // -------------------------------------------------------------
    // Canvas Ambient Mesh & Parallax Background
    // -------------------------------------------------------------
    function initCanvasMesh() {
        const canvas = document.getElementById("bg-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = 0;
        let height = 0;
        let dpr = 1;
        let particles = [];
        const PARTICLE_COUNT = 45;
        let mouseX = -9999;
        let mouseY = -9999;
        let animId = null;

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            initParticles();
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.35,
                    baseRadius: Math.random() * 1.5 + 0.8,
                    pulse: Math.random() * Math.PI * 2
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            const isDark = document.documentElement.getAttribute("data-mode") !== "light";
            const nodeColor = isDark ? "rgba(99, 102, 241, " : "rgba(79, 70, 229, ";
            const lineBase = isDark ? "rgba(99, 102, 241, " : "rgba(79, 70, 229, ";

            const scrollParallaxY = window.scrollY * 0.06;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.pulse += 0.02;

                // Wrap around edges
                if (p.x < -20) p.x = width + 20;
                if (p.x > width + 20) p.x = -20;
                if (p.y < -20) p.y = height + 20;
                if (p.y > height + 20) p.y = -20;

                // Mouse interaction repulsion/attraction
                const actualY = (p.y - scrollParallaxY) % height;
                const renderedY = actualY < 0 ? actualY + height : actualY;

                const dx = mouseX - p.x;
                const dy = mouseY - renderedY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120 && dist > 0) {
                    const force = (120 - dist) / 120;
                    p.x -= (dx / dist) * force * 0.6;
                    p.y -= (dy / dist) * force * 0.6;
                }

                // Render particle dot
                const r = p.baseRadius + Math.sin(p.pulse) * 0.4;
                ctx.beginPath();
                ctx.arc(p.x, renderedY, Math.max(0.4, r), 0, Math.PI * 2);
                ctx.fillStyle = `${nodeColor}${isDark ? 0.35 : 0.25})`;
                ctx.fill();

                // Connect nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const actualY2 = (p2.y - scrollParallaxY) % height;
                    const renderedY2 = actualY2 < 0 ? actualY2 + height : actualY2;

                    const pdx = p.x - p2.x;
                    const pdy = renderedY - renderedY2;
                    const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

                    if (pdist < 110) {
                        const alpha = (1 - pdist / 110) * (isDark ? 0.16 : 0.1);
                        ctx.beginPath();
                        ctx.moveTo(p.x, renderedY);
                        ctx.lineTo(p2.x, renderedY2);
                        ctx.strokeStyle = `${lineBase}${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            animId = requestAnimationFrame(draw);
        }

        window.addEventListener("resize", resize, { passive: true });
        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }, { passive: true });
        window.addEventListener("mouseleave", () => {
            mouseX = -9999;
            mouseY = -9999;
        }, { passive: true });

        // Pause animation when tab is inactive to save battery
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                if (animId) cancelAnimationFrame(animId);
            } else {
                animId = requestAnimationFrame(draw);
            }
        });

        resize();
        animId = requestAnimationFrame(draw);
    }

    // -------------------------------------------------------------
    // Bento Spotlight & 3D Interactive Card Tilt
    // -------------------------------------------------------------
    function initSpotlightsAndTilt() {
        const cards = document.querySelectorAll(".spotlight-card");
        const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        cards.forEach((card) => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Update CSS variables for radial flashlight glow
                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);

                // 3D Tilt calculation (subtle)
                if (!prefersReducedMotion && window.innerWidth > 768) {
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -4.5;
                    const rotateY = ((x - centerX) / centerX) * 4.5;
                    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
                }
            });

            card.addEventListener("mouseleave", () => {
                card.style.setProperty("--mouse-x", `-999px`);
                card.style.setProperty("--mouse-y", `-999px`);
                if (!prefersReducedMotion) {
                    card.style.transform = "";
                }
            });
        });
    }

    // -------------------------------------------------------------
    // Project Category Bento Filter Tabs
    // -------------------------------------------------------------
    function initProjectFilters() {
        const tabs = document.querySelectorAll(".bento-filters .filter-tab");
        const projects = document.querySelectorAll("#project-bento-grid .project-item");

        if (!tabs.length || !projects.length) return;

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                playHapticSound(950, "sine");
                tabs.forEach((t) => {
                    t.classList.remove("active");
                    t.setAttribute("aria-selected", "false");
                });
                tab.classList.add("active");
                tab.setAttribute("aria-selected", "true");

                const filter = tab.getAttribute("data-filter") || "all";

                projects.forEach((item) => {
                    const categories = (item.getAttribute("data-category") || "").split(" ");
                    const matches = filter === "all" || categories.includes(filter);

                    if (matches) {
                        item.style.display = "";
                        setTimeout(() => {
                            item.style.opacity = "1";
                            item.style.transform = "";
                        }, 20);
                    } else {
                        item.style.opacity = "0";
                        item.style.transform = "scale(0.96)";
                        setTimeout(() => {
                            item.style.display = "none";
                        }, 240);
                    }
                });
            });
        });
    }

    // -------------------------------------------------------------
    // Terminal Typewriter Prompt Loop
    // -------------------------------------------------------------
    function initTypewriter() {
        const typedSpan = document.getElementById("typed-text");
        if (!typedSpan) return;

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function tick() {
            const currentPhrase = PHRASES[phraseIndex];
            if (!isDeleting) {
                typedSpan.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            } else {
                typedSpan.textContent = currentPhrase.substring(0, Math.max(0, charIndex - 1));
                charIndex--;
            }

            let delay = isDeleting ? 25 : 60;
            if (!isDeleting && charIndex === currentPhrase.length) {
                delay = 2400;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % PHRASES.length;
                delay = 450;
            }

            setTimeout(tick, delay);
        }

        setTimeout(tick, 600);
    }

    // -------------------------------------------------------------
    // Personal Facts Widget
    // -------------------------------------------------------------
    function nextFact() {
        const textEl = document.getElementById("fact-text");
        const btn = document.getElementById("fact-refresh");
        if (!textEl) return;

        playHapticSound(850, "triangle");

        if (btn) {
            btn.classList.remove("spinning");
            void btn.offsetWidth; // Force CSS reflow
            btn.classList.add("spinning");
        }

        if (!FACTS.length) {
            textEl.textContent = "No trivia records available right now.";
            return;
        }

        let idx;
        do {
            idx = Math.floor(Math.random() * FACTS.length);
        } while (idx === lastFactIdx && FACTS.length > 1);

        lastFactIdx = idx;
        textEl.style.opacity = "0";
        setTimeout(() => {
            textEl.textContent = FACTS[idx];
            textEl.style.opacity = "1";
        }, 150);
    }

    // -------------------------------------------------------------
    // Email Copy to Clipboard
    // -------------------------------------------------------------
    function copyEmailToClipboard() {
        playHapticSound(1100, "sine");
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(EMAIL).then(() => {
                showToast(`Copied to clipboard: ${EMAIL}`);
            }).catch(() => {
                window.location.href = `mailto:${EMAIL}`;
            });
        } else {
            window.location.href = `mailto:${EMAIL}`;
        }
    }

    // -------------------------------------------------------------
    // Command Palette (⌘K / Ctrl+K)
    // -------------------------------------------------------------
    function initCommandPalette() {
        const modal = document.getElementById("cmd-palette-modal");
        const backdrop = document.getElementById("cmd-backdrop");
        const input = document.getElementById("cmd-input");
        const closeBtn = document.getElementById("cmd-close-btn");
        const triggerBtn = document.getElementById("cmd-trigger-btn");
        const dockTriggerBtn = document.getElementById("dock-cmd-btn");
        const resultsContainer = document.getElementById("cmd-results-list");
        if (!modal || !input) return;

        let activeIdx = 0;

        function getVisibleItems() {
            return Array.from(modal.querySelectorAll(".cmd-item:not([style*='display: none'])"));
        }

        function updateSelection(items) {
            items.forEach((item, idx) => {
                if (idx === activeIdx) {
                    item.classList.add("selected");
                    item.scrollIntoView({ block: "nearest", behavior: "smooth" });
                } else {
                    item.classList.remove("selected");
                }
            });
        }

        function openPalette() {
            playHapticSound(900, "triangle");
            modal.classList.add("open");
            modal.setAttribute("aria-hidden", "false");
            input.value = "";
            filterCommands("");
            activeIdx = 0;
            const items = getVisibleItems();
            updateSelection(items);
            setTimeout(() => input.focus(), 60);
        }

        function closePalette() {
            playHapticSound(600, "sine");
            modal.classList.remove("open");
            modal.setAttribute("aria-hidden", "true");
        }

        function filterCommands(query) {
            const q = query.trim().toLowerCase();
            const items = modal.querySelectorAll(".cmd-item");
            const groupLabels = modal.querySelectorAll(".cmd-group-label");

            items.forEach((item) => {
                const text = (item.textContent || "").toLowerCase();
                if (!q || text.includes(q)) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            });

            // Hide section labels if all children are hidden
            groupLabels.forEach(label => {
                let next = label.nextElementSibling;
                let hasVisible = false;
                while (next && !next.classList.contains("cmd-group-label")) {
                    if (next.classList.contains("cmd-item") && next.style.display !== "none") {
                        hasVisible = true;
                        break;
                    }
                    next = next.nextElementSibling;
                }
                label.style.display = hasVisible ? "" : "none";
            });

            const visible = getVisibleItems();
            activeIdx = 0;
            updateSelection(visible);
        }

        function executeItem(item) {
            if (!item) return;
            const action = item.getAttribute("data-action");
            const target = item.getAttribute("data-target");
            const url = item.getAttribute("data-url");

            closePalette();

            if (action === "nav" && target) {
                const el = document.querySelector(target);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                }
            } else if (action === "copy-email") {
                copyEmailToClipboard();
            } else if (action === "toggle-theme") {
                toggleTheme();
            } else if (action === "toggle-sound") {
                toggleSound();
            } else if (action === "open-link" && url) {
                window.open(url, "_blank", "noopener,noreferrer");
            }
        }

        // Event Listeners
        if (triggerBtn) triggerBtn.addEventListener("click", openPalette);
        if (dockTriggerBtn) dockTriggerBtn.addEventListener("click", openPalette);
        if (backdrop) backdrop.addEventListener("click", closePalette);
        if (closeBtn) closeBtn.addEventListener("click", closePalette);

        input.addEventListener("input", (e) => {
            filterCommands(e.target.value);
        });

        input.addEventListener("keydown", (e) => {
            const items = getVisibleItems();
            if (e.key === "ArrowDown") {
                e.preventDefault();
                playHapticSound(750, "sine", 0.02);
                activeIdx = (activeIdx + 1) % items.length;
                updateSelection(items);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                playHapticSound(750, "sine", 0.02);
                activeIdx = (activeIdx - 1 + items.length) % items.length;
                updateSelection(items);
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (items[activeIdx]) {
                    executeItem(items[activeIdx]);
                }
            } else if (e.key === "Escape") {
                e.preventDefault();
                closePalette();
            }
        });

        // Click on individual items
        resultsContainer.addEventListener("click", (e) => {
            const item = e.target.closest(".cmd-item");
            if (item) {
                executeItem(item);
            }
        });

        // Global hotkeys (⌘K, Ctrl+K, ESC)
        document.addEventListener("keydown", (e) => {
            const isK = e.key === "k" || e.key === "K";
            const isCmdOrCtrl = e.metaKey || e.ctrlKey;

            if (isCmdOrCtrl && isK) {
                e.preventDefault();
                if (modal.classList.contains("open")) {
                    closePalette();
                } else {
                    openPalette();
                }
                return;
            }

            if (e.key === "Escape" && modal.classList.contains("open")) {
                e.preventDefault();
                closePalette();
                return;
            }

            // Quick hotkey 't' for theme (outside input fields)
            const tag = document.activeElement?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable) return;

            if ((e.key === "t" || e.key === "T") && !e.altKey && !e.ctrlKey && !e.metaKey) {
                toggleTheme();
            }
        });
    }

    // -------------------------------------------------------------
    // Apple-Style Dock Magnification (Desktop)
    // -------------------------------------------------------------
    function initDockInteractions() {
        const dock = document.getElementById("dock-nav");
        if (!dock) return;
        const items = dock.querySelectorAll(".dock-item");

        dock.addEventListener("mousemove", (e) => {
            if (window.innerWidth < 860) return;
            const mouseX = e.clientX;

            items.forEach((item) => {
                const rect = item.getBoundingClientRect();
                const itemCenterX = rect.left + rect.width / 2;
                const distance = Math.abs(mouseX - itemCenterX);

                if (distance < 90) {
                    const scale = 1 + (1 - distance / 90) * 0.28;
                    item.style.transform = `scale(${scale.toFixed(3)}) translateY(-4px)`;
                } else {
                    item.style.transform = "";
                }
            });
        });

        dock.addEventListener("mouseleave", () => {
            items.forEach((item) => {
                item.style.transform = "";
            });
        });

        // Click haptics on dock items
        items.forEach((item) => {
            item.addEventListener("click", () => {
                playHapticSound(900, "sine");
            });
        });
    }

    // -------------------------------------------------------------
    // Scroll Fade-in Observer
    // -------------------------------------------------------------
    function initScrollObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("fade-in-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        document.querySelectorAll(".fade-in").forEach((el) => {
            observer.observe(el);
        });
    }

    // -------------------------------------------------------------
    // Bootstrap on DOM Ready
    // -------------------------------------------------------------
    document.addEventListener("DOMContentLoaded", () => {
        setTheme(getInitialMode());
        updateSoundUI();
        initDynamicIsland();
        initCanvasMesh();
        initSpotlightsAndTilt();
        initProjectFilters();
        initTypewriter();
        initCommandPalette();
        initDockInteractions();
        initScrollObserver();

        // Trivia facts setup
        nextFact();
        const refreshBtn = document.getElementById("fact-refresh");
        if (refreshBtn) {
            refreshBtn.addEventListener("click", nextFact);
        }

        // Theme and Sound toggles
        const themeBtn = document.getElementById("theme-btn");
        if (themeBtn) {
            themeBtn.addEventListener("click", toggleTheme);
        }

        const soundBtn = document.getElementById("sound-btn");
        if (soundBtn) {
            soundBtn.addEventListener("click", toggleSound);
        }

        // Email copy triggers
        const emailLinks = document.querySelectorAll(".email-copy-trigger, a[href^='mailto:']");
        emailLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                if (link.getAttribute("href") === `mailto:${EMAIL}`) {
                    // Let default mailto trigger or optionally copy
                    playHapticSound(800, "sine");
                }
            });
        });
    });

})();
