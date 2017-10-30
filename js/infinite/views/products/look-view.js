(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.products.LookView = BaseView.extend({
    $hotspots: [],
    initialize: function (pOptions) {
      BaseView.prototype.initialize.call(this, pOptions);

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
            $tmpOriginalWidget = [];


          $tmpOriginalWidget = $that.$el.find('.imagepin-widgets [data-imagepin-key="' + tmpWidgetId + '"]');
          console.log(tmpWidgetId, $tmpOriginalWidget, $tmpOriginalWidget.find('.item-ecommerce').data('infiniteModel'));
        });
      });
    }
  });

  window.LookView = window.LookView || BurdaInfinite.views.products.LookView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);