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


/* =========================================================
   #region INTERSECTION OBSERVER
========================================================= */

const observer = new IntersectionObserver(handleIntersect, {
    threshold: 0.3
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

        animateTagClone(entry.target, skill, category);
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

    const section = document.createElement("section");
    section.id = "mobile-skills";

    const title = document.createElement("h2");
    title.className = "section-title";
    title.textContent = "Compétences";

    const card = document.createElement("div");
    card.className = "card";

    CATEGORY_ORDER.forEach(category => {

        const skills = skillsByCategory[category];
        if (!skills) return;

        const item = document.createElement("div");
        item.className = "card-item-condensed";

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

        item.appendChild(h3);
        item.appendChild(tagContainer);
        card.appendChild(item);
    });

    section.appendChild(title);
    section.appendChild(card);

    const education = document.getElementById("education");
    education.parentNode.insertBefore(section, education);
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

function animateTagClone(originalTag, skill, category) {

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

    const finalTag = document.createElement("span");
    finalTag.className = "tag";
    finalTag.textContent = skill;

    categoryBlock.appendChild(finalTag);

    const endRect = finalTag.getBoundingClientRect();

    finalTag.style.opacity = "0";

    /* ---- 2. Création du clone animé ---- */

    const animatedClone = originalTag.cloneNode(true);
    document.body.appendChild(animatedClone);

    const startRect = originalTag.getBoundingClientRect();

    gsap.set(animatedClone, {
        position: "fixed",
        left: startRect.left,
        top: startRect.top,
        margin: 0,
        zIndex: 9999,
        whiteSpace: "nowrap" // évite les retours à la ligne pendant le vol
    });

    /* ---- 3. Animation vers la position réelle ---- */

    gsap.to(animatedClone, {
        left: endRect.left,
        top: endRect.top,
        duration: 0.65,
        ease: "power3.inOut",
        onComplete: () => {
            animatedClone.remove();
            finalTag.style.opacity = "1";
        }
    });
}

// #endregion

})();
