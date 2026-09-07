/**
 * The Bandhan Project (tbp;) - Admin CMS Portal Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const dataManager = window.TBP_DATA;

  // DOM Elements
  const authScreen = document.getElementById('auth-screen');
  const adminPanel = document.getElementById('admin-panel');
  const loginForm = document.getElementById('admin-login-form');
  const loginPassword = document.getElementById('login-password');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('logout-btn');

  // Modals
  const eventModal = document.getElementById('event-modal');
  const eventForm = document.getElementById('event-form');
  const addEventBtn = document.getElementById('btn-add-event');
  const closeModalBtns = document.querySelectorAll('.admin-modal-close, .modal-cancel');

  // Check auth on load
  function checkAuth() {
    if (dataManager.isAdminAuthenticated()) {
      authScreen.style.display = 'none';
      adminPanel.style.display = 'flex';
      loadAllSectionData();
    } else {
      authScreen.style.display = 'flex';
      adminPanel.style.display = 'none';
    }
  }

  // Handle Login
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = loginPassword.value.trim();
      if (dataManager.loginAdmin(entered)) {
        loginError.style.display = 'none';
        loginPassword.value = '';
        checkAuth();
        showToast('Welcome to The Bandhan Project Admin Portal!', 'success');
      } else {
        loginError.style.display = 'block';
        loginError.textContent = 'Incorrect passcode. Please try again.';
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dataManager.logoutAdmin();
      checkAuth();
      showToast('Logged out successfully.');
    });
  }

  // Handle Tab Switching
  const navItems = document.querySelectorAll('.sidebar-nav-item');
  const tabPanes = document.querySelectorAll('.admin-tab-pane');
  const pageTitle = document.getElementById('topbar-page-title');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');
      if (!targetTab) return;

      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      tabPanes.forEach(pane => {
        if (pane.id === `tab-${targetTab}`) {
          pane.style.display = 'block';
        } else {
          pane.style.display = 'none';
        }
      });

      if (pageTitle) {
        pageTitle.textContent = item.querySelector('span')?.textContent || 'Admin Control Panel';
      }
    });
  });

  // Load All Section Data into Forms
  function loadAllSectionData() {
    const data = dataManager.getData();

    // 1. Events Table
    renderEventsTable(data.events || []);

    // 2. Brand & Hero Form
    setVal('hero-brand-name', data.brand.name);
    setVal('hero-brand-short', data.brand.shortName);
    setVal('hero-title-input', data.hero.title);
    setVal('hero-subtitle-input', data.hero.subtitle);
    setVal('hero-btn-text', data.hero.buttonText);
    setVal('hero-btn-link', data.hero.buttonLink);
    setVal('hero-sec-btn-text', data.hero.secondaryButtonText);
    setVal('hero-sec-btn-link', data.hero.secondaryButtonLink);
    setVal('hero-bg-img', data.hero.bgImage);
    updateImagePreview('hero-bg-preview', data.hero.bgImage);

    // 3. About & Stats Form
    setVal('about-title-input', data.about.title);
    setVal('about-subtitle-input', data.about.subtitle);
    setVal('about-desc-input', data.about.desc);
    setVal('about-btn-text', data.about.buttonText);
    setVal('about-btn-link', data.about.buttonLink);
    setVal('about-image-url', data.about.image);
    updateImagePreview('about-img-preview', data.about.image);

    setVal('about-vision-title-input', data.about.visionTitle);
    setVal('about-vision-input', data.about.vision);
    setVal('about-mission-title-input', data.about.missionTitle);
    setVal('about-mission-input', data.about.mission);

    // 3b. yKnot First Impact Project
    const yk = data.yknot || {};
    setVal('yknot-badge-input', yk.badge);
    setVal('yknot-title-input', yk.title);
    setVal('yknot-subtitle-input', yk.subtitle);
    setVal('yknot-desc-input', yk.description);
    setVal('yknot-btn-text', yk.buttonText);
    setVal('yknot-btn-link', yk.buttonLink);
    setVal('yknot-image-url', yk.image);
    updateImagePreview('yknot-img-preview', yk.image);
    const yknotActiveEl = document.getElementById('yknot-active');
    if (yknotActiveEl) yknotActiveEl.checked = (data.sections || {}).yknot !== false;

    if (data.about.stats && data.about.stats.length >= 4) {
      setVal('stat-count-0', data.about.stats[0].count);
      setVal('stat-label-0', data.about.stats[0].label);
      setVal('stat-count-1', data.about.stats[1].count);
      setVal('stat-label-1', data.about.stats[1].label);
      setVal('stat-count-2', data.about.stats[2].count);
      setVal('stat-label-2', data.about.stats[2].label);
      setVal('stat-count-3', data.about.stats[3].count);
      setVal('stat-label-3', data.about.stats[3].label);
    }

    // 4. Founder's Note Form
    setVal('founder-badge-input', data.founderNote.badge);
    setVal('founder-quote-input', data.founderNote.quote);
    setVal('founder-name-input', data.founderNote.founderName);
    setVal('founder-title-input', data.founderNote.founderTitle);
    setVal('founder-img-url', data.founderNote.founderImage);
    updateImagePreview('founder-img-preview', data.founderNote.founderImage);

    if (data.founderNote.paragraphs) {
      setVal('founder-paras-input', data.founderNote.paragraphs.join('\n\n'));
    }

    // 5. Contact Form
    setVal('contact-title-input', data.contact.title);
    setVal('contact-subtitle-input', data.contact.subtitle);
    setVal('contact-email-input', data.contact.email);
    setVal('contact-phone-input', data.contact.phone);
    setVal('contact-address-input', data.contact.address);

    // 6. Footer Form
    const f = data.footer || {};
    setVal('footer-brand-name-input', f.brandName);
    setVal('footer-brand-tagline-input', f.brandTagline);
    setVal('footer-about-input', f.aboutText);
    setVal('footer-copyright-input', f.copyright);
    setVal('footer-subscribe-title-input', f.subscribeTitle);
    setVal('footer-subscribe-text-input', f.subscribeText);
    const showSub = document.getElementById('footer-show-subscribe');
    if (showSub) showSub.checked = f.showSubscribe !== false;
    renderSocialEditor(Array.isArray(f.socials) ? f.socials : []);
    renderFooterColumnsEditor(Array.isArray(f.columns) ? f.columns : []);

    // 7. Navigation & Layout
    renderNavEditor((data.navigation && Array.isArray(data.navigation.menu)) ? data.navigation.menu : []);
    const sec = data.sections || {};
    setChecked('sec-about', sec.about);
    setChecked('sec-yknot', sec.yknot);
    setChecked('sec-events', sec.events);
    setChecked('sec-founder', sec.founder);
    setChecked('sec-gallery', sec.gallery);
    setChecked('sec-contact', sec.contact);

    // 8. Render Gallery Grid in Admin
    renderAdminGallery(data.gallery || []);

    updateDraftStatus();
  }

  function setChecked(id, value) {
    const el = document.getElementById(id);
    if (el) el.checked = value !== false;
  }

  // =========================================================================
  // EVENTS CRUD (WITH 4-PHOTO SLOTS - NO RSVP)
  // =========================================================================
  function renderEventsTable(events) {
    const tbody = document.getElementById('events-table-body');
    if (!tbody) return;

    if (events.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No past events recorded. Click "+ Add Past Event" above to create one.</td></tr>`;
      return;
    }

    tbody.innerHTML = events.map((evt, idx) => {
      const coverPhoto = (evt.images && evt.images[0]) || evt.image || 'assets/images/hero-area.jpg';
      const photoCount = (evt.images && Array.isArray(evt.images)) ? evt.images.filter(Boolean).length : 1;

      return `
        <tr>
          <td>
            <div style="position:relative; display:inline-block;">
              <img src="${coverPhoto}" alt="${escapeHtml(evt.title)}" style="width:65px; height:45px; object-fit:cover; border-radius:6px; border:1px solid #cbd5e1;">
              <span style="position:absolute; bottom:-4px; right:-4px; background:#0b3b95; color:#fff; font-size:10px; font-weight:700; border-radius:10px; padding:1px 5px;">
                ${photoCount} 📷
              </span>
            </div>
          </td>
          <td>
            <strong>${escapeHtml(evt.title)}</strong>
            <br><span class="badge badge-primary" style="background:#0b3b95; font-size:11px;">${escapeHtml(evt.category || 'Event')}</span>
          </td>
          <td>
            ${escapeHtml(evt.date || 'Completed')}
            ${evt.time ? `<br><small class="text-muted">${escapeHtml(evt.time)}</small>` : ''}
          </td>
          <td>${escapeHtml(evt.location || 'Online / Hybrid')}</td>
          <td>
            <span class="status-badge ${evt.active !== false ? 'active' : 'inactive'}">
              ${evt.active !== false ? 'Active' : 'Hidden'}
            </span>
          </td>
          <td>
            <div class="action-btn-group">
              <button type="button" class="btn-action" title="Edit Event" onclick="window.editEvent('${evt.id}')">
                <i class="lni lni-pencil"></i>
              </button>
              <button type="button" class="btn-action" title="Toggle Status" onclick="window.toggleEventStatus('${evt.id}')">
                <i class="lni lni-power-switch"></i>
              </button>
              <button type="button" class="btn-action btn-delete" title="Delete Event" onclick="window.deleteEvent('${evt.id}')">
                <i class="lni lni-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  window.editEvent = function(id) {
    const data = dataManager.getData();
    const event = (data.events || []).find(e => e.id === id);
    if (!event) return;

    setVal('modal-event-id', event.id);
    setVal('modal-event-title', event.title);
    setVal('modal-event-category', event.category || 'Summit');
    setVal('modal-event-date', event.date || '');
    setVal('modal-event-time', event.time || '');
    setVal('modal-event-location', event.location || '');
    setVal('modal-event-desc', event.description || '');
    document.getElementById('modal-event-active').checked = event.active !== false;

    // Load 4 photo slots
    const imgs = (event.images && Array.isArray(event.images)) ? event.images : [event.image || 'assets/images/hero-area.jpg'];
    for (let i = 0; i < 4; i++) {
      const imgVal = imgs[i] || (i === 0 ? 'assets/images/hero-area.jpg' : '');
      setVal(`event-img-url-${i}`, imgVal);
      updateImagePreview(`event-slot-preview-${i}`, imgVal || 'assets/images/hero-area.jpg');
    }

    document.getElementById('modal-title-text').textContent = 'Edit Past Event';
    openModal(eventModal);
  };

  window.toggleEventStatus = function(id) {
    const data = dataManager.getData();
    const event = (data.events || []).find(e => e.id === id);
    if (event) {
      event.active = event.active === false ? true : false;
      dataManager.saveData(data);
      renderEventsTable(data.events);
      showToast(`Event status updated to: ${event.active ? 'Active' : 'Hidden'}`, 'success');
    }
  };

  window.deleteEvent = function(id) {
    if (confirm('Are you sure you want to delete this event from the past events archive?')) {
      const data = dataManager.getData();
      data.events = (data.events || []).filter(e => e.id !== id);
      dataManager.saveData(data);
      renderEventsTable(data.events);
      showToast('Event deleted successfully.', 'success');
    }
  };

  if (addEventBtn) {
    addEventBtn.addEventListener('click', () => {
      eventForm.reset();
      setVal('modal-event-id', 'evt_' + Date.now());
      document.getElementById('modal-event-active').checked = true;

      const defaultPhotos = [
        'assets/images/hero-area.jpg',
        'assets/images/blog-1.jpg',
        'assets/images/blog-2.jpg',
        'assets/images/blog-3.jpg'
      ];
      for (let i = 0; i < 4; i++) {
        setVal(`event-img-url-${i}`, defaultPhotos[i]);
        updateImagePreview(`event-slot-preview-${i}`, defaultPhotos[i]);
      }

      document.getElementById('modal-title-text').textContent = 'Add Past Event';
      openModal(eventModal);
    });
  }

  if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('modal-event-id').value;
      const data = dataManager.getData();
      data.events = data.events || [];

      // Collect 4 photos
      const eventPhotos = [];
      for (let i = 0; i < 4; i++) {
        const val = getVal(`event-img-url-${i}`);
        if (val) eventPhotos.push(val);
      }
      if (eventPhotos.length === 0) {
        eventPhotos.push('assets/images/hero-area.jpg');
      }

      const newEvent = {
        id: id || ('evt_' + Date.now()),
        title: document.getElementById('modal-event-title').value.trim(),
        category: document.getElementById('modal-event-category').value.trim(),
        date: document.getElementById('modal-event-date').value.trim(),
        time: document.getElementById('modal-event-time').value.trim(),
        location: document.getElementById('modal-event-location').value.trim(),
        images: eventPhotos,
        image: eventPhotos[0],
        description: document.getElementById('modal-event-desc').value.trim(),
        active: document.getElementById('modal-event-active').checked
      };

      const existingIndex = data.events.findIndex(ev => ev.id === id);
      if (existingIndex >= 0) {
        data.events[existingIndex] = newEvent;
        showToast('Past event updated successfully!', 'success');
      } else {
        data.events.unshift(newEvent);
        showToast('Past event added to Jigsaw Archive!', 'success');
      }

      dataManager.saveData(data);
      renderEventsTable(data.events);
      closeModal(eventModal);
    });
  }

  // =========================================================================
  // IMAGE COMPRESSION & UPLOAD HANDLER
  // =========================================================================
  window.handleImageUpload = function(inputEl, targetInputId, previewImgId) {
    const file = inputEl.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const maxDimension = 1000;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.84);
        
        setVal(targetInputId, compressedDataUrl);
        if (previewImgId) {
          updateImagePreview(previewImgId, compressedDataUrl);
        }

        const sizeKb = Math.round((compressedDataUrl.length * 3 / 4) / 1024);
        showToast(`Photo optimized (${sizeKb} KB). Click Save to apply!`, 'success');
      };
      img.onerror = function() {
        showToast('Error reading image file.', 'error');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  function updateImagePreview(previewId, src) {
    const el = document.getElementById(previewId);
    if (el) {
      if (src) {
        el.src = src;
        el.style.display = 'block';
      } else {
        el.style.display = 'none';
      }
    }
  }

  // =========================================================================
  // SECTION FORMS SAVING
  // =========================================================================

  // Hero & Brand Save
  const heroForm = document.getElementById('hero-brand-form');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = dataManager.getData();
      data.brand.name = getVal('hero-brand-name');
      data.brand.shortName = getVal('hero-brand-short');
      data.hero.title = getVal('hero-title-input');
      data.hero.subtitle = getVal('hero-subtitle-input');
      data.hero.buttonText = getVal('hero-btn-text');
      data.hero.buttonLink = getVal('hero-btn-link');
      data.hero.secondaryButtonText = getVal('hero-sec-btn-text');
      data.hero.secondaryButtonLink = getVal('hero-sec-btn-link');
      data.hero.bgImage = getVal('hero-bg-img');

      const res = dataManager.saveData(data);
      if (res && res.success === false) {
        showToast('Storage error: ' + res.error, 'error');
      } else {
        showToast('Hero & Brand details updated live!', 'success');
      }
    });
  }

  // About & Stats Save
  const aboutForm = document.getElementById('about-stats-form');
  if (aboutForm) {
    aboutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = dataManager.getData();
      data.about.title = getVal('about-title-input');
      data.about.subtitle = getVal('about-subtitle-input');
      data.about.desc = getVal('about-desc-input');
      data.about.buttonText = getVal('about-btn-text');
      data.about.buttonLink = getVal('about-btn-link');
      data.about.image = getVal('about-image-url');
      data.about.visionTitle = getVal('about-vision-title-input');
      data.about.vision = getVal('about-vision-input');
      data.about.missionTitle = getVal('about-mission-title-input');
      data.about.mission = getVal('about-mission-input');

      data.about.stats = [
        { count: getVal('stat-count-0'), label: getVal('stat-label-0'), suffix: '+' },
        { count: getVal('stat-count-1'), label: getVal('stat-label-1'), suffix: '+' },
        { count: getVal('stat-count-2'), label: getVal('stat-label-2'), suffix: '+' },
        { count: getVal('stat-count-3'), label: getVal('stat-label-3'), suffix: '%' }
      ];

      const res = dataManager.saveData(data);
      if (res && res.success === false) {
        showToast('Storage error: ' + res.error, 'error');
      } else {
        showToast('About section and live counters saved!', 'success');
      }
    });
  }

  // yKnot First Impact Project Save
  const yknotForm = document.getElementById('yknot-form');
  if (yknotForm) {
    yknotForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = dataManager.getData();
      data.yknot = data.yknot || {};
      data.sections = data.sections || {};
      data.sections.yknot = document.getElementById('yknot-active').checked;
      data.yknot.badge = getVal('yknot-badge-input');
      data.yknot.title = getVal('yknot-title-input');
      data.yknot.subtitle = getVal('yknot-subtitle-input');
      data.yknot.description = getVal('yknot-desc-input');
      data.yknot.image = getVal('yknot-image-url');
      data.yknot.buttonText = getVal('yknot-btn-text');
      data.yknot.buttonLink = getVal('yknot-btn-link');

      const res = dataManager.saveData(data);
      if (res && res.success === false) {
        showToast('Storage error: ' + res.error, 'error');
      } else {
        showToast('yKnot project section saved live!', 'success');
      }
    });
  }

  // Founder's Note Save
  const founderForm = document.getElementById('founder-form');
  if (founderForm) {
    founderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = dataManager.getData();
      data.founderNote.badge = getVal('founder-badge-input');
      data.founderNote.quote = getVal('founder-quote-input');
      data.founderNote.founderName = getVal('founder-name-input');
      data.founderNote.founderTitle = getVal('founder-title-input');
      data.founderNote.founderImage = getVal('founder-img-url');

      const rawParas = getVal('founder-paras-input');
      data.founderNote.paragraphs = rawParas.split('\n\n').map(p => p.trim()).filter(p => p.length > 0);

      const res = dataManager.saveData(data);
      if (res && res.success === false) {
        showToast('Storage error: ' + res.error, 'error');
      } else {
        showToast("Founder's note and portrait photo saved live!", 'success');
      }
    });
  }

  // Contact Section Save
  const contactForm = document.getElementById('contact-footer-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = dataManager.getData();
      data.contact.title = getVal('contact-title-input');
      data.contact.subtitle = getVal('contact-subtitle-input');
      data.contact.email = getVal('contact-email-input');
      data.contact.phone = getVal('contact-phone-input');
      data.contact.address = getVal('contact-address-input');
      persist(data, 'Contact section saved!');
    });
  }

  // =========================================================================
  // FOOTER (brand text, bio, socials, link columns, newsletter box)
  // =========================================================================
  const SOCIAL_PRESETS = [
    { label: 'Facebook',    icon: 'lni-facebook-original' },
    { label: 'Instagram',   icon: 'lni-instagram-original' },
    { label: 'Twitter / X', icon: 'lni-twitter-original' },
    { label: 'LinkedIn',    icon: 'lni-linkedin-original' },
    { label: 'YouTube',     icon: 'lni-youtube' },
    { label: 'WhatsApp',    icon: 'lni-whatsapp' },
    { label: 'Telegram',    icon: 'lni-telegram-original' },
    { label: 'Pinterest',   icon: 'lni-pinterest' },
    { label: 'Email',       icon: 'lni-envelope' },
    { label: 'Website',     icon: 'lni-world' }
  ];

  function socialOptions(selectedIcon) {
    return SOCIAL_PRESETS.map(p =>
      `<option value="${p.icon}" ${p.icon === selectedIcon ? 'selected' : ''}>${p.label}</option>`
    ).join('');
  }

  function renderSocialEditor(socials) {
    const box = document.getElementById('footer-social-editor');
    if (!box) return;
    box.innerHTML = (socials.length ? socials : []).map(s => socialRowHtml(s)).join('');
  }

  function socialRowHtml(s) {
    s = s || {};
    return `<div class="repeater-row" data-id="${attr(s.id || ('soc_' + rid()))}">
      <select class="admin-form-control rp-icon" style="flex:0 0 150px;">${socialOptions(s.icon || 'lni-link')}</select>
      <input type="text" class="admin-form-control rp-url" placeholder="https://…" value="${attr(s.url)}">
      <button type="button" class="rp-remove" title="Remove"><i class="lni lni-trash"></i></button>
    </div>`;
  }

  function collectSocials() {
    return [...document.querySelectorAll('#footer-social-editor .repeater-row')].map(row => {
      const icon = row.querySelector('.rp-icon').value;
      const preset = SOCIAL_PRESETS.find(p => p.icon === icon);
      return {
        id: row.dataset.id || ('soc_' + rid()),
        label: preset ? preset.label : 'Social',
        icon: icon,
        url: row.querySelector('.rp-url').value.trim()
      };
    });
  }

  const addSocialBtn = document.getElementById('btn-add-social');
  if (addSocialBtn) {
    addSocialBtn.addEventListener('click', () => {
      document.getElementById('footer-social-editor').insertAdjacentHTML('beforeend', socialRowHtml({ icon: 'lni-facebook-original' }));
    });
  }

  function renderFooterColumnsEditor(columns) {
    const box = document.getElementById('footer-columns-editor');
    if (!box) return;
    box.innerHTML = columns.map(col => footerColBlockHtml(col)).join('');
  }

  function footerColBlockHtml(col) {
    col = col || {};
    const links = Array.isArray(col.links) ? col.links : [];
    return `<div class="footer-col-block" data-id="${attr(col.id || ('fcol_' + rid()))}">
      <div class="fcol-head">
        <input type="text" class="admin-form-control fcol-title" placeholder="Column heading" value="${attr(col.title)}">
        <button type="button" class="rp-remove-col" title="Remove whole column"><i class="lni lni-trash"></i></button>
      </div>
      <div class="fcol-links">
        ${links.map(l => footerLinkRowHtml(l)).join('')}
      </div>
      <button type="button" class="btn-inline-add btn-add-fcol-link"><i class="lni lni-plus"></i> Add link</button>
    </div>`;
  }

  function footerLinkRowHtml(l) {
    l = l || {};
    return `<div class="repeater-row" data-id="${attr(l.id || ('flink_' + rid()))}">
      <input type="text" class="admin-form-control fl-label" placeholder="Link text" value="${attr(l.label)}">
      <input type="text" class="admin-form-control fl-url" placeholder="#about or https://…" value="${attr(l.url)}">
      <button type="button" class="rp-remove" title="Remove link"><i class="lni lni-trash"></i></button>
    </div>`;
  }

  function collectFooterColumns() {
    return [...document.querySelectorAll('#footer-columns-editor .footer-col-block')].map(block => ({
      id: block.dataset.id || ('fcol_' + rid()),
      title: block.querySelector('.fcol-title').value.trim(),
      links: [...block.querySelectorAll('.fcol-links .repeater-row')].map(row => ({
        id: row.dataset.id || ('flink_' + rid()),
        label: row.querySelector('.fl-label').value.trim(),
        url: row.querySelector('.fl-url').value.trim() || '#'
      })).filter(l => l.label)
    })).filter(c => c.title || c.links.length);
  }

  const addFooterColBtn = document.getElementById('btn-add-footer-col');
  if (addFooterColBtn) {
    addFooterColBtn.addEventListener('click', () => {
      document.getElementById('footer-columns-editor').insertAdjacentHTML('beforeend',
        footerColBlockHtml({ title: 'New Column', links: [{ label: 'New link', url: '#' }] }));
    });
  }

  // Delegated remove / add-link buttons inside the footer editors
  document.addEventListener('click', (e) => {
    const rm = e.target.closest('.rp-remove');
    if (rm && rm.closest('#footer-social-editor, #footer-columns-editor, #nav-menu-editor')) {
      rm.closest('.repeater-row').remove();
      return;
    }
    const rmCol = e.target.closest('.rp-remove-col');
    if (rmCol) {
      rmCol.closest('.footer-col-block').remove();
      return;
    }
    const addLink = e.target.closest('.btn-add-fcol-link');
    if (addLink) {
      addLink.closest('.footer-col-block').querySelector('.fcol-links')
        .insertAdjacentHTML('beforeend', footerLinkRowHtml({ label: '', url: '#' }));
    }
  });

  const footerForm = document.getElementById('footer-form');
  if (footerForm) {
    footerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = dataManager.getData();
      data.footer = data.footer || {};
      data.footer.brandName = getVal('footer-brand-name-input');
      data.footer.brandTagline = getVal('footer-brand-tagline-input');
      data.footer.aboutText = getVal('footer-about-input');
      data.footer.copyright = getVal('footer-copyright-input');
      data.footer.showSubscribe = document.getElementById('footer-show-subscribe').checked;
      data.footer.subscribeTitle = getVal('footer-subscribe-title-input');
      data.footer.subscribeText = getVal('footer-subscribe-text-input');
      data.footer.socials = collectSocials();
      data.footer.columns = collectFooterColumns();
      persist(data, 'Footer saved!');
    });
  }

  // =========================================================================
  // NAVIGATION MENU + SECTION VISIBILITY
  // =========================================================================
  function renderNavEditor(menu) {
    const box = document.getElementById('nav-menu-editor');
    if (!box) return;
    box.innerHTML = menu.map(item => navRowHtml(item)).join('');
  }

  function navRowHtml(item) {
    item = item || {};
    return `<div class="repeater-row" data-id="${attr(item.id || ('nav_' + rid()))}">
      <button type="button" class="rp-move-up" title="Move up" style="flex:0 0 auto;width:34px;height:38px;border:1px solid #e2e8f0;background:#fff;border-radius:8px;cursor:pointer;">&uarr;</button>
      <button type="button" class="rp-move-down" title="Move down" style="flex:0 0 auto;width:34px;height:38px;border:1px solid #e2e8f0;background:#fff;border-radius:8px;cursor:pointer;">&darr;</button>
      <input type="text" class="admin-form-control rp-label" placeholder="Menu label" value="${attr(item.label)}">
      <input type="text" class="admin-form-control rp-link" placeholder="#about or https://…" value="${attr(item.link)}">
      <button type="button" class="rp-remove" title="Remove"><i class="lni lni-trash"></i></button>
    </div>`;
  }

  function collectNavMenu() {
    return [...document.querySelectorAll('#nav-menu-editor .repeater-row')].map(row => ({
      id: row.dataset.id || ('nav_' + rid()),
      label: row.querySelector('.rp-label').value.trim(),
      link: row.querySelector('.rp-link').value.trim() || '#'
    })).filter(x => x.label);
  }

  const addNavBtn = document.getElementById('btn-add-nav-item');
  if (addNavBtn) {
    addNavBtn.addEventListener('click', () => {
      document.getElementById('nav-menu-editor').insertAdjacentHTML('beforeend', navRowHtml({ label: 'New Item', link: '#' }));
    });
  }

  // Move up / down inside the nav editor
  const navEditor = document.getElementById('nav-menu-editor');
  if (navEditor) {
    navEditor.addEventListener('click', (e) => {
      const up = e.target.closest('.rp-move-up');
      const down = e.target.closest('.rp-move-down');
      if (!up && !down) return;
      const row = e.target.closest('.repeater-row');
      if (up && row.previousElementSibling) row.parentNode.insertBefore(row, row.previousElementSibling);
      if (down && row.nextElementSibling) row.parentNode.insertBefore(row.nextElementSibling, row);
    });
  }

  const saveNavBtn = document.getElementById('btn-save-nav');
  if (saveNavBtn) {
    saveNavBtn.addEventListener('click', () => {
      const data = dataManager.getData();
      data.navigation = data.navigation || {};
      data.navigation.menu = collectNavMenu();
      persist(data, 'Navigation menu saved!');
    });
  }

  const sectionsForm = document.getElementById('sections-form');
  if (sectionsForm) {
    sectionsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = dataManager.getData();
      data.sections = data.sections || {};
      data.sections.about = document.getElementById('sec-about').checked;
      data.sections.yknot = document.getElementById('sec-yknot').checked;
      data.sections.events = document.getElementById('sec-events').checked;
      data.sections.founder = document.getElementById('sec-founder').checked;
      data.sections.gallery = document.getElementById('sec-gallery').checked;
      data.sections.contact = document.getElementById('sec-contact').checked;
      persist(data, 'Section visibility saved!');
      // keep the yKnot-tab checkbox in sync
      const yk = document.getElementById('yknot-active');
      if (yk) yk.checked = data.sections.yknot;
    });
  }

  // Shared save helper
  function persist(data, successMsg) {
    const res = dataManager.saveData(data);
    if (res && res.success === false) {
      showToast('Storage error: ' + res.error, 'error');
    } else {
      showToast(successMsg, 'success');
      updateDraftStatus();
    }
  }

  function rid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function attr(v) {
    return (v == null ? '' : String(v))
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function updateDraftStatus() {
    const el = document.getElementById('draft-status');
    if (!el) return;
    if (dataManager.hasLocalDraft()) {
      el.className = 'draft-status dirty';
      el.innerHTML = '<i class="lni lni-warning"></i> You have unpublished changes in this browser. Download <code>content.js</code> below and deploy it to make them live.';
    } else {
      el.className = 'draft-status clean';
      el.innerHTML = '<i class="lni lni-checkmark-circle"></i> Nothing to publish — this browser matches the published site.';
    }
  }

  // Gallery Manager
  function renderAdminGallery(gallery) {
    const container = document.getElementById('admin-gallery-list');
    if (!container) return;

    container.innerHTML = gallery.map((item, idx) => `
      <div class="col-md-4 mb-3">
        <div style="border:1px solid #e2e8f0; border-radius:12px; overflow:hidden; background:#fff; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <img src="${item.image || 'assets/images/blog-1.jpg'}" style="width:100%; height:160px; object-fit:cover;">
          <div style="padding:15px;">
            <h6 style="font-weight:700; margin-bottom:4px;">${escapeHtml(item.title)}</h6>
            <p style="font-size:12px; color:#64748b; margin-bottom:12px;">${escapeHtml(item.subtitle || '')}</p>
            <button type="button" class="btn-secondary" style="padding:6px 12px; font-size:12px; width:100%; color:#ef4444;" onclick="window.deleteGalleryItem('${item.id}')">
              <i class="lni lni-trash"></i> Remove Photo
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  window.deleteGalleryItem = function(id) {
    const data = dataManager.getData();
    data.gallery = (data.gallery || []).filter(g => g.id !== id);
    dataManager.saveData(data);
    renderAdminGallery(data.gallery);
    showToast('Gallery item removed.', 'success');
  };

  const addGalleryForm = document.getElementById('add-gallery-form');
  if (addGalleryForm) {
    addGalleryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = getVal('gallery-new-title');
      const subtitle = getVal('gallery-new-subtitle');
      const image = getVal('gallery-new-img') || 'assets/images/blog-1.jpg';

      const data = dataManager.getData();
      data.gallery = data.gallery || [];
      data.gallery.push({
        id: 'gal_' + Date.now(),
        title,
        subtitle,
        image
      });

      const res = dataManager.saveData(data);
      if (res && res.success === false) {
        showToast('Storage error: ' + res.error, 'error');
      } else {
        renderAdminGallery(data.gallery);
        addGalleryForm.reset();
        updateImagePreview('gallery-new-preview', '');
        showToast('New photo added to gallery!', 'success');
      }
    });
  }

  // Security & Settings
  const passwordForm = document.getElementById('change-password-form');
  if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newPass = getVal('new-admin-password').trim();
      if (newPass.length < 4) {
        showToast('Password must be at least 4 characters long.', 'error');
        return;
      }
      dataManager.setAdminPassword(newPass);
      passwordForm.reset();
      showToast('Admin passcode updated successfully!', 'success');
    });
  }

  function downloadFile(filename, text, mime) {
    const blob = new Blob([text], { type: mime || 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const exportBtn = document.getElementById('btn-export-json');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      downloadFile(
        `the-bandhan-project-backup-${new Date().toISOString().slice(0, 10)}.json`,
        dataManager.exportDataJson(),
        'application/json'
      );
      showToast('Backup JSON exported.', 'success');
    });
  }

  const publishBtn = document.getElementById('btn-export-publish');
  if (publishBtn) {
    publishBtn.addEventListener('click', () => {
      downloadFile('content.js', dataManager.exportPublishFile(), 'text/javascript');
      showToast('content.js downloaded. Replace assets/js/content.js and deploy.', 'success');
    });
  }

  const discardBtn = document.getElementById('btn-discard-draft');
  if (discardBtn) {
    discardBtn.addEventListener('click', () => {
      if (!dataManager.hasLocalDraft()) {
        showToast('There are no local changes to discard.', 'info');
        return;
      }
      if (confirm('Discard all unpublished changes in this browser and show the currently published content?')) {
        dataManager.clearDraft();
        loadAllSectionData();
        showToast('Local changes discarded.', 'success');
      }
    });
  }

  const importFile = document.getElementById('import-json-file');
  if (importFile) {
    importFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = dataManager.importDataJson(ev.target.result);
        if (res.success) {
          loadAllSectionData();
          showToast('Website data restored successfully!', 'success');
        } else {
          showToast('Failed to import JSON: ' + res.error, 'error');
        }
      };
      reader.readAsText(file);
    });
  }

  // Modal Helpers
  function openModal(modal) {
    if (modal) modal.style.display = 'flex';
  }

  function closeModal(modal) {
    if (modal) modal.style.display = 'none';
  }

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.admin-modal-backdrop');
      closeModal(modal);
    });
  });

  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="lni lni-${type === 'success' ? 'checkmark-circle' : type === 'error' ? 'close' : 'information'}"></i> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val !== undefined && val !== null ? val : '';
  }

  function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
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

  checkAuth();
});
