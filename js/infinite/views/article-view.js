(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.ArticleView = BaseDynamicView.extend({
        articleReadedTrigger: null,
        articleReadedDelay: 0,
        articleSEOTitle: '',
        initialize: function (pOptions) {
            BaseDynamicView.prototype.initialize.call(this, pOptions);

            this.articleReadedDelay = AppConfig.articleReadedDelay || 2000;

            if (this.infiniteBlockDataModel != undefined && this.infiniteBlockDataModel.has('title')) {
                this.articleSEOTitle = this.infiniteBlockDataModel.get('title');
            }

            this.initTracking();
            this.renderParagraphSocials();
        },
        initTracking: function () {
            if (this.$el.find('.cet').length <= 0) return;

            this.articleReadedTrigger = new Waypoint.Inview({
                element: this.$el.find('.cet'),
                exit: _.bind(function (pDirection) {
                    this.stopArticleReadedInterval();
                }, this),
                enter: _.bind(function (pDirection) {
                    this.stopArticleReadedInterval();

                    this.readedInterval = setInterval($.proxy(function () {
                        this.trackArticleReaded();
                        this.stopArticleReadedInterval();
                    }, this), this.articleReadedDelay);

                }, this)
            })
        },
        renderParagraphSocials: function () {
            if (typeof twttr != 'undefined') {
                twttr.widgets.load(
                    this.$el[0]
                );
            }

            if (typeof PinUtils != 'undefined') {
                PinUtils.build(this.$el[0]);
            }

            if (typeof instgrm != 'undefined') {
                instgrm.Embeds.process();
            }

            if (typeof tracdelight != "undefined") {
                window.tracdelight.then(_.bind(function (td) {
                    $.each(this.$el.find('.td-widget'), function (pIndex, pItem) {
                        td.parse(pItem);
                    })
                }, this)).catch(function (err) {
                    console.error("Tracdelight Error", err);
                });
            }

        },
        stopArticleReadedInterval: function () {
            clearInterval(this.readedInterval);
            this.readedInterval = 0;
        },
        trackArticleReaded: function () {
            this.articleReadedTrigger.destroy();

            if (typeof TrackingManager != 'undefined') {
                TrackingManager.trackEvent({
                    category: 'mkt-userInteraction',
                    action: 'readArticle',
                    label: this.articleSEOTitle,
                    'eventNonInteraction': 'true',
                });
            }
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);