(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.StickyView = BaseDynamicView.extend({
        pageOffsetsModel: {},
        offsetsPageModel: {},
        context: null,
        sticky: null,
        stickyStop: null,
        hasAd: false,
        posTop: 0,
        offsetTop: 0,
        height: 0,
        contentHeight: 0,
        lastBreakpoint: '',
        elementBreakpoints: [],
        initialize: function (pOptions) {
            BaseDynamicView.prototype.initialize.call(this, pOptions);

            this.pageOffsetsModel = BM.reuseModel(ModelIds.pageOffsetsModel);
            this.offsetsPageModel = this.pageOffsetsModel.getModel('offsetPage');
            this.offsetTop = this.offsetsPageModel.get('offsets').top;
            this.posTop = Math.floor(this.$el.offset().top);
            this.height = Math.floor(this.$el.height());
            this.elementBreakpoints = $(this.$el.data('breakpoints')).toArray();
            this.hasAd = this.$el.find('.ad-container').length > 0;

            /**
             * default breakpoints
             */
            if (this.elementBreakpoints.length <= 0) this.elementBreakpoints.push('tablet', 'desktop');
            this.breakpointDeviceModel = this.deviceModel.getDeviceBreakpoints().findWhere({active: true});

            this.listenTo(this.offsetsPageModel, 'change:offsets', this.onOffsetHandler, this);
            this.listenTo(this.model, 'change:inviewEnabled', this.onEnabledHandler, this);
            this.listenTo(this.model, 'change:contentHeight', this.onContentHeightHandler, this);
            this.listenTo(this.deviceModel.getDeviceBreakpoints(), 'change:active', this.onDeviceBreakpointHandler, this);

            //TODO check if throttle or debounce is better
            $(this.context).bind('scroll.sticky', _.bind(_.throttle(function () {
                this.onCheckHandler();
            }, 500), this));

            window.addEventListener('adRendered', _.bind(this.onAdRenderedHandler, this), false);

            this.updateView();
        },
        updateView: function () {
            var tmpCurrentBreakpoint = this.breakpointDeviceModel.id;

            if (this.elementBreakpoints.indexOf(tmpCurrentBreakpoint) >= 0 && this.lastBreakpoint != tmpCurrentBreakpoint) {
                this.createStickiness();
            } else if (this.sticky != null) {
                this.removeStickiness();
            }

            this.lastBreakpoint = tmpCurrentBreakpoint;
        },
        createStickiness: function () {
            if (this.sticky !== null) {
                this.removeStickiness();
            }

            this.sticky = new Waypoint.Sticky({
                context: this.context[0],
                element: this.$el,
                useWrapperHeight: false,
                wrapper: false,
                handler: _.bind(this.onStickyHandler, this),
                offset: _.bind(function () {
                    return this.offsetTop + AppConfig.padding;
                }, this)
            });

            this.stickyStop = new Waypoint({
                context: this.context[0],
                element: this.$el.parent(),
                handler: _.bind(function (pDirection) {

                    if (pDirection == 'down') {
                        this.$el.addClass('stuck-stop');
                    } else if (pDirection == 'up') {
                        this.$el.removeClass('stuck-stop');
                    }
                }, this),
                offset: _.bind(function () {
                    //remove .parent() if no wrapper exists
                    return -(this.$el.parent().outerHeight() - (this.height + this.offsetTop + AppConfig.padding));
                }, this)
            });
        },
        refresh: function () {
            if (this.sticky == null) return;

            this.sticky.waypoint.context.refresh();
            this.stickyStop.context.refresh();
        },
        removeStickiness: function () {
            this.sticky.destroy();
            this.stickyStop.destroy();
            this.sticky = null;
            this.stickyStop = null;
            this.$el.removeClass('stuck-stop');
            this.onStickyHandler();
        },
        onStickyHandler: function (pDirection) {
            if (this.$el.hasClass('stuck')) {
                this.$el.css('top', this.offsetTop + AppConfig.padding);
            } else {
                this.$el.css('top', '');
            }
        },
        onDeviceBreakpointHandler: function (pModel) {
            this.breakpointDeviceModel = pModel;
            this.updateView();
        },
        onCheckHandler: function (pDirection) {
            if (this.sticky == null || this.enabled == false) return;

            var tmpHeight = Math.floor(this.$el.height()),
                tmpPosTop;

            if (tmpHeight == 0) return;

            //if (this.$el.parent('.sticky-wrapper').length > 0) {
            //    tmpPosTop = Math.floor(this.$el.parent('.sticky-wrapper').offset().top);
            //} else {
            //}
            tmpPosTop = Math.floor(this.$el.offset().top);

            if (this.posTop == tmpPosTop && this.height == tmpHeight) return;

            this.posTop = tmpPosTop;
            this.height = tmpHeight;
            this.refresh();
        },
        onOffsetHandler: function (pModel) {
            this.offsetTop = pModel.get('offsets').top;
            if (this.stickyStop != null) this.stickyStop.context.refresh();
            this.onStickyHandler();
        },
        onAdRenderedHandler: function () {
            if (this.hasAd) this.onCheckHandler();
        },
        onEnabledHandler: function (pModel) {
            if (pModel != this.model) return; //event bubbling

            if (pModel.get('inviewEnabled') == true) {
                this.enableView();
            } else {
                this.disableView();
            }
        },
        onContentHeightHandler: function (pModel) {
            this.onCheckHandler();
        },
        enableView: function () {
            BaseDynamicView.prototype.enableView();

            if (this.sticky == null) return;
            this.sticky.waypoint.enable();
            this.stickyStop.enable();
        },
        disableView: function () {
            BaseDynamicView.prototype.disableView();

            if (this.sticky == null) return;
            this.sticky.waypoint.disable();
            this.stickyStop.disable();
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
