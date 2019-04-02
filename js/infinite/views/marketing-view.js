(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.MarketingView = BaseView.extend({
    trackingTimeout: 0,
    inview: null,
    adType: '',
    adEntityType: '',
    adContainerType: '',
    currentBreakpoint: '',
    adRenderModel: null,
    breakpointDeviceModel: {},
    $adSlotContainer: [],
    $adTechAd: [],
    $adEntityContainer: [],
    height: 0,
    visible: false,
    enabled: null,
    fbaIsFilled: false,
    targeting: null,
    initialize: function (pOptions) {
      BaseView.prototype.initialize.call(this, pOptions);

      this.$adSlotContainer = this.$el.find('.item-marketing');
      this.checkContainerType();
      this.delegateInview();
      this.breakpointDeviceModel = this.deviceModel.getDeviceBreakpoints().findWhere({
        active: true
      });
      this.currentBreakpoint = this.breakpointDeviceModel.id;
      this.listenTo(this.deviceModel.getDeviceBreakpoints(), 'change:active', this.onDeviceBreakpointHandler, this);
      this.listenTo(this.model, 'change:inviewEnabled', this.onEnabledHandler, this);

      if (this.currentBreakpoint === 'desktop' || this.adContainerType !== MarketingView.CONTAINER_TYPE_SIDEBAR) {
        this.trackAd('DOM');
      }
    },
    delegateInview: function () {
      if (this.inview !== null) this.inview.destroy();

      this.inview = this.$el.inview({
        enter: this.onInviewEnterHandler.bind(this),
        exit: this.onInviewExitHandler.bind(this),
      });
    },
    onInviewEnterHandler: function () {
      clearTimeout(this.trackingTimeout);
      this.trackingTimeout = setTimeout(() => {
        this.trackAd('viewportDefault');
      });
    },
    onInviewExitHandler: function () {
      clearTimeout(this.trackingTimeout);
    },
    onEnabledHandler: function (pModel) {
      if (pModel !== this.model) return; // event bubbling
      this.enabled = !!pModel.get('inviewEnabled');
    },
    trackAd: function (action) {
      const entityTargeting = this.el.find('.ad-entity-container').data('ad-entity-targeting');

      let trackingObject = {
        event: 'adImpression',
        category: 'marketing',
        action: action,
      };

      if (!!entityTargeting && entityTargeting.hasOwnProperty('contentwidth')) {
        trackingObject.label = entityTargeting.contentwidth;
      }

      TrackingManager.trackEvent(trackingObject);
    },
    updateView: function () {
      if (this.adRenderModel.visibility == 'visible') {
        this.show();
      } else {
        this.hide();
      }
    },
    checkContainerType: function () {
      this.adEntityType = this.$el.find('[data-atf-format]');

      if (this.$el.hasClass('container-sidebar-content')) {
        this.adContainerType = MarketingView.CONTAINER_TYPE_SIDEBAR;
      } else if (this.$el.hasClass('region-full-content')) {
        this.adContainerType = MarketingView.CONTAINER_TYPE_LEADERBOARD;
      }
    },
    onDeviceBreakpointHandler: function (pModel) {
      this.breakpointDeviceModel = pModel;
      this.currentBreakpoint = this.breakpointDeviceModel.id;

      this.hide();
    },
    isActive: function () {
      if (
        this.adContainerType == MarketingView.CONTAINER_TYPE_SIDEBAR &&
        this.currentBreakpoint != 'desktop'
      ) {
        return false;
      }

      return this.enabled;
    },
    show: function () {
      this.$el.removeClass('ad-inactive').addClass('ad-active');
      this.removeFixHeight();
      this.visible = true;
    },
    hide: function () {
      this.$el.removeClass('ad-active ad-fba').addClass('ad-inactive');
      this.removeFixHeight();
      this.adType = '';
      this.visible = false;
    },
    freeze: function () {
      const height = this.getAdEntityContainer().height();
      if (this.visible && height !== 0 && this.adType !== MarketingView.CONTAINER_TYPE_SIDEBAR) {
        this.setFixHeight(height);
      };
    },
    allowToBuild: function () {
      if (this.adType === MarketingView.AD_TYPE_FBSA) return false;
      return true;
    },
    setFixHeight: function (pHeight) {
      this.getAdEntityContainer().css('height', pHeight);
    },
    removeFixHeight: function () {
      this.getAdEntityContainer().css('height', '');
    },
    getAdEntityContainer: function () {
      if (this.$adEntityContainer.length <= 0) this.$adEntityContainer = this.$el.find('.ad-entity-container');
      return this.$adEntityContainer;
    },
    getAdTechAd: function () {
      if (this.$adTechAd.length <= 0) this.$adTechAd = this.$el.find('.adtech-factory-ad');
      return this.$adTechAd;
    },
    getTargeting: function () {
      let tmpTargeting = null;
      const $adEntityContainer = this.getAdEntityContainer();
      if ($adEntityContainer.length > 0) tmpTargeting = $adEntityContainer.attr('data-ad-entity-targeting') || null;
      return JSON.parse(tmpTargeting);
    },
    getAdContainerType: function () {
      return this.adContainerType;
    },
    setRenderedAdType: function (pAdType, pElement) {
      this.adType = pAdType;

      if (pAdType == MarketingView.AD_TYPE_FBSA) {
        this.$el.addClass('ad-' + MarketingView.AD_TYPE_FBSA);
        this.fbaIsFilled = true;

        if (pElement != undefined) {
          pElement.contentWindow.addEventListener(
            'DOMContentLoaded',
            _.bind(function (pTest) {
              this.checkHeight();
            }, this)
          );
        }
      }
    },
    setRenderModel: function (pAdModel) {
      this.adRenderModel = pAdModel;
      this.updateView();
    },
  }, {
    CONTAINER_TYPE_SIDEBAR: 'CONTAINER_TYPE_SIDEBAR',
    CONTAINER_TYPE_SPECIAL: 'CONTAINER_TYPE_SPECIAL',
    CONTAINER_TYPE_LEADERBOARD: 'CONTAINER_TYPE_LEADERBOARD',
    AD_ENTITY_TYPE_LEADERBOARD: 'AD_ENTITY_TYPE_LEADERBOARD',
    AD_ENTITY_TYPE_SPECIAL: 'AD_ENTITY_TYPE_SPECIAL',
    AD_TYPE_FBSA: 'fba',
    AD_TYPE_INREAD: 'inread',
  });

  window.MarketingView = window.MarketingView || BurdaInfinite.views.MarketingView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
