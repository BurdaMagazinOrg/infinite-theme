(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.AjaxModel = BurdaInfinite.models.AjaxModel.extend({
        initialize: function (pAttributes, pOptions) {
            BurdaInfinite.models.AjaxModel.prototype.initialize.call(this, pAttributes, pOptions);
        }
    });


})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
