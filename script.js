document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURE YOUR WEBHOOK HERE ---
    // Works with Hubspot, Make.com, GoHighLevel, Zapier, etc.
    const WEBHOOK_URL = 'PASTE_YOUR_WEBHOOK_URL_HERE'; 

    console.log("Med Spa Lead-to-Booking System: System Logic Online.");

    // --- GLOBAL UTILITIES ---
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));

    window.addEventListener('scroll', () => {
        const header = document.getElementById('main-header');
        if (window.scrollY > 50) header?.classList.add('scrolled');
        else header?.classList.remove('scrolled');
    });

    // --- MOBILE MENU TOGGLE ---
    const mainHeader = document.getElementById('main-header');
    const mobileToggle = document.getElementById('mobileNavToggle');
    const navLinks = document.querySelectorAll('.header-nav .nav-link');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mainHeader.classList.toggle('menu-open');
            document.body.classList.toggle('modal-open');
            
            // Toggle Icon (Hamburger to X)
            const isOpen = mainHeader.classList.contains('menu-open');
            mobileToggle.innerHTML = isOpen 
                ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
                : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainHeader.classList.remove('menu-open');
            document.body.classList.remove('modal-open');
            // Reset to Hamburger
            if (mobileToggle) {
                mobileToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            }
        });
    });

    // --- 1. HERO COMMAND CENTER (MULTI-LEAD SIMULATION) ---
    const heroLeads = [
        { row: 'heroRow1', status: 'heroStatus1', name: 'Sarah Jenkins' },
        { row: 'heroRow2', status: 'heroStatus2', name: 'Mark Peterson' },
        { row: 'heroRow3', status: 'heroStatus3', name: 'David Miller' }
    ];

    function updateHeroRow(index, state) {
        const row = document.getElementById(heroLeads[index].row);
        const status = document.getElementById(heroLeads[index].status);
        if (!row || !status) return;

        if (state === 'new') {
            status.innerText = 'Processing';
            status.className = 'table-badge badge-new';
            row.style.background = 'rgba(255,255,255,0.06)';
            row.style.opacity = '1';
        } else if (state === 'contacted') {
            status.innerText = 'Active';
            status.className = 'table-badge badge-contacted';
            row.style.background = 'rgba(255,255,255,0.03)';
            row.style.opacity = '0.8';
        } else if (state === 'booked') {
            status.innerText = 'Booked';
            status.className = 'table-badge badge-booked';
            row.style.background = 'rgba(34, 197, 94, 0.05)';
            row.style.opacity = '0.6';
            addHeroLog(`[${new Date().getHours()}:${new Date().getMinutes()}] ${heroLeads[index].name} // AUTO_BOOKED`);
        }
    }

    function addHeroLog(msg) {
        const log = document.getElementById('sysLog');
        if (!log) return;
        const entry = document.createElement('div');
        entry.style.marginBottom = '2px';
        entry.innerText = msg;
        if (msg.includes('AUTO_BOOKED')) entry.style.color = 'var(--cta-green)';
        log.prepend(entry);
        if (log.children.length > 8) log.lastElementChild.remove();
    }

    function runHeroSimulation() {
        const steps = ['new', 'contacted', 'booked'];
        heroLeads.forEach((lead, i) => {
            let currentStep = 0;
            setInterval(() => {
                updateHeroRow(i, steps[currentStep]);
                currentStep = (currentStep + 1) % steps.length;
            }, 4000 + (i * 1500));
        });
    }

    const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            runHeroSimulation();
            heroObserver.unobserve(entries[0].target);
        }
    }, { threshold: 0.1 });
    
    if (document.getElementById('heroCommandCenter')) heroObserver.observe(document.getElementById('heroCommandCenter'));

    // --- 2. INTERACTIVE WORKFLOW (SECTION 4) ---
    const workflowSteps = document.querySelectorAll('.step-item');
    const workflowStatusBadge = document.getElementById('systemStatusBadge');
    const workflowEvents = [
        document.getElementById('sys-event-1'),
        document.getElementById('sys-event-2'),
        document.getElementById('sys-event-3'),
        document.getElementById('sys-event-4')
    ];
    let workflowIndex = 0;
    let workflowTimer = null;

    function runWorkflowStep(idx) {
        workflowEvents.forEach(ev => ev?.classList.remove('visible'));
        workflowSteps.forEach(st => st.classList.remove('active'));
        const step = workflowSteps[idx];
        const event = workflowEvents[idx];
        step?.classList.add('active');
        event?.classList.add('visible');
        if (workflowStatusBadge) {
            const labels = ["Inquiry Captured", "Intent Analysis", "Immediate Outreach", "Confirmed Booking"];
            const colors = ["#94A3B8", "#3B82F6", "#A855F7", "#22C55E"];
            workflowStatusBadge.innerText = labels[idx];
            workflowStatusBadge.style.borderColor = colors[idx];
        }
    }

    function autoWorkflowLoop() {
        runWorkflowStep(workflowIndex);
        workflowIndex = (workflowIndex + 1) % 4;
    }

    workflowSteps.forEach((step, i) => {
        step.addEventListener('click', () => {
            clearInterval(workflowTimer);
            workflowIndex = i;
            runWorkflowStep(i);
        });
    });

    const workflowObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !workflowTimer) {
            autoWorkflowLoop();
            workflowTimer = setInterval(autoWorkflowLoop, 3500);
        }
    }, { threshold: 0.1 });
    
    if (document.getElementById('workflow')) workflowObserver.observe(document.getElementById('workflow'));

    // --- 3. FAILURE DASHBOARD COUNTER ---
    const leakCounter = document.getElementById('leakCounter');
    let currentLeak = 8420;
    if (leakCounter) {
        setInterval(() => {
            currentLeak += Math.floor(Math.random() * 3) + 1;
            leakCounter.innerText = `$${currentLeak.toLocaleString()}`;
        }, 3000);
    }

    // --- 4. PIPELINE CRM ---
    const movingCard = document.getElementById('movingCard');
    const cardStatusText = document.getElementById('cardStatus');
    const columns = [
        document.getElementById('col-new'),
        document.getElementById('col-contacted'),
        document.getElementById('col-booked')
    ];
    let pipelineCol = 0;
    let pipelineTimer = null;

    function movePipelineCard() {
        if (!movingCard || !columns[0] || !columns[1] || !columns[2]) return;
        pipelineCol = (pipelineCol + 1) % 3;
        const target = columns[pipelineCol];
        movingCard.classList.add('card-moving');
        setTimeout(() => {
            target.appendChild(movingCard);
            movingCard.classList.remove('card-moving');
            const labels = ["Status: Inquiry Captured (Sarah J.)", "Status: Immediate Outreach", "Status: Confirmed Booking"];
            const states = ["INQUIRY", "OUTREACH", "BOOKED"];
            const colors = ["var(--secondary-blue)", "var(--secondary-blue)", "var(--cta-green)"];
            if (cardStatusText) {
                cardStatusText.innerText = labels[pipelineCol];
                cardStatusText.style.color = colors[pipelineCol];
            }
            const badge = movingCard.querySelector('div[style*="font-size:10px"]');
            if (badge) {
                badge.innerText = states[pipelineCol];
                badge.style.color = colors[pipelineCol];
                badge.style.background = `${colors[pipelineCol]}22`;
            }
        }, 500);
    }

    const pipelineObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !pipelineTimer) {
            pipelineTimer = setInterval(movePipelineCard, 5000);
        }
    }, { threshold: 0.1 });
    
    if (document.getElementById('crmBoard')) pipelineObserver.observe(document.getElementById('crmBoard'));

    // --- 5. INTAKE HUD REACTIVITY ---
    const inputName = document.getElementById('fullName');
    const inputEmail = document.getElementById('email');
    const hudNameLine = document.getElementById('hud-name');
    const hudEmailLine = document.getElementById('hud-email');
    const progressBar = document.getElementById('formProgress');

    if (inputName && hudNameLine) {
        inputName.addEventListener('input', (e) => {
            const val = e.target.value;
            const display = hudNameLine.querySelector('div:last-child');
            if (val.length > 0) { display.innerText = val; hudNameLine.classList.add('active'); updateProgress(50); }
            else { display.innerText = '...awaiting_handshake'; hudNameLine.classList.remove('active'); updateProgress(25); }
        });
    }

    if (inputEmail && hudEmailLine) {
        inputEmail.addEventListener('input', (e) => {
            const val = e.target.value;
            const display = hudEmailLine.querySelector('div:last-child');
            if (val.length > 0) { display.innerText = val.toLowerCase(); hudEmailLine.classList.add('active'); updateProgress(75); }
            else { display.innerText = '...securing_connection'; hudEmailLine.classList.remove('active'); updateProgress(50); }
        });
    }

    function updateProgress(percent) {
        if (progressBar) progressBar.style.width = `${percent}%`;
    }

    // --- 6. POP-UP SYSTEM & WEBHOOK SUBMISSION ---
    const modal = document.getElementById('systemModal');
    const closeBtn = document.getElementById('closeModal');
    const modalForm = document.getElementById('modalForm');
    const staticForm = document.getElementById('bookingForm');
    
    // Universal trigger for all 'Book a Demo' buttons
    const ctaButtons = document.querySelectorAll('a[href="#demo-form"], .header-action a, .cta-wrapper a');

    function openModal(e) {
        if (e) e.preventDefault();
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
            document.body.classList.add('modal-open');
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
            }, 300);
        }
    }

    ctaButtons.forEach(btn => btn.addEventListener('click', openModal));
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // SHARED SUBMISSION LOGIC
    async function handleSystemSubmission(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;

        // UI Feedback: Loading State
        submitBtn.disabled = true;
        submitBtn.innerText = "SYNC_IN_PROGRESS...";
        submitBtn.style.opacity = "0.7";

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            // WEBHOOK POST REQ
            if (WEBHOOK_URL && !WEBHOOK_URL.includes('PASTE_YOUR_WEBHOOK')) {
                await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Standard for automation triggers
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...data,
                        source_system: form.id === 'modalForm' ? 'MODAL_INTAKE' : 'STATIC_INTAKE',
                        timestamp: new Date().toISOString(),
                        origin: window.location.origin
                    })
                });
            }

            // REDIRECT TO THANK YOU
            window.location.href = 'thank-you.html';
        } catch (err) {
            console.error("System handshaking failed:", err);
            // Fallback redirect for UX stability
            window.location.href = 'thank-you.html';
        }
    }

    if (modalForm) modalForm.addEventListener('submit', handleSystemSubmission);
    if (staticForm) staticForm.addEventListener('submit', handleSystemSubmission);

    console.log("Med Spa Lead-to-Booking System: All Intake Protocols Synced.");
});
