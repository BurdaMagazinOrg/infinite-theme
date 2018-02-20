import BaseView from '../base/base-view'

"use strict";

BurdaInfinite.views.newsletter.HmNewsletterView = BaseView.extend({
  initialize: function (pOptions) {
    Drupal.behaviors.hmNewsletter.attach(pOptions.el.context)

    pOptions.el.on('newsletter:success', function (event) {
      if (typeof TrackingManager != 'undefined') {
        TrackingManager.trackEvent({
          category: 'newsletter',
          action: 'success',
          'eventNonInteraction': 'false'
        }, TrackingManager.getAdvTrackingByElement(this.$el));
      }
    })
    pOptions.el.on('newsletter:error', function (event) {
      if (typeof TrackingManager != 'undefined') {
        TrackingManager.trackEvent({
          category: 'newsletter',
          action: 'error',
          'eventNonInteraction': 'false'
        }, TrackingManager.getAdvTrackingByElement(this.$el));
      }
    })
  }
});

export default BurdaInfinite.views.newsletter.HmNewsletterView;
