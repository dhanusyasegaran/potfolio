/**
 * Dhanusya Segaran D - Portfolio Interactive Scripts
 * Features: Particle Constellation Canvas, Typewriter, ScrollSpy,
 * Project Filters, Interactive Modal, One-Click Copy, Contact Form Handling
 */

document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initParticleCanvas();
    initNavbarScroll();
    initMobileNav();
    initProjectFilters();
    initProjectModal();
    initCopyButtons();
    initContactForm();
    initBackToTop();
    updateCopyrightYear();
});

/* ==========================================================================
   1. Typewriter Effect
   ========================================================================== */
function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter-text');
    if (!typewriterElement) return;

    const words = [
        "AI & Data Science Student",
        "Machine Learning Developer",
        "Data Analytics Enthusiast",
        "Chatbot & Automation Specialist",
        "Aspiring Solutions Architect"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 90;
    const eraseSpeed = 50;
    const delayBetweenWords = 1800;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? eraseSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentWord.length) {
            speed = delayBetweenWords;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    type();
}

/* ==========================================================================
   2. Interactive HTML5 Particle Constellation Canvas
   ========================================================================== */
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 18), 75);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.radius = Math.random() * 2 + 1;
            this.color = Math.random() > 0.4 ? 'rgba(0, 240, 255,' : 'rgba(168, 85, 247,';
            this.alpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${this.color}${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 110) {
                    const lineAlpha = (1 - distance / 110) * 0.22;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${lineAlpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   3. Navbar Scroll & Active Section Highlighting
   ========================================================================== */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Navbar shadow and backdrop on scroll
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section spy
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 140;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ==========================================================================
   4. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });
}

/* ==========================================================================
   5. Projects Category Filtering
   ========================================================================== */
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory.includes(category)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

/* ==========================================================================
   6. Project Details Modal
   ========================================================================== */
const projectData = {
    cyber_ai: {
        title: "Adaptive Multi-Agent AI for Cybersecurity Incident Investigation and Risk Prioritization",
        category: "Multi-Agent AI, LLM & Cybersecurity",
        image: "assets/images/project_cyber_ai.jpg",
        description: "An advanced multi-agent AI architecture engineered for automated cybersecurity alert correlation, threat investigation, automated verification, and risk prioritization. Utilizes specialized agentic workflows and Retrieval-Augmented Generation (RAG) to inspect indicators of compromise, query security intelligence bases, and generate analyst-grade incident reports.",
        highlights: [
            "Alert Correlation & Risk Scoring: Correlates disparate security alerts and assigns dynamic risk scores based on threat severity.",
            "Autonomous AI Investigation: Employs AI agents and RAG pipelines to investigate active threats and retrieve intelligence.",
            "Verification Agent: Deploys a dedicated verification agent to rigorously validate findings and reduce false positives.",
            "Explainability (XAI): Produces evidence-backed incident reports with human-in-the-loop analyst feedback loops."
        ],
        techStack: ["Python", "Multi-Agent AI", "LLM", "RAG", "Explainable AI", "Cybersecurity", "Machine Learning"],
        githubUrl: "https://github.com/dhanusyasegaran"
    },
    drowsiness: {
        title: "Drowsiness Detection System (2024)",
        category: "Machine Learning & Computer Vision",
        image: "assets/images/project_drowsiness.jpg",
        description: "An intelligent, real-time computer vision system built to detect driver fatigue and prevent roadway accidents. Using facial landmark detection and Eye Aspect Ratio (EAR) calculations, the model continuously monitors driver alertness and triggers audible warnings when closed-eye or drowsiness patterns exceed predefined safety thresholds.",
        highlights: [
            "Real-time video feed analysis using OpenCV and MediaPipe / Dlib 68-point landmarks.",
            "Calculates Eye Aspect Ratio (EAR) and Mouth Opening Ratio (MOR) to detect yawns and microsleep.",
            "Instant buzzer/alert generation to wake the driver and log warning metrics.",
            "High frame-rate inference optimized for lightweight execution on edge devices."
        ],
        techStack: ["Python", "OpenCV", "Machine Learning", "MediaPipe", "NumPy", "SciPy"],
        githubUrl: "https://github.com/dhanusyasegaran"
    },
    ev_charging: {
        title: "Electric Vehicle Charging Infrastructure Automation (2025)",
        category: "Automation & Smart Energy Systems",
        image: "assets/images/project_ev_charging.jpg",
        description: "A centralized smart management and automation prototype for urban electric vehicle charging stations. Integrates grid load telemetry, automated queue allocation, and intelligent scheduling algorithms to balance charging loads during peak hours and maximize renewable energy utilization.",
        highlights: [
            "Automated slot allocation algorithms based on battery state-of-charge (SoC) and wait times.",
            "RPA workflows automated with UiPath for recurring billing and telemetry reporting.",
            "Real-time grid stability monitoring to avoid power surges across charging clusters.",
            "Dynamic dashboard tracking energy output, station availability, and daily throughput."
        ],
        techStack: ["Python", "Automation", "UiPath RPA", "IoT Telemetry", "Data Analytics"],
        githubUrl: "https://github.com/dhanusyasegaran"
    },
    ai_chatbot: {
        title: "Context-Aware AI Chatbot Assistant (2025)",
        category: "Natural Language Processing & Chatbots",
        image: "assets/images/project_ai_chatbot.jpg",
        description: "An automated conversational AI agent developed for enterprise query resolution and automated user assistance. Features intent classification, entity extraction, and conversational memory to seamlessly guide users through multi-turn questions and automate support workflows.",
        highlights: [
            "Intent recognition and custom dialogue management for intelligent routing.",
            "Full context persistence across user interactions with fallback escalation rules.",
            "Automated integration with databases for live order status and appointment booking.",
            "Freelance deployment resulting in a 40% reduction in customer response times."
        ],
        techStack: ["Python", "NLP", "Chatbot Architecture", "REST APIs", "Machine Learning"],
        githubUrl: "https://github.com/dhanusyasegaran"
    },
    analytics_bi: {
        title: "Business Intelligence & Predictive Analytics Dashboard",
        category: "Data Science & BI",
        image: "assets/images/project_analytics_bi.jpg",
        description: "An end-to-end data analytics and business intelligence solution developed using Python pipelines, Power BI, and Tableau. Transforms complex raw datasets into interactive visual stories with key performance indicators (KPIs), trend forecasting, and cohort analysis.",
        highlights: [
            "Comprehensive data cleaning, outlier detection, and feature engineering in Python & Pandas.",
            "Interactive Tableau and Power BI dashboards with drill-down filters and cross-tab analysis.",
            "Predictive regression modeling to project revenue trends and identify seasonal variance.",
            "Clean data documentation and structured reporting adhering to enterprise standards."
        ],
        techStack: ["Python", "Power BI", "Tableau", "SQL", "Excel", "Data Visualization"],
        githubUrl: "https://github.com/dhanusyasegaran"
    }
};

function initProjectModal() {
    const modalBackdrop = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalDesc = document.getElementById('modal-desc');
    const modalHighlights = document.getElementById('modal-highlights');
    const modalTech = document.getElementById('modal-tech');
    const modalGithub = document.getElementById('modal-github');

    if (!modalBackdrop) return;

    // Open Modal
    document.querySelectorAll('.view-project-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = btn.getAttribute('data-project');
            const data = projectData[projectId];
            if (!data) return;

            modalImg.src = data.image;
            modalImg.alt = data.title;
            modalTitle.textContent = data.title;
            modalCategory.textContent = data.category;
            modalDesc.textContent = data.description;

            modalHighlights.innerHTML = '';
            data.highlights.forEach(h => {
                const li = document.createElement('li');
                li.style.marginBottom = '6px';
                li.innerHTML = `<i class="fas fa-check-circle" style="color: var(--cyan); margin-right: 8px;"></i> ${h}`;
                modalHighlights.appendChild(li);
            });

            modalTech.innerHTML = '';
            data.techStack.forEach(t => {
                const span = document.createElement('span');
                span.className = 'tech-tag';
                span.textContent = t;
                modalTech.appendChild(span);
            });

            modalGithub.href = data.githubUrl;

            modalBackdrop.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close Modal
    function closeModal() {
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ==========================================================================
   7. Copy to Clipboard
   ========================================================================== */
function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check" style="color: var(--emerald);"></i> Copied!';
                showToast(`Copied "${textToCopy}" to clipboard!`);
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                }, 2200);
            }).catch(err => {
                console.error("Failed to copy:", err);
            });
        });
    });
}

/* ==========================================================================
   8. Contact Form Handling
   ========================================================================== */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const subject = document.getElementById('form-subject').value.trim();
        const message = document.getElementById('form-message').value.trim();

        if (!name || !email || !message) {
            showToast("Please fill in all required fields.");
            return;
        }

        // Construct mailto link as fallback to launch user's default email client
        const mailtoLink = `mailto:dhanusyasegaran@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Inquiry from ' + name)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;

        showToast("Opening email client to send your message...");
        setTimeout(() => {
            window.location.href = mailtoLink;
            contactForm.reset();
        }, 1000);
    });
}

/* ==========================================================================
   Toast Notification Utility
   ========================================================================== */
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fas fa-info-circle"></i> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}

/* ==========================================================================
   9. Back to Top Button
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==========================================================================
   10. Dynamic Copyright Year
   ========================================================================== */
function updateCopyrightYear() {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}