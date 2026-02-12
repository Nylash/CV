const tags = document.querySelectorAll('.tag');
const seenSkills = new Set();

const observer = new IntersectionObserver(handleIntersect, {
    threshold: 0.3
});

tags.forEach(tag => observer.observe(tag));

function handleIntersect(entries) {
    entries.forEach(entry => {

        document.querySelectorAll('.tag')[0].dataset
        if (!entry.isIntersecting) return;

        const skill = entry.target.textContent.trim();
        const category = entry.target.dataset.category;

        if (!skill || !category) return;

        if (seenSkills.has(skill)) return;

        seenSkills.add(skill);
        animateTagClone(entry.target, skill, category)
    });
}

function addSkillToPanel(skill, category) {

    const categoryBlock = document.querySelector(
        `.skill-category[data-category="${category}"] .skill-list`
    );

    if (!categoryBlock) return;

    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = skill;

    categoryBlock.appendChild(span);
}

/*
Create mobile skills section
*/

const CATEGORY_ORDER = [
    "Développement",
    "Architectures & Pratiques",
    "Outils",
    "Gestion de projet"
];

const mobileQuery = window.matchMedia("(max-width: 1024px)");

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

    // Création section
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

/*
Tag animation
*/

function animateTagClone(originalTag, skill, category) {

    if (window.innerWidth <= 1024) {
        addSkillToPanel(skill, category);
        return;
    }

    const categoryBlock = document.querySelector(
        `.skill-category[data-category="${category}"] .skill-list`
    );

    if (!categoryBlock) return;

    // 1️⃣ On crée le vrai tag FINAL immédiatement
    const finalTag = document.createElement("span");
    finalTag.className = "tag";
    finalTag.textContent = skill;

    categoryBlock.appendChild(finalTag);

    // 2️⃣ On mesure sa vraie position
    const endRect = finalTag.getBoundingClientRect();

    // 3️⃣ On le rend invisible (mais il reste dans le layout)
    finalTag.style.opacity = "0";

    // 4️⃣ On crée le clone animé
    const animatedClone = originalTag.cloneNode(true);
    document.body.appendChild(animatedClone);

    const startRect = originalTag.getBoundingClientRect();

    gsap.set(animatedClone, {
        position: "fixed",
        left: startRect.left,
        top: startRect.top,
        margin: 0,
        zIndex: 9999,
        whiteSpace: "nowrap"
    });

    // 5️⃣ Animation vers SA vraie place
    gsap.to(animatedClone, {
        left: endRect.left,
        top: endRect.top,
        opacity: 0.85,
        duration: 0.65,
        ease: "power3.inOut",
        onComplete: () => {
            animatedClone.remove();
            finalTag.style.opacity = "1";
        }
    });
}