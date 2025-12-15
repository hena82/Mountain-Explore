/* Small, dependency-free interactions: mobile menu, modal, counters, contact prefill */
document.addEventListener('DOMContentLoaded', () => {
  // set current year in footers
  const year = new Date().getFullYear();
  ['currentYear','currentYear2','currentYear3','currentYear4','currentYear5'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = year;
  });

  // Mobile menu toggle
  const hamburger = document.querySelectorAll('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  hamburger.forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      if (mobileMenu) {
        const hidden = mobileMenu.getAttribute('aria-hidden') === 'true';
        mobileMenu.setAttribute('aria-hidden', String(!hidden));
        mobileMenu.style.display = hidden ? 'block' : 'none';
      }
    });
  });

  // Trip data used by modal
  const trips = {
    valley: {
      title: "Valley of Flowers Trek",
      img: "images/trek1.png",
      meta: "Uttarakhand • 6 days • Moderate",
      bullets: [
        "Alpine meadows & rare endemic flora",
        "Camps by the river, photography-friendly",
        "Includes permits, guide and meals"
      ]
    },
    kedar: {
      title: "Kedarkantha Peak Trek",
      img: "images/trek2.png",
      meta: "Uttarakhand • 5 days • Moderate",
      bullets: [
        "Great for beginners and short trips",
        "Camping on the ridge with sunset & stars",
        "Local guides and home-style meals"
      ]
    },
    triund: {
      title: "Snow Trekking",
      img: "images/trek3.png",
      meta: "Manali • 3 days • Easy",
      bullets: [
        "Snowy winter trails and summit views",
        "Acclimatized itinerary with shorter approach days",
        "Includes camps, guide & transport"
      ]
    }
  };

  // Modal open/close
  const modal = document.getElementById('tripModal');
  const modalImg = document.getElementById('tripModalImg');
  const modalTitle = document.getElementById('tripModalTitle');
  const modalMeta = document.getElementById('tripModalMeta');
  const modalBullets = document.getElementById('tripModalBullets');
  const modalBook = document.getElementById('modalBook');

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.matches('.details-btn')) {
      const id = t.dataset.trip;
      openTrip(id);
    }
    if (t.matches('.modal-close')) {
      closeModal();
    }
    if (t === modal) closeModal();
  });

  function openTrip(id) {
    const data = trips[id];
    if (!data || !modal) return;
    modalImg.src = data.img;
    modalImg.alt = data.title;
    modalTitle.textContent = data.title;
    modalMeta.textContent = data.meta;
    modalBullets.innerHTML = '';
    data.bullets.forEach(b => {
      const li = document.createElement('li');
      li.textContent = b;
      modalBullets.appendChild(li);
    });
    modal.setAttribute('aria-hidden','false');
    modal.style.display = 'flex';
    modalBook.href = `contact.html?trip=${encodeURIComponent(data.title)}`;
  }

  function closeModal(){
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden','true');
  }

  // Animated counters when in view
  const counters = document.querySelectorAll('.impact-number');
  let countersStarted = false;
  function runCounters() {
    if (countersStarted) return;
    if (!counters.length) return;
    const top = counters[0].getBoundingClientRect().top;
    if (top < window.innerHeight - 80) {
      counters.forEach(el => {
        const target = +el.dataset.target || 0;
        const duration = 1600;
        let start = 0;
        const step = Math.ceil(target / (duration / 16));
        const id = setInterval(() => {
          start += step;
          if (start >= target) {
            el.textContent = target;
            clearInterval(id);
          } else el.textContent = start;
        }, 16);
      });
      countersStarted = true;
    }
  }
  runCounters();
  window.addEventListener('scroll', runCounters);

  // Prefill contact form from query string
  (function prefillContact() {
    const url = new URL(window.location.href);
    const trip = url.searchParams.get('trip');
    if (!trip) return;
    window.addEventListener('load', () => {
      const subjectEl = document.getElementById('subject');
      if (subjectEl) subjectEl.value = decodeURIComponent(trip);
      const form = document.getElementById('contactForm');
      if (form) form.scrollIntoView({behavior:'smooth'});
    });
  })();

  // Contact submit (demo)
  window.submitContact = function (e) {
    e.preventDefault();
    const notice = document.getElementById('contactNotice');
    if (notice) {
      notice.textContent = "Thanks — your enquiry was received. We'll reply soon.";
      setTimeout(()=> notice.textContent = "", 6000);
    }
  };

  // Newsletter demo
  window.submitNewsletter = function(e){
    e.preventDefault();
    const input = document.getElementById('newsletterEmail');
    if (input) {
      input.value = '';
      alert('Thanks for subscribing!'); 
    }
  };

  // Lightbox for gallery (basic)
  document.querySelectorAll('.lightbox').forEach(a=>{
    a.addEventListener('click', (ev)=>{
      ev.preventDefault();
      const src = a.getAttribute('href');
      openLightbox(src);
    });
  });

  function openLightbox(src){
    const lb = document.createElement('div');
    lb.style.position='fixed';lb.style.inset=0;lb.style.zIndex=1200;lb.style.background='rgba(2,6,23,0.8)';lb.style.display='flex';lb.style.alignItems='center';lb.style.justifyContent='center';
    const img = document.createElement('img');
    img.src=src; img.style.maxWidth='95%'; img.style.maxHeight='90%'; img.style.borderRadius='8px'; lb.appendChild(img);
    lb.addEventListener('click',()=> document.body.removeChild(lb));
    document.body.appendChild(lb);
  }

});
