(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.managers.ScrollManager = Backbone.View.extend(
    {
      infiniteViewsModel: {},
      scrollTopAdSettings: 0,
      scrollTop: 0,
      initialize(pOptions) {
        _.extend(this, pOptions);

        if (!Backbone.History.started && _.isFunction(history.pushState))
          Backbone.history.start({ pushState: true });

        this.scrollTopAdSettings = $(window).scrollTop();
        this.scrollTop = $(window).scrollTop();
        this.listenTo(
          this.infiniteViewsModel,
          'change:inview',
          this.onInviewChangeHandler,
          this
        );
      },
      onInviewChangeHandler(pModel) {
        if (pModel.get('type') != 'infiniteBlockView') return;
        this.urlChangeHandler(pModel);
      },
      urlChangeHandler(pModel) {
        if (
          this.scrollTop == $(window).scrollTop() ||
          !pModel.get('el').data('history-url')
        )
          return;

        const $tmpElement = pModel.get('el');

        const tmpInviewModel = pModel.get('inview');

        const tmpHistoryURL = $tmpElement.data('history-url');

        let tmpDocumentTitle = '';

        if (tmpInviewModel.state == 'enter' || tmpInviewModel.state == 'exit') {
          if (!_.isUndefined(tmpHistoryURL) && !_.isEmpty(tmpHistoryURL)) {
            ScrollManager.pushHistory(tmpHistoryURL, { replace: true });
            tmpDocumentTitle = $tmpElement.data('history-title');

            if (
              !_.isUndefined(tmpDocumentTitle) &&
              !_.isEmpty(tmpDocumentTitle)
            ) {
              document.title = decodeURIComponent(tmpDocumentTitle);
            }
          }
        }

        this.scrollTop = $(window).scrollTop();
      },
    },
    {
      pushHistory(pURL, pSettings) {
        // console.log(">>> pushHistory", pURL);
        const pushStateSupported = _.isFunction(history.pushState);
        if (pushStateSupported) {
          Backbone.history.navigate(pURL, pSettings);
        }
      },
    }
  );

  window.ScrollManager =
    window.ScrollManager || BurdaInfinite.managers.ScrollManager;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
