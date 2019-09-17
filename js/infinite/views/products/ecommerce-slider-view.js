(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.products.EcommerceSliderView = BaseDynamicView.extend({
    $swiperContainer: [],
    swiperApi: null,
    mutationObserver: null,
    settings: {
      loop: true,
      slidesPerView: 'auto',
      grabCursor: true,
      watchSlidesVisibility: true,
      preloadImages: false,
      lazy: {
        loadOnTransitionStart: true
      }
    },
    reInit: null,
    initialize: function(pOptions) {
      BaseDynamicView.prototype.initialize.call(this, pOptions);
      this.createView();
      this.updateView();
      this.checkProducts();

      this.reInit = function() {
        this.updateView();
      };
    },
    checkProducts: function() {
      var productAvailable = !!this.$el[0].querySelector(
        '.item-product-slider'
      );

      if (productAvailable) {
        this.productsAvailable();
      } else {
        var config = { childList: true };
        var target = this.$el[0].querySelector('.swiper-wrapper');
        this.mutationObserver = new MutationObserver(
          this.mustacheRendered.bind(this)
        );
        this.mutationObserver.observe(target, config);
      }
    },
    mustacheRendered: function() {
      this.productsAvailable();
      !!this.mutationObserver && this.mutationObserver.disconnect();
    },
    createView: function() {
      this.$swiperContainer = this.$el.find('.swiper-container');
      this.$el.find('.swiper-button-prev').click(this.slidePrev.bind(this));
      this.$el.find('.swiper-button-next').click(this.slideNext.bind(this));

      if (this.$el.attr('data-slider') !== 'undefined') {
        const $dataSlider = JSON.parse(this.$el.attr('data-slider'));
        _.extend(this.settings, $dataSlider);
      }
    },
    slidePrev: function() {
      !!this.swiperApi && this.swiperApi.slidePrev();
    },
    slideNext: function() {
      !!this.swiperApi && this.swiperApi.slideNext();
    },
    updateView: function() {
      if (!!this.swiperApi) this.swiperApi.destroy();

      this.swiperApi = new Swiper(this.$swiperContainer[0], this.settings);
      this.$swiperContainer.data('swiperApi', this.swiperApi);
      this.model.set('swiperApi', this.swiperApi);
      this.swiperApi
        .off('slideChangeTransitionEnd')
        .on('slideChangeTransitionEnd', this.onSliderChangeHandler.bind(this));
    },
    productsAvailable: function() {
      this.delegateInview();
      this.duplicateElementClick();
    },
    trackVisibleProductImpressions: function() {
      let tmpView;
      let tmpExternalURL = '';
      let $tmpElement = [];

      // .not('.swiper-slide-duplicate')
      this.$el.find('.swiper-slide-visible').each(
        _.bind(function(pIndex, pItem) {
          $tmpElement = $(pItem);

          /**
           * search original element
           */
          if ($tmpElement.hasClass('swiper-slide-duplicate')) {
            tmpExternalURL = $tmpElement.data('external-url');
            $tmpElement = this.$el
              .find("[data-external-url='" + tmpExternalURL + "']")
              .not('.swiper-slide-duplicate');
          }

          /**
           * get model and track impression
           */
          if (typeof $tmpElement.data('infiniteModel') !== 'undefined') {
            tmpView = $tmpElement.data('infiniteModel').get('view');

            if (
              tmpView.model.get('disabled') != true &&
              tmpView.model.get('trackImpression') != true
            ) {
              tmpView.trackImpression();
            }
          }
        }, this)
      );
    },
    duplicateElementClick: function() {
      let $tmpElement = [];
      let tmpExternalURL = '';
      let tmpView;

      this.$el.find('.swiper-slide-duplicate').each(
        _.bind(function(pIndex, pItem) {
          $(pItem)
            .unbind('click.enhanced_ecommerce')
            .bind(
              'click.enhanced_ecommerce',
              _.bind(function(pEvent) {
                $tmpElement = $(pEvent.currentTarget);
                tmpExternalURL = $tmpElement.data('external-url');

                /**
                 * search original element
                 */
                $tmpElement = this.$el
                  .find("[data-external-url='" + tmpExternalURL + "']")
                  .not('.swiper-slide-duplicate');

                /**
                 * get model and track impression
                 */
                if (typeof $tmpElement.data('infiniteModel') !== 'undefined') {
                  tmpView = $tmpElement.data('infiniteModel').get('view');
                  tmpView.trackProductClick();
                }
              }, this)
            );
        }, this)
      );
    },
    onSliderChangeHandler: function(pSwiperApi) {
      this.trackVisibleProductImpressions();
    },
    onEnterHandler: function(pDirection) {
      BaseInviewView.prototype.onEnterHandler.call(this, pDirection);
      this.trackVisibleProductImpressions();
    }
  });

  window.EcommerceSliderView =
    window.EcommerceSliderView ||
    BurdaInfinite.views.products.EcommerceSliderView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
