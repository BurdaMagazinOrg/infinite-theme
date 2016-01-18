(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.MainView = BurdaInfinite.views.MainView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.MainView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
