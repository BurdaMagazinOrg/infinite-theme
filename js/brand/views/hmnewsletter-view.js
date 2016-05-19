(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  window.HmNewsletterView = BurdaInfinite.views.HmNewsletterView.extend({
    initialize: function (pOptions) {
      BurdaInfinite.views.HmNewsletterView.prototype.initialize.call(this, pOptions);
    }
  });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
