import ViewIds from './consts/view-ids'

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

      this.initBlazyOnContainer('#modal-search');
    },

    initBlazyOnContainer: function(containerSelector){
      if (null === document.querySelector(containerSelector)) {
        return;
      }
      new Blazy({
        container: containerSelector,
        success: function (element) {
          jQuery(element).parents('.media--loading').removeClass('media--loading')
        }
      })
    }
  };


  window.addEventListener('acquiaLiftDecision', function(e) {
    console.log("%cacquiaLift | decision", "color: blue; font-weight: bold;", e.detail.decision_slot_id);
    jQuery(document).trigger('base-utils:update-links', [jQuery('[data-lift-slot="' + e.detail.decision_slot_id + '"]').find('.promotion')]);
  });

})(jQuery, Drupal, drupalSettings, Backbone, window);
