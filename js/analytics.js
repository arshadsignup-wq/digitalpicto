/* ============================================================
   Digital Picto analytics loader

   SET YOUR IDS BELOW. Until an ID is filled in, nothing loads and no
   requests are made: the file is inert and safe to ship as-is.

     GA4_ID  Google Analytics 4   looks like  G-XXXXXXXXXX
     GTM_ID  Google Tag Manager   looks like  GTM-XXXXXXX   (optional,
             use this instead of GA4_ID if you prefer managing tags in GTM)

   Where to get GA4_ID:
     analytics.google.com -> Admin -> Data Streams -> your web stream ->
     "Measurement ID" at the top right.
   ============================================================ */
(function () {
  'use strict';

  var GA4_ID = '';   // e.g. 'G-ABCD123456'
  var GTM_ID = '';   // e.g. 'GTM-ABCD123'

  if (!GA4_ID && !GTM_ID) return;   // nothing configured, do nothing

  function inject(src) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
  }

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  if (GTM_ID) {
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    inject('https://www.googletagmanager.com/gtm.js?id=' + GTM_ID);
  } else {
    inject('https://www.googletagmanager.com/gtag/js?id=' + GA4_ID);
    gtag('js', new Date());
    gtag('config', GA4_ID, { anonymize_ip: true });
  }

  /* ---- Conversion events -------------------------------------------
     These fire on the actions that actually matter, so leads can be
     attributed instead of guessed at. */
  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', function () {
        gtag('event', 'generate_lead', {
          form_name: 'contact',
          page_path: window.location.pathname
        });
      });
    }

    document.querySelectorAll('.subscribe-form').forEach(function (f) {
      f.addEventListener('submit', function () {
        gtag('event', 'sign_up', { method: 'newsletter' });
      });
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
      a.addEventListener('click', function () {
        gtag('event', 'contact_email_click');
      });
    });

    document.querySelectorAll('a.btn-primary').forEach(function (a) {
      a.addEventListener('click', function () {
        gtag('event', 'cta_click', {
          cta_text: (a.textContent || '').trim().slice(0, 60),
          page_path: window.location.pathname
        });
      });
    });
  });
})();
