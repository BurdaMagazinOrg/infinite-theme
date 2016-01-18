(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.BaseNewsletterView = BurdaInfinite.views.base.BaseNewsletterView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.base.BaseNewsletterView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
