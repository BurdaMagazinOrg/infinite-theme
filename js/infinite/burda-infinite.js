(function ($, Drupal, drupalSettings, Backbone, window) {

    "use strict";

    window.BurdaInfinite = {
        views: {
            base: {},
            newsletter: {}
        },
        managers: {},
        models: {
            base: {}
        }
    };

    Drupal.behaviors.burdaInfinite = {
        attach: function (context) {
            var $context = $(context);


      console.log("1");
      $('body').once(ViewIds.mainView).each(function () {
        var mainView = new MainView({el: $context, id: ViewIds.mainView});
        BM.reuseView(ViewIds.mainView, mainView);
      });
    }
  };

  // if (typeof blockAdBlock === 'undefined') {
  //   adBlockDetected();
  // } else {
  //   blockAdBlock.onDetected(adBlockDetected);
  //   blockAdBlock.onNotDetected(adBlockNotDetected);
  //   // and|or
  //   blockAdBlock.on(true, adBlockDetected);
  //   blockAdBlock.on(false, adBlockNotDetected);
  //   // and|or
  //   blockAdBlock.on(true, adBlockDetected).onNotDetected(adBlockNotDetected);
  // }

})(jQuery, Drupal, drupalSettings, Backbone, window);
