const tags = document.querySelectorAll('.tag');
const panel = document.getElementById('skill-panel');
const panelContent = document.getElementById('skill-panel-content');
const layout = document.querySelector('.page-layout');

const seenSkills = new Set();
const activeSkills = new Set();

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {

        const skill = entry.target.dataset.skill;

        if (!skill) return;

        // Si le tag est visible
        if (entry.isIntersecting) {

            // On marque qu'il a été vu
            seenSkills.add(skill);

            // Si il était dans le panel → on l’enlève
            if (activeSkills.has(skill)) {
                activeSkills.delete(skill);
            }

        } else {

            // Il sort de l'écran
            // Mais seulement si il a déjà été vu
            if (seenSkills.has(skill)) {
                activeSkills.add(skill);
            }
        }

    });

    updatePanel();

}, {
    threshold: 0.2
});

tags.forEach(tag => observer.observe(tag));

function updatePanel() {

    panelContent.innerHTML = '';

    panel.style.opacity = activeSkills.size ? 1 : 0;
    if (activeSkills.size === 0) {
        panel.style.display = 'none';
        layout.classList.add('panel-hidden');
        return;
    }
    else {
        layout.classList.remove('panel-hidden');
    }

    panel.style.display = 'block';

    activeSkills.forEach(skill => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = skill;
        panelContent.appendChild(span);
    });
}
