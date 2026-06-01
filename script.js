// Password Protection
const CORRECT_PASSWORD = 'Italie2027';
const PASSWORD_SESSION_KEY = 'wedding_authenticated';

function checkPassword(event) {
    event.preventDefault();
    const passwordInput = document.getElementById('passwordInput');
    const passwordError = document.getElementById('passwordError');
    const envelopePassword = document.getElementById('envelopePassword');
    
    if (passwordInput.value === CORRECT_PASSWORD) {
        sessionStorage.setItem(PASSWORD_SESSION_KEY, 'true');
        passwordError.style.display = 'none';
        if (envelopePassword) envelopePassword.classList.add('hidden');
        openLetterAnimation();
    } else {
        passwordError.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Check if already authenticated (for page refreshes during session)
function checkAuthentication() {
    const letterOverlay = document.getElementById('letterOverlay');
    const envelopePassword = document.getElementById('envelopePassword');
    if (sessionStorage.getItem(PASSWORD_SESSION_KEY) === 'true') {
        if (letterOverlay) {
            letterOverlay.classList.add('hidden');
            setTimeout(() => {
                letterOverlay.style.display = 'none';
            }, 800);
        }
        if (envelopePassword) envelopePassword.classList.add('hidden');
    } else {
        const passwordInput = document.getElementById('passwordInput');
        if (passwordInput) {
            passwordInput.focus();
        }
    }
}

// Open Letter Animation - Trigger envelope opening
function openLetterAnimation(event) {
    const envelope = document.getElementById('envelope');
    const overlay = document.getElementById('letterOverlay');
    
    if (event && event.target.closest('form')) return;
    if (sessionStorage.getItem(PASSWORD_SESSION_KEY) !== 'true') {
        const passwordInput = document.getElementById('passwordInput');
        if (passwordInput) passwordInput.focus();
        return;
    }

    // Prevent multiple clicks
    if (envelope.classList.contains('opening')) return;
    
    envelope.classList.add('opening');
    
    setTimeout(() => {
        overlay.classList.remove('active');
        overlay.classList.add('hidden');
        
        window.scrollTo(0, 0);
    }, 2200);
}

// Close Letter Animation - Go directly to website
function closeLetter() {
    const overlay = document.getElementById('letterOverlay');
    overlay.classList.add('hidden');
    
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 800);
    
    // Scroll to top of website
    window.scrollTo(0, 0);
}

// Close letter with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('letterOverlay');
        if (overlay && !overlay.classList.contains('hidden')) {
            closeLetter();
        }
    }
});

// Translate page content between English and French
function setLanguage(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-en][data-fr]').forEach(element => {
        const text = lang === 'fr' ? element.dataset.fr : element.dataset.en;

        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.setAttribute('placeholder', text);
        } else if (element.tagName === 'OPTION') {
            element.textContent = text;
        } else {
            element.textContent = text;
        }
    });

    document.querySelectorAll('.lang-btn').forEach(button => {
        button.classList.toggle('active', button.dataset.lang === lang);
    });
}

function initLanguageSwitcher() {
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedLang = button.dataset.lang;
            setLanguage(selectedLang);
        });
    });
}

// Initialize EmailJS when SDK is ready
// (No longer needed - using FormSubmit instead)


// RSVP Form Handler - Using FormSubmit service
const rsvpForm = document.getElementById('rsvpForm');

const alertMessages = {
    en: name => `Thank you ${name}! We've received your RSVP.\n\nWe look forward to celebrating with you!`,
    fr: name => `Merci ${name} ! Nous avons bien reçu votre RSVP.\n\nNous avons hâte de célébrer avec vous !`
};

rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();

    console.log('✓ RSVP form submit handler triggered');
    const name = document.getElementById('name').value;
    const language = document.documentElement.lang || 'en';
    
    const submitBtn = this.querySelector('.btn-submit');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset._origText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
    }

    // Show success message immediately
    alert(alertMessages[language](name));

    // Submit form to FormSubmit service
    try {
        // Create FormData from the form
        const formData = new FormData(this);
        
        fetch(this.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('✓ RSVP submitted successfully');
            rsvpForm.reset();
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = submitBtn.dataset._origText || 'Submit RSVP';
                delete submitBtn.dataset._origText;
            }
        })
        .catch(error => {
            console.error('✗ Form submission error:', error);
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = submitBtn.dataset._origText || 'Submit RSVP';
                delete submitBtn.dataset._origText;
            }
        });
    } catch (error) {
        console.error('Error:', error);
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset._origText || 'Submit RSVP';
            delete submitBtn.dataset._origText;
        }
    }
});

// Smooth Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            const offsetTop = target.offsetTop - 90;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if(window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check password authentication first
    checkAuthentication();
    
    const envelope = document.getElementById('envelope');
    envelope.classList.remove('opening');
    initLanguageSwitcher();
    setLanguage('en');
    
    console.log('🎊 Wedding site loaded');
    console.log('✓ Form handler ready (using FormSubmit service)');
});
