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
        createDynamicItem: function (pModel, pOptions) {
            var tmpView = {},
                tmpAdscModel,
                $tmpElement = pModel.el,
                tmpType = pModel.type,
                tmpSettings = {
                    model: this,
                    el: $tmpElement,
                    context: $tmpElement.closest('[data-view-context]').length > 0 ?
                        $tmpElement.closest('[data-view-context]') : $(window)
                };

            if (!_.isUndefined(pOptions) && !_.isUndefined(pOptions.deviceModel)) {
                tmpSettings.deviceModel = pOptions.deviceModel;
            }

            //console.log(">>> createView", tmpType);

            switch (tmpType) {
                case 'feedView':
                    tmpView = new BaseFeedView(tmpSettings);
                    break;
                case 'infiniteBlockView':
                    tmpView = new InfiniteBlockView(tmpSettings);
                    tmpView.delegateInview(); //active inview functions
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

                    //dynamic adsc model
                    if($tmpElement.parents('[data-adsc-keyword]').length > 0) {
                        tmpAdscModel = new AdscModel();
                        tmpAdscModel.setByElement($tmpElement.parents('[data-adsc-keyword]'));
                        tmpSettings.dynamicAdscModel = tmpAdscModel;
                    }

                    tmpView = new MarketingView(tmpSettings);
                    break;
                case 'listSwipeableView':
                    tmpView = new ListSwipeableView(tmpSettings);
                    break;
                case 'newsletterView':
                    tmpView = new BaseNewsletterView(tmpSettings);
                    break;
                default:
                    tmpView = new BaseView(tmpSettings);
                    break;
            }

            this.set(pModel);
            this.set('view', tmpView);
        }
    });


})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
