(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.EcommerceSliderView = BaseDynamicView.extend({
    $swiperContainer: [],
    swiperApi: null,
    // deviceModel: null,
    // breakpointDeviceModel: null,
    // currentBreakpoint: null,
    settings: {
      loop: true,
      slidesPerView: 'auto',
      grabCursor: true,
      watchSlidesVisibility: true
    },
    initialize: function (pOptions) {
      BaseDynamicView.prototype.initialize.call(this, pOptions);
      this.createView();
      this.updateView();
      this.delegateInview();
      this.duplicateElementClick();

      // this.deviceModel = BM.reuseModel(ModelIds.deviceModel);
      // this.breakpointDeviceModel = this.deviceModel.getDeviceBreakpoints().findWhere({active: true});
      // this.currentBreakpoint = this.breakpointDeviceModel.id;
      // this.listenTo(this.deviceModel.getDeviceBreakpoints(), 'change:active', this.onDeviceBreakpointHandler, this);
    },
    createView: function () {
      this.$swiperContainer = this.$el.find('.swiper-container');

      _.extend(this.settings, {
        nextButton: this.$el.find('.swiper-button-next')[0],
        prevButton: this.$el.find('.swiper-button-prev')[0]
      });
    },
    updateView: function () {
      this.swiperApi = this.$swiperContainer.swiper(this.settings);
      this.$swiperContainer.data('swiperApi', this.swiperApi);

      this.swiperApi.off('onSlideChangeEnd').on('onSlideChangeEnd', _.bind(this.onSliderChangeHandler, this));
      this.swiperApi.off('onTouchEnd').on('onTouchEnd', _.bind(this.onSliderChangeHandler, this));
    },
    trackVisibleProductImpressions: function () {
      var tmpView,
        tmpExternalURL = "",
        $tmpElement = [];

      //.not('.swiper-slide-duplicate')
      this.$el.find('.swiper-slide-visible').each(_.bind(function (pIndex, pItem) {
        $tmpElement = $(pItem);

        /**
         * search original element
         */
        if ($tmpElement.hasClass('swiper-slide-duplicate')) {
          tmpExternalURL = $tmpElement.data('external-url');
          $tmpElement = this.$el.find("[data-external-url='" + tmpExternalURL + "']").not('.swiper-slide-duplicate');
        }

        /**
         * get model and track impression
         */
        if (typeof $tmpElement.data('infiniteModel') != 'undefined') {
          tmpView = $tmpElement.data('infiniteModel').get('view');

          if (tmpView.model.get('trackImpression') != true) {
            tmpView.trackImpression();
          }
        }

      }, this));
    },
    duplicateElementClick: function () {
      var $tmpElement = [],
        tmpExternalURL = "",
        tmpView;

      this.$el.find('.swiper-slide-duplicate').each(_.bind(function (pIndex, pItem) {

        $(pItem).unbind('click.enhanced_ecommerce').bind('click.enhanced_ecommerce', _.bind(function (pEvent) {
          $tmpElement = $(pEvent.currentTarget);
          tmpExternalURL = $tmpElement.data('external-url');

          /**
           * search original element
           */
          $tmpElement = this.$el.find("[data-external-url='" + tmpExternalURL + "']").not('.swiper-slide-duplicate');

          /**
           * get model and track impression
           */
          if (typeof $tmpElement.data('infiniteModel') != 'undefined') {
            tmpView = $tmpElement.data('infiniteModel').get('view');
            tmpView.trackProductClick();
          }
        }, this));


      }, this));
    },
    onSliderChangeHandler: function (pSwiperApi) {
      this.trackVisibleProductImpressions();
    },
    onEnterHandler: function (pDirection) {
      BaseInviewView.prototype.onEnterHandler.call(this, pDirection);
      this.trackVisibleProductImpressions();
    }

  });

  window.EcommerceSliderView = window.EcommerceSliderView || BurdaInfinite.views.EcommerceSliderView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
