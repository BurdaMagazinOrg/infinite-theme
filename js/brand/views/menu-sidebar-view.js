(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.MenuSidebarView = BurdaInfinite.views.MenuSidebarView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.MenuSidebarView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
