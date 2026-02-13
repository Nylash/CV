const SkillSystem = (() => {
   /* =========================================================
   VARIABLES GLOBALES
========================================================= */

const tags = document.querySelectorAll(".main-content .tag");
const seenSkills = new Set();

const mobileQuery = window.matchMedia("(max-width: 1024px)");

const CATEGORY_ORDER = [
    "Développement",
    "Architectures & Pratiques",
    "Outils",
    "Gestion de projet"
];

let animationQueue = Promise.resolve();

/* =========================================================
   #region INTERSECTION OBSERVER
========================================================= */

const observer = new IntersectionObserver(handleIntersect, {
    threshold: 0.6
});

tags.forEach(tag => observer.observe(tag));

function handleIntersect(entries) {
    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const skill = entry.target.textContent.trim();
        const category = entry.target.dataset.category;

        if (!skill || !category) return;
        if (seenSkills.has(skill)) return;

        seenSkills.add(skill);

        animationQueue = animationQueue.then(() =>
            animateTagClone(entry.target, skill, category)
        );
    });
}

// #endregion


/* =========================================================
   #region SKILL PANEL (DESKTOP)
========================================================= */

function addSkillToPanel(skill, category) {

    const categoryBlock = document.querySelector(
        `.skill-category[data-category="${category}"] .skill-list`
    );

    if (!categoryBlock) return;

    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = skill;

    categoryBlock.appendChild(span);
}

// #endregion


/* =========================================================
   #region MOBILE SKILLS SECTION
========================================================= */

function buildMobileSkillsSection() {

    if (document.getElementById("mobile-skills")) return;

    const tags = document.querySelectorAll(".main-content .tag");
    const skillsByCategory = {};

    tags.forEach(tag => {

        const category = tag.dataset.category;
        const skill = tag.textContent.trim();

        if (!category) return;

        if (!skillsByCategory[category]) {
            skillsByCategory[category] = new Set();
        }

        skillsByCategory[category].add(skill);
    });

    const container = document.createElement("section");
    container.id = "mobile-skills";

    const title = document.createElement("h2");
    title.className = "section-title";
    title.textContent = "Compétences";

    container.appendChild(title);

    const education = document.getElementById("education");
    education.parentNode.insertBefore(container, education);

    CATEGORY_ORDER.forEach(category => {

        const skills = skillsByCategory[category];
        if (!skills) return;

        const section = document.createElement("section");
        section.className = "card";

        const h3 = document.createElement("h3");
        h3.textContent = category;

        const tagContainer = document.createElement("div");
        tagContainer.className = "tags";

        skills.forEach(skill => {
            const span = document.createElement("span");
            span.className = "tag";
            span.textContent = skill;
            tagContainer.appendChild(span);
        });

        section.appendChild(h3);
        section.appendChild(tagContainer);
        container.appendChild(section);
    });
}

function removeMobileSkillsSection() {
    const section = document.getElementById("mobile-skills");
    if (section) section.remove();
}

function handleResponsive(e) {
    if (e.matches) {
        buildMobileSkillsSection();
    } else {
        removeMobileSkillsSection();
    }
}

// Initial check
handleResponsive(mobileQuery);

// Listen resize
mobileQuery.addEventListener("change", handleResponsive);

// #endregion


/* =========================================================
   #region TAG ANIMATION (GSAP)
========================================================= */

async function animateTagClone(originalTag, skill, category) {

    // Mobile → ajout instantané (pas d’animation)
    if (window.innerWidth <= 1024) {
        addSkillToPanel(skill, category);
        return;
    }

    const categoryBlock = document.querySelector(
        `.skill-category[data-category="${category}"] .skill-list`
    );

    if (!categoryBlock) return;

    /* ---- 1. Création du vrai tag final (invisible) ---- */

    const startRect = originalTag.getBoundingClientRect();
    const finalTag = document.createElement("span");
    finalTag.className = "tag";
    finalTag.textContent = skill;
    finalTag.style.visibility = "hidden";

    categoryBlock.appendChild(finalTag);

    const endRect = finalTag.getBoundingClientRect();

    /* ---- 2. Création du clone animé ---- */

    const animatedClone = originalTag.cloneNode(true);
    document.body.appendChild(animatedClone);

    gsap.set(animatedClone, {
        position: "fixed",
        left: endRect.left,
        top: endRect.top,
        margin: 0,
        zIndex: 9999,
        whiteSpace: "nowrap" // évite les retours à la ligne pendant le vol
    });

    // Calcul du delta
    const deltaX = startRect.left - endRect.left;
    const deltaY = startRect.top - endRect.top;

    // On inverse visuellement la position
    gsap.set(animatedClone, {
        x: deltaX,
        y: deltaY
    });

    /* ---- 3. Animation vers la position réelle ---- */

    await new Promise(resolve => {
        gsap.to(animatedClone, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power3.inOut",
            onComplete: resolve
        });
    });
    animatedClone.remove();
    finalTag.style.visibility = "visible";

}

// #endregion

})();
