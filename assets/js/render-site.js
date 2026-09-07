/**
 * The Bandhan Project (tbp;) - Dynamic Frontend Site Renderer
 * Reads the merged content object from window.TBP_DATA and renders every part of
 * index.html: navigation menu, section visibility, hero, about, vision/mission,
 * yKnot, the events jigsaw board, founder's note, gallery, contact and footer
 * (social icons + link columns + newsletter box). Also: custom cursor and the
 * IntersectionObserver scroll-reveal animations.
 */

(function () {
  // Setup Custom Cursor
  function initCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return; // Skip touch screens

    let dot = document.querySelector('.custom-cursor-dot');
    let ring = document.querySelector('.custom-cursor-ring');

    if (!dot) {
      dot = document.createElement('div');
      dot.className = 'custom-cursor-dot';
      document.body.appendChild(dot);
    }
    if (!ring) {
      ring = document.createElement('div');
      ring.className = 'custom-cursor-ring';
      document.body.appendChild(ring);
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    });

    // Smooth inertia for outer ring
    function renderCursorRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursorRing);
    }
    renderCursorRing();

    // Hover detection on interactive elements
    function attachHoverListeners() {
      const interactiveEls = document.querySelectorAll('a, button, input, textarea, select, .puzzle_card, .event-card, .gallery_item_card');
      interactiveEls.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    }
    attachHoverListeners();
    window.addEventListener('tbp_data_updated', () => setTimeout(attachHoverListeners, 100));
  }

  // Setup Scroll Motion Observer
  function initScrollMotions() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.12 });

    const revealElements = document.querySelectorAll('.slider_content, .about_content, .about_vm_item, .yknot_content, .yknot_image_wrap, .founder_box, .puzzle_card, .gallery_item_card, .single_counter, .section_title');
    revealElements.forEach(el => {
      el.classList.add('scroll-reveal');
      observer.observe(el);
    });
  }

  // Main Render Function
  function renderAll() {
    if (!window.TBP_DATA) return;
    const data = window.TBP_DATA.getData();

    // 0. Section visibility (show / hide whole blocks of the page)
    const sec = data.sections || {};
    applySectionVisibility('about', sec.about);
    applySectionVisibility('yknot', sec.yknot);
    applySectionVisibility('events', sec.events);
    applySectionVisibility('founder-note', sec.founder);
    applySectionVisibility('gallery', sec.gallery);
    applySectionVisibility('contact', sec.contact);

    // 1. Update Metadata & Title
    document.title = `${data.brand.name} (${data.brand.shortName}) — ${data.brand.tagline || 'lean into Goodness'}`;
    const favicon = document.querySelector("link[rel*='icon']");
    if (favicon && data.brand.favicon) {
      favicon.href = data.brand.favicon;
    }

    // 1b. Navigation menu
    renderNavigation(data);

    // 2. Update Brand Navbar & Tagline
    const brandElements = document.querySelectorAll('.tbp-brand-logo');
    brandElements.forEach(img => {
      img.src = data.brand.logo || 'assets/images/logo.png';
      img.alt = data.brand.name;
    });

    const brandTaglines = document.querySelectorAll('.brand-text small');
    brandTaglines.forEach(el => {
      el.textContent = data.brand.tagline || 'lean into Goodness';
    });

    // 3. Update Hero Section
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) heroTitle.innerHTML = data.hero.title;

    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = data.hero.subtitle;

    const heroBtn = document.getElementById('hero-btn');
    if (heroBtn) {
      heroBtn.textContent = data.hero.buttonText || "Our Mission";
      heroBtn.href = data.hero.buttonLink || "#about";
    }

    const heroSecBtn = document.getElementById('hero-sec-btn');
    if (heroSecBtn) {
      heroSecBtn.textContent = data.hero.secondaryButtonText || "Past Events";
      heroSecBtn.href = data.hero.secondaryButtonLink || "#events";
    }

    const heroSlider = document.querySelector('.header_slider .single_slider');
    if (heroSlider && data.hero.bgImage) {
      heroSlider.style.backgroundImage = `url("${data.hero.bgImage}")`;
    }

    // 4. Update About Section
    const aboutTitle = document.getElementById('about-title');
    if (aboutTitle) aboutTitle.innerHTML = data.about.subtitle || data.about.title;

    const aboutDesc = document.getElementById('about-desc');
    if (aboutDesc) aboutDesc.textContent = data.about.desc;

    const aboutBtn = document.getElementById('about-btn');
    if (aboutBtn) {
      aboutBtn.textContent = data.about.buttonText;
      aboutBtn.href = data.about.buttonLink;
    }

    const aboutImg = document.getElementById('about-image-bg');
    if (aboutImg && data.about.image) {
      aboutImg.style.backgroundImage = `url("${data.about.image}")`;
    }

    // Vision & Mission
    setText('about-vision-title', data.about.visionTitle || 'Our Vision');
    setText('about-vision-text', data.about.vision);
    setText('about-mission-title', data.about.missionTitle || 'Our Mission');
    setText('about-mission-text', data.about.mission);

    // 4b. yKnot — First Impact Project
    const yknot = data.yknot || {};
    setText('yknot-badge', yknot.badge);
    setText('yknot-title', yknot.title);
    setText('yknot-subtitle', yknot.subtitle);

    const yknotDesc = document.getElementById('yknot-description');
    if (yknotDesc && yknot.description != null) {
      yknotDesc.innerHTML = String(yknot.description)
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(Boolean)
        .map(p => `<p class="yknot_text">${escapeHtml(p)}</p>`)
        .join('');
    }

    const yknotImg = document.getElementById('yknot-image');
    if (yknotImg && yknot.image) yknotImg.src = yknot.image;

    const yknotBtn = document.getElementById('yknot-btn');
    if (yknotBtn) {
      yknotBtn.textContent = yknot.buttonText || 'Visit the yKnot Store';
      yknotBtn.href = yknot.buttonLink || 'https://www.yknotstore.com';
    }

    // Update Counter Numbers
    if (data.about.stats && Array.isArray(data.about.stats)) {
      const counterContainer = document.getElementById('about-counters-container');
      if (counterContainer) {
        counterContainer.innerHTML = data.about.stats.map((stat, idx) => `
          <div class="single_counter ${idx % 2 === 0 ? 'counter_1' : 'counter_2'} d-flex justify-content-center align-items-center">
            <div class="counter_wrapper">
              <span class="counter">${stat.count}</span>${stat.suffix ? `<span style="font-size:24px;font-weight:700;color:#0b3b95;">${stat.suffix}</span>` : ''}
              <p>${stat.label}</p>
            </div>
          </div>
        `).join('');
      }
    }

    // 5. Render Events as an interlocking jigsaw board
    const puzzleEventsContainer = document.getElementById('puzzle-events-container');

    if (puzzleEventsContainer) {
      const activeEvents = (data.events || []).filter(e => e.active !== false);
      if (activeEvents.length === 0) {
        puzzleEventsContainer.innerHTML = `
          <div class="puzzle_empty">
            <i class="lni lni-calendar" style="font-size: 40px; color: #0b3b95;"></i>
            <h4 class="mt-3">Events Archive</h4>
            <p class="text-muted">Stay tuned as we update our past events and initiative stories!</p>
          </div>`;
      } else {
        puzzleEventsContainer.innerHTML = activeEvents.map((event) => {
          let eventImages = [];
          if (Array.isArray(event.images) && event.images.length > 0) {
            eventImages = event.images.filter(img => img && img.trim().length > 0);
          } else if (event.image) {
            eventImages = [event.image];
          }
          if (eventImages.length === 0) {
            eventImages = ['assets/images/hero-area.jpg'];
          }

          const primaryThumb = eventImages[0];

          return `
              <div class="puzzle_card event-card" data-event-id="${escapeHtml(event.id)}" onclick="window.togglePuzzleCard(this, event)">
                <span class="pz_socket pz_socket_l"></span>
                <span class="pz_socket pz_socket_t"></span>
                <!-- Top Cover Thumbnail Banner -->
                <div style="height:160px; overflow:hidden; margin:-30px -24px 16px; background:#e2e8f0; position:relative;">
                  <img src="${primaryThumb}" alt="${escapeHtml(event.title)}" style="width:100%; height:100%; object-fit:cover;">
                  <span class="puzzle_badge" style="position:absolute; top:12px; left:12px; margin:0;"><i class="lni lni-checkmark-circle"></i> ${escapeHtml(event.category || 'Event')}</span>
                  <span style="position:absolute; bottom:10px; right:12px; background:rgba(0,0,0,0.65); color:#fff; font-size:11px; font-weight:600; padding:3px 8px; border-radius:6px; backdrop-filter:blur(4px);">
                    ${eventImages.length} Photos 📷
                  </span>
                </div>

                <h4 class="puzzle_title">${escapeHtml(event.title)}</h4>

                <div class="puzzle_meta">
                  <span><i class="lni lni-calendar"></i> ${escapeHtml(event.date || 'Completed')}</span>
                  ${event.time ? `<span><i class="lni lni-timer"></i> ${escapeHtml(event.time)}</span>` : ''}
                </div>

                ${event.location ? `<div class="puzzle_meta"><span><i class="lni lni-map-marker"></i> ${escapeHtml(event.location)}</span></div>` : ''}

                <!-- Short Preview Snippet -->
                <p class="puzzle_brief">${escapeHtml(event.description ? event.description.substring(0, 90) + '...' : '')}</p>

                <!-- Expandable Body (Expands smoothly on click) -->
                <div class="puzzle_expandable">
                  <div style="margin-bottom:14px;">
                    <span style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:6px;">Event Photos & Moments</span>
                    <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:6px;">
                      ${eventImages.map((imgUrl, pIdx) => `
                        <a href="${imgUrl}" target="_blank" onclick="event.stopPropagation();" style="flex:0 0 75px; height:58px; border-radius:8px; overflow:hidden; border:1px solid #cbd5e1; display:block;">
                          <img src="${imgUrl}" alt="Moment ${pIdx+1}" style="width:100%; height:100%; object-fit:cover; transition:transform 0.2s ease;">
                        </a>
                      `).join('')}
                    </div>
                  </div>

                  <div style="font-size: 13.5px; color: #334155; line-height: 1.7; margin-bottom: 8px;">
                    ${escapeHtml(event.description || '')}
                  </div>
                </div>

                <!-- Click to expand hint -->
                <div class="puzzle_expand_toggle">
                  <span class="toggle_text">Click to view story & photos</span>
                  <i class="lni lni-chevron-down toggle_icon"></i>
                </div>
              </div>
          `;
        }).join('');
      }
    }

    // 6. Update Founder's Note Section (Harsh Bhayani)
    const founderBadge = document.getElementById('founder-badge');
    if (founderBadge) founderBadge.textContent = data.founderNote.badge || "A Word from Our Founder";

    const founderQuote = document.getElementById('founder-quote');
    if (founderQuote) founderQuote.textContent = data.founderNote.quote || "";

    const founderParas = document.getElementById('founder-paragraphs');
    if (founderParas && Array.isArray(data.founderNote.paragraphs)) {
      founderParas.innerHTML = data.founderNote.paragraphs.map(p => `
        <p class="founder_text">${escapeHtml(p)}</p>
      `).join('');
    }

    const founderName = document.getElementById('founder-name');
    if (founderName) founderName.textContent = data.founderNote.founderName || "Harsh Bhayani";

    const founderTitle = document.getElementById('founder-title');
    if (founderTitle) founderTitle.textContent = data.founderNote.founderTitle || "Director, Coatings and Coatings (India) Pvt. Ltd. | Founder, The Bandhan Project";

    const founderImg = document.getElementById('founder-image');
    if (founderImg && data.founderNote.founderImage) {
      founderImg.src = data.founderNote.founderImage;
    }

    // 7. Update Gallery Section
    const galleryContainer = document.getElementById('gallery-container');
    if (galleryContainer && data.gallery) {
      galleryContainer.innerHTML = data.gallery.map(item => `
        <div class="col-lg-4 col-md-6">
          <div class="gallery_item_card">
            <img src="${item.image || 'assets/images/blog-1.jpg'}" alt="${escapeHtml(item.title)}">
            <div class="gallery_item_overlay">
              <h5 class="gallery_item_title">${escapeHtml(item.title)}</h5>
              <span class="gallery_item_subtitle">${escapeHtml(item.subtitle || '')}</span>
            </div>
          </div>
        </div>
      `).join('');
    }

    // 8. Update Contact
    const contactTitle = document.getElementById('contact-title');
    if (contactTitle) contactTitle.textContent = data.contact.title;

    const contactSubtitle = document.getElementById('contact-subtitle');
    if (contactSubtitle) contactSubtitle.textContent = data.contact.subtitle;

    // 9. Footer
    renderFooter(data);
  }

  // ---- Navigation menu -----------------------------------------------------
  function renderNavigation(data) {
    const navUl = document.getElementById('nav');
    const menu = data.navigation && Array.isArray(data.navigation.menu) ? data.navigation.menu : [];
    if (!navUl || menu.length === 0) return;

    navUl.innerHTML = menu.map((item, i) => `
      <li class="nav-item${i === 0 ? ' active' : ''}">
        <a class="page-scroll" href="${escapeHtml(item.link || '#')}">${escapeHtml(item.label || '')}</a>
      </li>`).join('');

    navUl.querySelectorAll('a.page-scroll').forEach(a => {
      a.removeEventListener('click', onNavLinkClick);
      a.addEventListener('click', onNavLinkClick);
    });
  }

  function onNavLinkClick(e) {
    const href = this.getAttribute('href') || '';
    if (href.charAt(0) === '#' && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - 60;
        smoothScrollTo(y, 600);
      }
    }
    // Close the mobile menu after any click
    const collapse = document.getElementById('navbarSupportedContent');
    if (collapse) collapse.classList.remove('show');
    const toggler = document.querySelector('.navbar-toggler');
    if (toggler) toggler.classList.remove('active');
    // Move the active highlight
    document.querySelectorAll('#nav .nav-item').forEach(li => li.classList.remove('active'));
    const li = this.closest('.nav-item');
    if (li) li.classList.add('active');
  }

  // ---- Footer ------------------------------------------------------------
  function renderFooter(data) {
    const f = data.footer || {};

    setText('footer-brand-name', f.brandName || (data.brand && data.brand.name));
    setText('footer-brand-tagline', f.brandTagline || (data.brand && data.brand.tagline));

    const footerAbout = document.getElementById('footer-about-text');
    if (footerAbout) footerAbout.textContent = f.aboutText || '';

    // Social icons
    const socialList = document.getElementById('footer-social-list');
    if (socialList) {
      socialList.innerHTML = (Array.isArray(f.socials) ? f.socials : [])
        .filter(s => s && s.url)
        .map(s => `<li><a class="tbp-social" href="${escapeHtml(s.url)}" target="_blank" rel="noopener" aria-label="${escapeHtml(s.label || 'Social')}"><i class="lni ${escapeHtml(s.icon || 'lni-link')}"></i></a></li>`)
        .join('');
    }

    // Link columns
    const cols = document.getElementById('footer-columns');
    if (cols) {
      cols.innerHTML = (Array.isArray(f.columns) ? f.columns : []).map(col => `
        <div class="footer_link mt-45">
          <h4 class="footer_title">${escapeHtml(col.title || '')}</h4>
          <ul class="link">
            ${(Array.isArray(col.links) ? col.links : []).map(l => `<li><a href="${escapeHtml(l.url || '#')}">${escapeHtml(l.label || '')}</a></li>`).join('')}
          </ul>
        </div>`).join('');
    }

    // Newsletter box
    const subBlock = document.getElementById('footer-subscribe-block');
    if (subBlock) subBlock.style.display = f.showSubscribe === false ? 'none' : '';
    setText('footer-subscribe-title', f.subscribeTitle);
    setText('footer-subscribe-text', f.subscribeText);

    const footerCopyright = document.getElementById('footer-copyright');
    if (footerCopyright) {
      footerCopyright.innerHTML = `${escapeHtml(f.copyright || '')} <a href="admin.html" style="opacity:0.3; color:inherit; text-decoration:none; margin-left:4px;" title="Admin Portal">🔒</a>`;
    }
  }

  function applySectionVisibility(id, value) {
    const el = document.getElementById(id);
    if (el) el.style.display = value === false ? 'none' : '';
  }

  // Self-contained smooth scroll (timer-based, so it does not depend on native
  // `behavior:'smooth'` support).
  function smoothScrollTo(targetY, duration) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    if (Math.abs(distance) < 2) {
      window.scrollTo(0, targetY);
      return;
    }
    duration = duration || 600;
    const startTime = Date.now();
    const timer = setInterval(function () {
      const p = Math.min(1, (Date.now() - startTime) / duration);
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p; // easeInOutQuad
      window.scrollTo(0, Math.round(startY + distance * ease));
      if (p >= 1) clearInterval(timer);
    }, 16);
  }

  // Interactive Click to Expand for Event Card
  window.togglePuzzleCard = function(cardEl, ev) {
    const isExpanded = cardEl.classList.contains('is-expanded');
    const toggleText = cardEl.querySelector('.toggle_text');

    if (isExpanded) {
      cardEl.classList.remove('is-expanded');
      if (toggleText) toggleText.textContent = 'Click to view story & photos';
    } else {
      cardEl.classList.add('is-expanded');
      if (toggleText) toggleText.textContent = 'Click to collapse';
    }
  };

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el && value != null && value !== '') el.textContent = value;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Keyboard shortcut for discrete Admin Access: Ctrl + Shift + A or Cmd + Shift + A
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.location.href = 'admin.html';
    }
  });

  // Initial render when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      renderAll();
      initCustomCursor();
      initScrollMotions();
    });
  } else {
    renderAll();
    initCustomCursor();
    initScrollMotions();
  }

  // Re-render immediately on data update events
  window.addEventListener('tbp_data_updated', renderAll);
  window.addEventListener('storage', renderAll);
})();
