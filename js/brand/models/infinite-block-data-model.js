(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.InfiniteBlockDataModel = BurdaInfinite.models.InfiniteBlockDataModel.extend({
        initialize: function (pAttributes, pOptions) {
            BurdaInfinite.models.InfiniteBlockDataModel.prototype.initialize.call(this, pAttributes, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
