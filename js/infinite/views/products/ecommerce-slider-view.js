(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.products.EcommerceSliderView = BaseDynamicView.extend({
    $swiperContainer: [],
    swiperApi: null,
    settings: {
      loop: true,
      slidesPerView: 'auto',
      grabCursor: true,
      watchSlidesVisibility: true,
      preloadImages: false,
      lazy: {
        loadOnTransitionStart: true,
      },
    },
    initialize: function(pOptions) {
      BaseDynamicView.prototype.initialize.call(this, pOptions);
      this.createView();
      this.updateView();
      this.delegateInview();
      this.duplicateElementClick();
    },
    createView: function() {
      this.$swiperContainer = this.$el.find('.swiper-container');

      _.extend(this.settings, {
        navigation: {
          nextEl: this.$el.find('.swiper-button-next')[0],
          prevEl: this.$el.find('.swiper-button-prev')[0],
        },
      });

      if (this.$el.attr('data-slider') !== 'undefined') {
        const $dataSlider = JSON.parse(this.$el.attr('data-slider'));
        _.extend(this.settings, $dataSlider);
      }
    },
    updateView: function() {
      this.swiperApi = new Swiper(this.$swiperContainer[0], this.settings);
      this.$swiperContainer.data('swiperApi', this.swiperApi);
      this.swiperApi
        .off('slideChangeTransitionEnd')
        .on('slideChangeTransitionEnd', this.onSliderChangeHandler.bind(this));
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
    },
  });

  window.EcommerceSliderView =
    window.EcommerceSliderView ||
    BurdaInfinite.views.products.EcommerceSliderView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
