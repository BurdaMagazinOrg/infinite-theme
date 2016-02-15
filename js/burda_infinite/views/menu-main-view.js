(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.MenuMainView = Backbone.View.extend({
        events: {
            "click #menu-open-btn": function (pEvent) {
                this.clickHandler(pEvent, 'toggle-sidebar');
            },
            "click #search-open-btn": function (pEvent) {
                this.clickHandler(pEvent, 'search-open');
            }
        },
        $subMenu: {},
        offsetTop: 0,
        pageOffsetsModel: {},
        modalSearchModel: {},
        menuSidebarModel: {},
        deviceModel: null,
        breakpointDeviceModel: null,
        isMobileMode: false,
        initialize: function (pOptions) {
            _.defaults(this, pOptions || {});

            this.pageOffsetsModel = BM.reuseModel(ModelIds.pageOffsetsModel);
            this.modalSearchModel = BM.reuseModel(ModelIds.modalSearchModel);
            this.menuSidebarModel = BM.reuseModel(ModelIds.menuSidebarModel);
            this.deviceModel = BM.reuseModel(ModelIds.deviceModel);

            this.delegateEvents();
            this.createViews();
            _.delay(_.bind(this.createByContext, this), 10);

            if (this.deviceModel.isActive) {
                this.listenTo(this.deviceModel.getDeviceBreakpoints(), 'change:active', this.onDeviceBreakpointHandler, this);

                //shitty drupal 8 js-menu-active
                _.delay(_.bind(function () {
                    this.onDeviceBreakpointHandler(this.deviceModel.getDeviceBreakpoints().findWhere({active: true}));
                }, this), 20);
            }

            this.listenTo(this.pageOffsetsModel.getModel('offsetToolbar'), 'change', this.onToolbarHandler, this);
            this.listenTo(this.modalSearchModel, 'change:is_open', function (pModel) {
                this.onModalSearchHandler(pModel, 'is_open');
            }, this);

            this.listenTo(this.modalSearchModel, 'sync', function (pModel) {
                this.onModalSearchHandler(pModel, 'sync');
            }, this);
        },
        createViews: function () {
            this.$subMenu = $('#menu-submenu-navigation');
        },
        createByContext: function (pSettings) {

            var tmpSettings = _.extend({
                context: $(window)[0],
                element: this.$el,
                handler: _.bind(this.onStickyHandler, this),
                offset: _.bind(function () {
                    return this.offsetTop;
                }, this)
            }, pSettings);


            if (this.sticky !== undefined) {
                this.clearStickiness();
            }

            this.sticky = new Waypoint.Sticky(tmpSettings);
        },
        onStickyHandler: function () {
            if (this.$el.hasClass('stuck')) {
                this.$el.css('top', this.offsetTop);
                this.activateOffset();
            } else {
                this.$el.css('top', '');
                this.deactivateOffset();
            }
        },
        onToolbarHandler: function (pModel) {
            this.offsetTop = pModel.get('offsets').top;
            this.sticky.waypoint.context.refresh()
            this.onStickyHandler();
        },
        onModalSearchHandler: function (pModel, pType) {
            var tmpIsOpen = pModel.get('is_open'),
                tmpSettings = {};

            /**
             * Destroy on modal open
             * Create and show by search sync
             * Create by modal close
             */

            if (pType == 'is_open') {

                if (tmpIsOpen) {
                    this.clearStickiness();
                } else {
                    this.$el.css('top', '');
                    this.createByContext(tmpSettings);
                }

            } else if ('sync') {
                tmpSettings.context = BM.reuseView(ViewIds.modalSearchView).$el;
                tmpSettings.offset = 2500;
                this.createByContext(tmpSettings);
            }
        },
        clickHandler: function (pEvent, pType) {
            if (pType == 'toggle-sidebar') {
                this.menuSidebarModel.toggleOpenState();
            } else if ('search-open') {
                if (!this.modalSearchModel.get('is_open')) {
                    this.modalSearchModel.set('is_open', true);
                }
            }
        },
        clearStickiness: function () {
            this.sticky.destroy();
            this.onStickyHandler();
        },
        activateOffset: function () {
            //console.log(">>> activateOffset");
            this.pageOffsetsModel.add(this.getOffsetManagerModel());
        },
        deactivateOffset: function () {
            //console.log(">>> deactivateOffset");
            this.pageOffsetsModel.deactivate(this.getOffsetManagerModel());
        },
        getOffsetManagerModel: function () {
            var tmpPosition = this.$el.position(),
                tmpElementHeight = this.$el.outerHeight(true);

            return {
                id: 'offsetMenuMain',
                pageRelevant: true,
                $el: this.$el,
                offsets: {
                    top: tmpPosition.top,
                    left: 0,
                    right: 0,
                    bottom: tmpPosition.top + tmpElementHeight,
                    height: tmpElementHeight
                },
            };
        },
        bindMobileListener: function () {
            var $tmpActiveItem = this.$subMenu.find('.is-active');

            $tmpActiveItem.off('click').on('click', $.proxy(function (pEvent) {
                pEvent.preventDefault();

                this.$subMenu.toggleClass('is-open', '');
                return false;
            }, this));
        },
        unbindMobileListener: function () {
            var $tmpActiveItem = this.$subMenu.find('.is-active');
            this.$subMenu.removeClass('is-open');
            $tmpActiveItem.off('click');
        },
        onDeviceBreakpointHandler: function (pModel) {
            this.breakpointDeviceModel = pModel;

            if (pModel.id == 'smartphone' && this.isMobileMode == false) {
                this.isMobileMode = true;
                this.bindMobileListener();
            } else if (pModel.id != 'smartphone' && this.isMobileMode) {
                this.isMobileMode = false;
                this.unbindMobileListener();
            }
        }
    });

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);