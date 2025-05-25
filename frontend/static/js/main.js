// Theme Management
document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // Language Selection
    const languageSelect = document.querySelector('.language-select');
    if (languageSelect) {
        const savedLanguage = localStorage.getItem('language') || 'en';
        languageSelect.value = savedLanguage;
        
        languageSelect.addEventListener('change', (e) => {
            const selectedLanguage = e.target.value;
            localStorage.setItem('language', selectedLanguage);
            window.location.reload();
        });
    }
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
});

// Voice Recognition
let recognition = null;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = function(event) {
        const text = event.results[0][0].transcript;
        processVoiceCommand(text);
    };
}

function startVoiceRecognition() {
    if (recognition) {
        recognition.start();
    } else {
        console.log('Speech recognition not supported');
    }
}

function processVoiceCommand(text) {
    // Send the voice command to the backend for processing
    fetch('/api/ai/voice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            command: text,
            language: localStorage.getItem('language') || 'en'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.audio_url) {
            playAudioResponse(data.audio_url);
        }
        if (data.actions) {
            executeActions(data.actions);
        }
    })
    .catch(error => console.error('Error:', error));
}

function playAudioResponse(audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
}

function executeActions(actions) {
    actions.forEach(action => {
        switch (action.type) {
            case 'navigate':
                window.location.href = action.url;
                break;
            case 'record_vitals':
                openVitalsModal();
                break;
            case 'emergency':
                triggerEmergencyAlert();
                break;
            default:
                console.log('Unknown action:', action);
        }
    });
}

// Charts and Graphs
function initializeCharts() {
    const charts = document.querySelectorAll('.chart-container canvas');
    charts.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        const config = JSON.parse(canvas.dataset.config);
        new Chart(ctx, config);
    });
}

// Real-time Updates
function initializeWebSocket() {
    const ws = new WebSocket(window.location.protocol.replace('http', 'ws') + '//' + window.location.host + '/ws');
    
    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        handleRealtimeUpdate(data);
    };
    
    ws.onclose = function() {
        setTimeout(initializeWebSocket, 5000); // Reconnect after 5 seconds
    };
}

function handleRealtimeUpdate(data) {
    switch (data.type) {
        case 'vital_update':
            updateVitalSigns(data.vitals);
            break;
        case 'medication_reminder':
            showMedicationReminder(data.medication);
            break;
        case 'appointment_alert':
            showAppointmentAlert(data.appointment);
            break;
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0 fade show`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    const container = document.querySelector('.toast-container') || document.body;
    container.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    setTimeout(() => {
        bsToast.hide();
        setTimeout(() => toast.remove(), 500);
    }, 5000);
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    initializeWebSocket();
}); 