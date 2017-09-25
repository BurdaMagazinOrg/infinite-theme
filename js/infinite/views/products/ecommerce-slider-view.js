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

      this.swiperApi.off('onSlideChangeStart').on('onSlideChangeStart', _.bind(this.onSliderChangeHandler, this));
    },
    trackVisibleProductImpressions: function () {
      var tmpView;

      //.not('.swiper-slide-duplicate')
      this.$el.find('.swiper-slide-visible').each(function (pIndex, pItem) {
        if (typeof $(pItem).data('infiniteModel') != 'undefined') {
          tmpView = $(pItem).data('infiniteModel').get('view');

          // console.log(">>> tmpView.model.get('trackImpression')", tmpView.model.get('trackImpression'));

          if (tmpView.model.get('trackImpression') != true) {
            tmpView.trackImpression();
          }
        }
      });
    },
    onSliderChangeHandler: function (pSwiperApi) {
      this.trackVisibleProductImpressions();
    },
    onEnterHandler: function (pDirection) {
      BaseInviewView.prototype.onEnterHandler.call(this, pDirection);
      this.trackVisibleProductImpressions();
    }
    // onDeviceBreakpointHandler: function (pModel) {
    //   this.breakpointDeviceModel = pModel
    // }

  });

  window.EcommerceSliderView = window.EcommerceSliderView || BurdaInfinite.views.EcommerceSliderView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
