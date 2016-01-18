(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.InfiniteBlockView = BurdaInfinite.views.InfiniteBlockView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.InfiniteBlockView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
