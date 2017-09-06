(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.ProductsView = BaseView.extend({
    $products: [],
    $productHeadlines: [],
    initialize: function (pOptions) {
      BaseView.prototype.initialize.call(this, pOptions);
    }
  });

  window.ProductsView = window.ProductsView || BurdaInfinite.views.ProductsView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);