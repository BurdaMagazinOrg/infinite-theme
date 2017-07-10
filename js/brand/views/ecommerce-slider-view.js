(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.EcommerceSliderView = BurdaInfinite.views.EcommerceSliderView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.EcommerceSliderView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
