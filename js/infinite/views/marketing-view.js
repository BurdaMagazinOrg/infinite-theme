(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.MarketingView = BaseView.extend(
    {
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
      initialize: function(pOptions) {
        BaseView.prototype.initialize.call(this, pOptions);

        this.$adSlotContainer = this.$el.find('.item-marketing');
        this.checkContainerType();
        this.breakpointDeviceModel = this.deviceModel.getDeviceBreakpoints().findWhere({ active: true });
        this.currentBreakpoint = this.breakpointDeviceModel.id;
        this.listenTo(this.deviceModel.getDeviceBreakpoints(), 'change:active', this.onDeviceBreakpointHandler, this);
        // this.listenTo(this.model, 'change:inviewEnabled', this.onEnabledHandler, this);

        if (this.currentBreakpoint === 'desktop' || this.adContainerType !== MarketingView.CONTAINER_TYPE_SIDEBAR) {
          this.trackAd();
        }
      },
      trackAd: function() {
        const entityTargeting = this.el.find('.ad-entity-container').data('ad-entity-targeting');
        let trackingObject = {
          event: 'adImpression',
          category: 'marketing',
          action: 'DOM',
        };

        if (!!entityTargeting && entityTargeting.hasOwnProperty('contentwidth')) {
          trackingObject.label = entityTargeting.contentwidth;
        }

        TrackingManager.trackEvent(trackingObject);
      },
      updateView: function() {
        if(this.adRenderModel.visibility === 'visible') this.show();
      },
      checkContainerType: function() {
        this.adEntityType = this.$el.find('[data-atf-format]');

        if (this.$el.hasClass('container-sidebar-content')) {
          this.adContainerType = MarketingView.CONTAINER_TYPE_SIDEBAR;
        }
      },
      onDeviceBreakpointHandler: function(pModel) {
        this.breakpointDeviceModel = pModel;
        this.currentBreakpoint = this.breakpointDeviceModel.id;

        if (!this.isAllowedToWrite()) return;

        this.hide();
      },
      isAllowedToWrite: function() {
        if (this.adType == MarketingView.AD_TYPE_FBSA || this.adType == MarketingView.AD_TYPE_INREAD) {
          return false;
        }

        return true;
      },
      isActive: function() {
        if (this.adContainerType == MarketingView.CONTAINER_TYPE_SIDEBAR && this.currentBreakpoint != 'desktop') {
          return false;
        }

        return true;
      },
      show: function() {
        this.$el.removeClass('ad-inactive').addClass('ad-active');
        this.visible = true;
      },
      hide: function() {
        this.$el.removeClass('initialized ad-active ad-fba').addClass('ad-inactive');
        this.adType = '';
        this.clear();
        this.visible = false;
      },
      clear: function() {
         if (this.getAdTechAd().length > 0) {
          this.getAdTechAd().empty();
        }
      },
      getAdEntityContainer: function() {
        if (this.$adEntityContainer.length <= 0) {
          this.$adEntityContainer = this.$el.find('.ad-entity-container');
        }

        return this.$adEntityContainer;
      },
      getAdTechAd: function() {
        if (this.$adTechAd.length <= 0) {
          this.$adTechAd = this.$el.find('.adtech-factory-ad');
        }

        return this.$adTechAd;
      },
      getTargeting: function() {
        let tmpTargeting = null;
        const $adEntityContainer = this.getAdEntityContainer();
        if ($adEntityContainer.length > 0) {
          tmpTargeting = $adEntityContainer.attr('data-ad-entity-targeting') || null;
        }
        return JSON.parse(tmpTargeting);
      },
      getAdContainerType: function() {
        return this.adContainerType;
      },
      setRenderedAdType: function(pAdType, pElement) {
        this.adType = pAdType;

        if (pAdType == MarketingView.AD_TYPE_FBSA) {
          this.$el.addClass('ad-' + MarketingView.AD_TYPE_FBSA);
          this.fbaIsFilled = true;
        }

        console.log('setRenderedAdType', this.adType);
      },
      setRenderModel: function(pAdModel) {
        this.adRenderModel = pAdModel;
        this.updateView();
        console.log('setRenderModel', pAdModel);
      },
    },
    {
      CONTAINER_TYPE_SIDEBAR: 'CONTAINER_TYPE_SIDEBAR',
      CONTAINER_TYPE_SPECIAL: 'CONTAINER_TYPE_SPECIAL',
      CONTAINER_TYPE_LEADERBOARD: 'CONTAINER_TYPE_LEADERBOARD',
      AD_ENTITY_TYPE_LEADERBOARD: 'AD_ENTITY_TYPE_LEADERBOARD',
      AD_ENTITY_TYPE_SPECIAL: 'AD_ENTITY_TYPE_SPECIAL',
      AD_TYPE_FBSA: 'fba',
      AD_TYPE_INREAD: 'inread',
    }
  );

  window.MarketingView =
    window.MarketingView || BurdaInfinite.views.MarketingView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
