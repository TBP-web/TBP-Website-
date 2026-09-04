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
    if (yknotActiveEl) yknotActiveEl.checked = yk.active !== false;

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

    // 5. Contact & Footer Form
    setVal('contact-email-input', data.contact.email);
    setVal('contact-phone-input', data.contact.phone);
    setVal('contact-address-input', data.contact.address);
    setVal('contact-fb-input', data.contact.facebook);
    setVal('contact-twitter-input', data.contact.twitter);
    setVal('contact-insta-input', data.contact.instagram);
    setVal('contact-linkedin-input', data.contact.linkedin);
    setVal('footer-about-input', data.footer.aboutText);
    setVal('footer-copyright-input', data.footer.copyright);

    // 6. Render Gallery Grid in Admin
    renderAdminGallery(data.gallery || []);
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
      data.yknot.active = document.getElementById('yknot-active').checked;
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

  // Contact & Footer Save
  const contactForm = document.getElementById('contact-footer-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = dataManager.getData();
      data.contact.email = getVal('contact-email-input');
      data.contact.phone = getVal('contact-phone-input');
      data.contact.address = getVal('contact-address-input');
      data.contact.facebook = getVal('contact-fb-input');
      data.contact.twitter = getVal('contact-twitter-input');
      data.contact.instagram = getVal('contact-insta-input');
      data.contact.linkedin = getVal('contact-linkedin-input');
      data.footer.aboutText = getVal('footer-about-input');
      data.footer.copyright = getVal('footer-copyright-input');

      const res = dataManager.saveData(data);
      if (res && res.success === false) {
        showToast('Storage error: ' + res.error, 'error');
      } else {
        showToast('Contact and footer details saved live!', 'success');
      }
    });
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

  const exportBtn = document.getElementById('btn-export-json');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const json = dataManager.exportDataJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `the-bandhan-project-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Backup JSON exported successfully!', 'success');
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

  const resetBtn = document.getElementById('btn-reset-default');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all content to default preset?')) {
        dataManager.resetToDefault();
        loadAllSectionData();
        showToast('Reset all data to default brand preset.', 'success');
      }
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
