(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.ProductView = BaseInviewView.extend({
    initialize: function (pOptions) {
      BaseInviewView.prototype.initialize.call(this, pOptions);

      //activate inview functions
      BaseInviewView.prototype.delegateInview.call(this);
    },
    onEnterHandler: function (pDirection) {
      BaseInviewView.prototype.onEnterHandler.call(this, pDirection);
      console.log("ON ENTER");
    }
  });

  window.ProductView = window.ProductView || BurdaInfinite.views.ProductView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);