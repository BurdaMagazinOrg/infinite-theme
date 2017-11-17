(function ($, Drupal, drupalSettings, Backbone, window) {

  "use strict";

  window.BurdaInfinite = {
    views: {
      base: {},
      products: {},
      newsletter: {}
    },
    utils: {},
    managers: {},
    models: {
      base: {}
    }
  };

  Drupal.behaviors.burdaInfinite = {
    attach: function (context) {
      var $context = $(context);

      $('body').once(ViewIds.mainView).each(function () {
        var mainView = new MainView({el: $context, id: ViewIds.mainView});
        BM.reuseView(ViewIds.mainView, mainView);
      });
    }
  };

  window.addEventListener('acquiaLiftDecision', function(e) {
    console.log("%cacquiaLift | decision", "color: blue; font-weight: bold;", e.detail.decision_slot_id);
    jQuery(document).trigger('base-utils:update-links', [jQuery('[data-lift-slot="' + e.detail.decision_slot_id + '"]').find('.promotion')]);
  });

})(jQuery, Drupal, drupalSettings, Backbone, window);
