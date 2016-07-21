(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.GallerySlickView = BaseView.extend({
        mediaId: null,
        initialize: function (pOptions) {
            BaseView.prototype.initialize.call(this, pOptions);

            Drupal.behaviors.blazy.attach(pOptions.el.context)
            Drupal.behaviors.slick.attach(pOptions.el.context)


        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
