(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

    BurdaInfinite.views.EcommerceSliderView = BaseView.extend({
        $swiperContainer: [],
        $swiperNav: [],
        swiperApi: null,
        isMobileMode: false,
        swiperNavUsage: false,
        swiperNavActive: false,
        settings: {
            loop: true,
            slidesPerView: 'auto',
            grabCursor: true
        },
        initialize: function (pOptions) {
            BaseView.prototype.initialize.call(this, pOptions);
            this.createView();
            this.updateViews();
        },
        createView: function () {
            this.$swiperContainer = this.$el.find('.swiper-container');

            _.extend(this.settings, {
                nextButton: this.$el.find('.swiper-button-next')[0],
                prevButton: this.$el.find('.swiper-button-prev')[0]
            });
        },
        updateViews: function () {
            this.swiperApi = this.$swiperContainer.swiper(this.settings);
            this.$swiperContainer.data('swiperApi', this.swiperApi);
        },
        onDeviceBreakpointHandler: function (pModel) {
            this.breakpointDeviceModel = pModel;
            this.swiperApi.reInit()
        }

    });


})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
