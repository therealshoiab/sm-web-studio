/* ==========================================================================
   GLOBAL INTERACTIVE JAVASCRIPT
   (Theme Toggles, Custom Cursor, Spotlight Glow, Counters, Scroll Reveal, Banner)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
    initTheme();
    initStickyHeader();
  initMobileMenu();
  initScrollProgress();
  initScrollReveal();
  initStatsCounters();
  initBackToTop();
  initCookieBanner();
  initCardSpotlightGlow();
  initProgressBars();
});

/* 1. LOADING SCREEN */
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const loaderBar = document.querySelector('.loader-bar');
  
  if (!loadingScreen) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        document.body.style.overflowY = 'auto';
      }, 300);
    }
    if (loaderBar) {
      loaderBar.style.width = `${progress}%`;
    }
  }, 50);
}

/* 2. THEME HANDLING (Light / Dark Switch) */
function initTheme() {
  const themeInputs = document.querySelectorAll('.theme-switch-input');
  if (themeInputs.length === 0) return;

  const currentTheme = localStorage.getItem('theme') || 'dark';

  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    themeInputs.forEach(input => input.checked = true);
  } else {
    themeInputs.forEach(input => input.checked = false);
  }

  themeInputs.forEach(input => {
    input.addEventListener('change', () => {
      const isChecked = input.checked;
      
      // Sync all other theme switches on the page
      themeInputs.forEach(otherInput => {
        if (otherInput !== input) {
          otherInput.checked = isChecked;
        }
      });

      if (isChecked) {
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
      }
    });
  });
}


/* 4. STICKY HEADER & ACTIVE SECTION NAV LINKS */
function initStickyHeader() {
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }

    // Determine current active section
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });

    if (current) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* 5. MOBILE NAVIGATION MENU */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Toggle body scroll to prevent background scrolling when mobile menu open
    if (navMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* 6. SCROLL PROGRESS INDICATOR */
function initScrollProgress() {
  const progress = document.querySelector('.scroll-progress');
  if (!progress) return;

  window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const currentProgress = (window.scrollY / totalScroll) * 100;
    progress.style.width = `${currentProgress}%`;
  });
}

/* 7. SCROLL REVEAL ANIMATIONS */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  if (reveals.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve after animating
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(element => {
    revealObserver.observe(element);
  });
}

/* 8. STATISTICS NUMBER COUNTERS */
function initStatsCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (counters.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.5
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // 2 seconds animation
        const increment = target / (duration / 16); // ~60fps
        
        let current = 0;
        
        const updateCount = () => {
          current += increment;
          if (current < target) {
            counter.innerText = Math.ceil(current);
            requestAnimationFrame(updateCount);
          } else {
            counter.innerText = target;
          }
        };
        
        updateCount();
        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

/* 9. BACK TO TOP BUTTON */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      backToTopBtn.classList.add('active');
    } else {
      backToTopBtn.classList.remove('active');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* 10. COOKIE CONSENT BANNER */
function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');

  if (!banner || !acceptBtn) return;

  // Show banner if consent not given
  const consent = localStorage.getItem('cookieConsent');
  if (!consent) {
    setTimeout(() => {
      banner.classList.add('active');
    }, 2500); // Wait 2.5s before showing
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    banner.classList.remove('active');
  });

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      banner.classList.remove('active');
    });
  }
}

/* 11. SPOTLIGHT GLOW ON GLASS CARDS */
function initCardSpotlightGlow() {
  const cards = document.querySelectorAll('.glass-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* 12. PROGRESS BARS ANIMATION */
function initProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  if (progressBars.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        bar.style.width = width;
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.1 });

  progressBars.forEach(bar => observer.observe(bar));
}

/* 13. UTILS: TOAST GENERATION */
window.showToast = function(message, type = 'success') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const iconSvg = type === 'success' 
    ? `<svg class="toast-icon success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`
    : `<svg class="toast-icon error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;

  toast.innerHTML = `
    ${iconSvg}
    <div class="toast-text">${message}</div>
  `;

  toastContainer.appendChild(toast);

  // Auto remove toast
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
};
