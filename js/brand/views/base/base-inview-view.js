(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    window.BaseInviewView = BurdaInfinite.views.base.BaseInviewView.extend({
        initialize: function (pOptions) {
            BurdaInfinite.views.base.BaseInviewView.prototype.initialize.call(this, pOptions);
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
