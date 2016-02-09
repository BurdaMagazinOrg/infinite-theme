(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.BaseSidebarModel = BurdaInfinite.models.base.BaseSidebarModel.extend({
        initialize: function (pAttributes, pOptions) {
            BurdaInfinite.models.base.BaseSidebarModel.prototype.initialize.call(this, pAttributes, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
