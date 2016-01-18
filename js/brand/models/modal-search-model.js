(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.ModalSearchModel = BurdaInfinite.models.ModalSearchModel.extend({
        initialize: function (pAttributes, pOptions) {
            BurdaInfinite.models.ModalSearchModel.prototype.initialize.call(this, pAttributes, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
