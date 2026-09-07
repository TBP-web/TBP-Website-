/**
 * The Bandhan Project (tbp;) - Dynamic Frontend Site Renderer
 * Runs on every page (index.html, event.html, page.html). Reads the merged
 * content object from window.TBP_DATA and renders:
 *   - the shared header + footer (injected into #tbp-header-mount / #tbp-footer-mount
 *     on sub-pages; already present in index.html)
 *   - the navigation menu (+ custom pages flagged "show in menu")
 *   - homepage sections: hero, about, vision/mission, yKnot, events jigsaw board,
 *     founder's note, gallery, contact
 *   - event detail pages (event.html?id=…)
 *   - custom pages (page.html?slug=…)
 *   - the floating "Join WhatsApp Group" button
 * Plus the custom cursor and IntersectionObserver scroll-reveal animations.
 */

(function () {
  // Which kind of page are we on?
  const PATH = (location.pathname || '').split('/').pop().toLowerCase();
  const IS_HOME = PATH === '' || PATH === 'index.html' || PATH === 'index.htm';

  // Shared header markup for sub-pages (index.html keeps its own, with the hero).
  const SUBPAGE_HEADER_HTML = `
    <section class="header_area">
      <div class="header_navbar header_navbar--page">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <nav class="navbar navbar-expand-lg">
                <a class="navbar-brand" href="index.html">
                  <img src="assets/images/logo.png" alt="The Bandhan Project" class="brand-logo-img tbp-brand-logo">
                  <span class="brand-text">tbp;<small>lean into Goodness</small></span>
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="toggler-icon"></span><span class="toggler-icon"></span><span class="toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
                  <ul id="nav" class="navbar-nav ml-auto align-items-lg-center"></ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>`;

  // Shared footer markup for sub-pages (mirrors the footer in index.html).
  const SUBPAGE_FOOTER_HTML = `
    <section id="footer" class="footer_area">
      <div class="footer_widget pt-80 pb-100">
        <div class="container">
          <div class="row">
            <div class="col-lg-4 col-md-6 order-md-1 order-lg-1">
              <div class="footer_about mt-50">
                <a href="index.html" class="d-inline-flex align-items-center gap-2 mb-3 text-white text-decoration-none">
                  <img src="assets/images/logo.png" alt="The Bandhan Project" class="brand-logo-img tbp-brand-logo" style="height:48px; background:#fff; padding:4px; border-radius:8px;">
                  <div style="margin-left:10px;">
                    <span id="footer-brand-name" style="font-size:20px; font-weight:700; color:#fff; display:block; line-height:1.2;">The Bandhan Project</span>
                    <small id="footer-brand-tagline" style="color:#93c5fd; font-size:12px; font-weight:500;">lean into Goodness</small>
                  </div>
                </a>
                <p id="footer-about-text"></p>
                <ul class="social" id="footer-social-list"></ul>
              </div>
            </div>
            <div class="col-lg-4 col-md-12 order-md-3 order-lg-2">
              <div class="footer_link_wrapper d-flex flex-wrap" id="footer-columns"></div>
            </div>
            <div class="col-lg-4 col-md-6 order-md-2 order-lg-3" id="footer-subscribe-block">
              <div class="footer_subscribe mt-45">
                <h4 class="footer_title" id="footer-subscribe-title">Stay Updated</h4>
                <p id="footer-subscribe-text"></p>
                <div class="subscribe_form">
                  <form action="javascript:void(0)" onsubmit="alert('Thank you for subscribing to The Bandhan Project updates!'); this.reset();">
                    <input type="email" placeholder="Enter your email" required>
                    <button type="submit" aria-label="Subscribe"><i class="lni lni-arrow-right"></i></button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="text-center mt-70" id="footer-copyright"></p>
      </div>
    </section>`;

  function buildSubPageChrome() {
    const headerMount = document.getElementById('tbp-header-mount');
    if (headerMount && !headerMount.dataset.built) {
      headerMount.innerHTML = SUBPAGE_HEADER_HTML;
      headerMount.dataset.built = '1';
    }
    const footerMount = document.getElementById('tbp-footer-mount');
    if (footerMount && !footerMount.dataset.built) {
      footerMount.innerHTML = SUBPAGE_FOOTER_HTML;
      footerMount.dataset.built = '1';
    }
  }

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

    const revealElements = document.querySelectorAll('.slider_content, .about_content, .about_vm_item, .yknot_content, .yknot_image_wrap, .founder_box, .puzzle_card, .gallery_item_card, .single_counter, .section_title, .detail_body, .detail_gallery_item, .page_body');
    revealElements.forEach(el => {
      el.classList.add('scroll-reveal');
      observer.observe(el);
    });
  }

  // Main Render Function
  function renderAll() {
    if (!window.TBP_DATA) return;
    const data = window.TBP_DATA.getData();

    // Sub-pages: build the shared header/footer shell before anything else.
    buildSubPageChrome();

    // Site-wide floating button
    renderWhatsApp(data);

    // Sub-page renderers (each is a no-op if its container isn't on this page)
    renderEventDetail(data);
    renderCustomPage(data);

    // 0. Section visibility (show / hide whole blocks of the page)
    const sec = data.sections || {};
    applySectionVisibility('about', sec.about);
    applySectionVisibility('yknot', sec.yknot);
    applySectionVisibility('events', sec.events);
    applySectionVisibility('founder-note', sec.founder);
    applySectionVisibility('gallery', sec.gallery);
    applySectionVisibility('contact', sec.contact);

    // 1. Update Metadata & Title (sub-pages set their own title in their renderer)
    if (!document.getElementById('event-detail') && !document.getElementById('custom-page')) {
      document.title = `${data.brand.name} (${data.brand.shortName}) — ${data.brand.tagline || 'lean into Goodness'}`;
    }
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

          const brief = event.description
            ? (event.description.length > 110 ? event.description.substring(0, 110).trim() + '…' : event.description)
            : '';

          return `
              <a class="puzzle_card event-card" href="event.html?id=${encodeURIComponent(event.id)}" data-event-id="${escapeHtml(event.id)}">
                <span class="pz_socket pz_socket_l"></span>
                <span class="pz_socket pz_socket_t"></span>
                <div class="puzzle_banner">
                  <img src="${escapeHtml(primaryThumb)}" alt="${escapeHtml(event.title)}">
                  <span class="puzzle_badge"><i class="lni lni-checkmark-circle"></i> ${escapeHtml(event.category || 'Event')}</span>
                  <span class="puzzle_photocount">${eventImages.length} Photos 📷</span>
                </div>

                <h4 class="puzzle_title">${escapeHtml(event.title)}</h4>

                <div class="puzzle_meta">
                  <span><i class="lni lni-calendar"></i> ${escapeHtml(event.date || 'Completed')}</span>
                  ${event.time ? `<span><i class="lni lni-timer"></i> ${escapeHtml(event.time)}</span>` : ''}
                </div>

                ${event.location ? `<div class="puzzle_meta"><span><i class="lni lni-map-marker"></i> ${escapeHtml(event.location)}</span></div>` : ''}

                <p class="puzzle_brief">${escapeHtml(brief)}</p>

                <div class="puzzle_expand_toggle">
                  <span class="toggle_text">View full story &amp; photos</span>
                  <i class="lni lni-arrow-right toggle_icon"></i>
                </div>
              </a>
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
  // On sub-pages, a "#about" link becomes "index.html#about" so it still works.
  function navHref(link) {
    link = link || '#';
    if (!IS_HOME && link.charAt(0) === '#' && link.length > 1) return 'index.html' + link;
    return link;
  }

  function renderNavigation(data) {
    const navUl = document.getElementById('nav');
    if (!navUl) return;

    const menu = (data.navigation && Array.isArray(data.navigation.menu)) ? data.navigation.menu.slice() : [];
    // Custom pages that opted into the menu
    (Array.isArray(data.pages) ? data.pages : []).forEach(p => {
      if (p && p.showInNav && p.slug) {
        menu.push({ id: 'pagenav_' + p.slug, label: p.navLabel || p.title || p.slug, link: 'page.html?slug=' + encodeURIComponent(p.slug) });
      }
    });
    if (menu.length === 0) return;

    navUl.innerHTML = menu.map((item, i) => `
      <li class="nav-item${i === 0 ? ' active' : ''}">
        <a class="page-scroll" href="${escapeHtml(navHref(item.link))}">${escapeHtml(item.label || '')}</a>
      </li>`).join('');

    navUl.querySelectorAll('a.page-scroll').forEach(a => {
      a.removeEventListener('click', onNavLinkClick);
      a.addEventListener('click', onNavLinkClick);
    });
  }

  function onNavLinkClick(e) {
    const href = this.getAttribute('href') || '';
    // Same-page anchor → smooth scroll. Anything else → let the browser navigate.
    if (href.charAt(0) === '#' && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - 60;
        smoothScrollTo(y, 600);
      }
    }
    const collapse = document.getElementById('navbarSupportedContent');
    if (collapse) collapse.classList.remove('show');
    const toggler = document.querySelector('.navbar-toggler');
    if (toggler) toggler.classList.remove('active');
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

  // ---- Floating "Join WhatsApp Group" button ---------------------------------
  function renderWhatsApp(data) {
    const w = data.whatsapp || {};
    let btn = document.getElementById('tbp-whatsapp-fab');
    const on = w.enabled !== false && !!w.url;

    if (!on) {
      if (btn) btn.remove();
      return;
    }
    if (!btn) {
      btn = document.createElement('a');
      btn.id = 'tbp-whatsapp-fab';
      btn.className = 'tbp-whatsapp-fab';
      btn.target = '_blank';
      btn.rel = 'noopener';
      document.body.appendChild(btn);
    }
    btn.href = w.url;
    btn.style.setProperty('--wa-color', w.color || '#25D366');
    btn.setAttribute('aria-label', w.label || 'Join our WhatsApp Group');
    btn.innerHTML = `<i class="lni lni-whatsapp"></i><span class="tbp-whatsapp-label">${escapeHtml(w.label || 'Join our WhatsApp Group')}</span>`;
  }

  // ---- Event detail page (event.html?id=…) ----------------------------------
  function renderEventDetail(data) {
    const box = document.getElementById('event-detail');
    if (!box) return;

    const id = new URLSearchParams(location.search).get('id');
    const event = (Array.isArray(data.events) ? data.events : []).find(e => e.id === id);

    if (!event) {
      document.title = 'Event not found — ' + (data.brand ? data.brand.name : 'The Bandhan Project');
      box.innerHTML = `
        <div class="detail_notfound">
          <i class="lni lni-calendar"></i>
          <h2>Event not found</h2>
          <p>This event may have been removed or the link is incorrect.</p>
          <a href="index.html#events" class="main-btn">Back to all events</a>
        </div>`;
      return;
    }

    const imgs = (Array.isArray(event.images) ? event.images : [event.image])
      .filter(u => u && String(u).trim().length);
    if (imgs.length === 0) imgs.push('assets/images/hero-area.jpg');

    document.title = event.title + ' — ' + (data.brand ? data.brand.name : 'The Bandhan Project');

    const meta = [];
    if (event.date) meta.push(`<span><i class="lni lni-calendar"></i> ${escapeHtml(event.date)}</span>`);
    if (event.time) meta.push(`<span><i class="lni lni-timer"></i> ${escapeHtml(event.time)}</span>`);
    if (event.location) meta.push(`<span><i class="lni lni-map-marker"></i> ${escapeHtml(event.location)}</span>`);

    box.innerHTML = `
      <div class="detail_hero" style="background-image:url('${escapeHtml(imgs[0])}')">
        <div class="detail_hero_overlay"></div>
        <div class="container detail_hero_inner">
          <a href="index.html#events" class="detail_back"><i class="lni lni-arrow-left"></i> All Events &amp; Drives</a>
          ${event.category ? `<span class="detail_badge">${escapeHtml(event.category)}</span>` : ''}
          <h1 class="detail_title">${escapeHtml(event.title)}</h1>
          <div class="detail_meta">${meta.join('')}</div>
        </div>
      </div>
      <div class="container detail_body_wrap">
        <div class="detail_body">
          ${mdToHtml(event.body || event.description || '')}
        </div>
        ${imgs.length ? `
          <h3 class="detail_gallery_title">Photos &amp; Moments</h3>
          <div class="detail_gallery">
            ${imgs.map((u, i) => `<a href="${escapeHtml(u)}" target="_blank" rel="noopener" class="detail_gallery_item"><img src="${escapeHtml(u)}" alt="${escapeHtml(event.title)} photo ${i + 1}" loading="lazy"></a>`).join('')}
          </div>` : ''}
        <div class="detail_cta">
          <a href="index.html#events" class="main-btn main-btn-2">More Events</a>
          <a href="index.html#contact" class="main-btn">Get in Touch</a>
        </div>
      </div>`;
  }

  // ---- Custom page (page.html?slug=…) --------------------------------------
  function renderCustomPage(data) {
    const box = document.getElementById('custom-page');
    if (!box) return;

    const slug = new URLSearchParams(location.search).get('slug');
    const page = (Array.isArray(data.pages) ? data.pages : []).find(p => p.slug === slug);

    if (!page) {
      document.title = 'Page not found — ' + (data.brand ? data.brand.name : 'The Bandhan Project');
      box.innerHTML = `
        <div class="detail_notfound">
          <i class="lni lni-files"></i>
          <h2>Page not found</h2>
          <p>This page may have been removed or the link is incorrect.</p>
          <a href="index.html" class="main-btn">Back to Home</a>
        </div>`;
      return;
    }

    document.title = page.title + ' — ' + (data.brand ? data.brand.name : 'The Bandhan Project');

    box.innerHTML = `
      <div class="page_hero${page.heroImage ? ' has-image' : ''}"${page.heroImage ? ` style="background-image:url('${escapeHtml(page.heroImage)}')"` : ''}>
        <div class="page_hero_overlay"></div>
        <div class="container">
          <h1 class="page_hero_title">${escapeHtml(page.title)}</h1>
        </div>
      </div>
      <div class="container page_body_wrap">
        <div class="page_body">${mdToHtml(page.body || '')}</div>
        <div class="detail_cta"><a href="index.html" class="main-btn">Back to Home</a></div>
      </div>`;
  }

  // ---- Tiny Markdown subset → HTML ----------------------------------------
  // Supports: ## / ### headings, blank-line paragraphs, - bullet lists,
  // **bold**, *italic*, [text](url), ![alt](url). Input is HTML-escaped first.
  function mdToHtml(src) {
    if (!src) return '';
    const esc = escapeHtml(String(src));
    const blocks = esc.split(/\n\s*\n/);
    return blocks.map(block => {
      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return '';
      if (/^###\s+/.test(lines[0]) && lines.length === 1) return `<h3>${inline(lines[0].replace(/^###\s+/, ''))}</h3>`;
      if (/^##\s+/.test(lines[0]) && lines.length === 1) return `<h2>${inline(lines[0].replace(/^##\s+/, ''))}</h2>`;
      if (lines.every(l => /^[-*]\s+/.test(l))) {
        return `<ul>${lines.map(l => `<li>${inline(l.replace(/^[-*]\s+/, ''))}</li>`).join('')}</ul>`;
      }
      const imgMatch = lines.length === 1 && lines[0].match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
      if (imgMatch) return `<p><img src="${imgMatch[2]}" alt="${imgMatch[1]}" loading="lazy"></p>`;
      return `<p>${lines.map(inline).join('<br>')}</p>`;
    }).join('\n');

    function inline(t) {
      return t
        .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    }
  }

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

  function boot() {
    renderAll();
    initCustomCursor();
    initScrollMotions();
    // Arriving on the homepage with #section in the URL (e.g. from a sub-page nav link)
    if (IS_HOME && location.hash && location.hash.length > 1) {
      const target = document.querySelector(location.hash);
      if (target) {
        setTimeout(() => {
          window.scrollTo(0, target.getBoundingClientRect().top + window.pageYOffset - 60);
        }, 60);
      }
    }
  }

  // Initial render when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Re-render immediately on data update events
  window.addEventListener('tbp_data_updated', renderAll);
  window.addEventListener('storage', renderAll);
})();
