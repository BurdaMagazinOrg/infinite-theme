(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.base.BaseFeedView = BaseDynamicView.extend({
    context: $(window),
    $feedItemsContainer: {},
    lastInfiniteItem: {},
    preloader: null,
    infinite: null,
    initFeed: true,
    onBeforeLoadCallback: $.noop,
    onAfterLoadCallback: $.noop,
    initialize: function (pOptions) {
      BaseDynamicView.prototype.initialize.call(this, pOptions);

      this.context = $(this.context); //force jquery element
      this.$feedItemsContainer = this.$el.find('.container-feed-items');
      /**
       * auto init
       */
      if (this.initFeed) this.rebuildFeed();

      this.listenTo(this.model, "change:is_disabled", this.onDisableHandler);
      this.listenTo(this.model, "reset", this.onResetHandler, this);
    },
    rebuildFeed: function () {
      if (this.infinite !== null) this.infinite.destroy();

      this.infinite = new Waypoint.Infinite({
        context: this.context[0],
        element: this.$el,
        onBeforePageLoad: _.bind(this.onBeforeLoad, this),
        onAfterPageLoad: _.bind(this.onAfterLoad, this),
        offset: function () {
          return (this.context.innerHeight() * 2) - this.adapter.outerHeight();
        }
      });
    },
    onBeforeLoad: function () {
      this.lastInfiniteItem = this.$el.find('.infinite-item:last').length > 0 ? this.$el.find('.infinite-item:last') : this.$el;
      if (this.preloader != null) this.preloader.hide(true, true);
      this.preloader = new SpinnerCubeView({el: this.lastInfiniteItem});
      this.onBeforeLoadCallback(this.lastInfiniteItem);
    },
    onAfterLoad: function (pItem) {
      //console.log("loading done", " View >> ", this.id || this.$el.attr('id') || this.$el.attr('class'));

      if (this.preloader != null) {
        this.preloader.hide(true, true);
        this.preloader = null;
      }
      this.onAfterLoadCallback($(pItem));
      this.parseInfiniteView($(pItem), {modelList: this.model, initialDOMItem: false}); //delegateElements: true,
    },
    onDisableHandler: function (pDisabled) {
      //console.log("AbstractFeedView onDisableHandler", " View >> ", this.id, pDisabled);
      if (this.infinite == null || this.infinite.waypoint == undefined) return;

      if (pDisabled) {
        this.infinite.waypoint.disable();
      } else {
        this.infinite.waypoint.enable();
      }
    },
    onResetHandler: function () {
      this.clear();
    },
    appendElement: function (pElement) {
      this.$feedItemsContainer.append(pElement).fadeIn();

      if (this.infinite == null) {
        this.rebuildFeed();
      } else {
        this.refreshFeed();
      }
    },
    refreshFeed: function () {
      this.infinite.refresh();
    },
    clear: function () {
      this.$feedItemsContainer.empty();
      if (this.infinite != null) {
        this.infinite.destroy();
      }
    },
    destroy: function () {
      this.infinite.destroy();
      BaseDynamicView.prototype.destroy.call(this);
    }
  });

  window.BaseFeedView = window.BaseFeedView || BurdaInfinite.views.base.BaseFeedView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
