(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.ListSwipeableView = BurdaInfinite.views.ListSwipeableView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.ListSwipeableView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
