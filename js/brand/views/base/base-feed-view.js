(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.BaseFeedView = BurdaInfinite.views.base.BaseFeedView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.base.BaseFeedView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
