(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.ProductESliderView = ProductView.extend({
    initialize: function (pOptions) {
      ProductView.prototype.initialize.call(this, pOptions);
    },
    delegateInview: function() {
      //override inview method
    }
  });

  window.ProductESliderView = window.ProductESliderView || BurdaInfinite.views.ProductESliderView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);