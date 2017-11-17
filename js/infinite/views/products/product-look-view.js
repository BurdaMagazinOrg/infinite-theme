(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.products.ProductLookView = ProductView.extend({
    initialize: function (pOptions) {
      ProductView.prototype.initialize.call(this, pOptions);
    },
    delegateInview: function () {

    },
    createModel: function () {
      ProductView.prototype.createModel.call(this);

      this.model.set('componentType', 'look');
    }
  });

  window.ProductLookView = window.ProductLookView || BurdaInfinite.views.products.ProductLookView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
