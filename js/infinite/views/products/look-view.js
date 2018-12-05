(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.products.LookView = BaseDynamicView.extend({
    $hotspots: [],
    blazy: null,
    trackedProducts: [],
    initialize(pOptions) {
      BaseDynamicView.prototype.initialize.call(this, pOptions);

      this.createView();
      this.init();
    },
    createView() {
      this.$hotspots = this.$el.find('.imagepin');

      if (typeof Blazy !== 'undefined') {
        this.blazy = new Blazy();
      }
    },
    init() {
      const that = this;

      $.each(this.$hotspots, function() {
        $(this).on('overlay:show', (evt, currentPin) => {
          const imagePinId = currentPin.data('imagepin-key');
          const imagePinData = currentPin
            .find('.item-ecommerce')
            .data('infiniteModel');
          const imagePinDataView = imagePinData.get('view');
          const basicTrackingData = imagePinData.get('enhancedEcommerce');
          const additionalTrackingData = imagePinDataView.advancedTrackingData;

          if (typeof TrackingManager !== 'undefined') {
            if (that.trackedProducts.indexOf(imagePinId) === -1) {
              that.trackedProducts.push(imagePinId);
              TrackingManager.trackEcommerce(
                basicTrackingData,
                'impressions',
                additionalTrackingData
              );
            }
          }

          // Lazyload images
          if (that.blazy != null) {
            const $pinImages = currentPin.find('img');

            $.each($pinImages, (index, imageItem) => {
              that.blazy.load(imageItem);
            });
          }
        });
      });
    },
  });

  window.LookView = window.LookView || BurdaInfinite.views.products.LookView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
