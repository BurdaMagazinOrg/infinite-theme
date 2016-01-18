(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.BaseCollectionModel = BurdaInfinite.models.base.BaseCollectionModel.extend({
        initialize: function (pAttributes, pOptions) {
            BurdaInfinite.models.base.BaseCollectionModel.prototype.initialize.call(this, pAttributes, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
