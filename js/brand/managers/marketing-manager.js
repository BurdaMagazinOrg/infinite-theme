(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.MarketingManager = BurdaInfinite.managers.MarketingManager.extend({
        initialize: function (pOptions) {
            BurdaInfinite.managers.MarketingManager.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
