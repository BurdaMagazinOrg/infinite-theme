(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.MenuMainView = BurdaInfinite.views.MenuMainView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.MenuMainView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
