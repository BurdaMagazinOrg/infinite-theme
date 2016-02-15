(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.ListSwipeableView = BaseView.extend({
        $swiperContainer: [],
        swiperApi: null,
        isMobileMode: false,
        settings: {
            selector: '.region-teaser-list-horizontal',
            slidesPerView: 'auto',
            wrapperClass: 'teaser-list',
            slideClass: 'teaser',
            grabCursor: true
        },
        initialize: function (pOptions) {
            BaseView.prototype.initialize.call(this, pOptions);

            this.createView();

            if (!_.isUndefined(this.deviceModel) && this.deviceModel.isActive) {
                this.onDeviceBreakpointHandler(this.deviceModel.getDeviceBreakpoints().findWhere({active: true}));
                this.listenTo(this.deviceModel.getDeviceBreakpoints(), 'change:active', this.onDeviceBreakpointHandler, this);
            }
        },
        createView: function () {
            this.$swiperContainer = this.$el.find('.container-content')
        },
        updateViews: function () {
            this.swiperApi = this.$swiperContainer.swiper(this.settings);
            this.$swiperContainer.data('swiperApi', this.swiperApi);
        },
        removeSwiper: function () {
            this.$swiperContainer.data('swiperApi').destroy(true, true);
            this.$swiperContainer.removeData('swiperApi');
        },
        onDeviceBreakpointHandler: function (pModel) {
            this.breakpointDeviceModel = pModel;

            if (pModel.id == 'smartphone' && this.isMobileMode == false) {
                this.isMobileMode = true;
                this.updateViews();
            } else if (pModel.id != 'smartphone' && this.isMobileMode) {
                this.isMobileMode = false;
                this.removeSwiper();
            }
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
