(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.GalleryView = BurdaInfinite.views.GalleryView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.GalleryView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
