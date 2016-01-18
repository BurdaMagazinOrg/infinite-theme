(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.ModalSearchView = BurdaInfinite.views.ModalSearchView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.ModalSearchView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
