// Password Protection 
const CORRECT_PASSWORD_HASH = 533025672;
const PASSWORD_SESSION_KEY = 'wedding_authenticated';

// One-way hash function
function hashString(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
    }
    return hash >>> 0;
}

function checkPassword(event) {
    if (event) event.preventDefault();
    
    const passwordInput = document.getElementById('passwordInput');
    const passwordError = document.getElementById('passwordError');
    const envelopePassword = document.getElementById('envelopePassword');
    
    if (!passwordInput) return;

    // Hash user input and compare to stored hash
    const inputHash = hashString(passwordInput.value.trim());

    if (inputHash === CORRECT_PASSWORD_HASH) {
        resetMobileZoom();
        sessionStorage.setItem(PASSWORD_SESSION_KEY, 'true');
        
        if (passwordError) passwordError.style.display = 'none';
        if (envelopePassword) envelopePassword.classList.add('hidden');
        
        openLetterAnimation();
    } else {
        if (passwordError) passwordError.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
    }
}

function resetMobileZoom() {
    if (document.activeElement) {
        document.activeElement.blur();
    }

    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        const originalContent = viewportMeta.getAttribute('content') || 'width=device-width, initial-scale=1.0';
        
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0');
        
        setTimeout(() => {
            viewportMeta.setAttribute('content', originalContent);
        }, 300);
    }

    window.scrollTo(0, 0);
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

    if (!envelope || envelope.classList.contains('opening')) return;
    
    envelope.classList.add('opening');
    
    setTimeout(() => {
        if (overlay) {
            overlay.classList.remove('active');
            overlay.classList.add('hidden');
        }
        window.scrollTo(0, 0);
    }, 2200);
}

// Language Switcher
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

// RSVP Form Handler - Safely initialized inside DOMContentLoaded
function initRsvpForm() {
    const rsvpForm = document.getElementById('rsvpForm');
    if (!rsvpForm) return;

    const alertMessages = {
        en: name => `Thank you ${name}! We've received your message.\n\nWe look forward to celebrating with you!`,
        fr: name => `Merci ${name} ! Nous avons bien reçu votre message.\n\nNous avons hâte de célébrer avec vous tous!`
    };

    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nameInput = document.getElementById('name');
        const name = nameInput ? nameInput.value : '';
        const language = document.documentElement.lang || 'fr';
        
        const submitBtn = this.querySelector('.btn-submit');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.dataset._origText = submitBtn.textContent;
            submitBtn.textContent = (language === 'fr') ? 'Envoi...' : 'Sending...';
        }

        const formData = new FormData(this);

        // Fetch request with required JSON header for FormSubmit
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert(alertMessages[language](name));
                rsvpForm.reset();
            } else {
                alert(language === 'fr' ? 'Une erreur est survenue. Veuillez réessayer.' : 'An error occurred. Please try again.');
            }
        })
        .catch(error => {
            console.error('✗ Form submission error:', error);
            alert(language === 'fr' ? 'Une erreur est survenue. Veuillez réessayer.' : 'An error occurred. Please try again.');
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = submitBtn.dataset._origText || 'Submit';
                delete submitBtn.dataset._origText;
            }
        });
    });
}

// Smooth Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 90;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

function updateHeroParallax() {
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-background');
    if (!hero || !heroBg) return;

    const rect = hero.getBoundingClientRect();
    const offset = Math.max(0, -rect.top);
    const shift = Math.min(offset * 0.55, 160);
    heroBg.style.transform = `translateY(${shift}px)`;
}

// Scroll effects
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.boxShadow = window.scrollY > 50 ? '0 4px 15px rgba(0, 0, 0, 0.1)' : '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
    updateHeroParallax();
});

// Main Page Initialization
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    
    const envelope = document.getElementById('envelope');
    if (envelope) envelope.classList.remove('opening');
    
    initLanguageSwitcher();
    setLanguage('fr');
    initRsvpForm(); // Safely binds the RSVP submit event
    updateHeroParallax();
    
    if (typeof initCountdown === 'function') initCountdown();

    const travelVideo = document.querySelector('.travel-video video');
    
    if (travelVideo) {
        // Sur mobile, forcer le 'muted' via le JS débloque souvent l'autoplay
        travelVideo.muted = true;
        
        // Tente de lancer la vidéo
        const playPromise = travelVideo.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay bloqué par le navigateur mobile :", error);
                // Optionnel : Réessayer de lancer la vidéo dès que l'utilisateur touche l'écran
                document.addEventListener('touchstart', function() {
                    travelVideo.play();
                }, { once: true });
            });
        }
    }

    console.log('🎊 Wedding site loaded');
});

// Countdown implementation
function initCountdown() {
    const target = new Date('2027-07-31T16:00:00');

    const els = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };

    if (!els.days) return;

    function update() {
        const now = new Date();
        let diff = Math.max(0, target - now);

        const s = Math.floor((diff / 1000) % 60);
        const m = Math.floor((diff / (1000 * 60)) % 60);
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));

        els.days.textContent = String(d).padStart(2, '0');
        els.hours.textContent = String(h).padStart(2, '0');
        els.minutes.textContent = String(m).padStart(2, '0');
        els.seconds.textContent = String(s).padStart(2, '0');
    }

    update();
    const intervalId = setInterval(() => {
        update();
        if (new Date() >= target) clearInterval(intervalId);
    }, 1000);
}