(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.ScrollManager = BurdaInfinite.managers.ScrollManager.extend({
        initialize: function (pOptions) {
            BurdaInfinite.managers.ScrollManager.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
