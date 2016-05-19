(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.GalleryView = BaseView.extend({
        mediaId: null,
        initialize: function (pOptions) {
            BaseView.prototype.initialize.call(this, pOptions);

            this.mediaId = this.$el.data('media-id').toString();
            this.createView();
        },
        createView: function () {
            var $tmpSwiper = this.$el.find('.gallery-container').swiper({
                speed: parseInt($.browser.version, 10) <= 9 ? 0 : 350,
                keyboardControl: false,
                loop: true,
                spaceBetween: 10,
                lazyLoading: false,
                lazyLoadingInPrevNext: true,
                lazyLoadingOnTransitionStart: true,
                preloadImages: true,
                setWrapperSize: true,
                runCallbacksOnInit: false,
                grabCursor: true,
                onSlideChangeStart: $.proxy(function (pSwiper, pEvent) {
                    var tmpCurrentIndex = this.getCurrentIndex(pSwiper);
                    this.el.find('.text-item-count span').text(tmpCurrentIndex);
                    this.resizeContent(pSwiper);

                    if (typeof TrackingManager != 'undefined') {
                        TrackingManager.trackIVW();
                        TrackingManager.trackPageView(Backbone.history.location.pathname + '/gallery_' + this.mediaId);
                        TrackingManager.trackEvent({
                            category: 'click',
                            action: 'gallery',
                            label: this.mediaId
                        });
                    }
                }, this)
            });


            this.updateSocials(this.$el.find('.swiper-slide-duplicate'));
            this.resizeContent($tmpSwiper);
            this.fitImages($tmpSwiper);

            $(window).on('resize', $.proxy(function (pEvent) {
                _.delay(_.bind(function () {
                    this.resizeContent($tmpSwiper);
                    this.fitImages($tmpSwiper);
                }, this), 10);
            }, this));

            this.$el.data('api', $tmpSwiper);
            this.$el.find('.swiper-button-prev').on('click', function () {
                $tmpSwiper.slidePrev();
            });
            this.$el.find('.swiper-button-next').on('click', function () {
                $tmpSwiper.slideNext();
            });
        },
        getCurrentIndex: function (pSwiperApi) {
            var tmpSliderItems = $(pSwiperApi.container).find('.swiper-slide').not('.swiper-slide-duplicate'),
                tmpActiveSlide = pSwiperApi.activeIndex;

            if (tmpActiveSlide > tmpSliderItems.length) {
                tmpActiveSlide = Math.abs(tmpSliderItems.length - tmpActiveSlide);
            } else if (tmpActiveSlide == 0) {
                tmpActiveSlide = tmpSliderItems.length;
            }

            return Math.max(1, tmpActiveSlide - tmpSliderItems.slice(0, tmpActiveSlide).filter('.ads-container-gallery').length);
        },
        resizeContent: function (pSwiper) {
            var $tmpContainer = $(pSwiper.container),
                $tmpGalleryWrapper = $tmpContainer.find('.swiper-wrapper'),
                $tmpCurrentElement = $tmpGalleryWrapper.find('.swiper-slide-active'),
                tmpHeight = $tmpCurrentElement.find('.img-container').outerHeight(true) + $tmpCurrentElement.find('.caption').outerHeight(true);

            //todo check if still relevant (orientation change bug)
            $tmpGalleryWrapper.height(tmpHeight);
            $tmpContainer.height($tmpGalleryWrapper.position().top + tmpHeight);
        },
        fitImages: function (pSwiper) {
            //orientation render bug :(
            //if ($.browser.chrome || $.browser.android) {
            this.$el.find('img').height(this.$el.find('.img-container').eq(0).outerHeight(true));
            //}
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
