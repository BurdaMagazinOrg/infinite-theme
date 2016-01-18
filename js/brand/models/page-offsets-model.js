(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.PageOffsetsModel = BurdaInfinite.models.PageOffsetsModel.extend({
        initialize: function (pAttributes, pOptions) {
            BurdaInfinite.models.PageOffsetsModel.prototype.initialize.call(this, pAttributes, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
