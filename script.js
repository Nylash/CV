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
        addSkillToPanel(skill, category);
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