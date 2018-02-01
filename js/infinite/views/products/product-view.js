(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {

  "use strict";

  BurdaInfinite.views.products.ProductView = BaseView.extend({
    advancedTrackingData: null,
    $containerElement: [],
    inview: null,
    initialize: function (pOptions) {
      BaseView.prototype.initialize.call(this, pOptions);

      if (this.$el.hasClass('item-product--sold-out')) {
        this.model.set('disabled', true);
        return;
      }

      this.delegateInview();
      this.addListener();
      this.createModel();

      /**
       * infiniteBlockDataModel set in base-dynamic-view
       */
      // console.log(">>> this.infiniteBlockDataModel", this.infiniteBlockDataModel);

      if (this.infiniteBlockDataModel) {

        if (this.infiniteBlockDataModel.has('trackingContainerType') && this.model.get('componentType') != ProductView.COMPONENT_TYPE_SLIDER) {
          this.model.set('containerType', this.infiniteBlockDataModel.get('trackingContainerType').toLowerCase());
        }

        if (this.infiniteBlockDataModel.has('uuid')) {
          this.advancedTrackingData = TrackingManager.getAdvTrackingByUuid(this.infiniteBlockDataModel.has('uuid'));
          this.extendDataLayerInfo();
        }

        if (this.infiniteBlockDataModel.getElement().length > 0) {
          this.$containerElement = this.infiniteBlockDataModel.getElement();
          this.setProductIndex(); //set on this position to override the function
        }

      }

      if (this.model.get('componentType') == ProductView.COMPONENT_TYPE_SLIDER) {
        this.model.set('containerType', ProductView.COMPONENT_TYPE_SLIDER);
      }

      this.initCustomTracking();
      this.collectTrackingData();
    },
    delegateInview: function () {
      if (this.inview != null) this.inview.destroy();

      this.inview = this.$el.find('.img-container')
        .inview({
          offset: 'bottom',
          enter: _.bind(this.onInviewEnterHandler, this),
          exit: _.bind(this.onInviewExitHandler, this)
        });
    },
    onInviewEnterHandler: function (pDirection) {
      this.onEnterHandler(pDirection);
    },
    onInviewExitHandler: function (pDirection) {

    },
    addListener: function () {
      this.$el.unbind('click.enhanced_ecommerce').bind('click.enhanced_ecommerce', $.proxy(this.onProductClickHandler, this));
      // $(window).scroll(_.bind(this.checkPos, this));
    },
    createModel: function () {
      var tmpComponentType = '';

      this.model.set('provider', this.$el.data('provider'));
      this.model.set('price', this.$el.data('price') + '');
      this.model.set('currency', this.$el.data('currency'));
      this.model.set('category', this.$el.data('category'));
      this.model.set('title', this.$el.data('title'));
      this.model.set('shop', this.$el.data('shop'));
      this.model.set('productId', this.$el.data('product-id') + '');
      this.model.set('brand', this.$el.data('brand'));
      this.model.set('viewType', this.$el.data('view-type'));
      this.model.set('productCategory', this.$el.data('product-category'));
      this.model.set('url', this.$el.data('external-url') || this.$el.data('internal-url'));

      if (this.$el.hasClass('item-product--single')) {
        tmpComponentType = ProductView.COMPONENT_TYPE_SINGLE;
      } else if (this.$el.hasClass('item-product-slider')) {
        tmpComponentType = ProductView.COMPONENT_TYPE_SLIDER;
      } else {
        tmpComponentType = ProductView.COMPONENT_TYPE_GRID;
      }

      this.model.set('componentType', tmpComponentType);

      //fallback - provider is empty for generic products
      if (this.model.get('provider') == '') {
        this.model.set('provider', ProductView.PROVIDER_GENERIC);
      }

      //generic products has no id
      if (this.model.get('productId') == 'undefined') {
        this.model.set('productId', ProductView.PROVIDER_GENERIC);
      }
    },
    extendDataLayerInfo: function () {
      if (this.advancedTrackingData.hasOwnProperty('page')) {
        this.model.set('entityType', this.advancedTrackingData.page.entityType);
        this.model.set('contentType', this.advancedTrackingData.page.contentType);
        this.model.set('entityID', this.advancedTrackingData.page.entityID);
        this.model.set('entityName', this.advancedTrackingData.page.name);
      }
    },
    initCustomTracking: function () {
      var externalTrackingURL = this.model.get('url');
      var slicedString = '';
      var containerType = '';
      var positionOfLinkParam = externalTrackingURL.indexOf("&link");
      var hasLinkParam = positionOfLinkParam > -1;
      var productTitle = '';
      var isTracdelightURL = externalTrackingURL.indexOf("//td.") > -1;
      var hasSubid = externalTrackingURL.indexOf("subid=") > -1;

      if (externalTrackingURL === '' || externalTrackingURL === undefined) return;

      if (this.model.has('containerType') && this.model.get('containerType') !== '') {
        containerType = '-' + this.model.get('containerType').toLowerCase();
      }

      switch (this.model.get('provider')) {
        case ProductView.PROVIDER_TRACDELIGHT:

          if (hasSubid) {
            externalTrackingURL = BaseUtils.replaceUrlParam(externalTrackingURL, 'subid', window.getURLParam('subid', externalTrackingURL) + containerType);
          }

          break;
        case ProductView.PROVIDER_AMAZON:

          //TODO change this to dynamic value for all platforms
          if (externalTrackingURL.indexOf(AppConfig.amazonURLTrId) > -1) {

            slicedString = AppConfig.amazonURLTrId.split('-');
            if (slicedString.length > 1) {
              slicedString = slicedString[0] + containerType + '-' + slicedString[1];
            } else {
              slicedString = AppConfig.amazonURLTrId + containerType;
            }

            externalTrackingURL = externalTrackingURL.replace(AppConfig.amazonURLTrId, slicedString);
          }

          break;
        case ProductView.PROVIDER_GENERIC:

          if (isTracdelightURL && hasLinkParam) {
            slicedString = externalTrackingURL.substring(positionOfLinkParam, externalTrackingURL.length);

            if (this.model.has('entityType')) {

              productTitle = this.model.get('title');
              productTitle = productTitle.replace(/[\/. ,:-]+/g, "_").toLowerCase().slice(0, Math.min(10, productTitle.length));

              slicedString = "&subid="
                + this.model.get('entityType')
                + '-' + this.model.get('entityID')
                + '-' + productTitle
                + containerType;
            }

            externalTrackingURL = externalTrackingURL.substr(0, positionOfLinkParam) + slicedString + externalTrackingURL.substr(positionOfLinkParam)
          }

          break;

      }

      if (externalTrackingURL != this.model.get('url')) {
        this.model.set('tracking-url', externalTrackingURL);
        this.$el.attr("data-external-url", externalTrackingURL);
      }
    },
    collectTrackingData: function () {
      var tmpEnhancedEcommerceData = {
        list: this.model.get('componentType'),
        category: this.model.get('shop'),
        name: this.model.get('title'),
        id: this.model.get('productId'),
        price: this.model.get('price'),
        brand: this.model.get('brand'),
        provider: this.model.get('provider'),
        productCategory: this.model.get('productCategory'),
        containerType: this.model.get('containerType') || ''
      };

      if (this.model.has('productIndex')) {
        tmpEnhancedEcommerceData.position = this.model.get('productIndex');
      }

      this.model.set('enhancedEcommerce', tmpEnhancedEcommerceData);
    },
    setProductIndex: function () {
      if (this.$containerElement.length > 0) {
        var tmpProductIndex = this.$containerElement.find('.item-ecommerce').not('.item-product-slider').index(this.$el);
        this.model.set('productIndex', tmpProductIndex);
      }
    },
    trackImpression: function () {
      if (this.model.get('disabled') == true) return;

      this.model.set('trackImpression', true);
      if(typeof TrackingManager != 'undefined') {
        TrackingManager.trackEcommerce(this.model.get('enhancedEcommerce'), 'impressions', this.advancedTrackingData);
      }
    },
    trackProductClick: function () {
      if(typeof TrackingManager != 'undefined') {
        TrackingManager.trackEcommerce(this.model.get('enhancedEcommerce'), 'productClick', this.advancedTrackingData);
      }
    },
    onProductClickHandler: function (pEvent) {
      this.trackProductClick();
    },
    onEnterHandler: function (pDirection) {
      // BaseInviewView.prototype.onEnterHandler.call(this, pDirection);
      this.trackImpression();
      this.inview.destroy();
    }
  }, {
    PROVIDER_TRACDELIGHT: 'tracdelight',
    PROVIDER_AMAZON: 'amazon',
    PROVIDER_GENERIC: 'generic',
    COMPONENT_TYPE_SLIDER: 'slider',
    COMPONENT_TYPE_GRID: 'grid',
    COMPONENT_TYPE_SINGLE: 'single'
  });

  window.ProductView = window.ProductView || BurdaInfinite.views.products.ProductView;

})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
