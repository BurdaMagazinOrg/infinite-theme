/*!
 Waypoints Infinite Scroll Shortcut - 4.0.0
 Copyright © 2011-2015 Caleb Troughton
 Licensed under the MIT license.
 https://github.com/imakewebthings/waypoints/blog/master/licenses.txt
 */
(function () {
  'use strict'

  var $ = window.jQuery;
  var Waypoint = window.Waypoint;

  /* http://imakewebthings.com/waypoints/shortcuts/infinite-scroll */
  function Infinite(options) {
    this.options = $.extend({}, Infinite.defaults, options);
    this.container = this.options.element;
    this.odoscopeArticleModel = null;
    this.useOdoscope = false;

    if (this.options.container !== 'auto') {
      this.container = this.options.container;
    }

    if (typeof OdoscopeManager !== 'undefined' && this.container.is('#feed') && OdoscopeManager.getInstance().has('articleModel')) {
      OdoscopeManager.getInstance().get('articleModel').on('set:articleModel', this.onOdoscopeArticelModelHandler, this);

      if (OdoscopeManager.getInstance().isOdoscopeArticleGroup()) {
        this.onOdoscopeArticelModelHandler(OdoscopeManager.getInstance().get('articleModel'));
      }
    }


    this.$container = $(this.container);
    this.reInit();
  }

  Infinite.prototype.onOdoscopeArticelModelHandler = function (pModel) {
    console.log("%cinfiniteCustom", "color: deepskyblue;", pModel);
    this.useOdoscope = true;
    this.odoscopeArticleModel = pModel;
  }

  Infinite.prototype.reInit = function () {
    /**
     * line updated $(this.options.more) -> this.$container.find(this.options.more)
     * search more link in context...
     */

    this.$more = this.$container.find(this.options.more);

    if (this.$more.length) {
      this.setupHandler();
      this.waypoint = new Waypoint(this.options);
      this.destroyed = false;
    }
  }

  /* Private */
  Infinite.prototype.setupHandler = function () {

    this.options.handler = $.proxy(function () {
      var $tmpMoreLink = this.$container.find(this.options.more),
        tmpURL = $tmpMoreLink.attr('href');

      if (this.useOdoscope && this.odoscopeArticleModel != null) {
        tmpURL = this.odoscopeArticleModel.getNextURL() || tmpURL;
      }

      this.options.onBeforePageLoad();
      this.destroy();
      this.$container.addClass(this.options.loadingClass);

      var tmpAjaxModel = new AjaxModel({
        url: tmpURL,
        element: $tmpMoreLink[0],
        callback: _.bind(this.appendInfiniteItem, this)
      });

      tmpAjaxModel.execute();

    }, this);
  }

  Infinite.prototype.appendInfiniteItem = function ($pContent) {
    var $data = $pContent;
    var $newMore = $data.find(this.options.more);
    var $items = $data.find(this.options.items);

    if (!$items.length) {
      $items = $data.filter(this.options.items);
    }

    //$items.appendTo(this.$container.find('.container-feed-items')).hide().fadeIn(1000);
    $items.appendTo(this.$container.find('.container-feed-items'));
    this.$container.removeClass(this.options.loadingClass);

    if (!$newMore.length) {
      $newMore = $data.filter(this.options.more);
    }

    if (TrackingManager != undefined) {
      TrackingManager.trackEvent({
        category: 'lazy-loading',
        action: this.$more.attr('href'),
        eventNonInteraction: false
      });
    }

    if ($newMore.length) {
      this.$more.remove();
      this.$container.append($newMore);
      this.$more = $newMore;
      this.waypoint = new Waypoint(this.options);
    }
    else {
      this.$more.remove();
    }

    this.options.onAfterPageLoad($items);
    Drupal.attachBehaviors($items[0]);
  }

  /* Public */
  Infinite.prototype.destroy = function () {
    if (this.waypoint) {
      this.waypoint.destroy();
      this.destroyed = true;
    }
  }

  Infinite.prototype.refresh = function () {
    if (this.waypoint && this.destroyed == false) {
      this.destroy();
    }
    this.reInit();
  }

  Infinite.defaults = {
    container: 'auto',
    items: '.infinite-item',
    more: '.infinite-more-link',
    offset: 'bottom-in-view',
    loadingClass: 'infinite-loading',
    onBeforePageLoad: $.noop,
    onAfterPageLoad: $.noop
  }

  Waypoint.Infinite = Infinite;
}())
;
