(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.products.LookView = BaseDynamicView.extend({
    $hotspots: [],
    initialize: function (pOptions) {
      BaseDynamicView.prototype.initialize.call(this, pOptions);

      console.log("CREATE");

      this.createView();
      this.init();
    },
    createView: function () {
      this.$hotspots = this.$el.find('.imagepin');

      console.log(">>> this.$hotspots", this.$hotspots);
    },
    init: function () {
      var $that = this;

      $.each(this.$hotspots, function () {
        $(this).bind('overlay:show', function (pEvent, $pOverlay) {
          var tmpWidgetId = $pOverlay.data('imagepin-key'),
            $tmpOriginalWidget = [],
            $tmpOriginalProduct = [],
            tmpView,
            tmpInfiniteModel;

          $tmpOriginalWidget = $that.$el.find('.imagepin-widgets [data-imagepin-key="' + tmpWidgetId + '"]');
          $tmpOriginalProduct = $tmpOriginalWidget.find('.item-ecommerce');
          tmpInfiniteModel = $tmpOriginalProduct.data('infiniteModel');

          /**
           * get model and track impression
           */
          if (typeof tmpInfiniteModel != "undefined") {
            tmpView = $tmpOriginalProduct.data('infiniteModel').get('view');
            if ($tmpOriginalProduct.data('trackImpression') != true) {
              $tmpOriginalProduct.data('trackImpression', true);
              tmpView.trackImpression();
            }
          }
        });
      });
    }
  });

  window.LookView = window.LookView || BurdaInfinite.views.products.LookView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);