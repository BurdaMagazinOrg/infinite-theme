(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.products.LookView = BaseDynamicView.extend({
    $hotspots: [],
    blazy: null,
    trackedProducts: [],
    initialize: function (pOptions) {
      BaseDynamicView.prototype.initialize.call(this, pOptions);

      this.createView();
      this.init();
    },
    createView: function () {
      this.$hotspots = this.$el.find('.imagepin');

      if (typeof Blazy !== 'undefined') {
        this.blazy = new Blazy();
      }
    },
    init: function () {
      var that = this;

      $.each(this.$hotspots, function () {
        $(this).on('overlay:show', function (evt, currentPin) {
          var imagePinId = currentPin.data('imagepin-key');
          var imagePinData = currentPin.find('.item-ecommerce').data('infiniteModel');
          var imagePinDataView = imagePinData.get('view');
          var basicTrackingData = imagePinData.get('enhancedEcommerce');
          var additionalTrackingData = imagePinDataView.advancedTrackingData;

          if (typeof TrackingManager !== 'undefined') {
            if (that.trackedProducts.indexOf(imagePinId) === -1) {
              that.trackedProducts.push(imagePinId);
              TrackingManager.trackEcommerce(basicTrackingData, 'impressions',  additionalTrackingData);
            }
          }

          // Lazyload images
          if (that.blazy != null) {
            var $pinImages = currentPin.find('img');

            $.each($pinImages, function (index, imageItem) {
              that.blazy.load(imageItem);
            });
          }
        });
      });
    }
  });

  window.LookView = window.LookView || BurdaInfinite.views.products.LookView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
