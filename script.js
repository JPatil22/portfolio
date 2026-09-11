// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .service-card, .project-item, .platform-btn, .stat-card, .faq-question, .pricing-card, .badge').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
        cursor.style.background = '#7c3aed';
        follower.style.transform = 'translate(-50%, -50%) scale(1.6)';
        follower.style.borderColor = 'rgba(124,58,237,0.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.background = '#06b6d4';
        follower.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.borderColor = 'rgba(6, 182, 212, 0.35)';
    });
});

// ============================================
// SCROLL PROGRESS BAR
// ============================================
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ============================================
// FLOATING CTA & BACK TO TOP
// ============================================
const floatingCTA = document.getElementById('floating-cta');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    const heroHeight = document.getElementById('home').offsetHeight;
    const scrolled = window.scrollY;
    floatingCTA.classList.toggle('hidden', scrolled < heroHeight * 0.8);
    backToTop.classList.toggle('hidden', scrolled < 400);
});

backToTop.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

// ============================================
// MOBILE MENU
// ============================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
});
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => {
    menuOpen = false; mobileMenu.classList.remove('open');
}));

// ============================================
// HERO CANVAS — PARTICLE NETWORK WITH PARALLAX
// ============================================
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mx = 0, my = 0;

function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
resize();
window.addEventListener('resize', () => { resize(); particles = []; initParticles(); });

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.ox = this.x; this.oy = this.y;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.8 + 0.8;
        this.alpha = Math.random() * 0.45 + 0.15;
        this.color = Math.random() > 0.5 ? '124,58,237' : '6,182,212';
        this.parallaxFactor = Math.random() * 0.02 + 0.005;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        // Parallax offset
        const px = (mx - window.innerWidth / 2) * this.parallaxFactor;
        const py = (my - window.innerHeight / 2) * this.parallaxFactor;
        const rx = this.x + px;
        const ry = this.y + py;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        return { rx, ry };
    }
    draw(rx, ry) {
        ctx.beginPath();
        ctx.arc(rx, ry, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
        ctx.fill();
    }
}

function initParticles() { for (let i = 0; i < 90; i++) particles.push(new Particle()); }
initParticles();

function connectParticles(positions) {
    for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
            const dx = positions[i].rx - positions[j].rx;
            const dy = positions[i].ry - positions[j].ry;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
                ctx.beginPath();
                ctx.moveTo(positions[i].rx, positions[i].ry);
                ctx.lineTo(positions[j].rx, positions[j].ry);
                ctx.strokeStyle = `rgba(124,58,237,${0.12 * (1 - dist / 140)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const positions = particles.map(p => p.update());
    particles.forEach((p, i) => p.draw(positions[i].rx, positions[i].ry));
    connectParticles(positions);
    requestAnimationFrame(animateCanvas);
}
animateCanvas();

// ============================================
// TYPEWRITER
// ============================================
const phrases = [
    'AI-powered SaaS platforms.',
    'realtime voice agents.',
    'full-stack web apps.',
    'business automation tools.',
    'scalable backends & APIs.'
];
const typeEl = document.getElementById('typewriter');
let phraseIdx = 0, charIdx = 0, deleting = false, typeDelay = 100;

function typeWriter() {
    const current = phrases[phraseIdx];
    if (!deleting) {
        typeEl.textContent = current.slice(0, ++charIdx);
        typeDelay = charIdx === current.length ? (deleting = true, 2000) : 75;
    } else {
        typeEl.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; typeDelay = 350; }
        else typeDelay = 38;
    }
    setTimeout(typeWriter, typeDelay);
}
setTimeout(typeWriter, 1200);

// ============================================
// ANIMATED COUNTERS
// ============================================
function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const startTime = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.round(easeOut(progress) * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
    }
    requestAnimationFrame(update);
}

// ============================================
// SCROLL REVEAL + COUNTER TRIGGER
// ============================================
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const allSiblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
            const idx = allSiblings.indexOf(entry.target);
            setTimeout(() => {
                entry.target.classList.add('visible');
                // Trigger counters inside this element
                entry.target.querySelectorAll('.counter').forEach(c => animateCounter(c));
            }, idx * 80);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealEls.forEach(el => observer.observe(el));

// Also observe counters that aren't inside reveal elements
document.querySelectorAll('.counter').forEach(el => {
    if (!el.closest('.reveal')) {
        const c = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) { animateCounter(el); c.disconnect(); }
        }, { threshold: 0.5 });
        c.observe(el);
    }
});

// ============================================
// 3D TILT EFFECT ON PROJECT CARDS
// ============================================
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -5;
        const rotateY = ((x - cx) / cx) * 5;
        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        card.style.transition = 'transform 0.1s ease-out';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)';
        card.style.transition = 'transform 0.5s ease';
    });
});

// ============================================
// FAQ ACCORDION
// ============================================
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        document.querySelectorAll('.faq-item').forEach(i => {
            i.classList.remove('open');
            i.querySelector('.faq-answer').style.maxHeight = null;
        });
        // Open clicked
        if (!isOpen) {
            item.classList.add('open');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// ============================================
// ACTIVE NAV LINK
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${entry.target.id}`;
                link.style.color = isActive ? '#f1f5f9' : '';
                link.style.fontWeight = isActive ? '600' : '';
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ============================================
// CONTACT FORM AJAX SUBMISSION (Web3Forms / Formspree)
// ============================================
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.innerHTML = `<span>Sending...</span> <div class="spinner" style="width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.8s linear infinite"></div>`;
        formStatus.className = 'form-status';
        formStatus.textContent = '';

        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const result = await response.json();
            
            if (response.ok || result.success) {
                formStatus.className = 'form-status success';
                formStatus.textContent = '✓ Message sent! Thank you — Jay will get back to you within 12 hours.';
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            formStatus.className = 'form-status error';
            formStatus.textContent = '✕ Error sending message. Please try again or email directly.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.innerHTML = originalBtnHTML;
        }
    });
}

