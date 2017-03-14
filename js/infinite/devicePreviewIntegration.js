/**
 * @file devicePreviewIntegration.js
 *
 * Integration of responsive device preview.
 */
(function ($, Drupal) {

  "use strict";

  /**
   * Attaches handlers for device preview (module: responsive_preview)
   * integration. It will hide sticky bar at top, since it covers top of device
   * preview with action elements (rotate, close).
   */
  Drupal.behaviors.devicePreviewIntegration = {
    attach: function () {
      var $document = $(document).once('infinite-device-preview-integration');

      if ($document.length) {
        $document.on('drupalResponsivePreviewStarted', function () {
          $('.sticky-wrapper').hide();
        });

        $document.on('drupalResponsivePreviewStopped', function () {
          $('.sticky-wrapper').show();
        });
      }
    }
  };

})(jQuery, Drupal);
