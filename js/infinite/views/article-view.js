/* global AppConfig */
/* global TrackingManager */
/* global PinUtils */
/* global twttr */
/* global instgrm */
/* global BurdaInfinite */
/* global BaseDynamicView */

(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.ArticleView = BaseDynamicView.extend({
    infiniteBlockDataModel: null,
    articleScrolledInview: null,
    articlePageviewInview: null,
    articleReadInview: null,
    articleReadDelay: 0,
    articleSEOTitle: '',
    initialize: function(pOptions) {
      BaseDynamicView.prototype.initialize.call(this, pOptions);

      this.articleReadDelay = AppConfig.articleReadDelay || 2000;

      if (
        !!this.infiniteBlockDataModel &&
        this.infiniteBlockDataModel.has('title')
      ) {
        this.articleSEOTitle = this.infiniteBlockDataModel.get('title');
      }

      if (this.model.has('infiniteBlockDataModel')) {
        this.infiniteBlockDataModel = this.model.get('infiniteBlockDataModel');
      }

      this.initTracking();
      this.renderParagraphSocials();
    },
    initTracking: function() {
      this.articleReadInview = this.$el
        .find('.item-paragraph--text:last')
        .inview({
          offset: 'bottom',
          enter: this.handleArticleReadEnter.bind(this),
          exit: this.handleArticleReadExit.bind(this),
        });

      if (!this.model.get('initialDOMItem')) {
        this.articleScrolledInview = this.$el
          .find('.item-paragraph--text:first')
          .inview({
            offset: 'top',
            enter: this.handleArticleScrolledEnter.bind(this),
          });

        this.articlePageviewInview = this.$el.find('.title--article').inview({
          offset: 'bottom',
          enter: this.handlePageview.bind(this),
        });
      }
    },
    handleArticleScrolledEnter: function() {
      this.extendPersona();
      this.trackArticleScrolled();
    },
    handleArticleReadEnter: function() {
      this.stopArticleReadInterval();

      this.readInterval = setInterval(
        function() {
          this.trackArticleRead();
          this.stopArticleReadInterval();
        }.bind(this),
        this.articleReadDelay
      );
    },
    handleArticleReadExit: function() {
      this.stopArticleReadInterval();
    },
    stopArticleReadInterval: function() {
      clearInterval(this.readInterval);
      this.readInterval = 0;
    },
    trackArticleRead: function() {
      this.articleReadInview.destroy();

      if (typeof TrackingManager !== 'undefined') {
        TrackingManager.trackEvent(
          {
            category: 'mkt-userInteraction',
            action: 'readArticle',
            label: this.articleSEOTitle,
            eventNonInteraction: false,
          },
          TrackingManager.getAdvTrackingByElement(this.$el)
        );
      }
    },
    trackArticleScrolled: function() {
      this.articleScrolledInview.destroy();

      if (typeof TrackingManager !== 'undefined') {
        TrackingManager.trackEvent(
          {
            category: 'mkt-userInteraction',
            action: 'scrolledArticle',
            label: this.articleSEOTitle,
            eventNonInteraction: false,
          },
          TrackingManager.getAdvTrackingByElement(this.$el)
        );
      }
    },
    handlePageview: function() {
      const tmpModel = this.model.get('parentModel'); // infiniteBlockViewModel
      const $tmpElement = tmpModel.get('el');
      const tmpHistoryURL = $tmpElement.data('history-url');

      this.articlePageviewInview.destroy();

      if (
        !_.isUndefined(tmpHistoryURL) &&
        tmpModel.get('pageviewTracked') !== true
      ) {
        tmpModel.set('pageviewTracked', true);
        TrackingManager.trackPageView(
          tmpHistoryURL,
          TrackingManager.getAdvTrackingByElement($tmpElement)
        );
      }
    },
    extendPersona: function() {
      const persona = {};
      if (this.infiniteBlockDataModel && typeof Persona !== 'undefined') {
        persona.channel = this.infiniteBlockDataModel.get('category');
        persona.subChannel = this.infiniteBlockDataModel.get('subCategory');
        Persona.extendPersona(persona);
      }
    },
    renderParagraphSocials: function() {
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
            function() {
              $.each(this.$el.find('.td-widget'), function(pIndex, pItem) {
                window.td.parse(pItem);
              });
            }.bind(this)
          )
          .catch(function(err) {
            console.error('Tracdelight Error', err);
          });
      }
    },
  });

  window.ArticleView = window.ArticleView || BurdaInfinite.views.ArticleView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
