/* ============================================
   POLYMATHICS — Shared Layout (nav + footer)
   Single source of truth injected into every page.
   ============================================ */

const SPECIALTIES = [
  { href: '/#prp', title: 'PRP Therapies', desc: 'Platelet-rich plasma for joints & aesthetics', icon: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>' },
  { href: '/#stem-cells', title: 'Stem Cell Treatments', desc: 'Advanced cellular therapies & tissue repair', icon: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>' },
  { href: '/#joint-pain', title: 'Joint & Pain Management', desc: 'Non-surgical joint rehabilitation', icon: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>' },
  { href: '/#exosome', title: 'Exosome Therapy', desc: 'Advanced regenerative signaling', icon: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  { href: '/#peptide', title: 'Peptide Therapy', desc: 'Tissue healing & accelerated recovery', icon: '<path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>' },
  { href: '/#longevity', title: 'Longevity Protocols', desc: 'NAD+, cellular anti-aging, bio-optimization', icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
];

const MARKETING = [
  { href: '/pages/lead-reactivation.html', title: 'Outreach & Lead Reactivation', desc: 'Turn cold patient databases into hot revenue', icon: '<path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>' },
  { href: '/pages/reputation-management.html', title: 'Reputation Management', desc: 'Automated 5-star reviews & social proof', icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
  { href: '/pages/website-optimization.html', title: 'Website Optimization', desc: 'High-converting, LLM-ready landing pages', icon: '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>' },
  { href: '/pages/paid-ads.html', title: 'Marketing & Paid Ads', desc: 'Hyper-targeted Meta & Google campaigns', icon: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
];

const SOFTWARE = [
  { href: '/pages/ai-receptionists.html', title: 'AI Receptionists', desc: '24/7 call answering, booking & missed-call recovery', icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' },
];

const iconSvg = (paths, size = 22) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

const megaItem = (item, compact = false) => `
  <li><a class="mega-item${compact ? ' mega-item--compact' : ''}" href="${item.href}">
    <span class="mega-item-icon">${iconSvg(item.icon, compact ? 18 : 22)}</span>
    <span class="mega-item-body">
      <span class="mega-item-title">${item.title}</span>
      <span class="mega-item-desc">${item.desc}</span>
    </span>
  </a></li>`;

const chevron = `<svg class="nav-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

function buildNav() {
  return `
  <nav class="navbar" id="navbar">
    <div class="nav-container">
      <a href="/" class="nav-logo">
        <img src="/PolymathicsDesign2.png" alt="Polymathics" class="nav-logo-img" />
        <span class="nav-logo-text">Polymathics</span>
      </a>

      <ul class="nav-links" id="navLinks">
        <li class="nav-item has-mega" data-nav="specialties">
          <button class="nav-trigger" aria-expanded="false" aria-haspopup="true">Who We Help ${chevron}</button>
          <div class="mega-panel mega-panel--specialties" role="menu">
            <a class="mega-panel-header mega-panel-header--link" href="/#specialties">
              <span class="mega-eyebrow">Specialties We Serve</span>
              <p class="mega-lede">Revenue-driven AI automation for regenerative medicine.</p>
            </a>
            <ul class="mega-list mega-list--cols">${SPECIALTIES.map((i) => megaItem(i, true)).join('')}</ul>
          </div>
        </li>

        <li class="nav-item has-mega" data-nav="marketing">
          <button class="nav-trigger" aria-expanded="false" aria-haspopup="true">Marketing ${chevron}</button>
          <div class="mega-panel mega-panel--services" role="menu">
            <a class="mega-panel-header mega-panel-header--link" href="/#services">
              <span class="mega-eyebrow">Marketing Services</span>
              <p class="mega-lede">Patient acquisition systems built for regenerative practices.</p>
            </a>
            <ul class="mega-list">${MARKETING.map((i) => megaItem(i)).join('')}</ul>
          </div>
        </li>

        <li class="nav-item has-mega" data-nav="software">
          <button class="nav-trigger" aria-expanded="false" aria-haspopup="true">Software ${chevron}</button>
          <div class="mega-panel mega-panel--software" role="menu">
            <a class="mega-panel-header mega-panel-header--link" href="/#services">
              <span class="mega-eyebrow">Proprietary Software</span>
              <p class="mega-lede">HIPAA-compliant AI infrastructure for your front desk.</p>
            </a>
            <ul class="mega-list">${SOFTWARE.map((i) => megaItem(i)).join('')}</ul>
          </div>
        </li>

        <li class="nav-item" data-nav="about">
          <a class="nav-link" href="/#about">About</a>
        </li>
      </ul>

      <button class="nav-cta calendly-trigger">Book a Call</button>
      <button class="nav-hamburger" id="navHamburger" aria-label="Toggle menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>`;
}

function buildFooter() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" class="footer-logo">
            <img src="/PolymathicsDesign2.png" alt="Polymathics" class="footer-logo-img" width="28" height="28" loading="lazy" decoding="async" />
            <span class="footer-logo-text">Polymathics</span>
          </a>
          <p class="footer-tagline">Driving revenue for regenerative medicine clinics and advanced tissue repair practices.</p>
          <ul class="footer-social">
            <li><a href="mailto:dagfarias@polymathicsai.com" aria-label="Email"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></a></li>
            <li><a href="https://www.linkedin.com/in/dagoberto-farias/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a></li>
            <li><a href="https://github.com/tenken127/polymathicstrat" target="_blank" rel="noopener" aria-label="GitHub"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg></a></li>
          </ul>
        </div>
        <div class="footer-links-group">
          <h4 class="footer-heading">Company</h4>
          <ul class="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/#about">About</a></li>
            <li><a href="/#calculator">ROI Calculator</a></li>
            <li><a href="#" class="calendly-trigger">Book a Call</a></li>
          </ul>
        </div>
        <div class="footer-links-group">
          <h4 class="footer-heading">Who We Help</h4>
          <ul class="footer-links">${SPECIALTIES.map((i) => `<li><a href="${i.href}">${i.title}</a></li>`).join('')}</ul>
        </div>
        <div class="footer-links-group">
          <h4 class="footer-heading">Marketing</h4>
          <ul class="footer-links">${MARKETING.map((i) => `<li><a href="${i.href}">${i.title.replace('Outreach & ', '').replace('Marketing & ', '')}</a></li>`).join('')}</ul>
        </div>
        <div class="footer-links-group">
          <h4 class="footer-heading">Software</h4>
          <ul class="footer-links">${SOFTWARE.map((i) => `<li><a href="${i.href}">${i.title}</a></li>`).join('')}</ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 Polymathics. All rights reserved.</span>
      </div>
    </div>
  </footer>`;
}

function buildBreadcrumb(section, sectionHref, page) {
  return `
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <div class="container">
      <ol class="breadcrumb-list">
        <li><a href="/">Home</a></li>
        ${section ? `<li><a href="${sectionHref || '/#services'}">${section}</a></li>` : ''}
        <li aria-current="page">${page}</li>
      </ol>
    </div>
  </nav>`;
}

function buildMobileCta() {
  return `
  <div class="mobile-cta-bar">
    <button class="btn btn-primary calendly-trigger">Book a Call</button>
  </div>`;
}

function applyActiveState() {
  const path = window.location.pathname;
  let section = document.body.dataset.section?.toLowerCase();

  if (!section) {
    if (/lead-reactivation|reputation-management|website-optimization|paid-ads/.test(path)) section = 'marketing';
    else if (/ai-receptionists/.test(path)) section = 'software';
  }

  if (section) {
    const item = document.querySelector(`.nav-item[data-nav="${section}"]`);
    if (item) {
      item.classList.add('is-active');
      const target = item.querySelector('.nav-trigger, .nav-link');
      if (target) target.setAttribute('aria-current', 'page');
    }
  }
}

export function initLayout() {
  const navMount = document.getElementById('site-nav');
  if (navMount) navMount.outerHTML = buildNav();

  // Skip-to-content: target the first content section after the nav.
  const navbar = document.getElementById('navbar');
  const firstContent = navbar?.nextElementSibling;
  if (firstContent) {
    if (!firstContent.id) firstContent.id = 'main-content';
    firstContent.setAttribute('tabindex', '-1');
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = `#${firstContent.id}`;
    skip.textContent = 'Skip to content';
    document.body.insertBefore(skip, document.body.firstChild);
  }

  // Breadcrumb (subpages only, driven by body data attributes).
  const { page, section, sectionHref } = document.body.dataset;
  if (page && navbar) {
    navbar.insertAdjacentHTML('afterend', buildBreadcrumb(section, sectionHref, page));
  }

  const footerMount = document.getElementById('site-footer');
  if (footerMount) footerMount.outerHTML = buildFooter();

  document.body.insertAdjacentHTML('beforeend', buildMobileCta());

  applyActiveState();
}
