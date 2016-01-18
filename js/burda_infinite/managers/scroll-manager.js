(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.managers.ScrollManager = Backbone.View.extend({
        scrollTopAdSettings: 0,
        scrollTopUrl: 0,
        initialize: function (pOptions) {
            _.extend(this, pOptions);

            if (!Backbone.History.started && _.isFunction(history.pushState)) Backbone.history.start({pushState: true});

            this.scrollTopAdSettings = $(window).scrollTop();
            this.scrollTopUrl = $(window).scrollTop();
            this.listenTo(this.infiniteModel, 'change:inview', _.debounce(this.urlChangeHandler, 100), this);
            this.listenTo(this.infiniteModel, 'change:inview', _.debounce(this.adSettingsChangeHandler, 10), this);
        },
        adSettingsChangeHandler: function (pModel) {
            if (this.scrollTopAdSettings == $(window).scrollTop()) return;

            var $tmpElement = pModel.get('el'),
                tmpInviewModel = pModel.get('inview');

            if (tmpInviewModel.state == 'enter' || tmpInviewModel.state == 'exit' && tmpInviewModel.direction == 'up') {
                this.adscModel.setByElement($tmpElement);
            }

            this.scrollTopAdSettings = $(window).scrollTop();
        },
        urlChangeHandler: function (pModel) {
            if (this.scrollTopUrl == $(window).scrollTop()) return;

            var $tmpElement = pModel.get('el'),
                tmpInviewModel = pModel.get('inview'),
                tmpHistoryURL = $tmpElement.data('history-url'),
                tmpDocumentTitle = '';

            if (!_.isUndefined(tmpHistoryURL) && !_.isEmpty(tmpHistoryURL)) {
                ScrollManager.pushHistory(tmpHistoryURL, {replace: true});
                tmpDocumentTitle = $tmpElement.data('history-title');

                if (!_.isUndefined(tmpDocumentTitle) && !_.isEmpty(tmpDocumentTitle)) {
                    document.title = decodeURIComponent(tmpDocumentTitle);
                }
            }

            this.scrollTopUrl = $(window).scrollTop();
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

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
