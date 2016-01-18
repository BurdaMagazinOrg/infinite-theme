(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.DeviceModel = BurdaInfinite.models.DeviceModel.extend({
        initialize: function (pAttributes, pOptions) {
            BurdaInfinite.models.DeviceModel.prototype.initialize.call(this, pAttributes, pOptions);
        }
    });


})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
