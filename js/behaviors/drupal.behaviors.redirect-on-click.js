(function ($, Drupal, drupalSettings, Backbone, window) {
  Drupal.behaviors.redirectOnClick = {
    attach: function () {
      this.onClickRedirectTo('data-internal-url', false);
      this.onClickRedirectTo('data-external-url', true);
    },
    onClickRedirectTo: function (urlDataAttribute, openInNewWindow) {

      // Drupal context is not used
      // to make sure that events are always captured
      $(document).on('click', '[' + urlDataAttribute + ']', function (e) {
        let currentTarget = e.currentTarget;
        let redirectUrl = currentTarget.getAttribute(urlDataAttribute);
        let target = openInNewWindow
          ? currentTarget.getAttribute('data-target') || '_blank'
          : currentTarget.getAttribute('data-target');
        let hasTarget = !!target;

        if (hasTarget) {
          window.open(redirectUrl, target);
        } else {
          location.href = redirectUrl;
        }
      });
    }
  };
})(jQuery, Drupal, drupalSettings, Backbone, window);
