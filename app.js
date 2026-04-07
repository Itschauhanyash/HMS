// HMS Application Logic

const state = {
    isLoggedIn: false,
    currentView: 'select-facility', // Initial view after login
    scanStep: 'waiting-for-shipment', 
    currentShipment: '',
    facility: '' // Empty by default for gated navigation
};

// DOM Elements
const loginSection = document.getElementById('login-section');
const appShell = document.getElementById('app-shell');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');

const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const facilitySelect = document.getElementById('facility-select');
const innerFacilitySelect = document.getElementById('inner-facility-select');
const logoutBtn = document.getElementById('logout-btn');

const selectFacilityView = document.getElementById('select-facility-view');
const idleView = document.getElementById('idle-view');
const putView = document.getElementById('put-view');
const navPut = document.getElementById('nav-put');
const navLogout = document.getElementById('nav-logout');

const scanInput = document.getElementById('scan-input');
const scanLabel = document.getElementById('scan-label');
const scanIdHint = document.getElementById('scan-id-hint');
const feedbackBox = document.getElementById('feedback-box');
const feedbackContent = document.getElementById('feedback-content');
const skipBtn = document.getElementById('skip-btn');

// --- Initialization ---

function init() {
    loginBtn.addEventListener('click', handleLogin);
    passwordInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleLogin(); });

    menuToggle.addEventListener('click', toggleSidebar);
    navPut.addEventListener('click', () => {
        switchView('put');
        sidebar.classList.add('hidden');
    });
    
    if (navLogout) {
        navLogout.addEventListener('click', () => location.reload());
    }

    scanInput.addEventListener('keypress', handleScan);
    scanInput.addEventListener('input', handleAutoScan);
    skipBtn.addEventListener('click', handleSkip);

    facilitySelect.addEventListener('change', handleFacilityChange);
    // innerFacilitySelect is for guidance only, no listener needed
    logoutBtn.addEventListener('click', () => location.reload());

    // Click outside to close sidebar
    document.addEventListener('click', (e) => {
        const isClickInsideSidebar = sidebar.contains(e.target);
        const isClickOnToggle = menuToggle.contains(e.target);
        
        if (!isClickInsideSidebar && !isClickOnToggle && !sidebar.classList.contains('hidden')) {
            sidebar.classList.add('hidden');
        }
    });
}

function handleFacilityChange(e) {
    const val = e.target.value;
    state.facility = val;
    facilitySelect.value = val;
    // Don't try to set innerFacilitySelect.value as it was removed by USER
    
    // Mute/Disable dropdowns after selection
    facilitySelect.disabled = true;
    if (innerFacilitySelect) innerFacilitySelect.disabled = true;

    console.log("Facility changed to:", val);
    if (val) {
        switchView('idle');
    }
}

// --- Auth ---

function handleLogin() {
    const user = usernameInput.value;
    const pass = passwordInput.value;
    const loginError = document.getElementById('login-error');

    if (user === 'ca.1234' && pass === '1234') {
        state.isLoggedIn = true;
        loginSection.style.display = 'none';
        appShell.style.display = 'flex';
        switchView('select-facility');
        if (loginError) loginError.style.display = 'none';

        // Prevent accidental refresh/leave after login
        window.onbeforeunload = function() {
            if (state.isLoggedIn) {
                return "Are you sure you want to leave?";
            }
        };
    } else {
        if (loginError) {
            loginError.innerText = 'Invalid credentials! Hint: ca.1234 / 1234';
            loginError.style.display = 'block';
        }
    }
}

// --- Navigation ---

function toggleSidebar() {
    if (!state.facility && state.currentView === 'select-facility') {
        alert("Please select a facility first.");
        return;
    }
    sidebar.classList.toggle('hidden');
}

function switchView(view) {
    // Only allow 'select-facility' view if no facility chosen
    if (view !== 'select-facility' && !state.facility) {
        alert("Please select a facility first.");
        return;
    }

    state.currentView = view;
    selectFacilityView.style.display = 'none';
    idleView.style.display = 'none';
    putView.style.display = 'none';
    feedbackBox.classList.remove('text-xlarge', 'text-large', 'text-medium', 'success', 'error');

    if (view === 'select-facility') {
        selectFacilityView.style.display = 'flex';
    } else if (view === 'idle') {
        idleView.style.display = 'block';
    } else if (view === 'put') {
        putView.style.display = 'block';
        resetPutFlow();
    }
}

// --- Put Flow Logic ---

function resetPutFlow() {
    state.scanStep = 'waiting-for-shipment';
    state.currentShipment = '';

    scanLabel.innerText = 'Scan Item';
    scanInput.value = '';
    scanInput.placeholder = '';
    scanIdHint.innerText = '';
    feedbackBox.style.display = 'none';
    feedbackBox.classList.remove('text-xlarge', 'text-large', 'text-medium', 'success', 'error');
    skipBtn.style.display = 'none';
    scanInput.focus();
}

let scanTimer = null;

function handleAutoScan() {
    if (scanTimer) clearTimeout(scanTimer);
    
    // Auto-process after 1200ms of inactivity
    scanTimer = setTimeout(() => {
        const value = scanInput.value.trim();
        if (value) {
            processCurrentInput(value);
            scanInput.value = '';
        }
    }, 1200);
}

function handleScan(e) {
    if (e.key !== 'Enter') return;
    
    if (scanTimer) clearTimeout(scanTimer); // Manual enter cancels the timer
    const value = scanInput.value.trim();
    if (value) {
        processCurrentInput(value);
        scanInput.value = '';
    }
}

function processCurrentInput(value) {
    if (state.scanStep === 'waiting-for-shipment') {
        processShipmentScan(value);
    } else if (state.scanStep === 'waiting-for-bin') {
        processBinScan(value);
    }
}

function processShipmentScan(shipmentId) {
    state.currentShipment = shipmentId;
    state.scanStep = 'waiting-for-bin';

    // UI Updates to match 1.6.png
    scanLabel.innerText = 'Scan Barcode';
    scanIdHint.innerText = shipmentId;

    feedbackBox.style.display = 'block';
    feedbackBox.classList.remove('success', 'error', 'text-xlarge', 'text-large', 'text-medium');
    feedbackBox.classList.add('success', 'text-large');
    feedbackContent.innerHTML = `Put to N-K6 | MotherHub_CSK and scan barcode`;

    skipBtn.style.display = 'block';
}

function processBinScan(binId) {
    feedbackBox.classList.remove('success', 'error', 'text-xlarge', 'text-large', 'text-medium');
    
    if (binId === 'N-K6') {
        // Success (1.8.png)
        feedbackBox.classList.add('success', 'text-xlarge');
        feedbackContent.innerHTML = `${state.currentShipment} <br> put confirmed`;
        skipBtn.style.display = 'none';

        state.scanStep = 'waiting-for-shipment';
        scanLabel.innerText = 'Scan Item';
    } else {
        // Wrong ID (1.10.png)
        feedbackBox.classList.add('error', 'text-medium');
        feedbackContent.innerHTML = `Incorrect barcode scanned: ${binId}`;
        skipBtn.style.display = 'none';

        state.scanStep = 'waiting-for-shipment';
        scanLabel.innerText = 'Scan Item';
    }
}

function handleSkip() {
    // Cancel (1.9.png)
    feedbackBox.style.display = 'block';
    feedbackBox.classList.remove('success', 'error', 'text-xlarge', 'text-large', 'text-medium');
    feedbackBox.classList.add('success', 'text-xlarge');
    feedbackContent.innerHTML = `Put cancelled`;
    skipBtn.style.display = 'none';

    state.scanStep = 'waiting-for-shipment';
    scanLabel.innerText = 'Scan Item';
    scanInput.focus();
}

// Start app
if (sidebar) sidebar.classList.add('hidden'); // Hide sidebar by default
init();
