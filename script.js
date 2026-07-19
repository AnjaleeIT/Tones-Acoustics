// Page Loader Handling
window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => { loader.classList.add('fade-out'); }, 300);
  }
  
  // Trigger Initial Home Animations
  setTimeout(() => {
    const revealEls = document.querySelectorAll('[data-reveal]');
    revealEls.forEach(el => el.classList.add('in-view'));
  }, 400);
});

// Mobile Nav Toggle with Smooth Animation & Auto-Close
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open'); 
    burger.setAttribute('aria-expanded', isOpen);
  });

  // Automatically close menu when a target link is clicked
  const links = navLinks.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Footer year setting
const yr = document.getElementById('year');
if(yr) yr.textContent = new Date().getFullYear();

// HIGHLIGHTED FIRE EMBERS ENGINE (HIGH PERFORMANCE CANVAS)
(function() {
  const canvas = document.getElementById('emberCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let embers = [];
  const maxEmbers = 65; // Balanced particle count for density

  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  class Ember {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height; // Distribute instantly on startup
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 10;
      this.size = 1.5 + Math.random() * 2.5; // Scaled up sizes for clearer highlights
      this.speedY = 0.5 + Math.random() * 0.8; 
      this.speedX = (Math.random() - 0.5) * 0.4; 
      this.opacity = 0.3 + Math.random() * 0.6; // High visibility threshold 
      this.fadeSpeed = 0.001 + Math.random() * 0.002;
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.opacity -= this.fadeSpeed;

      if (this.y < -10 || this.opacity <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      
      // Radiant Orange / Amber Flame Core Color
      ctx.fillStyle = `rgba(232, 99, 44, ${this.opacity})`;
      
      // Glow Highlight mechanics
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(232, 99, 44, 0.8)';
      
      ctx.fill();
    }
  }

  function init() {
    embers = [];
    for (let i = 0; i < maxEmbers; i++) {
      embers.push(new Ember());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < embers.length; i++) {
      embers[i].update();
      embers[i].draw();
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    init();
  });

  resizeCanvas();
  init();
  requestAnimationFrame(animate);
})();

// Dynamic Events List Insertion
const eventGrid = document.getElementById('eventGrid');
if (eventGrid && typeof EVENTS !== 'undefined') {
  const eventList = document.createElement('div');
  eventList.className = 'event-list';

  EVENTS.forEach(event => {
    const isSoldOut = event.status === 'soldout';
    const row = document.createElement('div');
    row.className = 'event-row';
    row.setAttribute('data-reveal', '');

    row.innerHTML = `
      <div class="event-date">
        ${event.day} <small>${event.month}</small>
      </div>
      <div class="event-info">
        <div class="venue">${event.venue}</div>
        <div class="city">${event.city}</div>
      </div>
      <div class="event-status ${isSoldOut ? 'soldout' : ''}">
        ${event.statusLabel}
      </div>
      <div class="event-actions" style="display:flex; gap:10px;">
        <a href="event-details.html?id=${event.id}" class="btn-sm text-btn">More Details</a>
        ${!isSoldOut ? `<a href="event-details.html?id=${event.id}" class="btn-sm" style="text-align:center;">Tickets</a>` : ''}
      </div>
    `;
    eventList.appendChild(row);
  });
  eventGrid.appendChild(eventList);
}

// Actual Email Sending Functionality with Formspree
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Page එක refresh වීම නවත්වනවා

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // සරල Validation එකක් (Fields හිස්දැයි බැලීම)
    if (!name || !email || !message) {
      alert('Please fill all fields before sending.');
      return;
    }

    // SUBMIT BUTTON එක "Sending..." කියලා වෙනස් කරනවා
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // ඔයාගේ Formspree URL එකට Data යැවීම
    fetch('https://formspree.io/f/mdaqgyrn', { 
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        message: message
      })
    })
    .then(response => {
      if (response.ok) {
        // සාර්ථක නම් මැසේජ් එක පෙන්වා Form එක clear කරනවා
        formMsg.textContent = "Thanks — your message has been sent. We'll be in touch soon.";
        formMsg.style.color = "#2ecc71"; // සාර්ථක බව පෙන්වීමට කොළ පැහැය
        formMsg.classList.add('show');
        contactForm.reset();
      } else {
        throw new Error('Formspree response error');
      }
    })
    .catch(error => {
      // කිසියම් වැරදීමක් වුවහොත් (උදා: Internet නැතිනම්)
      formMsg.textContent = "Oops! Something went wrong. Please try again.";
      formMsg.style.color = "#e8632c"; // Alert එකක් නිසා තැඹිලි පැහැය
      formMsg.classList.add('show');
    })
    .finally(() => {
      // Button එක නැවත සාමාන්‍ය තත්වයට පත් කිරීම
      submitBtn.textContent = originalBtnText;
      submitBtn.disabled = false;
    });
  });
}

// Scroll Reveal Action Trigger
window.addEventListener('scroll', () => {
  const revealEls = document.querySelectorAll('[data-reveal]:not(.in-view)');
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.85) { el.classList.add('in-view'); }
  });
});