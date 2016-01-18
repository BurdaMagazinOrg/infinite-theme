(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.MarketingView = BurdaInfinite.views.MarketingView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.MarketingView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
