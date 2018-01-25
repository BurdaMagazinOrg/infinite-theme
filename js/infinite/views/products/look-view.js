(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.products.LookView = BaseDynamicView.extend({
    $hotspots: [],
    blazy: null,
    initialize: function (pOptions) {
      BaseDynamicView.prototype.initialize.call(this, pOptions);

      this.createView();
      this.init();
    },
    createView: function () {
      this.$hotspots = this.$el.find('.imagepin');

      if (typeof Blazy != 'undefined') {
        this.blazy = new Blazy();
      }
    },
    init: function () {
      var $that = this;

      $.each(this.$hotspots, function () {
        $(this).bind('overlay:show', function (pEvent, $pOverlay) {
          var tmpWidgetId = $pOverlay.data('imagepin-key'),
              $tmpOriginalWidget = [],
              $tmpOriginalProduct = [],
              $tmpImages = $pOverlay.find('img'),
              tmpView,
              tmpInfiniteModel;

          $tmpOriginalWidget = $that.$el.find('.imagepin-widgets [data-imagepin-key="' + tmpWidgetId + '"]');
          $tmpOriginalProduct = $tmpOriginalWidget.find('.item-ecommerce');

          $.each($tmpOriginalProduct, function (index, element) {

            var $targetElement = $tmpOriginalProduct.eq(index);
            tmpInfiniteModel = $targetElement.data('infiniteModel');

            /**
             * get model and track impression
             */
            if (typeof tmpInfiniteModel != "undefined") {
              tmpView = $targetElement.data('infiniteModel').get('view');
              if ($targetElement.data('trackImpression') != true) {
                $targetElement.data('trackImpression', true);
                tmpView.trackImpression();
              }
            }

          });


          /**
           * Load blazy shizzl
           */
          if ($that.blazy != null) {
            $.each($tmpImages, function (pIndex, pImageItem) {
              $that.blazy.load(pImageItem);
            });
          }
        });
      });
    }
  });

  window.LookView = window.LookView || BurdaInfinite.views.products.LookView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);