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

// Personal + professional facts widget
const FACTS = [
    // Personal highlights
    "Pulled a classmate to safety from a cliff edge during a trek — kept calm under pressure and led the immediate response.",
    "Finished Re:Zero (3 seasons) in just three days — peak focus mode unlocked.",
    "Traveled across Japan recently, exploring Tokyo, Himeji, and Hiroshima.",
    "I follow a One Meal A Day (OMAD) routine.",
    "Completed the TCS World Majja Run 4.2K in Bengaluru.",
    "Peak Valorant rank: Diamond 3 (Reyna main).",
    "Comfort-first wardrobe enthusiast — modal and bamboo fabrics all day.",

    // Professional spotlights
    "Migrated CI from CircleCI to GitHub Actions with reusable workflows and caching — faster, more reliable pipelines.",
    "Enjoy designing clean APIs and shipping resilient services in Python (Django/Flask/FastAPI).",
    "Scaled background jobs with Celery + RabbitMQ to millions of tasks per month.",
    "Introduced SLOs/SLIs, on-call runbooks, and actionable alerts — faster MTTR.",
    "Zero‑downtime database migrations and blue‑green deploys for safe releases.",
    "Partitioned data and tuned indexes to keep p95/p99 predictable at scale.",
    "Cut cloud costs ~30% via right‑sizing, autoscaling, and storage lifecycle policies.",
    "Implemented least‑privilege IAM and centralized secret management.",
    "Built developer CLIs and templates to speed service scaffolding and diagnostics.",
    "Mentored junior engineers; raised test coverage and code review quality.",
    "Added observability — metrics, structured logs, and traces for rapid troubleshooting."
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
    // Optional: keyboard shortcut "t" to toggle theme
    document.addEventListener("keydown", (e) => {
        if ((e.key === "t" || e.key === "T") && !e.altKey && !e.ctrlKey && !e.metaKey) {
            toggleTheme();
        }
    });
}

function initEmailCopy() {
    const emailLink = document.getElementById("email-link");
    if (!emailLink) return;
    emailLink.addEventListener("contextmenu", (e) => e.preventDefault());
    // Add a click+modifier to copy to clipboard without opening mail client
    emailLink.addEventListener("click", (e) => {
        if (e.shiftKey) {
            e.preventDefault();
            copyEmail();
        }
    });
}

function copyEmail() {
    if (!navigator.clipboard) {
        window.alert(EMAIL);
        return;
    }
    navigator.clipboard.writeText(EMAIL).then(() => {
        alert("Email copied to clipboard!");
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
