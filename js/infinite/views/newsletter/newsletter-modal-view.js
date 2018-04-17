(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.newsletter.NewsletterModalView = BaseView.extend({
    events: {
      "click .close": "close"
    },
    options: {},
    cookieName: '_newsletter_modal',
    lastBreakpoint: '',
    hasDeviceModel: false,
    newsletterSuccess: false,
    deviceModel: null,
    newsletterView: null,
    availableInterval: 0,
    availableCheckCount: 0,
    initialize: function (pOptions) {
      _.extend(this, pOptions || {});

      this.hasDeviceModel = this.deviceModel != undefined;
      this.elementBreakpoints = $(this.$el.data('breakpoints')).toArray();

      if (!this.hasDeviceModel) return;

      this.cookieName = this.deviceModel.get("basehost") + this.cookieName;
      if (this.elementBreakpoints.length <= 0) this.elementBreakpoints.push('tablet', 'desktop');
      this.breakpointDeviceModel = this.deviceModel.getDeviceBreakpoints().findWhere({active: true});
      this.listenTo(this.deviceModel.getDeviceBreakpoints(), 'change:active', this.onDeviceBreakpointHandler, this);

      this.delegateEvents();
      this.initNewsletter();
      this.updateView();

    },
    updateView: function () {
      var tmpCurrentBreakpoint = this.breakpointDeviceModel.id;

      console.log("newsletter_modal",
        " \n | isGoogleBot", this.deviceModel.get("isGoogleBot"),
        " \n | currentBreakpoint >> " + tmpCurrentBreakpoint, 'is allowed > ', this.elementBreakpoints.indexOf(tmpCurrentBreakpoint),
        " \n | cookieName", this.cookieName,
        " \n | cookie", this.getCookie(),
        " \n | lastBreakpoint is NOT the same >> " + this.lastBreakpoint, (this.lastBreakpoint != tmpCurrentBreakpoint),
        " \n | referrerIsMe >> " + this.isRefererAccepted(),
        " \n | >>> SHOW", (this.deviceModel.isGoogleBot != true && this.elementBreakpoints.indexOf(tmpCurrentBreakpoint) >= 0 && this.getCookie() === undefined && this.lastBreakpoint != tmpCurrentBreakpoint) && this.isRefererAccepted());

      if (this.deviceModel.get("isGoogleBot") === false
        && this.elementBreakpoints.indexOf(tmpCurrentBreakpoint) >= 0
        && this.lastBreakpoint != tmpCurrentBreakpoint
        && this.isRefererAccepted() == true
        && this.getCookie() == undefined) {

        this.availableInterval = setInterval(_.bind(this.availableCheck, this), 1000);
        this.availableCheck();
      }

      this.lastBreakpoint = tmpCurrentBreakpoint;
    },
    availableCheck: function () {
      this.availableCheckCount++;
      if (this.newsletterView.available) {
        clearInterval(this.availableInterval);
        this.show();
      }

      //remove check if not available
      if (this.availableCheckCount > 10) {
        clearInterval(this.availableInterval);
      }
    },
    initNewsletter: function () {
      var $tmpNewsletter = this.$el.find('[data-view-type="newsletterView"]');
      this.newsletterView = new BaseNewsletterView({el: $tmpNewsletter, useTracking: false});

      $tmpNewsletter.on('newsletter:success', $.proxy(function (event) {
        this.newsletterSuccess = true;
        this.deviceModel.setCookieValue(this.cookieName, {newsletterModalSuccess: true}, {expires: 120});
        this.track({category: 'newsletter_modal', action: 'success'});
      }, this));

      $tmpNewsletter.on('newsletter:error', $.proxy(function (event) {
        this.track({category: 'newsletter_modal', action: 'error'});
      }, this));
    },
    onDeviceBreakpointHandler: function (pModel) {
      this.breakpointDeviceModel = pModel;
      this.updateView();
    },
    track: function (pObject) {
      if (typeof TrackingManager != 'undefined') {
        TrackingManager.trackEvent(pObject, TrackingManager.getAdvTrackingByElement(this.$el));

        if (pObject.category == 'newsletter_modal' && pObject.action == 'success') {
          TrackingManager.trackEvent({
            category: 'mkt-conversion',
            action: 'newsletterSignup',
            eventNonInteraction: false
          }, TrackingManager.getAdvTrackingByElement(this.$el));
        }
      }
    },
    isRefererAccepted: function () {
      return this.deviceModel.getReferrerCookie() != undefined && this.deviceModel.getReferrerCookie().referrerIsMe == true;
    },
    getCookie: function () {
      return this.deviceModel.getCookie(this.cookieName);
    },
    show: function () {
      this.$el.modal('show');
      $('body').addClass('modal-overall');
      this.track({category: 'newsletter_modal', action: 'show'});
    },
    close: function () {
      this.$el.modal('hide');
      $('body').removeClass('modal-overall');
      this.track({category: 'newsletter_modal', action: 'close'});

      if (!this.newsletterSuccess) {
        this.deviceModel.setCookieValue(this.cookieName, {newsletterModalSuccess: false}, {expires: 30});
      }
    }
  });

  window.NewsletterModalView = window.NewsletterModalView || BurdaInfinite.views.newsletter.NewsletterModalView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
