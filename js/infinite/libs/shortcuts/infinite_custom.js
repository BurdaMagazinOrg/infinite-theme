/*!
 Waypoints Infinite Scroll Shortcut - 4.0.0
 Copyright © 2011-2015 Caleb Troughton
 Licensed under the MIT license.
 https://github.com/imakewebthings/waypoints/blog/master/licenses.txt
 */
(function () {
    'use strict'

    var $ = window.jQuery
    var Waypoint = window.Waypoint

    /* http://imakewebthings.com/waypoints/shortcuts/infinite-scroll */
    function Infinite(options) {
        this.options = $.extend({}, Infinite.defaults, options)
        this.container = this.options.element
        if (this.options.container !== 'auto') {
            this.container = this.options.container
        }
        this.$container = $(this.container)
        this.reInit();
    }

    Infinite.prototype.reInit = function () {
        /**
         * line updated $(this.options.more) -> this.$container.find(this.options.more)
         * search more link in context...
         */

        this.$more = this.$container.find(this.options.more)

        if (this.$more.length) {
            this.setupHandler()
            this.waypoint = new Waypoint(this.options)
            this.destroyed = false;
        }
    }

    /* Private */
    Infinite.prototype.setupHandler = function () {

        this.options.handler = $.proxy(function () {
            var tmpURL = this.$container.find(this.options.more).attr('href'),
                $tmpMoreLink = this.$container.find(this.options.more);

            this.options.onBeforePageLoad()
            this.destroy()
            this.$container.addClass(this.options.loadingClass)

            var tmpAjaxModel = new AjaxModel({
                url: tmpURL,
                element: $tmpMoreLink,
                callback: _.bind(this.appendInfiniteItem, this)
            });
            tmpAjaxModel.execute();

        }, this)
    }

    Infinite.prototype.appendInfiniteItem = function ($pContent) {
        var $data = $pContent;
        var $newMore = $data.find(this.options.more)
        var $items = $data.find(this.options.items)

        if (!$items.length) {
            $items = $data.filter(this.options.items)
        }

        this.$container.find('.container-feed-items').append($items);
        this.$container.removeClass(this.options.loadingClass)

        if (!$newMore.length) {
            $newMore = $data.filter(this.options.more)
        }
        if ($newMore.length) {
            this.$more.replaceWith($newMore)
            this.$more = $newMore
            this.waypoint = new Waypoint(this.options)
        }
        else {
            this.$more.remove()
        }

        this.options.onAfterPageLoad($items)
    }

    /* Public */
    Infinite.prototype.destroy = function () {
        if (this.waypoint) {
            this.waypoint.destroy()
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

    Waypoint.Infinite = Infinite
}())
;
