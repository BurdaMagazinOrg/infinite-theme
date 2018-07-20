(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.models.DeviceModel = Backbone.Model.extend({
    defaults: {
      isActive: false,
      uid: -1,
      uid_cookie_name: "tc_ptid",
      basehost: window.location.hostname.split(".")[0],
      cookieReferrerName: '_referrer',
      isGoogleBot: navigator.userAgent.toLowerCase().indexOf('googlebot') > 0,
      useWhatsapp: ((navigator.userAgent.match(/Android|iPhone/i) && !navigator.userAgent.match(/iPod|iPad/i)) ? true : false)
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
    initialize: function (pAttributes, pOptions) {
      //var tmpOptions = _.extend(this.defaults, pOptions);
      Backbone.Model.prototype.initialize.call(this, pAttributes, pOptions);

      this.breakpoints = pOptions.Breakpoints;
      this.breakpointValues = _.values(this.breakpoints);
      this.breakpointKeys = _.keys(this.breakpoints);

      this.deviceMapping = pOptions.DeviceMapping;
      this.deviceValues = _.values(this.deviceMapping);
      this.deviceKeys = _.keys(this.deviceMapping);
      this.deviceBreakpointValues = [];
      this.deviceBreakpointKeys = [];

      this.set("uuid", this.getCookie(this.get("uid_cookie_name")));
      this.set("cookieReferrerName", this.get("basehost") + this.getReferrerCookieName());
      this.set('breakpoints', new Backbone.Collection());
      this.set('deviceBreakpoints', new Backbone.Collection());

      this.writeReferrerCookie();
      this.createBreakpoints();
      this.createDeviceBreakpoints();
      this.checkActiveBreakpoint();
      this.checkActiveDevice();

      $(window).resize(_.bind(_.debounce(function () {
        this.checkActiveBreakpoint();
        this.checkActiveDevice();
      }, 200), this));


      this.set('isActive', this.getBreakpoints().length > 0);
      // console.log("deviceModelInfo", JSON.parse(this.getReferrerCookie()));
    },
    createBreakpoints: function () {
      var tmpModelItem = {},
        tmpMinVal = 0,
        tmpMaxVal = 0,
        tmpKey = "";

      _.each(this.breakpointValues, _.bind(function (pVal, pIndex) {
        tmpKey = this.breakpointKeys[pIndex];
        tmpMinVal = pVal;
        tmpModelItem = {
          id: tmpKey,
          min_width: tmpMinVal,
          active: false
        };

        if (pIndex < this.breakpointValues.length - 1) {
          tmpMaxVal = (this.breakpointValues[pIndex + 1] - 1);
          tmpModelItem.max_width = tmpMaxVal;
        }

        this.getBreakpoints().add(tmpModelItem);
      }, this));
    },
    createDeviceBreakpoints: function () {
      var tmpModelItem = {},
        tmpKey = "",
        tmpNextKey;


      this.deviceBreakpointValues = [];
      this.deviceBreakpointKeys = [];
      _.each(this.deviceValues, _.bind(function (pVal, pIndex) {
        tmpKey = this.deviceKeys[pIndex];
        tmpModelItem = {
          id: tmpKey,
          min_width: this.getBreakpoints().get(pVal).get('min_width'),
          active: false,
          mapping: pVal
        };

        if (pIndex < this.deviceValues.length - 1) {
          tmpNextKey = (this.deviceValues[pIndex + 1]);
          tmpModelItem.max_width = parseInt(this.getBreakpoints().get(tmpNextKey).get('min_width')) - 1;
        }

        this.deviceBreakpointValues.push(tmpModelItem.min_width);
        this.deviceBreakpointKeys.push(tmpKey);
        this.getDeviceBreakpoints().add(tmpModelItem);
      }, this));

    },
    checkActiveBreakpoint: function () {
      var tmpSize = {width: $(window).width(), height: $(window).height()},
        tmpKey = "",
        tmpBreakpoint = null,
        tmpValues = _.clone(this.breakpointValues).reverse(),
        tmpKeys = _.clone(this.breakpointKeys).reverse();

      /**
       * reset active state
       */
      _.each(this.getBreakpoints().models, _.bind(function (pItem) {
        if (pItem.has('active')) pItem.set({active: false}, {silent: true});
      }, this));

      /**
       * set active state
       */
      _.every(tmpValues, _.bind(function (pVal, pIndex) {
        if (tmpSize.width >= pVal) {
          tmpKey = tmpKeys[pIndex];
          tmpBreakpoint = this.getBreakpoints().get(tmpKey);
          tmpBreakpoint.set({active: true}, {silent: true});
          if (tmpBreakpoint.id != this.lastBreakpoint.id) {
            this.getBreakpoints().trigger('change:active');
          }
          this.lastBreakpoint = tmpBreakpoint;
        }
        return tmpSize.width < pVal;
      }, this));
    },
    checkActiveDevice: function () {
      var tmpSize = {width: $(window).width(), height: $(window).height()},
        tmpValues = _.clone(this.deviceBreakpointValues).reverse(),
        tmpKeys = _.clone(this.deviceBreakpointKeys).reverse(),
        tmpBreakpoint = null,
        tmpKey = "";

      /**
       * reset active state
       */
      _.each(this.getDeviceBreakpoints().models, _.bind(function (pItem) {
        if (pItem.has('active')) pItem.set({active: false}, {silent: true});
      }, this));

      /**
       * set active state
       */
      _.every(tmpValues, _.bind(function (pVal, pIndex) {
        if (tmpSize.width >= pVal) {
          tmpKey = tmpKeys[pIndex];

          tmpBreakpoint = this.getDeviceBreakpoints().get(tmpKey);
          tmpBreakpoint.set({active: true}, {silent: true});
          if (tmpBreakpoint.id != this.lastDeviceBreakpoint.id) {
            this.getDeviceBreakpoints().trigger('change:active', tmpBreakpoint);
          }
          this.lastDeviceBreakpoint = tmpBreakpoint;
        }
        return tmpSize.width < pVal;
      }, this));
    },
    writeReferrerCookie: function () {
      var tmpParams = this.getURLParams(),
        tmpCookie = $.extend(this.getCookie(this.getReferrerCookieName()), {}),
        tmpReferrer = document.referrer,
        tmpHostname = this.parseUrl(tmpReferrer).hostname,
        tmpUtmCampaign = tmpParams.utm_campaign;

      tmpCookie.referrer = tmpReferrer;
      tmpCookie.currentUtmCampaign = tmpUtmCampaign; //could be undefined if no campaign in usage

      if (tmpUtmCampaign != "" && tmpUtmCampaign != undefined) {
        tmpCookie.lastKnownUtmCampaign = tmpUtmCampaign;
      }

      tmpCookie.referrerIsMe = tmpReferrer != "" && tmpHostname.indexOf(this.get('basehost')) > -1;
      tmpCookie.referrerIsFb = tmpHostname.indexOf("facebook") > -1;

      //counting clicks after FB referrer - needed for the FB layer/ads/likegates policy
      if (tmpCookie.referrerIsFb) {
        tmpCookie.comesFromFB = true;
        tmpCookie.clicksAfterFbReferrer = 0;
      } else if (tmpCookie.comesFromFB == true) {
        tmpCookie.clicksAfterFbReferrer++;
      }

      this.setCookieValue(this.getReferrerCookieName(), JSON.stringify(tmpCookie));
    },
    parseUrl: function (pUrl) {
      var a = document.createElement('a');
      a.href = pUrl;
      return a;
    },
    setCookieValue: function (pCookieName, pValue, pOptions) {
      var tmpOptions = _.extend({path: '/'}, pOptions);
      $.cookie(pCookieName, pValue, tmpOptions);
    },
    getCookie: function (pCookieName) {
      return $.cookie(pCookieName);
    },
    getReferrerCookieName: function () {
      return this.get("cookieReferrerName");
    },
    getReferrerCookie: function () {
      return $.cookie(this.getReferrerCookieName());
    },
    getURLParams: function (pParam) {
      return _.object(_.compact(_.map(location.search.slice(1).split('&'), function (item) {
        if (item) return item.split('=');
      })));
    },
    getBreakpoints: function () {
      return this.get('breakpoints');
    },
    getDeviceBreakpoints: function () {
      return this.get('deviceBreakpoints');
    }
  });

  window.DeviceModel = window.DeviceModel || BurdaInfinite.models.DeviceModel;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);

export default DeviceModel;
