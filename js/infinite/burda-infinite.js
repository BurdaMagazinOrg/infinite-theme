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

    window.addEventListener('atf_no_ad_rendered', function (event) {
      var $tmpAdContainer = jQuery('#' + event.element_id).closest('.marketing-view'),
        tmpModel = {visibility: 'hidden', event: event},
        tmpView;

      if ($tmpAdContainer.data('infiniteModel') != undefined) {
        tmpView = $tmpAdContainer.data('infiniteModel').get('view');
        tmpView.setRenderModel(tmpModel);
        console.log('No ad rendered for ' + event.element_id, tmpView.adRenderModel.visibility, tmpView.$el);
      }
    }, false);

    window.addEventListener('atf_ad_rendered', function (event) {
      var $tmpAdContainer = jQuery('#' + event.element_id).closest('.marketing-view'),
        tmpModel = {visibility: 'visible', event: event},
        tmpView;

      console.log('Ad rendered for ' + event.element_id);

      if ($tmpAdContainer.data('infiniteModel') != undefined) {
        tmpView = $tmpAdContainer.data('infiniteModel').get('view');
        tmpView.setRenderModel(tmpModel);
      }
    }, false);

    window.atf_ad = function (pElement, pType) {
      var $tmpAdContainer = $(pElement).closest('.marketing-view'),
        tmpView;

      if ($tmpAdContainer.data('infiniteModel') != undefined) {
        tmpView = $tmpAdContainer.data('infiniteModel').get('view');
        tmpView.setRenderedAdType(pType, pElement);
      }
      console.log("atf_fba", $tmpAdContainer, pType);
    }

})(jQuery, Drupal, drupalSettings, Backbone, window);
