(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.StickyView = BurdaInfinite.views.StickyView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.StickyView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
