(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.TrackingManager = BurdaInfinite.managers.TrackingManager.extend({
        initialize: function (pOptions) {
            BurdaInfinite.managers.TrackingManager.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
