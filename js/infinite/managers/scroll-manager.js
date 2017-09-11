(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.managers.ScrollManager = Backbone.View.extend({
    infiniteViewsModel: {},
    scrollTopAdSettings: 0,
    scrollTop: 0,
    initialize: function (pOptions) {
      _.extend(this, pOptions);

      if (!Backbone.History.started && _.isFunction(history.pushState)) Backbone.history.start({pushState: true});

      this.scrollTopAdSettings = $(window).scrollTop();
      this.scrollTop = $(window).scrollTop();
      this.listenTo(this.infiniteViewsModel, 'change:inview', this.onInviewChangeHandler, this);
    },
    onInviewChangeHandler: function (pModel) {
      this.urlChangeHandler(pModel);
    },
    urlChangeHandler: function (pModel) {
      if (this.scrollTop == $(window).scrollTop()) return;

      var $tmpElement = pModel.get('el'),
        tmpInviewModel = pModel.get('inview'),
        tmpHistoryURL = $tmpElement.data('history-url'),
        tmpDocumentTitle = '';

      if (tmpInviewModel.state == 'enter' || tmpInviewModel.state == 'exit') {

        if (!_.isUndefined(tmpHistoryURL) && !_.isEmpty(tmpHistoryURL)) {
          ScrollManager.pushHistory(tmpHistoryURL, {replace: true});
          tmpDocumentTitle = $tmpElement.data('history-title');

          if (!_.isUndefined(tmpDocumentTitle) && !_.isEmpty(tmpDocumentTitle)) {
            document.title = decodeURIComponent(tmpDocumentTitle);
          }
        }
      }

      this.scrollTop = $(window).scrollTop();
    }
  }, {
    pushHistory: function (pURL, pSettings) {
      //console.log(">>> pushHistory", pURL);
      var pushStateSupported = _.isFunction(history.pushState);
      if (pushStateSupported) {
        Backbone.history.navigate(pURL, pSettings);
      }
    }
  });

  window.ScrollManager = window.ScrollManager || BurdaInfinite.managers.ScrollManager;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
