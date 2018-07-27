(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  

  BurdaInfinite.views.MainView = Backbone.View.extend({
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
    initialize(pOptions) {
      _.extend(this, pOptions);

      if (_.isFunction(history.pushState)) Backbone.history.start({ pushState: true });
      AppConfig.initialLocation = Backbone.history.location.pathname + Backbone.history.location.search;
      // TFM.Debug.start();

      this.initBeforeUnloadBehavior();
      this.createModels();
      this.createManagers();
      this.createViews();

      // console.log("UUID", this.deviceModel.get('uuid'));

      /**
       * Infinite Model Helper
       */
      // TODO use for debugging
      // this.listenTo(this.infiniteViewsModel, 'update', _.debounce(function (pType) {
      //    console.info("global infiniteModel", this.infiniteViewsModel);
      // }, 100, true), this);

      /**
       * adjust sidebar if toolbar activated / displayed
       */
      setTimeout(_(function () {
        if (typeof Drupal.toolbar !== 'undefined' && typeof Drupal.toolbar.models.toolbarModel !== 'undefined') {
          Backbone.listenTo(Drupal.toolbar.models.toolbarModel, 'change:offsets', _(this.onToolbarHandler).bind(this));
        }
      }).bind(this));
    },
    initBeforeUnloadBehavior() {
      /**
       * fix the page reload problems
       */

      if ($('body').hasClass('page-article')) {
        window.allowBeforeUnload = true;
        window.onbeforeunload = function (pEvent) {
          if (!window.allowBeforeUnload) return;

          Waypoint.disableAll();

          $('body').css({
            top: `${$(window).scrollTop() * -1  }px`,
            left: `${$(window).scrollLeft() * -1  }px`,
          });
          window.scrollTo(0, 0);
        };
      }
    },
    createModels() {
      this.menuSidebarModel = new BaseSidebarModel();
      this.infiniteViewsModel = new BaseCollectionModel();
      this.modalSearchModel = new ModalSearchModel();
      this.pageOffsetsModel = new PageOffsetsModel();
      this.deviceModel = new DeviceModel({}, _.extend(JSON.parse(this.$el.find('[data-breakpoint-settings]').text())));

      /**
       * Backbone Manager - push Models
       */
      BM.reuseModel(ModelIds.menuSidebarModel, this.menuSidebarModel);
      BM.reuseModel(ModelIds.infiniteViewsModel, this.infiniteViewsModel);
      BM.reuseModel(ModelIds.modalSearchModel, this.modalSearchModel);
      BM.reuseModel(ModelIds.pageOffsetsModel, this.pageOffsetsModel);
      BM.reuseModel(ModelIds.deviceModel, this.deviceModel);
    },
    createManagers() {
      new MarketingManager({
        infiniteViewsModel: this.infiniteViewsModel,
      });

      /**
       * TrackingManager
       */
      new TrackingManager({
        id: ManagerIds.trackingManager,
        el: this.$el,
        infiniteViewsModel: this.infiniteViewsModel,
        model: new Backbone.Model({
          initialLocation: AppConfig.initialLocation,
          gtmEventName: AppConfig.gtmEventName,
          gtmIndexEvent: AppConfig.gtmIndexEvent,
          gtmIndexPosEvent: AppConfig.gtmIndexPosEvent,
        }),
      });

      /**
       * ScrollManager
       */
      new ScrollManager({
        id: ManagerIds.scrollManager,
        el: this.$el,
        infiniteViewsModel: this.infiniteViewsModel,
        model: new Backbone.Model({
          initialLocation: AppConfig.initialLocation,
        }),
      });
    },
    createViews() {
      /**
       * InfiniteView - parse and create views by data-view-type
       * IMPORTANT - Needed for the initial parsing
       */
      this.infiniteView = new BaseDynamicView({
        id: ViewIds.infiniteView,
        el: this.$el,
        model: this.infiniteViewsModel,
        deviceModel: this.deviceModel,
        initialCall: true,
      });

      this.infiniteView.delegateElements();
      /** * */


      /**
       * MainMenuView
       */
      this.menuMainView = new MenuMainView({
        id: ViewIds.menuMainView,
        el: $('#menu-main-navigation', this.$el),
      });

      /**
       * MenuSidebarView
       */
      this.menuSidebarView = new MenuSidebarView({
        id: ViewIds.menuSidebarView,
        el: $('#menu-sidebar', this.$el),
        model: this.menuSidebarModel,
      });


      /**
       * ModalSearchView
       */
      this.modalSearchView = new ModalSearchView({
        id: ViewIds.modalSearchView,
        el: this.$el.find('#modal-search'),
        model: this.modalSearchModel,
        infiniteModel: this.infiniteViewsModel,
      });

      /**
       * Backbone Manager - push Views
       */
      BM.reuseView(ViewIds.menuMainView, this.menuMainView);
      BM.reuseView(ViewIds.menuSidebarView, this.menuSidebarView);
      BM.reuseView(ViewIds.infiniteView, this.infiniteView);
      BM.reuseView(ViewIds.modalSearchView, this.modalSearchView);
    },
    onToolbarHandler(pModel, pAttr) {
      // pModel.set('orientation', 'horizontal');
      this.pageOffsetsModel.add({ id: 'offsetToolbar', offsets: pAttr, pageRelevant: true });
    },
  });

  window.MainView = window.MainView || BurdaInfinite.views.MainView;
}(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite));
