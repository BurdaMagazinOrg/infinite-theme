(function ($, Drupal, drupalSettings, Backbone, window) {
  Drupal.behaviors.redirectOnClick = {
    attach: function () {
      this.onClickRedirectTo('[data-internal-url]', false);
      this.onClickRedirectTo('[data-external-url]', true);
    },
    onClickRedirectTo: function (urlDataAttribute, openInNewWindow) {

      // Drupal context is not used
      // to make sure that events are always captured
      $(document).on('click', urlDataAttribute, function (e) {
        let currentTarget = e.currentTarget;
        let internalURL = currentTarget.getAttribute('data-internal-url');
        let target = openInNewWindow
          ? currentTarget.getAttribute('data-target') || '_blank'
          : currentTarget.getAttribute('data-target');
        let hasTarget = !!target;

        if (hasTarget) {
          window.open(internalURL, target);
        } else {
          location.href = internalURL;
        }
      });
    }
  };
})(jQuery, Drupal, drupalSettings, Backbone, window);
