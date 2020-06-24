(function($, Drupal, drupalSettings, Backbone, BurdaInfinite) {
  BurdaInfinite.views.products.ProductView = BaseView.extend(
    {
      advancedTrackingData: null,
      infiniteBlockDataModel: null,
      $containerElement: [],
      inview: null,
      initialize: function(pOptions) {
        BaseView.prototype.initialize.call(this, pOptions);

        this.delegateInview();
        this.addListener();
        this.createModel();
        this.collectTrackingData();
      },
      delegateInview: function() {
        if (this.inview != null) this.inview.destroy();

        this.inview = this.$el.find('.img-container').inview({
          offset: 'bottom',
          enter: _.bind(this.onInviewEnterHandler, this),
          exit: _.bind(this.onInviewExitHandler, this),
        });
      },
      onInviewEnterHandler: function(pDirection) {
        this.onEnterHandler(pDirection);
      },
      onInviewExitHandler: function(pDirection) {},
      addListener: function() {
        this.$el
          .unbind('click.enhanced_ecommerce')
          .bind(
            'click.enhanced_ecommerce',
            $.proxy(this.onProductClickHandler, this)
          );
      },
      createModel: function() {
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
        this.model.set('productCategory', this.$el.data('category'));
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
          this.infiniteBlockDataModel = this.model.get(
            'infiniteBlockDataModel'
          );
          this.model.set(
            'entityType',
            this.infiniteBlockDataModel.get('entityType')
          );
          this.model.set(
            'contentType',
            this.infiniteBlockDataModel.get('contentType')
          );
          this.model.set(
            'entityID',
            this.infiniteBlockDataModel.get('entityID')
          );
          this.model.set(
            'entityName',
            this.infiniteBlockDataModel.get('entityName')
          );

          // no datalayer is available so we have to grap our information from 'data-tr-container-type'
          if (
            (!this.model.has('entityType') &&
              this.infiniteBlockDataModel.has('trackingContainerType')) ||
            (this.model.has('entityType') &&
              this.model.get('entityType') === '' &&
              this.infiniteBlockDataModel.has('trackingContainerType'))
          ) {
            this.model.set(
              'entityType',
              this.infiniteBlockDataModel.get('trackingContainerType')
            );
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
            this.$el.attr('data-tipser-url') ||
            this.$el.attr('href')
        );
      },
      initCustomTracking: function() {
        //get current external url (A/B test relevant)
        this.setCurrentTrackingURL();
        let elementURL = !!this.model.get('url') ? this.model.get('url') : null;
        const isTracdelightURL =
          !!elementURL && elementURL.indexOf('//td.') > -1;
        const isDrupalEntityOrNode = this.model.has('entityType');
        let productTitle = !!this.model.get('title')
          ? this.model.get('title')
          : null;
        let productTitleProcessed;
        let componentType = !!this.model.get('componentType')
          ? this.model.get('componentType').toLowerCase()
          : null;
        let entityType = !!this.model.get('entityType')
          ? this.model.get('entityType')
          : null;
        let entityID = !!this.model.get('entityID')
          ? this.model.get('entityID')
          : null;
        let productId = !!this.model.get('productId')
          ? this.model.get('productId')
          : null;

        const url = new URL(elementURL);
        const params = url.searchParams;

        if (!elementURL) return;

        switch (this.model.get('provider')) {
          case ProductView.PROVIDER_TRACDELIGHT:
            if (params.has('subid')) {
              const subidArr = [];
              !!entityType && subidArr.push(entityType);
              !!entityID && subidArr.push(entityID);
              !!productId && subidArr.push(productId);
              !!componentType && subidArr.push(componentType);
              params.set('subid', subidArr.join('-'));
            }
            break;
          case ProductView.PROVIDER_AMAZON:
            const tagDefault =
              !!window.drupalSettings &&
              !!window.drupalSettings.amazon &&
              !!window.drupalSettings.amazon.associatesIdDefault
                ? window.drupalSettings.amazon.associatesIdDefault
                : AppConfig.amazonURLTrId;
            const tagOverriden =
              !!window.drupalSettings &&
              !!window.drupalSettings.amazon &&
              !!window.drupalSettings.amazon.associatesIdOverriden
                ? window.drupalSettings.amazon.associatesIdOverriden
                : null;
            let tag = !!tagOverriden ? tagOverriden : tagDefault;

            if (params.has('tag')) {
              tag = params.get('tag');
            }

            if (!tagOverriden) {
              tag = tag.replace('-', `-${componentType}-`);
            }

            params.set('tag', tag);
            break;
          case ProductView.PROVIDER_GENERIC:
            if (
              isTracdelightURL &&
              params.has('link') &&
              isDrupalEntityOrNode
            ) {
              const subidArr = [];
              const link = new URL(params.get('link'));
              const linkParams = link.searchParams;

              if (linkParams.has('subid')) {
                if (productTitle) {
                  productTitleProcessed = productTitle
                    .replace(/[\/. ,:-]+/g, '_')
                    .toLowerCase()
                    .slice(0, Math.min(10, productTitle.length));
                }

                !!entityType && subidArr.push(entityType);
                !!entityID && subidArr.push(entityID);
                !!productId && subidArr.push(productId);
                !!productTitleProcessed && subidArr.push(productTitleProcessed);
                !!componentType && subidArr.push(componentType);

                linkParams.set('subid', subidArr.join('-'));
                params.set('link', decodeURI(link.href));
              }
            }
            break;
        }

        // console.log(">>> params.get('subid')", url.href);
        elementURL !== url.href && this.setURL(url.href);
      },
      setURL(url) {
        this.model.set('tracking-url', url);
        !!this.$el.attr('href')
          ? this.$el.attr('href', url)
          : this.$el.attr('data-external-url', url);
      },
      collectTrackingData: function() {
        const tmpEnhancedEcommerceData = {
          list: this.model.get('componentType'),
          category: this.model.get('shop'),
          name: this.model.get('title'),
          id: this.model.get('productId'),
          price: this.model.get('price') * 1,
          brand: this.model.get('brand'),
          provider: this.model.get('provider'),
          productCategory: this.model.get('category'),
          componentType: this.model.get('componentType') || '',
          soldOut: this.model.get('soldOut'),
        };

        if (this.model.has('productIndex')) {
          tmpEnhancedEcommerceData.position = this.model.get('productIndex');
        }

        this.model.set('enhancedEcommerce', tmpEnhancedEcommerceData);
      },
      setProductIndex: function() {
        this.$containerElement = this.infiniteBlockDataModel.getElement();
        if (this.$containerElement.length > 0) {
          const tmpProductIndex = this.$containerElement
            .find('.item-ecommerce')
            .not('.item-product-slider')
            .index(this.$el);
          this.model.set('productIndex', tmpProductIndex);
        }
      },
      trackImpression: function() {
        this.model.set('trackImpression', true);
        if (typeof TrackingManager !== 'undefined') {
          TrackingManager.trackEcommerce(
            this.model.get('enhancedEcommerce'),
            'impressions',
            this.advancedTrackingData
          );
        }
      },
      trackProductClick: function() {
        if (typeof TrackingManager !== 'undefined') {
          TrackingManager.trackEcommerce(
            this.model.get('enhancedEcommerce'),
            'productClick',
            this.advancedTrackingData
          );
        }
      },
      onProductClickHandler: function(pEvent) {
        this.initCustomTracking();
        this.trackProductClick();
      },
      onEnterHandler: function(pDirection) {
        // BaseInviewView.prototype.onEnterHandler.call(this, pDirection);
        this.trackImpression();
        this.inview.destroy();
      },
    },
    {
      PROVIDER_TRACDELIGHT: 'tracdelight',
      PROVIDER_AMAZON: 'amazon',
      PROVIDER_GENERIC: 'generic',
      COMPONENT_TYPE_SLIDER: 'slider',
      COMPONENT_TYPE_GRID: 'grid',
      COMPONENT_TYPE_SINGLE: 'single',
    }
  );

  window.ProductView =
    window.ProductView || BurdaInfinite.views.products.ProductView;
})(jQuery, Drupal, drupalSettings, Backbone, BurdaInfinite);
