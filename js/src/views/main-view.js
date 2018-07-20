import BM from '../backbone-manager';
import ModelIds from '../consts/model-ids';
import Breakpoints from '../consts/breakpoints';
import ManagerIds from '../consts/manager-ids';
import ViewIds from '../consts/view-ids';

import BaseModel from '../models/base/base-model';
import BaseSidebarModel from '../models/base/base-sidebar-model';
import BaseCollectionModel from '../models/base/base-collection-model';
import BaseDynamicViewModel from '../models/base/base-dynamic-view-model';
import AjaxModel from '../models/ajax-model';
import DeviceModel from '../models/device-model';
import InfiniteBlockDataModel from '../models/infinite-block-data-model';
import ModalSearchModel from '../models/modal-search-model';
import PageOffsetsModel from '../models/page-offsets-model';
import SidebarModel from '../models/sidebar-model';

import MarketingManager from '../managers/marketing-manager';
import TrackingManager from '../managers/tracking-manager';
import ScrollManager from '../managers/scroll-manager';

import BaseUtils from '../utils/base-utils';

import BaseView from '../views/base/base-view';
import BaseDynamicView from '../views/base/base-dynamic-view';
import BaseFeedView from '../views/base/base-feed-view';
import BaseInviewView from '../views/base/base-inview-view';
import BaseListSwipeableView from '../views/base/base-list-swipeable-view';
import BaseNewsletterView from '../views/base/base-newsletter-view';
import BaseSidebarView from '../views/base/base-sidebar-view';
import AnchorNavigationView from '../views/anchor-navigation-view';
import ArticleView from '../views/article-view';
import GalleryView from '../views/gallery-view';
import InfiniteBlockView from '../views/infinite-block-view';
import MarketingView from '../views/marketing-view';
import MenuMainView from '../views/menu-main-view';
import MenuSidebarView from '../views/menu-sidebar-view';
import ModalSearchView from '../views/modal-search-view';
import StickyView from '../views/sticky-view';
import TeaserFeedView from '../views/teaser-feed-view';

import HMNewsletterView from '../views/newsletter/hmnewsletter-view';

import EcommerceSliderView from '../views/products/ecommerce-slider-view';
import LookView from '../views/products/look-view';
import ProductLookView from '../views/products/product-look-view';
import ProductSliderView from '../views/products/product-slider-view';
import ProductView from '../views/products/product-view';


(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite, AppConfig) {
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

      // if ($.cookie != undefined) $.cookie.json = true;
      if ($.timeago != undefined) $.timeago.settings.localeTitle = true;

      if (_.isFunction(history.pushState)) Backbone.history.start({ pushState: true });
      AppConfig.initialLocation = Backbone.history.location.pathname + Backbone.history.location.search;
      // TFM.Debug.start();

      this.initBeforeUnloadBehavior();
      this.createModels();
      this.createManagers();
      this.createViews();

      // console.log("UUID", this.deviceModel.get('uuid'));


      /**
       * Blazy Viewport fix
       *
       * Sometimes in safari browser on a page reload (especially when reloading through browser reload button)
       * images that are initially present in the viewport are not loaded by blazy. This snippet is a workaround
       * for this bug.
       */
      if (typeof jQuery.browser !== 'undefined' && jQuery.browser.safari && typeof Blazy !== 'undefined') {
        _.delay(() => {
          let tmpBlazy = new Blazy();
          tmpBlazy.revalidate();
        }, 100);
      }

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
            top: `${$(window).scrollTop() * -1}px`,
            left: `${$(window).scrollLeft() * -1}px`,
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
}(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite, AppConfig));

export default MainView;
