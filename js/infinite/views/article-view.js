/* global AppConfig */
/* global TrackingManager */
/* global PinUtils */
/* global twttr */
/* global instgrm */
/* global BurdaInfinite */
/* global BaseDynamicView */

(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.ArticleView = BaseDynamicView.extend({
    articleScrolledInview: null,
    articleReadedInview: null,
    articleReadedDelay: 0,
    articleSEOTitle: '',
    initialize(pOptions) {
      BaseDynamicView.prototype.initialize.call(this, pOptions);

      this.articleReadedDelay = AppConfig.articleReadedDelay || 2000;

      if (
        this.infiniteBlockDataModel !== undefined
        && this.infiniteBlockDataModel.has('title')
      ) {
        this.articleSEOTitle = this.infiniteBlockDataModel.get('title');
      }

      this.initTracking();
      this.renderParagraphSocials();
    },
    initTracking() {
      this.articleReadedInview = this.$el
        .find('.item-paragraph--text:last')
        .inview({
          offset: 'bottom',
          enter: this.handleArticleReadedEnter.bind(this),
          exit: this.handleArticleReadedExit.bind(this),
        });

      if (!this.model.get('initialDOMItem')) {
        this.articleScrolledInview = this.$el
          .find('.item-paragraph--text:first')
          .inview({
            offset: 'top',
            enter: this.handleArticleScrolledEnter.bind(this),
          });
      }
    },
    handleArticleScrolledEnter() {
      this.trackArticleScrolled();
    },
    handleArticleReadedEnter() {
      this.stopArticleReadedInterval();

      this.readedInterval = setInterval(
        () => {
          this.trackArticleReaded();
          this.stopArticleReadedInterval();
        },
        this.articleReadedDelay,
      );
    },
    handleArticleReadedExit() {
      this.stopArticleReadedInterval();
    },
    stopArticleReadedInterval() {
      clearInterval(this.readedInterval);
      this.readedInterval = 0;
    },
    trackArticleReaded() {
      this.articleReadedInview.destroy();

      if (typeof TrackingManager !== 'undefined') {
        TrackingManager.trackEvent(
          {
            category: 'mkt-userInteraction',
            action: 'readArticle',
            label: this.articleSEOTitle,
            eventNonInteraction: false,
          },
          TrackingManager.getAdvTrackingByElement(this.$el),
        );
      }
    },
    trackArticleScrolled() {
      this.articleScrolledInview.destroy();

      if (typeof TrackingManager !== 'undefined') {
        TrackingManager.trackEvent(
          {
            category: 'mkt-userInteraction',
            action: 'scrolledArticle',
            label: this.articleSEOTitle,
            eventNonInteraction: false,
          },
          TrackingManager.getAdvTrackingByElement(this.$el),
        );
      }
    },
    renderParagraphSocials() {
      if (typeof twttr !== 'undefined') {
        twttr.widgets.load(this.$el[0]);
      }

      if (typeof PinUtils !== 'undefined') {
        PinUtils.build(this.$el[0]);
      }

      if (typeof instgrm !== 'undefined') {
        instgrm.Embeds.process();
      }

      if (typeof tracdelight !== 'undefined') {
        window.tracdelight
          .then(
            () => {
              $.each(this.$el.find('.td-widget'), (pIndex, pItem) => {
                td.parse(pItem);
              });
            },
          )
          .catch((err) => {
            console.error('Tracdelight Error', err);
          });
      }
    },
  });

  window.ArticleView = window.ArticleView || BurdaInfinite.views.ArticleView;
}(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite));
