(function ($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.products.ProductView = BaseView.extend({
    advancedTrackingData: null,
    infiniteBlockDataModel: null,
    $containerElement: [],
    inview: null,
    initialize: function (pOptions) {
      BaseView.prototype.initialize.call(this, pOptions);

      this.delegateInview();
      this.addListener();
      this.createModel();
      this.collectTrackingData();
    },
    delegateInview: function () {
      if (this.inview != null) this.inview.destroy();

      this.inview = this.$el.find('.img-container').inview({
        offset: 'bottom',
        enter: _.bind(this.onInviewEnterHandler, this),
        exit: _.bind(this.onInviewExitHandler, this),
      });
    },
    onInviewEnterHandler: function (pDirection) {
      this.onEnterHandler(pDirection);
    },
    onInviewExitHandler: function (pDirection) {},
    addListener: function () {
      this.$el
        .unbind('click.enhanced_ecommerce')
        .bind(
          'click.enhanced_ecommerce',
          $.proxy(this.onProductClickHandler, this)
        );
      // $(window).scroll(_.bind(this.checkPos, this));
    },
    createModel: function () {
      let tmpComponentType = '';

      this.setCurrentTrackingURL();
      this.model.set('provider', this.$el.data('provider'));
      this.model.set('price', '' + this.$el.data('price'));
      this.model.set('currency', this.$el.data('currency'));
      this.model.set('category', this.$el.data('category'));
      this.model.set('title', this.$el.data('title'));
      this.model.set('shop', this.$el.data('shop'));
      this.model.set('productId', '' + this.$el.data('product-id'));
      this.model.set('brand', this.$el.data('brand'));
      this.model.set('viewType', this.$el.data('view-type'));
      this.model.set('productCategory', this.$el.data('product-category'));
      this.model.set('soldOut', !!this.$el.data('sold-out'));

      if (this.$el.hasClass('item-product--single')) {
        tmpComponentType = ProductView.COMPONENT_TYPE_SINGLE;
      } else if (this.$el.hasClass('item-product-slider')) {
        tmpComponentType = ProductView.COMPONENT_TYPE_SLIDER;
      } else {
        tmpComponentType = ProductView.COMPONENT_TYPE_GRID;
      }

      this.model.set('componentType', tmpComponentType);
      if (this.model.has('infiniteBlockDataModel')) {
        this.infiniteBlockDataModel = this.model.get('infiniteBlockDataModel');
        this.model.set('entityType', this.infiniteBlockDataModel.get('entityType'));
        this.model.set('contentType', this.infiniteBlockDataModel.get('contentType'));
        this.model.set('entityID', this.infiniteBlockDataModel.get('entityID'));
        this.model.set('entityName', this.infiniteBlockDataModel.get('entityName'));

        // no datalayer is available so we have to grap our information from 'data-tr-container-type'
        if (
          (!this.model.has('entityType') &&
            this.infiniteBlockDataModel.has('trackingContainerType')) ||
          (this.model.has('entityType') &&
            this.model.get('entityType') === '' &&
            this.infiniteBlockDataModel.has('trackingContainerType'))
        ) {
          this.model.set('entityType', this.infiniteBlockDataModel.get('trackingContainerType'));
        }

        if (this.infiniteBlockDataModel.getElement().length > 0) {
          this.setProductIndex(); // set on this position to override the function
        }
      }

      // fallback - provider is empty for generic products
      if (this.model.get('provider') == '') {
        this.model.set('provider', ProductView.PROVIDER_GENERIC);
      }

      // generic products has no id
      if (this.model.get('productId') == 'undefined') {
        this.model.set('productId', ProductView.PROVIDER_GENERIC);
      }
    },
    setCurrentTrackingURL() {
      this.model.set(
        'url',
        this.$el.attr('data-external-url') ||
        this.$el.attr('data-internal-url') ||
        this.$el.attr('data-tipser-url')
      );
    },
    initCustomTracking: function () {
      //get current external url (A/B test relevant)
      this.setCurrentTrackingURL();
      let externalTrackingURL = this.model.get('url');
      let slicedString = '';
      let componentType = '';
      let entityType = '';
      let entityID = '';
      let productId = '';
      const positionOfLinkParam = externalTrackingURL.indexOf('&link');
      const hasLinkParam = positionOfLinkParam > -1;
      let productTitle = '';
      let productTitleProcessed = '';
      const isTracdelightURL = externalTrackingURL.indexOf('//td.') > -1;
      const isDrupalEntityOrNode = this.model.has('entityType');
      const hasSubid = externalTrackingURL.indexOf('subid=') > -1;

      if (externalTrackingURL === '' || externalTrackingURL === undefined) return;
      if (this.model.has('componentType')) componentType = this.model.get('componentType').toLowerCase();
      if (this.model.has('entityType')) entityType = this.model.get('entityType');
      if (this.model.has('entityID')) entityID = this.model.get('entityID');
      if (this.model.has('productId')) productId = this.model.get('productId');

      switch (this.model.get('provider')) {
        case ProductView.PROVIDER_TRACDELIGHT:
          if (hasSubid) {
            if (entityType !== '') slicedString += '' + entityType;
            if (entityID !== '') slicedString += '-' + entityID;
            if (productId !== '') slicedString += '-' + productId;
            if (componentType !== '') slicedString += '-' + componentType;

            externalTrackingURL = BaseUtils.extendUrlParam(externalTrackingURL, 'subid', slicedString);
          }

          break;
        case ProductView.PROVIDER_AMAZON:
          // TODO change this to dynamic value for all platforms
          if (externalTrackingURL.indexOf(AppConfig.amazonURLTrId) > -1) {
            slicedString = AppConfig.amazonURLTrId.split('-');
            if (slicedString.length > 1) {
              slicedString = slicedString[0] + '-' + componentType + '-' + slicedString[1];
            } else {
              slicedString = AppConfig.amazonURLTrId + '-' + componentType;
            }

            externalTrackingURL = externalTrackingURL.replace(AppConfig.amazonURLTrId, slicedString);
          }

          break;
        case ProductView.PROVIDER_GENERIC:
          if (isTracdelightURL && hasLinkParam && isDrupalEntityOrNode) {
            productTitle = this.model.get('title');
            productTitleProcessed = productTitle
              .replace(/[\/. ,:-]+/g, '_')
              .toLowerCase()
              .slice(0, Math.min(10, productTitle.length));

            slicedString += '&subid=';

            if (entityType !== '') slicedString += '' + entityType;
            if (entityID !== '') slicedString += '-' + entityID;
            if (productTitleProcessed !== '') slicedString += '-' + productTitleProcessed;
            if (componentType !== '') slicedString += '-' + componentType;

            if (externalTrackingURL.indexOf("subid") > -1) {
              externalTrackingURL = BaseUtils.extendUrlParam(externalTrackingURL, 'link', `${slicedString}&link`);
            } else {
              externalTrackingURL = externalTrackingURL.replace("&link", `${slicedString}&link`);
            }
          }

          break;
      }

      if (externalTrackingURL != this.model.get('url')) {
        this.model.set('tracking-url', externalTrackingURL);
        this.$el.attr('data-external-url', externalTrackingURL);
      }
    },
    collectTrackingData: function () {
      const tmpEnhancedEcommerceData = {
        list: this.model.get('componentType'),
        category: this.model.get('shop'),
        name: this.model.get('title'),
        id: this.model.get('productId'),
        price: this.model.get('price'),
        brand: this.model.get('brand'),
        provider: this.model.get('provider'),
        productCategory: this.model.get('productCategory'),
        componentType: this.model.get('componentType') || '',
        soldOut: this.model.get('soldOut'),
      };

      if (this.model.has('productIndex')) {
        tmpEnhancedEcommerceData.position = this.model.get('productIndex');
      }

      this.model.set('enhancedEcommerce', tmpEnhancedEcommerceData);
    },
    setProductIndex: function () {
      this.$containerElement = this.infiniteBlockDataModel.getElement();
      if (this.$containerElement.length > 0) {
        const tmpProductIndex = this.$containerElement
          .find('.item-ecommerce')
          .not('.item-product-slider')
          .index(this.$el);
        this.model.set('productIndex', tmpProductIndex);
      }
    },
    trackImpression: function () {
      this.model.set('trackImpression', true);
      if (typeof TrackingManager !== 'undefined') {
        TrackingManager.trackEcommerce(
          this.model.get('enhancedEcommerce'),
          'impressions',
          this.advancedTrackingData
        );
      }
    },
    trackProductClick: function () {
      if (typeof TrackingManager !== 'undefined') {
        TrackingManager.trackEcommerce(
          this.model.get('enhancedEcommerce'),
          'productClick',
          this.advancedTrackingData
        );
      }
    },
    onProductClickHandler: function (pEvent) {
      this.initCustomTracking();
      this.trackProductClick();

      if (this.model.has('tracking-url')) {
        console.log('>> click on product', this.model.get('tracking-url'));
      }
    },
    onEnterHandler: function (pDirection) {
      // BaseInviewView.prototype.onEnterHandler.call(this, pDirection);
      this.trackImpression();
      this.inview.destroy();
    },
  }, {
    PROVIDER_TRACDELIGHT: 'tracdelight',
    PROVIDER_AMAZON: 'amazon',
    PROVIDER_GENERIC: 'generic',
    COMPONENT_TYPE_SLIDER: 'slider',
    COMPONENT_TYPE_GRID: 'grid',
    COMPONENT_TYPE_SINGLE: 'single',
  });

  window.ProductView =
    window.ProductView || BurdaInfinite.views.products.ProductView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
