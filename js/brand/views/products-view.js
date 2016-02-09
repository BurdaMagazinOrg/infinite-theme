(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.ProductsView = BurdaInfinite.views.ProductsView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.ProductsView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
