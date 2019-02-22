(function($, Drupal, drupalSettings, Backbone, window) {
  Drupal.behaviors.redirectOnClick = {
    attach: function() {
      this.onClickRedirectTo('data-internal-url', false);
      this.onClickRedirectTo('data-external-url', true);
    },
    onClickRedirectTo: function(urlDataAttribute, openInNewWindow) {
      // Drupal context is not used
      // to make sure that events are always captured
      $(document)
        .off('click.redirect', '[' + urlDataAttribute + ']')
        .on('click.redirect', '[' + urlDataAttribute + ']', function(e) {
          // If an actual link is clicked inside of the container
          // we want this to still work
          if (e.target.tagName.toUpperCase() === 'A') {
            return;
          }

          const currentTarget = e.currentTarget;
          const redirectUrl = currentTarget.getAttribute(urlDataAttribute);
          const target = openInNewWindow
            ? currentTarget.getAttribute('data-target') || '_blank'
            : currentTarget.getAttribute('data-target');
          const hasTarget = !!target;

          if(/^https?:\/\/(?:www\.)?tipser\.com/.test(redirectUrl)) return;

          if (hasTarget) {
            window.open(redirectUrl, target);
          } else {
            location.href = redirectUrl;
          }
        });
    },
  };
})(jQuery, Drupal, drupalSettings, Backbone, window);
