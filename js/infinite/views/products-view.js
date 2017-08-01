(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.ProductsView = BaseView.extend({
    $products: [],
    $productHeadlines: [],
    initialize: function (pOptions) {
      BaseView.prototype.initialize.call(this, pOptions);
    }
  });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);