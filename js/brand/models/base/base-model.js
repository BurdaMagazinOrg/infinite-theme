(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.BaseModel = BurdaInfinite.models.base.BaseModel.extend({
        initialize: function (pAttributes, pOptions) {
            BurdaInfinite.models.base.BaseModel.prototype.initialize.call(this, pAttributes, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);