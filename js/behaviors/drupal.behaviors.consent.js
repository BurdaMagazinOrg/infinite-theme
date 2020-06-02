(function (Drupal, window) {
  Drupal.behaviors.consent = {
    getSettings: function () {
      window.consentVendors = window.consentVendors || [];
      window.consentVendors.push(
        {
          init: function () {
            twttr.widgets.load();
          },
          data: [{ vendorId: 10006 }],
          script: { src: '//platform.twitter.com/widgets.js' },
        },
        {
          init: function () {
            instgrm.Embeds.process();
          },
          data: [{ vendorId: 10019 }],
          script: { src: '//platform.instagram.com/en_US/embeds.js' },
        },
        {
          init: this.setIframesSrc.bind(this, '.embed-youtube iframe'),
          data: [{ vendorId: 10020 }],
          script: { src: undefined },
        },
        {
          init: function () {},
          data: [{ vendorId: 10031 }],
          script: { src: '//assets.pinterest.com/js/pinit.js' },
        },
        {
          init: function () {},
          data: [{ vendorId: 10179 }],
          script: {
            src: '//static.cleverpush.com/channel/loader/YGtyGPovWHkyjZ6tN.js',
          },
        },
        {
          init: function () {},
          data: [{ vendorId: 10008 }],
          script: {
            src: `https://static.hotjar.com/c/hotjar-${AppConfig.hotjarId}.js`,
          },
        }
      );
      return { vendors: window.consentVendors };
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
      var script = vendor.script;
      if (consentData) script.src ? this.loadScript(vendor) : vendor.init();
    },
    loadScript: function (vendor) {
      var script = vendor.script;
      var js = document.createElement('script');
      js.onload = vendor.init;
      if (script.id) js.id = script.id;
      js.src = script.src;
      document.head.appendChild(js);
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
