(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.AnchorNavigationView = BurdaInfinite.views.AnchorNavigationView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.AnchorNavigationView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
