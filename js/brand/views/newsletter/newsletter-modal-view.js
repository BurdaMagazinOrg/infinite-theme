(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  window.NewsletterModalView = BurdaInfinite.views.newsletter.NewsletterModalView.extend({
    initialize: function (pOptions) {
      BurdaInfinite.views.newsletter.NewsletterModalView.prototype.initialize.call(this, pOptions);
    }
  });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
