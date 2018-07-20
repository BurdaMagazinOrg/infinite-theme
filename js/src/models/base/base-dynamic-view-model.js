(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.models.base.BaseDynamicViewModel = BaseCollectionModel.extend({
    defaults: {
      el: [],
      infiniteBlock: false,
      initialDOMItem: true
    },
    initialize: function (pModel, pOptions) {
      BaseCollectionModel.prototype.initialize.call(this, pModel, pOptions);

      if (!_.isUndefined(pModel)) {
        this.createDynamicItem(pModel);
      }
    },
    createDynamicItem: function (pSettings, pOptions) {

      var tmpView = {},
        $tmpElement = pSettings.el,
        tmpType = pSettings.type,
        tmpSettings = _.extend({
          model: this,
          context: $tmpElement.closest('[data-view-context]').length > 0 ?
            $tmpElement.closest('[data-view-context]') : $(window)
        }, pSettings, pOptions);

      /**
       * set new values
       */
      this.set(pSettings);

      // console.log(">>> createView", tmpType, tmpSettings);

      switch (tmpType) {
        case 'feedView':
          tmpView = new BaseFeedView(tmpSettings);
          break;
        case 'infiniteBlockView':
          tmpView = new InfiniteBlockView(tmpSettings);
          tmpView.delegateInview(); //active inview functions

          if (!tmpSettings.initialDOMItem) {
            tmpView.delegateElements();
          }

          break;
        case 'teaserFeedView':
          tmpView = new TeaserFeedView(tmpSettings);
          break;
        case 'articleView':
          tmpView = new ArticleView(tmpSettings);
          break;
        case 'stickyView':
          tmpView = new StickyView(tmpSettings);
          break;
        case 'galleryView':
          tmpView = new GalleryView(tmpSettings);
          break;
        case 'marketingView':
          tmpView = new MarketingView(tmpSettings);
          break;
        case 'listSwipeableView':
          tmpView = new BaseListSwipeableView(tmpSettings);
          break;
        case 'newsletterView':
          tmpView = new BaseNewsletterView(tmpSettings);
          break;
        case 'hmNewsletterView':
          tmpView = new HmNewsletterView(tmpSettings);
          break;
        case 'newsletterModalView':
          tmpView = new NewsletterModalView(tmpSettings);
          break;
        case 'productView':
          tmpView = new ProductView(tmpSettings);
          break;
        case 'productSliderView':
          tmpView = new ProductSliderView(tmpSettings);
          break;
          case 'productLookView':
          tmpView = new ProductLookView(tmpSettings);
          break;
        case 'anchorNavigationView':
          tmpView = new AnchorNavigationView(tmpSettings);
          break;
        case 'ecommerceSlider':
          tmpView = new EcommerceSliderView(tmpSettings);
          break;
        case 'lookView':
          tmpView = new LookView(tmpSettings);
          break;
        default:
          tmpView = new BaseView(tmpSettings);
          break;
      }

      this.set('view', tmpView);
    }
  });

  window.BaseDynamicViewModel = window.BaseDynamicViewModel || BurdaInfinite.models.base.BaseDynamicViewModel;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);

export default BaseDynamicViewModel;
