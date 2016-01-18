(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.SpinnerCubeView = BurdaInfinite.views.SpinnerCubeView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.SpinnerCubeView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
