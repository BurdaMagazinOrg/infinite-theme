(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.SidebarModel = BurdaInfinite.models.SidebarModel.extend({
        initialize: function (pAttributes, pOptions) {
            BurdaInfinite.models.SidebarModel.prototype.initialize.call(this, pAttributes, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
