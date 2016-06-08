(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  window.HmNewsletterView = BurdaInfinite.views.newsletter.HmNewsletterView.extend({
    initialize: function (pOptions) {
      BurdaInfinite.views.newsletter.HmNewsletterView.prototype.initialize.call(this, pOptions);
    }
  });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
