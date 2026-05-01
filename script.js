/**
 * Portfolio & Assignment Management System - Core Logic
 */

// --- 1. Global Configurations ---
// Replace this with your deployed Google Apps Script Web App URL
const GAS_API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; 
const USE_MOCK_DATA = true; // Set to false when GAS_API_URL is ready

let assignments = []; // State array

// --- 2. UI Elements & Setup ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTypingEffect();
    initMobileMenu();
    initProjectFilters();
    initModals();
    initSmoothScroll();
    
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

// --- 8. Modals Management ---
function initModals() {
    const modal = document.getElementById('assignment-modal');
    const btnAdd = document.getElementById('btn-add-assignment');
    const closeBtns = document.querySelectorAll('.close-modal, .close-modal-btn');
    const form = document.getElementById('assignment-form');

    btnAdd.addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Add Assignment';
        form.reset();
        document.getElementById('assignment-id').value = '';
        modal.classList.add('show');
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const m = e.target.closest('.modal');
            if (m) m.classList.remove('show');
            const iframe = document.getElementById('file-iframe');
            if (iframe) iframe.src = '';
        });
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
            const iframe = document.getElementById('file-iframe');
            if (iframe) iframe.src = '';
        }
    });

    // Form Submit
    form.addEventListener('submit', handleAssignmentSubmit);
}

// --- 9. Assignment Management (Google Sheets / Mock) ---

const mockData = [];

async function loadAssignments() {
    const tbody = document.getElementById('assignment-table-body');
    
    if (USE_MOCK_DATA) {
        const stored = localStorage.getItem('assignments');
        assignments = stored ? JSON.parse(stored) : [...mockData];
        renderAssignments();
        return;
    }

    try {
        const response = await fetch(`${GAS_API_URL}?action=get`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        assignments = data;
        renderAssignments();
    } catch (error) {
        console.error('Error fetching assignments:', error);
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Failed to load data. Please check connection.</td></tr>`;
    }
}

function renderAssignments() {
    const tbody = document.getElementById('assignment-table-body');
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const statusFilter = document.getElementById('status-filter').value;

    tbody.innerHTML = '';

    // Filter Logic
    let filtered = assignments.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchInput) || item.subject.toLowerCase().includes(searchInput);
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center">No assignments found.</td></tr>`;
        updateDashboard(filtered);
        return;
    }

    filtered.forEach(a => {
        let statusClass = '';
        if (a.status === 'Pending') statusClass = 'status-pending';
        if (a.status === 'In Progress') statusClass = 'status-progress';
        if (a.status === 'Completed') statusClass = 'status-completed';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${a.title}</strong><br><small class="text-muted">${a.notes || ''}</small></td>
            <td>${a.subject}</td>
            <td>${a.date}</td>
            <td><span class="status-badge ${statusClass}">${a.status}</span></td>
            <td><button onclick="viewAssignmentFile('${a.driveLink}', '${a.title.replace(/'/g, "\\'")}')" class="btn btn-sm btn-outline"><i class="fa-solid fa-eye"></i> View</button></td>
            <td class="action-btns">
                <button class="edit-btn" onclick="editAssignment('${a.id}')" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="delete-btn" onclick="deleteAssignment('${a.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    updateDashboard(assignments);
}

function saveAssignmentsToStorage() {
    localStorage.setItem('assignments', JSON.stringify(assignments));
}

// Event Listeners for Filters
document.getElementById('search-input').addEventListener('input', renderAssignments);
document.getElementById('status-filter').addEventListener('change', renderAssignments);

// Form Submission (Add/Edit)
async function handleAssignmentSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('assignment-id').value;
    const assignmentData = {
        title: document.getElementById('a-title').value,
        subject: document.getElementById('a-subject').value,
        date: document.getElementById('a-date').value,
        status: document.getElementById('a-status').value,
        driveLink: document.getElementById('a-link').value,
        notes: document.getElementById('a-notes').value
    };

    const submitBtn = document.getElementById('btn-save-assignment');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
    submitBtn.disabled = true;

    try {
        if (USE_MOCK_DATA) {
            if (id) {
                // Edit
                const index = assignments.findIndex(a => a.id === id);
                if (index > -1) {
                    assignments[index] = { ...assignments[index], ...assignmentData };
                }
            } else {
                // Add
                assignmentData.id = Date.now().toString();
                assignments.push(assignmentData);
            }
            saveAssignmentsToStorage();
            setTimeout(() => { // simulate delay
                finishSave();
            }, 500);
        } else {
            // Real API Call
            const action = id ? 'update' : 'add';
            if (id) assignmentData.id = id;

            const response = await fetch(`${GAS_API_URL}?action=${action}`, {
                method: 'POST',
                body: JSON.stringify(assignmentData)
            });
            const result = await response.json();
            if (result.success) {
                await loadAssignments();
                finishSave();
            } else {
                alert('Failed to save data.');
                resetBtn();
            }
        }
    } catch (error) {
        console.error(error);
        alert('Error saving assignment.');
        resetBtn();
    }

    function finishSave() {
        document.getElementById('assignment-modal').classList.remove('show');
        renderAssignments();
        resetBtn();
    }

    function resetBtn() {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Edit
window.editAssignment = function(id) {
    const assignment = assignments.find(a => a.id === id);
    if (!assignment) return;

    document.getElementById('modal-title').textContent = 'Edit Assignment';
    document.getElementById('assignment-id').value = assignment.id;
    document.getElementById('a-title').value = assignment.title;
    document.getElementById('a-subject').value = assignment.subject;
    document.getElementById('a-date').value = assignment.date;
    document.getElementById('a-status').value = assignment.status;
    document.getElementById('a-link').value = assignment.driveLink || '';
    document.getElementById('a-notes').value = assignment.notes;

    document.getElementById('assignment-modal').classList.add('show');
}

// Delete
window.deleteAssignment = async function(id) {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    if (USE_MOCK_DATA) {
        assignments = assignments.filter(a => a.id !== id);
        saveAssignmentsToStorage();
        renderAssignments();
        return;
    }

    try {
        const response = await fetch(`${GAS_API_URL}?action=delete`, {
            method: 'POST',
            body: JSON.stringify({ id })
        });
        const result = await response.json();
        if (result.success) {
            await loadAssignments();
        } else {
            alert('Failed to delete.');
        }
    } catch(err) {
        console.error(err);
        alert('Error deleting assignment.');
    }
}

// View File in Iframe
window.viewAssignmentFile = function(link, title) {
    if (!link || link === '#' || link === 'undefined') {
        alert("No valid link provided for this assignment.");
        return;
    }
    
    // Convert standard drive link to preview link for embedding
    let embedLink = link;
    if (link.includes('drive.google.com/file/d/')) {
        const fileIdMatch = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
            embedLink = `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
        }
    } else if (link.includes('docs.google.com/spreadsheets/d/')) {
        // Handle sheets specifically if needed
        embedLink = link.replace('/edit?usp=sharing', '/preview');
    }

    document.getElementById('view-file-title').textContent = title || 'View Assignment';
    document.getElementById('file-iframe').src = embedLink;
    document.getElementById('view-file-modal').classList.add('show');
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
