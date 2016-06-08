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

            $('body').once(ViewIds.mainView).each(function () {
                var mainView = new MainView({el: $context, id: ViewIds.mainView});
                BM.reuseView(ViewIds.mainView, mainView);
            });
        }
    };

})(jQuery, Drupal, drupalSettings, Backbone, window);
