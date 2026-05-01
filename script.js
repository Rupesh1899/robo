/**
 * Portfolio & Assignment Management System - Core Logic
 */

// --- 1. Global Configurations ---
const SHEET_ID = '14gHprU2oHbfAJPFiBeHZ48756TPN0FPQNnkWY3zt7cQ';
const SHEET_NAME = 'Assignments';
const SHEET_API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(SHEET_NAME)}`;

let assignments = []; // State array

// --- 2. UI Elements & Setup ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTypingEffect();
    initMobileMenu();
    initProjectFilters();
    initSmoothScroll();

    const uploadForm = document.getElementById('assignment-upload-form');
    if (uploadForm) uploadForm.addEventListener('submit', submitAssignmentForm);

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

async function submitAssignmentForm(e) {
    e.preventDefault();

    const titleInput = document.getElementById('upload-title');
    const linkInput = document.getElementById('upload-link');
    const inferenceInput = document.getElementById('upload-inference');
    const dateInput = document.getElementById('upload-date');
    const numberInput = document.getElementById('upload-number');
    const statusMessage = document.getElementById('upload-status');
    const submitBtn = document.getElementById('upload-submit');

    if (!titleInput || !linkInput || !inferenceInput || !submitBtn) return;

    const title = titleInput.value.trim();
    const link = linkInput.value.trim();
    const inference = inferenceInput.value.trim();
    const date = dateInput ? dateInput.value : '';
    const number = numberInput ? numberInput.value.trim() : '';

    if (!title || !link) {
        if (statusMessage) statusMessage.textContent = 'Please provide both a title and a valid Drive link.';
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Uploading...';
    if (statusMessage) {
        statusMessage.textContent = '';
        statusMessage.className = 'upload-status';
    }

    try {
        const payload = {
            action: 'add',
            number: number || String(assignments.length + 1),
            title,
            videoUrl: link,
            inference,
            date
        };

        const result = await addAssignmentToSheet(payload);

        if (result && result.success) {
            if (statusMessage) {
                statusMessage.textContent = result.fallback ? 'Saved locally because API is not configured yet.' : 'Assignment uploaded successfully. Refreshing list...';
                statusMessage.classList.add(result.fallback ? 'success' : 'success');
            }
            const uploadForm = e.target;
            if (uploadForm && typeof uploadForm.reset === 'function') {
                uploadForm.reset();
            }
            await loadAssignments();
        } else {
            throw new Error(result && result.error ? result.error : 'Upload failed');
        }
    } catch (error) {
        console.error('Upload failed:', error);
        if (statusMessage) {
            statusMessage.textContent = 'Upload failed. Check the sheet access and API URL.';
            statusMessage.classList.add('error');
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Upload Assignment';
    }
}

async function addAssignmentToSheet(data) {
    if (!SHEET_API_URL || SHEET_API_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE')) {
        saveLocalAssignment(data);
        return { success: true, fallback: true };
    }

    try {
        const response = await fetch(SHEET_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            saveLocalAssignment(data);
            return { success: true, fallback: true };
        }

        const result = await response.json();
        if (result && result.success) {
            return result;
        }

        saveLocalAssignment(data);
        return { success: true, fallback: true };
    } catch (error) {
        saveLocalAssignment(data);
        return { success: true, fallback: true };
    }
}

function saveLocalAssignment(data) {
    const stored = loadLocalAssignments();
    stored.push({
        number: data.number,
        title: data.title,
        videoUrl: data.videoUrl,
        inference: data.inference,
        date: data.date
    });
    localStorage.setItem('localAssignments', JSON.stringify(stored));
}

function loadLocalAssignments() {
    const stored = localStorage.getItem('localAssignments');
    return stored ? JSON.parse(stored) : [];
}

function isSheetApiConfigured() {
    return Boolean(SHEET_API_URL && !SHEET_API_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'));
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
        const sheetAssignments = parseCsv(text)
            .slice(1)
            .map((columns, rowIndex) => ({
                number: columns[0] || '',
                title: columns[1] || '',
                videoUrl: normalizeDriveUrl(columns[2] || ''),
                inference: columns[3] || '',
                date: columns[4] || '',
                source: 'sheet',
                row: rowIndex + 2
            }))
            .filter(item => item.title && item.videoUrl);

        const localAssignments = loadLocalAssignments();
        localAssignments.forEach(item => item.source = 'local');
        const seen = new Set();
        assignments = [...sheetAssignments, ...localAssignments].filter(item => {
            const key = `${item.title.trim().toLowerCase()}|${item.videoUrl}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
        renderAssignments();
    } catch (error) {
        const localAssignments = loadLocalAssignments();
        assignments = localAssignments;
        renderAssignments();
        if (!assignments.length) {
            grid.innerHTML = '<div class="assignment-empty">Unable to load assignments. Please confirm the sheet is shared and the tab is named "Assignments".</div>';
        }
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
        grid.innerHTML = '<div class="assignment-empty">No assignments found. If your Google Sheet is blank, add a header row with exactly: id,title,subject,date,status,driveLink,notes, then refresh this page.</div>';
        return;
    }

    assignments.forEach((assignment, index) => {
        const label = assignment.number || index + 1;
        const sheetDeleteDisabled = assignment.source === 'sheet' && !isSheetApiConfigured();
        const deleteButtonHtml = sheetDeleteDisabled
            ? `<button class="assignment-delete-btn disabled" disabled title="Configure SHEET_API_URL in script.js to enable sheet delete">Delete</button>`
            : `<button class="assignment-delete-btn" onclick="deleteAssignment(${index})">Delete</button>`;

        const card = document.createElement('div');
        card.className = 'assignment-card';
        card.innerHTML = `
            <div class="assignment-header">
                <div class="assignment-number">Assignment ${label}</div>
                ${deleteButtonHtml}
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

function deleteAssignment(index) {
    const assignment = assignments[index];
    if (!assignment) return;

    if (!confirm(`Delete "${assignment.title}" from assignments?`)) return;

    if (assignment.source === 'local') {
        const stored = loadLocalAssignments();
        const filtered = stored.filter(item => item.videoUrl !== assignment.videoUrl || item.title !== assignment.title);
        localStorage.setItem('localAssignments', JSON.stringify(filtered));
        assignments.splice(index, 1);
        renderAssignments();
        return;
    }

    if (assignment.source === 'sheet' && !isSheetApiConfigured()) {
        alert('Sheet delete is not configured. To enable delete, set SHEET_API_URL in script.js to your Apps Script Web App URL.');
        return;
    }

    deleteAssignmentFromSheet(assignment).then(success => {
        if (success) {
            assignments.splice(index, 1);
            renderAssignments();
        } else {
            alert('Unable to delete from the sheet. Please remove it directly in Google Sheets.');
        }
    });
}

async function deleteAssignmentFromSheet(assignment) {
    try {
        const response = await fetch(SHEET_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'delete', row: assignment.row })
        });
        if (!response.ok) return false;
        const data = await response.json();
        return data && data.success;
    } catch (error) {
        console.error('Sheet delete failed:', error);
        return false;
    }
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

// --- 11. Assignment Manager Modal ---
function openAssignmentManager() {
    const modal = document.getElementById('assignment-manager-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    renderAssignmentManager();
}

function closeAssignmentManager() {
    const modal = document.getElementById('assignment-manager-modal');
    if (modal) modal.style.display = 'none';
}

function renderAssignmentManager() {
    const listDiv = document.getElementById('manager-list');
    if (!listDiv) return;

    if (!assignments.length) {
        listDiv.innerHTML = '<div class="empty-message">No assignments yet. Upload one using the form above.</div>';
        return;
    }

    listDiv.innerHTML = '';
    assignments.forEach((assignment, index) => {
        const row = document.createElement('div');
        row.className = 'manager-item';
        row.innerHTML = `
            <div class="manager-item-info">
                <h4>${assignment.title}</h4>
                <p class="manager-meta">
                    ${assignment.number ? `Assignment #${assignment.number} | ` : ''}
                    <span class="source-badge ${assignment.source}">${assignment.source === 'sheet' ? 'From Sheet' : 'Local'}</span>
                </p>
                ${assignment.date ? `<p class="manager-date"><i class="fa-solid fa-calendar"></i> ${assignment.date}</p>` : ''}
                ${assignment.inference ? `<p class="manager-notes">${assignment.inference}</p>` : ''}
            </div>
            <div class="manager-actions">
                <button class="manager-btn edit-btn" onclick="editAssignmentModal(${index})" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button class="manager-btn delete-btn" onclick="deleteAssignmentFromManager(${index})" title="Delete"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        listDiv.appendChild(row);
    });
}

function editAssignmentModal(index) {
    const assignment = assignments[index];
    if (!assignment) return;

    const editForm = `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:4000;" id="edit-form-overlay" onclick="if(event.target.id==='edit-form-overlay')closeEditForm()">
            <div style="background:var(--bg-secondary);border-radius:12px;padding:2rem;width:90%;max-width:500px;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
                <h3 style="margin-top:0;color:var(--primary-color);">Edit Assignment</h3>
                <form id="edit-assignment-form" style="display:flex;flex-direction:column;gap:1rem;">
                    <div>
                        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Title</label>
                        <input type="text" id="edit-title" value="${assignment.title}" style="width:100%;padding:0.75rem;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-primary);color:var(--text-primary);font-family:inherit;">
                    </div>
                    <div>
                        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Assignment Number</label>
                        <input type="text" id="edit-number" value="${assignment.number || ''}" style="width:100%;padding:0.75rem;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-primary);color:var(--text-primary);font-family:inherit;">
                    </div>
                    <div>
                        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Technical Analysis</label>
                        <textarea id="edit-inference" style="width:100%;padding:0.75rem;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-primary);color:var(--text-primary);font-family:inherit;resize:vertical;min-height:100px;">${assignment.inference || ''}</textarea>
                    </div>
                    <div>
                        <label style="display:block;margin-bottom:0.5rem;font-weight:500;">Date</label>
                        <input type="date" id="edit-date" value="${assignment.date || ''}" style="width:100%;padding:0.75rem;border:1px solid var(--border-color);border-radius:8px;background:var(--bg-primary);color:var(--text-primary);font-family:inherit;">
                    </div>
                    <div style="display:flex;gap:1rem;margin-top:1rem;">
                        <button type="button" class="btn btn-primary" style="flex:1;" onclick="saveEditedAssignment(${index})">Save Changes</button>
                        <button type="button" class="btn btn-outline" style="flex:1;" onclick="closeEditForm()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', editForm);
}

function closeEditForm() {
    const overlay = document.getElementById('edit-form-overlay');
    if (overlay) overlay.remove();
}

function saveEditedAssignment(index) {
    const assignment = assignments[index];
    if (!assignment) return;

    const newTitle = document.getElementById('edit-title').value.trim();
    const newNumber = document.getElementById('edit-number').value.trim();
    const newInference = document.getElementById('edit-inference').value.trim();
    const newDate = document.getElementById('edit-date').value;

    if (!newTitle) {
        alert('Title cannot be empty');
        return;
    }

    assignment.title = newTitle;
    assignment.number = newNumber;
    assignment.inference = newInference;
    assignment.date = newDate;

    // Save to localStorage if it's a local assignment
    if (assignment.source === 'local') {
        const stored = loadLocalAssignments();
        const storedIndex = stored.findIndex(a => a.videoUrl === assignment.videoUrl);
        if (storedIndex !== -1) {
            stored[storedIndex] = assignment;
            localStorage.setItem('localAssignments', JSON.stringify(stored));
        }
    }

    closeEditForm();
    renderAssignmentManager();
    renderAssignments();
}

function deleteAssignmentFromManager(index) {
    const assignment = assignments[index];
    if (!assignment) return;

    if (!confirm(`Delete "${assignment.title}"?`)) return;

    if (assignment.source === 'local') {
        const stored = loadLocalAssignments();
        const filtered = stored.filter(item => item.videoUrl !== assignment.videoUrl || item.title !== assignment.title);
        localStorage.setItem('localAssignments', JSON.stringify(filtered));
        assignments.splice(index, 1);
        renderAssignmentManager();
        renderAssignments();
        return;
    }

    // For sheet items, show a friendly message
    alert('This assignment is from your Google Sheet. To delete it, remove the row from your Google Sheet and refresh this page.');
}
