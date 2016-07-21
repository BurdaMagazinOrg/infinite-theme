(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.GallerySlickView = BurdaInfinite.views.GallerySlickView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.GallerySlickView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
