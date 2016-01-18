(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.BaseDynamicView = BurdaInfinite.views.base.BaseDynamicView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.base.BaseDynamicView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
