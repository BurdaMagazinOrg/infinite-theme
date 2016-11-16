(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

    "use strict";

    BurdaInfinite.views.MainView = Backbone.View.extend({
        adscModel: {},
        menuSidebarModel: {},
        modalSearchModel: {},
        pageOffsetsModel: {},
        infiniteViewsModel: {},
        deviceModel: {},

        menuMainView: {},
        menuSidebarView: {},
        infiniteView: {},
        modalSearchView: {},

        events: {},
        initialize: function (pOptions) {
            _.extend(this, pOptions);

            if ($.cookie != undefined) $.cookie.json = true;
            if ($.timeago != undefined)  $.timeago.settings.localeTitle = true;

            if (_.isFunction(history.pushState)) Backbone.history.start({pushState: true});
            AppConfig.initialLocation = Backbone.history.location.pathname + Backbone.history.location.search;
            //TFM.Debug.start();

            this.initBeforeUnloadBehavior();
            this.initAdBehavior();
            //this.delegateEvents();
            this.createModels();
            this.createManagers();
            this.createViews();

            /**
             * Infinite Model Helper
             */
            //TODO use for debugging
            //this.listenTo(this.infiniteViewsModel, 'update', _.debounce(function (pType) {
            //    console.info("global infiniteModel", this.infiniteViewsModel);
            //}, 100, true), this);

            /**
             * adjust sidebar if toolbar activated / displayed
             */
            setTimeout(_(function () {
                if (typeof Drupal.toolbar !== "undefined" && typeof Drupal.toolbar.models.toolbarModel !== "undefined") {
                    Backbone.listenTo(Drupal.toolbar.models.toolbarModel, 'change:offsets', _(this.onToolbarHandler).bind(this));
                }
            }).bind(this));
        },
        initBeforeUnloadBehavior: function () {
            /**
             * fix the page reload problems
             */

            if ($('body').hasClass('page-article')) {
                window.allowBeforeUnload = true;
                window.onbeforeunload = function (pEvent) {
                    if (!window.allowBeforeUnload) return;

                    Waypoint.disableAll();

                    $('body').css({
                        top: $(window).scrollTop() * -1 + 'px',
                        left: $(window).scrollLeft() * -1 + 'px'
                    })
                    window.scrollTo(0, 0);
                }
            }
        },
        createModels: function () {
            this.adscModel = new AdscModel(); //{render: true}
            this.menuSidebarModel = new BaseSidebarModel();
            this.infiniteViewsModel = new BaseCollectionModel();
            this.modalSearchModel = new ModalSearchModel();
            this.pageOffsetsModel = new PageOffsetsModel();
            this.deviceModel = new DeviceModel({}, JSON.parse(this.$el.find('[data-breakpoint-settings]').text()));

            /**
             * Backbone Manager - push Models
             */
            BM.reuseModel(ModelIds.adscModel, this.adscModel);
            BM.reuseModel(ModelIds.menuSidebarModel, this.menuSidebarModel);
            BM.reuseModel(ModelIds.infiniteViewsModel, this.infiniteViewsModel);
            BM.reuseModel(ModelIds.modalSearchModel, this.modalSearchModel);
            BM.reuseModel(ModelIds.pageOffsetsModel, this.pageOffsetsModel);
            BM.reuseModel(ModelIds.deviceModel, this.deviceModel);
        },
        createManagers: function () {
            /**
             * TrackingManager
             */
            new TrackingManager({
                id: ManagerIds.trackingManager,
                el: this.$el,
                infiniteModel: this.infiniteViewsModel,
                model: new Backbone.Model({
                    initialLocation: AppConfig.initialLocation,
                    gtmEventName: AppConfig.gtmEventName,
                    gtmIndexEvent: AppConfig.gtmIndexEvent,
                    gtmIndexPosEvent: AppConfig.gtmIndexPosEvent
                })
            });

            /**
             * ScrollManager
             */
            new ScrollManager({
                id: ManagerIds.scrollManager,
                el: this.$el,
                infiniteModel: this.infiniteViewsModel,
                adscModel: this.adscModel,
                model: new Backbone.Model({
                    initialLocation: AppConfig.initialLocation
                })
            });
        },
        createViews: function () {
            /**
             * InfiniteView - parse and create views by data-view-type
             * IMPORTANT - Needed for the initial parsing
             */
            this.infiniteView = new BaseDynamicView({
                id: ViewIds.infiniteView,
                el: this.$el,
                model: this.infiniteViewsModel,
                deviceModel: this.deviceModel,
                initialCall: true
            });

            this.infiniteView.delegateElements();
            /** **/


            /**
             * MainMenuView
             */
            this.menuMainView = new MenuMainView({
                id: ViewIds.menuMainView,
                el: $('#menu-main-navigation', this.$el)
            });

            /**
             * MenuSidebarView
             */
            this.menuSidebarView = new MenuSidebarView({
                id: ViewIds.menuSidebarView,
                el: $('#menu-sidebar', this.$el),
                model: this.menuSidebarModel
            });


            /**
             * ModalSearchView
             */
            this.modalSearchView = new ModalSearchView({
                id: ViewIds.modalSearchView,
                el: this.$el.find('#modal-search'),
                model: this.modalSearchModel,
                infiniteModel: this.infiniteViewsModel
            });

            /**
             * Backbone Manager - push Views
             */
            BM.reuseView(ViewIds.menuMainView, this.menuMainView);
            BM.reuseView(ViewIds.menuSidebarView, this.menuSidebarView);
            BM.reuseView(ViewIds.infiniteView, this.infiniteView);
            BM.reuseView(ViewIds.modalSearchView, this.modalSearchView);
        },
        initAdBehavior: function () {
            var onAdRendered = function (e) {
                var $tmpMarketingView = $(e.detail.container).parents('[data-view-type="marketingView"]'),
                    tmpInfiniteModel = $tmpMarketingView.data('infiniteModel'),
                    tmpView;

                console.log(">>> onAdRendered", e.detail);

                if (!_.isUndefined(tmpInfiniteModel) && tmpInfiniteModel.has('view')) {
                    tmpView = tmpInfiniteModel.get('view');
                    tmpView.setModel(e.detail);
                }
            };

            //window.addEventListener('adReceived', onAdReceived, false);
            window.addEventListener('adRendered', onAdRendered, false);
        },
        onToolbarHandler: function (pModel, pAttr) {
            pModel.set('orientation', 'horizontal');
            this.pageOffsetsModel.add({id: 'offsetToolbar', offsets: pAttr, pageRelevant: true});
        }
    });
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);