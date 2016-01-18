(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.BaseView = BurdaInfinite.views.base.BaseView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.base.BaseView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
