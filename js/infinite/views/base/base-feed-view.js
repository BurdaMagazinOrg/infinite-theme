(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.base.BaseFeedView = BaseDynamicView.extend({
    context: $(window),
    $feedItemsContainer: {},
    lastInfiniteItem: {},
    preloader: null,
    infinite: null,
    initFeed: true,
    atBottomOfPage: false,
    fallbackNaviHeight: 56,
    naviHeight: 0,
    initialize(pOptions) {
      BaseDynamicView.prototype.initialize.call(this, pOptions);

      this.naviHeight =
        document.getElementById('menu-main-navigation').offsetHeight ||
        this.fallbackNaviHeight;
      this.context = $(this.context); // force jquery element
      this.$feedItemsContainer = this.$el.find('.container-feed-items');

      // auto init
      if (this.initFeed) this.rebuildFeed();

      this.listenTo(this.model, 'change:is_disabled', this.onDisableHandler);
      this.listenTo(this.model, 'reset', this.onResetHandler, this);
    },
    rebuildFeed() {
      if (this.infinite !== null) this.infinite.destroy();

      this.infinite = new Waypoint.Infinite({
        context: this.context[0],
        element: this.$el,
        executeCallback: _.bind(this.executeCallback, this),
        preAppendCallback: _.bind(this.preAppendCallback, this),
        appendCallback: _.bind(this.appendCallback, this),
        offset() {
          return this.context.innerHeight() * 2 - this.adapter.outerHeight();
        },
      });
    },
    executeCallback() {
      this.lastInfiniteItem =
        this.$el.find('.infinite-item:last').length > 0
          ? this.$el.find('.infinite-item:last')
          : this.$el;
      if (this.preloader != null) this.preloader.hide(true, true);
      this.preloader = new SpinnerCubeView({ el: this.lastInfiniteItem });
    },
    preAppendCallback(pItem) {
      // scroll to new appended article if someone scroll to the bottom and saw the preloader
      const atBottomOfPageCheck =
        window.scrollY + window.innerHeight === document.body.clientHeight;
      if (atBottomOfPageCheck) {
        this.atBottomOfPage = true;
      }
    },
    appendCallback($appendedElement) {
      const appendedElement = $appendedElement[0];

      if (this.preloader != null) {
        this.preloader.hide(true, true);
        this.preloader = null;
      }

      if (this.atBottomOfPage === true && $('body').hasClass('page-article')) {
        $('html, body').animate(
          { scrollTop: appendedElement.offsetTop - this.naviHeight },
          {
            duration: 500,
            easing: 'swing',
          }
        );

        this.atBottomOfPage = false;
      }

      this.parseInfiniteView($appendedElement, {
        modelList: this.model,
        initialDOMItem: false,
      });
    },
    onDisableHandler(pDisabled) {
      if (this.infinite == null || this.infinite.waypoint == undefined) return;

      if (pDisabled) {
        this.infinite.waypoint.disable();
      } else {
        this.infinite.waypoint.enable();
      }
    },
    onResetHandler() {
      this.clear();
    },
    appendElement(pElement) {
      this.$feedItemsContainer.append(pElement).fadeIn();

      if (this.infinite == null) {
        this.rebuildFeed();
      } else {
        this.refreshFeed();
      }
    },
    refreshFeed() {
      this.infinite.refresh();
    },
    clear() {
      this.$feedItemsContainer.empty();
      if (this.infinite != null) {
        this.infinite.destroy();
      }
    },
    destroy() {
      this.infinite.destroy();
      BaseDynamicView.prototype.destroy.call(this);
    },
  });

  window.BaseFeedView =
    window.BaseFeedView || BurdaInfinite.views.base.BaseFeedView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
