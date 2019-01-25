(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.MarketingView = BaseView.extend(
    {
      adType: "",
      adEntityType: "",
      adContainerType: "",
      currentBreakpoint: "",
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
      initialize(pOptions) {
        BaseView.prototype.initialize.call(this, pOptions);

        this.$adSlotContainer = this.$el.find(".item-marketing");
        this.checkContainerType();
        this.breakpointDeviceModel = this.deviceModel
          .getDeviceBreakpoints()
          .findWhere({ active: true });
        this.currentBreakpoint = this.breakpointDeviceModel.id;
        this.listenTo(
          this.deviceModel.getDeviceBreakpoints(),
          "change:active",
          this.onDeviceBreakpointHandler,
          this
        );
        this.listenTo(
          this.model,
          "change:inviewEnabled",
          this.onEnabledHandler,
          this
        );

        if(this.currentBreakpoint === "desktop" || this.adContainerType !== MarketingView.CONTAINER_TYPE_SIDEBAR) {
          this.trackAd();
        } 
      },
      trackAd() {
        const entityTargeting = this.el
        .find(".ad-entity-container")
        .data("ad-entity-targeting");
        
        let trackingObject = {
          event: "adImpression",
          category: "marketing",
          action: "DOM"
        };

        if(!!entityTargeting && entityTargeting.hasOwnProperty("contentwidth")) {
          trackingObject.label = entityTargeting.contentwidth;
        }

        TrackingManager.trackEvent(trackingObject);
      },
      updateView() {
        this.removeFixHeight();

        if (this.adRenderModel.visibility == "visible") {
          this.show();
        } else {
          this.hide();
        }
      },
      checkContainerType() {
        // TODO: this doesn't return the data, just the element containing it.
        // This also means, that the second to last condition will always fail
        this.adEntityType = this.$el.find("[data-atf-format]");

        if (this.$el.hasClass("container-sidebar-content")) {
          this.adContainerType = MarketingView.CONTAINER_TYPE_SIDEBAR;
        } 
      },
      updateEnableView() {
        /**
         * No atf_ad_rendered fired / only enabled
         */
        if (this.adRenderModel == null) return;

        if (this.adRenderModel.visibility == "visible" && this.enabled) {
          this.show();
        } else if (
          this.adType != MarketingView.AD_TYPE_FBSA &&
          this.adType != MarketingView.AD_TYPE_INREAD &&
          this.adContainerType != MarketingView.CONTAINER_TYPE_SIDEBAR
        ) {
          this.freeze();
        }
      },
      enableView() {
        if (this.enabled) return;

        this.enabled = true;
        this.updateEnableView();
      },
      disableView() {
        if (!this.enabled) return;

        this.enabled = false;
        this.updateEnableView();
      },
      onEnabledHandler(pModel) {
        if (pModel != this.model) return; // event bubbling

        if (pModel.get("inviewEnabled") == true) {
          this.enableView();
        } else {
          this.disableView();
        }
      },
      checkHeight() {
        if (this.height != this.$adSlotContainer.height()) {
          this.height = this.$adSlotContainer.height();
          this.model.set("contentHeight", this.height);
        }
      },
      onDeviceBreakpointHandler(pModel) {
        this.breakpointDeviceModel = pModel;
        this.currentBreakpoint = this.breakpointDeviceModel.id;

        if (!this.isAllowedToWrite()) return;

        this.hide();
      },
      isAllowedToWrite() {
        if (
          this.adType == MarketingView.AD_TYPE_FBSA ||
          this.adType == MarketingView.AD_TYPE_INREAD
        ) {
          return false;
        }

        return this.enabled;
      },
      isActive() {
        if (
          this.adContainerType == MarketingView.CONTAINER_TYPE_SIDEBAR &&
          this.currentBreakpoint != "desktop"
        ) {
          return false;
        }

        return this.enabled;
      },
      show() {
        this.$el.removeClass("ad-inactive").addClass("ad-active");
        this.checkHeight();
        this.visible = true;
      },
      hide() {
        this.$el.removeClass("ad-active ad-fba").addClass("ad-inactive");
        this.adType = "";
        this.clear();
        this.removeFixHeight();
        this.visible = false;
      },
      freeze() {
        this.setFixHeight(this.getAdEntityContainer().height());
        this.clear();
      },
      clear() {
        if (this.adType == MarketingView.AD_TYPE_FBSA && this.fbaIsFilled) {
          window.ftNuke();
          this.fbaIsFilled = false;
        } else if (this.getAdTechAd().length > 0) {
          this.getAdTechAd().empty();
        }
      },
      setFixHeight(pHeight) {
        this.getAdEntityContainer().css("height", pHeight);
      },
      removeFixHeight() {
        if (
          this.getAdEntityContainer().prop("style") &&
          this.getAdEntityContainer().prop("style").height !== ""
        ) {
          this.getAdEntityContainer().css("height", "auto");
        }
      },
      getAdEntityContainer() {
        if (this.$adEntityContainer.length <= 0) {
          this.$adEntityContainer = this.$el.find(".ad-entity-container");
        }

        return this.$adEntityContainer;
      },
      getAdTechAd() {
        if (this.$adTechAd.length <= 0) {
          this.$adTechAd = this.$el.find(".adtech-factory-ad");
        }

        return this.$adTechAd;
      },
      getTargeting() {
        const tmpTargeting =
          this.getAdEntityContainer().attr("data-ad-entity-targeting") || {};
        return JSON.parse(tmpTargeting);
      },
      getAdContainerType() {
        return this.adContainerType;
      },
      setRenderedAdType(pAdType, pElement) {
        this.adType = pAdType;

        if (pAdType == MarketingView.AD_TYPE_FBSA) {
          this.$el.addClass(`ad-${MarketingView.AD_TYPE_FBSA}`);
          this.fbaIsFilled = true;

          if (pElement != undefined) {
            pElement.contentWindow.addEventListener(
              "DOMContentLoaded",
              _.bind(function(pTest) {
                this.checkHeight();
              }, this)
            );
          }
        }

        console.log("setRenderedAdType", this.adType);
      },
      setRenderModel(pAdModel) {
        this.adRenderModel = pAdModel;
        this.updateView();
      }
    },
    {
      CONTAINER_TYPE_SIDEBAR: "CONTAINER_TYPE_SIDEBAR",
      CONTAINER_TYPE_SPECIAL: "CONTAINER_TYPE_SPECIAL",
      CONTAINER_TYPE_LEADERBOARD: "CONTAINER_TYPE_LEADERBOARD",
      AD_ENTITY_TYPE_LEADERBOARD: "AD_ENTITY_TYPE_LEADERBOARD",
      AD_ENTITY_TYPE_SPECIAL: "AD_ENTITY_TYPE_SPECIAL",
      AD_TYPE_FBSA: "fba",
      AD_TYPE_INREAD: "inread"
    }
  );

  window.MarketingView =
    window.MarketingView || BurdaInfinite.views.MarketingView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
