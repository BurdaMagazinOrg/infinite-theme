(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.ArticleView = BurdaInfinite.views.ArticleView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.ArticleView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
