// Configuration
const EMAIL = "hello@anuraaggrao.com";
const PHRASES = [
    "Building scalable APIs with Python & FastAPI.",
    "Designing resilient IoT pipelines with TimescaleDB.",
    "Shipping CI/CD with GitHub Actions.",
    "Optimizing PostgreSQL for high‑throughput writes.",
    "Containerizing backend deployments with Docker.",
    "Tinkering with Raspberry Pi and retro hardware.",
];

// Toast notification
let toastTimeout = null;
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

// Personal + professional facts widget
const FACTS = [
    "Pulled a classmate to safety from a cliff edge during a trek — kept calm under pressure and led the immediate response.",
    "Finished Re:Zero (3 seasons) in just three days — peak focus mode unlocked.",
    "Traveled across Japan recently, exploring Tokyo, Himeji, and Hiroshima.",
    "Follows a One Meal A Day (OMAD) routine — discipline on and off the keyboard.",
    "Completed the TCS World Majja Run 4.2K in Bengaluru.",
    "Peak Valorant rank: Diamond 3 (Reyna main).",
    "Has been tinkering with Raspberry Pi projects since university — hardware meets software.",
    "Believes the best bug fix is the one that also ships a test proving it can never come back.",
];
let lastFactIdx = -1;
function nextFact() {
    const textEl = document.getElementById("fact-text");
    const btn = document.getElementById("fact-refresh");
    if (!textEl) return;
    if (btn) {
        btn.classList.remove("spinning");
        // Force reflow for re-triggering animation
        void btn.offsetWidth;
        btn.classList.add("spinning");
    }
    if (!FACTS.length) {
        textEl.textContent = "No facts available right now.";
        return;
    }
    let idx;
    do {
        idx = Math.floor(Math.random() * FACTS.length);
    } while (idx === lastFactIdx && FACTS.length > 1);
    lastFactIdx = idx;
    textEl.textContent = FACTS[idx];
}

function setTheme(theme) {
    const html = document.documentElement;
    const btn = document.getElementById("theme-btn");
    html.setAttribute("data-theme", theme);
    if (btn) {
        const isDark = theme === "dark";
        btn.textContent = isDark ? "☀️" : "🌙";
        btn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
        btn.setAttribute("title", isDark ? "Switch to light theme" : "Switch to dark theme");
    }
}

function getInitialTheme() {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") return stored;
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || getInitialTheme();
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    setTheme(next);
}

function initTheme() {
    setTheme(getInitialTheme());
    const btn = document.getElementById("theme-btn");
    if (btn) btn.addEventListener("click", toggleTheme);
    // Keyboard shortcut "t" to toggle theme (skip when typing in inputs)
    document.addEventListener("keydown", (e) => {
        const tag = document.activeElement?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable) return;
        if ((e.key === "t" || e.key === "T") && !e.altKey && !e.ctrlKey && !e.metaKey) {
            toggleTheme();
        }
    });
}

function initEmailCopy() {
    const emailLink = document.getElementById("email-link");
    if (!emailLink) return;
    // Click copies email to clipboard; falls back to mailto if clipboard unavailable
    emailLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (!navigator.clipboard) {
            window.location.href = `mailto:${EMAIL}`;
            return;
        }
        navigator.clipboard.writeText(EMAIL).then(() => {
            showToast(`Copied: ${EMAIL}`);
        }).catch(() => {
            window.location.href = `mailto:${EMAIL}`;
        });
    });
}

function initTypewriter() {
    const typedTextSpan = document.getElementById("typed-text");
    if (!typedTextSpan) return;
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
        const currentPhrase = PHRASES[phraseIndex];
        if (!isDeleting) {
            typedTextSpan.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        } else {
            typedTextSpan.textContent = currentPhrase.substring(0, Math.max(0, charIndex - 1));
            charIndex--;
        }

        let delay = isDeleting ? 30 : 70;
        if (!isDeleting && charIndex === currentPhrase.length) {
            delay = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % PHRASES.length;
            delay = 500;
        }

        setTimeout(tick, delay);
    }

    setTimeout(tick, 800);
}

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initEmailCopy();
    initTypewriter();
    nextFact();
    const refresh = document.getElementById("fact-refresh");
    if (refresh) refresh.addEventListener("click", nextFact);
});
