(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.AdscModel = BurdaInfinite.models.AdscModel.extend({
        initialize: function (pAttributes, pOptions) {
            BurdaInfinite.models.AdscModel.prototype.initialize.call(this, pAttributes, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
