// Open Letter Animation - Trigger envelope opening
function openLetterAnimation() {
    const envelope = document.getElementById('envelope');
    const overlay = document.getElementById('letterOverlay');
    
    // Prevent multiple clicks
    if (envelope.classList.contains('opening')) return;
    
    // Start envelope opening animation
    envelope.classList.add('opening');
    
    // After animation completes, hide overlay and show website
    setTimeout(() => {
        overlay.classList.remove('active');
        overlay.classList.add('hidden');
        
        // Scroll to top when site is revealed
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

// RSVP Form Handler
const rsvpForm = document.getElementById('rsvpForm');

const alertMessages = {
    en: name => `Thank you ${name}! We've received your RSVP.\n\nWe look forward to celebrating with you!`,
    fr: name => `Merci ${name} ! Nous avons bien reçu votre RSVP.\n\nNous avons hâte de célébrer avec vous !`
};

rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();

    emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
    .then(function() {
        const language = document.documentElement.lang || 'en';
        alert(alertMessages[language](document.getElementById('name').value));
        rsvpForm.reset();
    }, function(error) {
        console.error('EmailJS error:', error);
        alert('Sorry, there was a problem sending your RSVP. Please try again later.');
    });
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
    const envelope = document.getElementById('envelope');
    envelope.classList.remove('opening');
    initLanguageSwitcher();
    setLanguage('en');
    console.log('Wedding site loaded - Click on envelope to open');
});
