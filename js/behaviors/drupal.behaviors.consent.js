(function (Drupal, window) {
  Drupal.behaviors.consent = {
    getSettings: function () {
      return {
        vendors: [
          {
            init: function () {
              twttr.widgets.load();
            },
            data: [{ vendorId: 10006 }],
            src: '//platform.twitter.com/widgets.js',
          },
          {
            init: function () {
              instgrm.Embeds.process();
            },
            data: [{ vendorId: 10019 }],
            src: '//platform.instagram.com/en_US/embeds.js',
          },
          {
            init: this.setIframesSrc.bind(this, '.embed-youtube iframe'),
            data: [{ vendorId: 10020 }],
            src: undefined,
          },
          {
            init: function () {},
            data: [{ vendorId: 10031 }],
            src: '//assets.pinterest.com/js/pinit.js',
          },
        ],
      };
    },
    attach: function (context) {
      if (context !== window.document) return;
      if (window.__tcfapi) this.init();
    },
    init: function () {
      var settings = this.getSettings();
      var checkVendors = this.checkVendors.bind(this, settings.vendors);

      checkVendors();
      window.__tcfapi('addEventListener', 'consentChanged', checkVendors);
      this.initPlaceholderListener();
    },
    initPlaceholderListener: function () {
      var placeholder = document.querySelectorAll('.item-media__consent');
      placeholder.forEach(function (element) {
        element.addEventListener('click', function () {
          __tcfapi('showConsentManager', 2);
        });
      });
    },
    checkVendors: function (vendors) {
      vendors.forEach(
        function (vendor) {
          var checkConsent = this.checkConsent.bind(this, vendor);
          var data = { data: vendor.data };
          window.__tcfapi('checkConsent', 2, checkConsent, data);
        }.bind(this)
      );
    },
    checkConsent: function (vendor, consentData) {
      if (consentData) vendor.src ? this.loadScript(vendor) : vendor.init();
    },
    loadScript: function (vendor) {
      var script = document.createElement('script');
      script.onload = vendor.init;
      script.src = vendor.src;
      document.head.appendChild(script);
    },
    setIframesSrc: function (cssSelector) {
      var iframes = document.querySelectorAll(cssSelector);
      iframes.forEach(function (iframe) {
        !!iframe.parentElement &&
          iframe.parentElement.classList.add('rendered');
        iframe.setAttribute('src', iframe.getAttribute('data-src'));
      });
    },
  };
})(Drupal, window);
