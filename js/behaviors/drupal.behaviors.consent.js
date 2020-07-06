(function(Drupal, window) {
  Drupal.behaviors.consent = {
    getSettings: function() {
      window.consentVendors = window.consentVendors || [];
      window.consentVendors.push(
        {
          init: function() {
            twttr.widgets.load();
          },
          data: [{ vendorId: 10006 }],
          script: { src: '//platform.twitter.com/widgets.js' },
        },
        {
          init: function() {
            instgrm.Embeds.process();
          },
          data: [{ vendorId: 10019 }],
          script: { src: '//platform.instagram.com/en_US/embeds.js' },
        },
        {
          init: this.setIframesSrc.bind(this, '.embed-youtube iframe'),
          data: [{ vendorId: 10020 }],
        },
        {
          init: function() {},
          data: [{ vendorId: 10031 }],
          script: { src: '//assets.pinterest.com/js/pinit.js' },
        },
        {
          init: function() {},
          data: [{ vendorId: 10179 }],
          script: {
            src: `//static.cleverpush.com/channel/loader/${AppConfig.cleverPush}.js`,
          },
        },
        {
          init: function() {},
          data: [{ vendorId: 10008 }],
          script: {
            innerHTML: `(function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:${AppConfig.hotjarId},hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
          },
        },
        {
          init: function() {},
          data: [{ vendorId: 10211 }],
          script: {
            innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${window.gtm_id}');`,
          },
        },
        {
          init: function() {
            window.hasABLyftConsent = true;
            if (window.ablyft) window.ablyft.reInit();
          },
          data: [{ vendorId: 10181 }],
        }
      );
      return { vendors: window.consentVendors };
    },
    attach: function(context) {
      if (context !== window.document) return;
      this.addListeners();
    },
    addListeners: function() {
      if (window.__tcfapi) {
        __tcfapi('addEventListener', 2, this.init.bind(this), ['cmpReady']);
      }
    },
    init: function() {
      var settings = this.getSettings();
      var checkVendors = this.checkVendors.bind(this, settings.vendors);

      checkVendors();
      this.initPlaceholderListener();
    },
    initPlaceholderListener: function() {
      var placeholder = document.querySelectorAll('.item-media__consent');
      placeholder.forEach(function(element) {
        element.addEventListener('click', function() {
          __tcfapi('showConsentManager', 2);
        });
      });
    },
    checkVendors: function(vendors) {
      vendors.forEach(
        function(vendor) {
          var checkConsent = this.checkConsent.bind(this, vendor);
          var data = { data: vendor.data, recheckConsentOnChange: true };
          window.__tcfapi('checkConsent', 2, checkConsent, data);
        }.bind(this)
      );
    },
    checkConsent: function(vendor, consentData) {
      var script = vendor.script;
      if (consentData) !!script ? this.loadScript(vendor) : vendor.init();
    },
    loadScript: function(vendor) {
      var script = vendor.script;
      var js = document.createElement('script');
      js.onload = vendor.init;
      if (script.id) js.id = script.id;
      if (script.src) js.src = script.src;
      if (script.innerHTML) js.innerHTML = script.innerHTML;
      document.head.appendChild(js);
    },
    setIframesSrc: function(cssSelector) {
      var iframes = document.querySelectorAll(cssSelector);
      iframes.forEach(function(iframe) {
        !!iframe.parentElement &&
          iframe.parentElement.classList.add('rendered');
        iframe.setAttribute('src', iframe.getAttribute('data-src'));
      });
    },
  };
})(Drupal, window);
