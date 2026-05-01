/**
 * Portfolio & Assignment Management System - Core Logic
 */

// --- 1. Global Configurations ---
const SHEET_ID = '14gHprU2oHbfAJPFiBeHZ48756TPN0FPQNnkWY3zt7cQ';
const SHEET_NAME = 'Assignments';
const SHEET_EDIT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?usp=sharing`;
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;

let assignments = []; // State array

// --- 2. UI Elements & Setup ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTypingEffect();
    initMobileMenu();
    initProjectFilters();
    initSmoothScroll();

    const openSheetBtn = document.getElementById('open-sheet-btn');
    if (openSheetBtn) openSheetBtn.addEventListener('click', openSheetManager);
    
    // Load Assignments
    loadAssignments();
});

window.addEventListener('load', () => {
    // Hide Loader
    const loader = document.querySelector('.loader-wrapper');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 1000);

    initGSAPAnimations();
    initSkillsAnimation();
});

// --- 3. Theme Management (Dark/Light Mode) ---
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const icon = themeToggle.querySelector('i');
    
    // Check local storage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(icon, savedTheme);

    themeToggle.addEventListener('click', () => {
        let currentTheme = htmlElement.getAttribute('data-theme');
        let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(icon, newTheme);
    });
}

function updateThemeIcon(icon, theme) {
    if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
    } else {
        icon.className = 'fa-solid fa-moon';
    }
}

// --- 4. Mobile Navigation ---
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            if(navLinks.classList.contains('active')){
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
            }
        });
    });
}

// --- 5. Typing Effect ---
function initTypingEffect() {
    const textElement = document.querySelector('.typing-text');
    if (!textElement) return;

    const words = ["Computer Science Student"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// --- 6. Scroll & GSAP Animations ---
function initSmoothScroll() {
    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }

        // Active Nav Link highlight
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href') === `#${current}`) {
                li.classList.add('active');
            }
        });
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initSkillsAnimation() {
    const progressLines = document.querySelectorAll('.progress-line span');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percent = entry.target.parentElement.getAttribute('data-percent');
                entry.target.style.width = percent;
            }
        });
    }, { threshold: 0.5 });

    progressLines.forEach(line => observer.observe(line));
}

function initGSAPAnimations() {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero Section
    gsap.from('.hero-content > *', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.5
    });

    gsap.from('.hero-image-container', {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'back.out(1.7)',
        delay: 0.8
    });

    // Sections fade up
    const sections = ['#about', '#skills', '#projects', '#dashboard', '#assignments'];
    
    sections.forEach(sec => {
        gsap.from(`${sec} .section-heading`, {
            scrollTrigger: {
                trigger: sec,
                start: 'top 80%'
            },
            y: 30,
            opacity: 0,
            duration: 0.6
        });

        gsap.from(`${sec} .glass`, {
            scrollTrigger: {
                trigger: sec,
                start: 'top 75%'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1
        });
    });
}

// --- 7. Projects Filter ---
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category').includes(filterValue)) {
                    card.style.display = 'block';
                    gsap.fromTo(card, {scale: 0.8, opacity: 0}, {scale: 1, opacity: 1, duration: 0.4});
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// --- 9. Assignment Management (Google Sheets) ---

function openSheetManager() {
    window.open(SHEET_EDIT_URL, '_blank');
}

function normalizeDriveUrl(url) {
    if (!url) return '';
    if (url.includes('/preview')) return url;
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (idMatch) {
        return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }
    return url;
}

function parseCsv(text) {
    const rows = [];
    let row = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (char === ',' && !inQuotes) {
            row.push(current.trim());
            current = '';
            continue;
        }

        if ((char === '\n' || char === '\r') && !inQuotes) {
            if (current.length || row.length) {
                row.push(current.trim());
                rows.push(row);
                row = [];
                current = '';
            }
            continue;
        }

        current += char;
    }

    if (current.length || row.length) {
        row.push(current.trim());
        rows.push(row);
    }

    return rows;
}

async function loadAssignments() {
    const grid = document.getElementById('assignmentsGrid');
    const totalSpan = document.getElementById('totalAssignments');

    if (!grid || !totalSpan) return;
    grid.innerHTML = '<div class="assignment-empty">Loading assignments...</div>';

    try {
        const response = await fetch(SHEET_CSV_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error('Unable to fetch sheet data.');

        const text = await response.text();
        assignments = parseCsv(text)
            .slice(1)
            .map(columns => ({
                number: columns[0] || '',
                title: columns[1] || '',
                videoUrl: normalizeDriveUrl(columns[2] || ''),
                inference: columns[3] || '',
                date: columns[4] || ''
            }))
            .filter(item => item.title && item.videoUrl);

        renderAssignments();
    } catch (error) {
        grid.innerHTML = '<div class="assignment-empty">Unable to load assignments. Please confirm the sheet is shared and the tab is named "Assignments".</div>';
        console.error('Assignment load failed:', error);
    }
}

function renderAssignments() {
    const grid = document.getElementById('assignmentsGrid');
    const totalSpan = document.getElementById('totalAssignments');

    if (!grid || !totalSpan) return;

    totalSpan.textContent = assignments.length;
    grid.innerHTML = '';

    if (!assignments.length) {
        grid.innerHTML = '<div class="assignment-empty">No assignments found. Use the sheet manager button to add rows to the Google Sheet.</div>';
        return;
    }

    assignments.forEach((assignment, index) => {
        const label = assignment.number || index + 1;
        const card = document.createElement('div');
        card.className = 'assignment-card';
        card.innerHTML = `
            <div class="assignment-header">
                <div class="assignment-number">Assignment ${label}</div>
            </div>
            <h4 class="assignment-title">${assignment.title}</h4>
            <div class="video-container" onclick="playVideo(${index})">
                <iframe class="video-thumbnail" src="${assignment.videoUrl}" allow="autoplay" allowfullscreen></iframe>
                <div class="play-overlay">Play</div>
            </div>
            <div class="inference-section">
                <div class="inference-title">Technical Analysis</div>
                <div class="inference-text">${assignment.inference || 'No technical analysis provided yet.'}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function playVideo(index) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);display:flex;align-items:center;justify-content:center;padding:1.5rem;z-index:3000;';
    overlay.onclick = () => document.body.removeChild(overlay);

    const frame = document.createElement('iframe');
    frame.src = assignments[index].videoUrl;
    frame.allow = 'autoplay';
    frame.allowFullscreen = true;
    frame.style.cssText = 'width:100%;max-width:900px;height:70vh;border:0;border-radius:16px;';
    overlay.appendChild(frame);
    document.body.appendChild(overlay);
}

// --- 10. Dashboard Logic ---
function updateDashboard(data) {
    const total = data.length;
    const completed = data.filter(a => a.status === 'Completed').length;
    const pending = data.filter(a => a.status === 'Pending' || a.status === 'In Progress').length;
    
    // Calculate Upcoming (Pending/In Progress and date is within next 7 days)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    let upcoming = 0;
    data.forEach(a => {
        if (a.status !== 'Completed') {
            const date = new Date(a.date);
            if (date >= today && date <= nextWeek) {
                upcoming++;
            }
        }
    });

    // Animate numbers
    animateValue("stat-total", 0, total, 1000);
    animateValue("stat-completed", 0, completed, 1000);
    animateValue("stat-pending", 0, pending, 1000);
    animateValue("stat-upcoming", 0, upcoming, 1000);
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
