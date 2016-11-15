(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.newsletter.HmNewsletterView = BaseView.extend({
    initialize: function (pOptions) {
      Drupal.behaviors.hmNewsletter.attach(pOptions.el.context)
      
      pOptions.el.on('newsletter:success', function(event) {
        if(typeof TrackingManager != 'undefined') {
          TrackingManager.trackEvent({category: 'newsletter', action: 'success'}, TrackingManager.getAdvTrackingByElement(this.$el));
        }
      })
      pOptions.el.on('newsletter:error', function(event) {
        if (typeof TrackingManager != 'undefined') {
          TrackingManager.trackEvent({category: 'newsletter', action: 'error'}, TrackingManager.getAdvTrackingByElement(this.$el));
        }
      })
    }
  });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
