(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.models.DeviceModel = Backbone.Model.extend({
    defaults: {
      isActive: false,
      uid: -1,
      uid_cookie_name: 'tc_ptid',
      basehost: window.location.hostname.split('.')[0],
      cookieReferrerName: '_referrer',
      isGoogleBot: navigator.userAgent.toLowerCase().indexOf('googlebot') > 0,
      useWhatsapp:
        !!navigator.userAgent.match(/Android|iPhone/i) &&
        !navigator.userAgent.match(/iPod|iPad/i),
    },
    breakpoints: {},
    breakpointValues: [],
    breakpointKeys: [],
    deviceBreakpointValues: [],
    deviceBreakpointKeys: [],
    deviceMapping: {},
    deviceValues: [],
    deviceKeys: [],
    lastBreakpoint: {},
    lastDeviceBreakpoint: {},
    initialize(pAttributes, pOptions) {
      Backbone.Model.prototype.initialize.call(this, pAttributes, pOptions);

      this.breakpoints = pOptions.Breakpoints;
      this.breakpointValues = _.values(this.breakpoints);
      this.breakpointKeys = _.keys(this.breakpoints);

      this.deviceMapping = pOptions.DeviceMapping;
      this.deviceValues = _.values(this.deviceMapping);
      this.deviceKeys = _.keys(this.deviceMapping);
      this.deviceBreakpointValues = [];
      this.deviceBreakpointKeys = [];

      this.set('uuid', window.readCookie(this.get('uid_cookie_name')));
      this.set(
        'cookieReferrerName',
        this.get('basehost') + this.getReferrerLSName()
      );
      this.set('breakpoints', new Backbone.Collection());
      this.set('deviceBreakpoints', new Backbone.Collection());

      this.writeReferrerLS();
      this.createBreakpoints();
      this.createDeviceBreakpoints();
      this.checkActiveBreakpoint();
      this.checkActiveDevice();

      $(window).resize(
        _.bind(
          _.debounce(function() {
            this.checkActiveBreakpoint();
            this.checkActiveDevice();
          }, 200),
          this
        )
      );

      this.set('isActive', this.getBreakpoints().length > 0);
      // console.log('deviceModelInfo', JSON.parse(this.getReferrerLS()), this);
    },
    createBreakpoints() {
      let tmpModelItem = {};

      let tmpMinVal = 0;

      let tmpMaxVal = 0;

      let tmpKey = '';

      _.each(
        this.breakpointValues,
        _.bind(function(pVal, pIndex) {
          tmpKey = this.breakpointKeys[pIndex];
          tmpMinVal = pVal;
          tmpModelItem = {
            id: tmpKey,
            min_width: tmpMinVal,
            active: false,
          };

          if (pIndex < this.breakpointValues.length - 1) {
            tmpMaxVal = this.breakpointValues[pIndex + 1] - 1;
            tmpModelItem.max_width = tmpMaxVal;
          }

          this.getBreakpoints().add(tmpModelItem);
        }, this)
      );
    },
    createDeviceBreakpoints() {
      let tmpModelItem = {};

      let tmpKey = '';

      let tmpNextKey;

      this.deviceBreakpointValues = [];
      this.deviceBreakpointKeys = [];
      _.each(
        this.deviceValues,
        _.bind(function(pVal, pIndex) {
          tmpKey = this.deviceKeys[pIndex];
          tmpModelItem = {
            id: tmpKey,
            min_width: this.getBreakpoints()
              .get(pVal)
              .get('min_width'),
            active: false,
            mapping: pVal,
          };

          if (pIndex < this.deviceValues.length - 1) {
            tmpNextKey = this.deviceValues[pIndex + 1];
            tmpModelItem.max_width =
              parseInt(
                this.getBreakpoints()
                  .get(tmpNextKey)
                  .get('min_width')
              ) - 1;
          }

          this.deviceBreakpointValues.push(tmpModelItem.min_width);
          this.deviceBreakpointKeys.push(tmpKey);
          this.getDeviceBreakpoints().add(tmpModelItem);
        }, this)
      );
    },
    checkActiveBreakpoint() {
      const tmpSize = { width: $(window).width(), height: $(window).height() };

      let tmpKey = '';

      let tmpBreakpoint = null;

      const tmpValues = _.clone(this.breakpointValues).reverse();

      const tmpKeys = _.clone(this.breakpointKeys).reverse();

      /**
       * reset active state
       */
      _.each(
        this.getBreakpoints().models,
        _.bind(pItem => {
          if (pItem.has('active'))
            pItem.set({ active: false }, { silent: true });
        }, this)
      );

      /**
       * set active state
       */
      _.every(
        tmpValues,
        _.bind(function(pVal, pIndex) {
          if (tmpSize.width >= pVal) {
            tmpKey = tmpKeys[pIndex];
            tmpBreakpoint = this.getBreakpoints().get(tmpKey);
            tmpBreakpoint.set({ active: true }, { silent: true });
            if (tmpBreakpoint.id != this.lastBreakpoint.id) {
              this.getBreakpoints().trigger('change:active');
            }
            this.lastBreakpoint = tmpBreakpoint;
          }
          return tmpSize.width < pVal;
        }, this)
      );
    },
    checkActiveDevice() {
      const tmpSize = { width: $(window).width(), height: $(window).height() };

      const tmpValues = _.clone(this.deviceBreakpointValues).reverse();

      const tmpKeys = _.clone(this.deviceBreakpointKeys).reverse();

      let tmpBreakpoint = null;

      let tmpKey = '';

      /**
       * reset active state
       */
      _.each(
        this.getDeviceBreakpoints().models,
        _.bind(pItem => {
          if (pItem.has('active'))
            pItem.set({ active: false }, { silent: true });
        }, this)
      );

      /**
       * set active state
       */
      _.every(
        tmpValues,
        _.bind(function(pVal, pIndex) {
          if (tmpSize.width >= pVal) {
            tmpKey = tmpKeys[pIndex];

            tmpBreakpoint = this.getDeviceBreakpoints().get(tmpKey);
            tmpBreakpoint.set({ active: true }, { silent: true });
            if (tmpBreakpoint.id != this.lastDeviceBreakpoint.id) {
              this.getDeviceBreakpoints().trigger(
                'change:active',
                tmpBreakpoint
              );
            }
            this.lastDeviceBreakpoint = tmpBreakpoint;
          }
          return tmpSize.width < pVal;
        }, this)
      );
    },
    writeReferrerLS() {
      const tmpParams = this.getURLParams();

      const tmpReferrerLS = $.extend(this.getLS(this.getReferrerLSName()), {});

      const tmpReferrer = document.referrer;

      const tmpHostname = this.parseUrl(tmpReferrer).hostname;

      const tmpUtmCampaign = tmpParams.utm_campaign;

      tmpReferrerLS.referrer = tmpReferrer;
      tmpReferrerLS.currentUtmCampaign = tmpUtmCampaign; // could be undefined if no campaign in usage

      if (tmpUtmCampaign != '' && tmpUtmCampaign != undefined) {
        tmpReferrerLS.lastKnownUtmCampaign = tmpUtmCampaign;
      }

      tmpReferrerLS.referrerIsMe =
        tmpReferrer != '' && tmpHostname.indexOf(this.get('basehost')) > -1;
      tmpReferrerLS.referrerIsFb = tmpHostname.indexOf('facebook') > -1;

      // counting clicks after FB referrer - needed for the FB layer/ads/likegates policy
      if (tmpReferrerLS.referrerIsFb) {
        tmpReferrerLS.comesFromFB = true;
        tmpReferrerLS.clicksAfterFbReferrer = 0;
      } else if (tmpReferrerLS.comesFromFB == true) {
        tmpReferrerLS.clicksAfterFbReferrer++;
      }

      this.setLSValue(this.getReferrerLSName(), JSON.stringify(tmpReferrerLS));
    },
    parseUrl(pUrl) {
      const a = document.createElement('a');
      a.href = pUrl;
      return a;
    },
    setLSValue(pCookieName, pValue, pOptions) {
      const tmpOptions = _.extend({ path: '/' }, pOptions);
      window.localStorage.setItem(pCookieName, pValue, tmpOptions);
    },
    getLS(pCookieName) {
      return window.localStorage.getItem(pCookieName);
    },
    getReferrerLSName() {
      return this.get('cookieReferrerName');
    },
    getReferrerLS() {
      return window.localStorage.getItem(this.getReferrerLSName());
    },
    getURLParams(pParam) {
      return _.object(
        _.compact(
          _.map(location.search.slice(1).split('&'), item => {
            if (item) return item.split('=');
          })
        )
      );
    },
    getBreakpoints() {
      return this.get('breakpoints');
    },
    getDeviceBreakpoints() {
      return this.get('deviceBreakpoints');
    },
  });

  window.DeviceModel = window.DeviceModel || BurdaInfinite.models.DeviceModel;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
