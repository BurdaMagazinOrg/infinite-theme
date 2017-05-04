(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.base.BaseListSwipeableView = BaseView.extend({
        $swiperContainer: [],
        $swiperNav: [],
        swiperApi: null,
        isMobileMode: false,
        swiperNavUsage: false,
        swiperNavActive: false,
        settings: {
            selector: '.swipeable--horizontal',
            slidesPerView: 'auto',
            wrapperClass: 'swipeable__wrapper',
            slideClass: 'swipeable__item',
            grabCursor: true
        },
        initialize: function (pOptions) {
            BaseView.prototype.initialize.call(this, pOptions);

            //init slide navi
            this.$swiperNav = this.$el.find('.swiper-navigation');
            if (this.$swiperNav.length > 0) {
                this.swiperNavUsage = true;
                _.extend(this.settings, {
                    nextButton: this.$swiperNav.find('.swiper-button-next')[0],
                    prevButton: this.$swiperNav.find('.swiper-button-prev')[0]
                });
            }

            this.createView();

            if (this.deviceModel != undefined && this.deviceModel.get('isActive')) {
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

            if (this.isMobileMode) {
                this.enableMobileMode();
            } else {
                this.disableMobileMode();
            }
        },
        enableMobileMode: function () {
            if (Blazy == undefined) return;

            this.swiperApi.on('onSlideChangeStart', function (pSwiperApi) {
                var tmpIndex = Math.min(pSwiperApi.activeIndex + 1, pSwiperApi.slides.length),
                    $tmpSlide = $(pSwiperApi.slides[tmpIndex]).find('.b-lazy'),
                    tmpBlazy;

                if (!$tmpSlide.hasClass('b-loaded')) {
                    tmpBlazy = new Blazy();
                    tmpBlazy.load($tmpSlide[0]);
                }

            });
        },
        disableMobileMode: function () {
            if (Blazy == undefined) return;

            this.swiperApi.off('slideChangeStart');
        },
        removeSwiper: function () {
            this.$swiperContainer.data('swiperApi').destroy(true, true);
            this.$swiperContainer.removeData('swiperApi');
        },
        onDeviceBreakpointHandler: function (pModel) {
            this.breakpointDeviceModel = pModel;

            if (pModel.id == 'smartphone' && this.isMobileMode == false) {

                if (this.swiperNavUsage) this.swiperNavActive = true;
                this.isMobileMode = true;

                this.updateViews();
            } else if (pModel.id != 'smartphone' && this.isMobileMode) {

                if (this.swiperNavUsage) this.swiperNavActive = false;
                this.isMobileMode = false;

                this.removeSwiper();
            }
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
