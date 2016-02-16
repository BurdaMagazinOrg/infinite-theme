(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.BaseListSwipeableView = BurdaInfinite.views.base.BaseListSwipeableView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.base.BaseListSwipeableView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
