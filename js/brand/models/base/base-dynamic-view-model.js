(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.BaseDynamicViewModel = BurdaInfinite.models.base.BaseDynamicViewModel.extend({
        initialize: function (pAttributes, pOptions) {
            BurdaInfinite.models.base.BaseDynamicViewModel.prototype.initialize.call(this, pAttributes, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);