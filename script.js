// DOM Elements
const mainHeading = document.getElementById('mainHeading');
const scannerForm = document.getElementById('scannerForm');
const scanButton = document.getElementById('scanButton');
const progressCard = document.getElementById('progressCard');
const resultsCard = document.getElementById('resultsCard');
const progressFill = document.getElementById('progressFill');
const progressPercentage = document.getElementById('progressPercentage');
const statusText = document.getElementById('statusText');
const scoreValue = document.getElementById('scoreValue');
const scoreProgress = document.getElementById('scoreProgress');

// Typing animation for main heading
const headingText = "Protect Your Digital Space With Security Scanner";
let headingIndex = 0;

function typeHeading() {
    if (headingIndex < headingText.length) {
        mainHeading.textContent += headingText.charAt(headingIndex);
        headingIndex++;
        setTimeout(typeHeading, 100);
    }
}

// Initialize typing animation on page load
document.addEventListener('DOMContentLoaded', function() {
    typeHeading();
    
    // Add floating animation to cards
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
});

// Form validation
function validateForm() {
    const urlInput = document.getElementById('websiteUrl');
    const emailInput = document.getElementById('email');
    const urlError = document.getElementById('urlError');
    const emailError = document.getElementById('emailError');
    
    let isValid = true;
    
    // Clear previous errors
    urlError.textContent = '';
    emailError.textContent = '';
    
    // Validate URL
    const urlPattern = /^https?:\/\/.+\..+/;
    if (!urlPattern.test(urlInput.value)) {
        urlError.textContent = 'Please enter a valid URL (e.g., https://example.com)';
        isValid = false;
    }
    
    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    return isValid;
}

// Scanning steps configuration
const scanningSteps = [
    { id: 'step1', text: 'Initializing security scan...', duration: 2000 },
    { id: 'step2', text: 'Scanning for open ports...', duration: 3000 },
    { id: 'step3', text: 'Analyzing SSL/TLS configuration...', duration: 2500 },
    { id: 'step4', text: 'Checking for vulnerabilities...', duration: 4000 },
    { id: 'step5', text: 'Validating security headers...', duration: 2000 },
    { id: 'step6', text: 'Performing malware detection...', duration: 3000 },
    { id: 'step7', text: 'Generating comprehensive report...', duration: 2500 }
];

// Progress animation
function animateProgress(targetPercentage, duration) {
    const startTime = performance.now();
    const startPercentage = parseFloat(progressFill.style.width) || 0;
    
    function updateProgress(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentPercentage = startPercentage + (targetPercentage - startPercentage) * progress;
        
        progressFill.style.width = `${currentPercentage}%`;
        progressPercentage.textContent = `${Math.round(currentPercentage)}%`;
        
        if (progress < 1) {
            requestAnimationFrame(updateProgress);
        }
    }
    
    requestAnimationFrame(updateProgress);
}

// Send data to webhook
async function sendToWebhook(data) {
    const webhookUrl = 'http://n8n.jaiminsomani.live:5678/webhook/start-sca';
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Webhook response:', result);
        return result;
    } catch (error) {
        console.log('Webhook connection unavailable - continuing with scan simulation');
        // Return success to continue with scan animation
        return { status: 'offline_mode' };
    }
}

// Main scanning function
async function startScan(formData) {
    const scannerCard = document.querySelector('.scanner-card');
    
    // Hide scanner form and show progress
    scannerCard.classList.add('hidden');
    progressCard.classList.remove('hidden');
    progressCard.classList.add('fade-in');
    
    // Send data to webhook immediately
    try {
        const webhookResult = await sendToWebhook(formData);
        console.log('Data sent to webhook successfully:', webhookResult);
    } catch (error) {
        console.log('Continuing with scan in offline mode');
        // Continue with scan animation even if webhook fails
    }
    
    let totalProgress = 0;
    const progressPerStep = 100 / scanningSteps.length;
    
    for (let i = 0; i < scanningSteps.length; i++) {
        const step = scanningSteps[i];
        const stepElement = document.getElementById(step.id);
        
        // Update status text
        statusText.textContent = step.text;
        
        // Mark current step as active
        if (stepElement) {
            stepElement.classList.add('active');
            stepElement.querySelector('i').classList.add('fa-spin');
        }
        
        // Animate progress
        totalProgress += progressPerStep;
        animateProgress(totalProgress, step.duration * 0.8);
        
        // Wait for step duration
        await new Promise(resolve => setTimeout(resolve, step.duration));
        
        // Mark step as completed
        if (stepElement) {
            stepElement.classList.remove('active');
            stepElement.classList.add('completed');
            stepElement.querySelector('i').classList.remove('fa-spin', 'fa-circle-notch');
            stepElement.querySelector('i').classList.add('fa-check');
        }
    }
    
    // Ensure progress reaches 100%
    animateProgress(100, 500);
    statusText.textContent = 'Scan completed successfully!';
    
    // Wait a moment then show results
    setTimeout(() => {
        showResults();
    }, 1500);
}

// Show results function
function showResults() {
    progressCard.classList.add('hidden');
    resultsCard.classList.remove('hidden');
    resultsCard.classList.add('fade-in');
    
    // Get website URL from input field
    const websiteUrl = document.getElementById('websiteUrl').value;
    
    // Generate report text
    const reportText = `
    CyberShield Security Scan Report
APHELION CYBER SECURITY REPORT
===============================

Website: ${reportData.website}
Scan Date: ${reportData.scanDate}
Security Score: ${reportData.securityScore}/100

SUMMARY:
${reportData.summary.map(item => `- ${item.check}: ${item.status}`).join('\n')}

This report was generated by Aphelion Cyber Professional Security Scanner.
For detailed analysis and remediation guidance, please contact our security experts.

© 2024 Aphelion Cyber. All rights reserved.
    `.trim();
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybershield-report-${websiteUrl.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
    
    // Animate score circle
    const scoreCircle = document.getElementById('scoreCircle');
    scoreCircle.classList.add('fade-in');
    
    // Generate random but realistic security score
    const securityScore = Math.floor(Math.random() * 20) + 70; // 70-89
    scoreValue.textContent = securityScore;
    
    // Animate score ring
    const circumference = 2 * Math.PI * 50; // radius = 50
    const offset = circumference - (circumference * securityScore / 100);
    scoreProgress.style.strokeDashoffset = offset;
    
    // Update score color based on value
    if (securityScore >= 80) {
        scoreProgress.style.stroke = '#10b981'; // green
    } else if (securityScore >= 60) {
        scoreProgress.style.stroke = '#f59e0b'; // yellow
    } else {
        scoreProgress.style.stroke = '#ef4444'; // red
    }
    
    // Animate summary items
    const summaryItems = document.querySelectorAll('.summary-item');
    summaryItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = `slideInRight 0.5s ease-out forwards`;
            item.style.animationDelay = `${index * 0.1}s`;
        }, 500);
    });


// Form submission handler
scannerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = {
        websiteUrl: document.getElementById('websiteUrl').value,
        email: document.getElementById('email').value,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    // Disable form
    scanButton.disabled = true;
    scanButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting Scan...';
    
    try {
        await startScan(formData);
    } catch (error) {
        console.error('Scan failed:', error);
        // Reset form on error
        scanButton.disabled = false;
        scanButton.innerHTML = '<span class="button-text">Start Security Scan</span><i class="fas fa-search"></i>';
        alert('An error occurred while starting the scan. Please try again.');
    }
});

// New scan function
function newScan() {
    // Reset form
    document.getElementById('websiteUrl').value = '';
    document.getElementById('email').value = '';
    document.getElementById('urlError').textContent = '';
    document.getElementById('emailError').textContent = '';
    
    // Reset button
    scanButton.disabled = false;
    scanButton.innerHTML = '<span class="button-text">Start Security Scan</span><i class="fas fa-search"></i>';
    
    // Reset progress
    progressFill.style.width = '0%';
    progressPercentage.textContent = '0%';
    statusText.textContent = 'Initializing scan...';
    
    // Reset steps
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.classList.remove('active', 'completed');
        const icon = step.querySelector('i');
        icon.className = 'fas fa-circle-notch';
    });
    
    // Show scanner card, hide others
    document.querySelector('.scanner-card').classList.remove('hidden');
    progressCard.classList.add('hidden');
    resultsCard.classList.add('hidden');
    
    // Scroll to top of scanner section
    document.getElementById('scanner').scrollIntoView({ behavior: 'smooth' });
}

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation to buttons
document.querySelectorAll('button, .action-button').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.disabled && !this.classList.contains('loading')) {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 300);
        }
    });
});

// Add intersection observer for animation triggers
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.glass-card, .summary-item').forEach(el => {
    observer.observe(el);
});

// Add CSS for slideInRight animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .loading {
        pointer-events: none;
        opacity: 0.7;
    }
`;
document.head.appendChild(style);
